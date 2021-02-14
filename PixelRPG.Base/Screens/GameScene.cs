namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;
    using System.Linq;

    using BrainAI.Pathfinding.AStar;

    using LocomotorECS;

    using MazeGenerators;


    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;
    using SpineEngine.ECS.EntitySystems;
    using SpineEngine.Graphics.Renderers;
    using SpineEngine.Graphics.ResolutionPolicy;

    using PixelRPG.Base.Assets.UnitAnimations;
    using PixelRPG.Base.ECS.Components;
    using PixelRPG.Base.ECS.EntitySystems;
    using SpineEngine;
    using FateRandom;
    using LocomotorECS.Matching;
    using PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using BrainAI.AI;
    using PixelRPG.Base.AdditionalStuff.BrainAI.EntitySystems;
    using System;
    using PixelRPG.Base.AdditionalStuff.ClientServer;

    #endregion

    public class ConnectServerRecieveHandler : ServerReceiveHandlerSystem.Handler<ConnectTransferMessage>
    {
        protected override void Handle(ServerComponent server, int connectionKey, ConnectTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();

            var room = gameState.Map.Rooms[gameState.Players.Count];
            gameState.Players[connectionKey] = new GameStateComponent.Player
            {
                Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2)
            };

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                responses.Add(new ConnectedCountTransferMessage
                {
                    ExpectedCount = gameState.MaxPlayersCount,
                    CurrentCount = gameState.Players.Count
                });

                if (gameState.Players.Count == gameState.MaxPlayersCount)
                {
                    responses.Add(new MapTransferMessage
                    {
                        Map = gameState.Map,
                        Players = gameState.Players.Values.ToList(),
                        Exit = gameState.Exit,
                        Me = player.Value,
                    });

                    responses.Add(new YourTurnTransferMessage());
                }
            }
        }
    }

    public class PlayerTurnDoneServerRecieveHandler : ServerReceiveHandlerSystem.Handler<PlayerTurnDoneTransferMessage>
    {
        protected override void Handle(ServerComponent server, int connectionKey, PlayerTurnDoneTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();

            gameState.Players[connectionKey].Position = message.NewPosition;
            gameState.MovedPlayers++;

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                responses.Add(new PlayerTurnReadyTransferMessage
                {
                    Player = gameState.Players[connectionKey],
                });

                if (gameState.MovedPlayers == gameState.MaxPlayersCount)
                {
                    responses.Add(new TurnDoneTransferMessage
                    {
                        Players = gameState.Players.Values.ToList(),
                        Me = player.Value,
                    });

                    responses.Add(new YourTurnTransferMessage());
                }
            }

            if (gameState.MovedPlayers == gameState.MaxPlayersCount)
            {
                gameState.MovedPlayers = 0;
            }
        }
    }



    public class GameStateComponent : Component
    {
        public RoomMazeGenerator.Result Map;
        public Dictionary<int, Player> Players;
        public Point Exit;
        public int MaxPlayersCount;
        public int MovedPlayers;

        public class Player
        {
            public Point Position;
        }
    }

    public class VisiblePlayerComponent : Component
    {
        public string MapEntityName;

        public VisiblePlayerComponent(string mapEntityName)
        {
            this.MapEntityName = mapEntityName;
        }
    }

    public class MapVisiblePlayerSystem : ClientReceiveHandlerSystem<MapTransferMessage>
    {
        private readonly Scene scene;

        public MapVisiblePlayerSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
        {
            this.scene = scene;
        }


        private static readonly List<string> availableAnimations = new List<string>
        {
            ContentPaths.Assets.Characters.mage,
            ContentPaths.Assets.Characters.ranger,
            ContentPaths.Assets.Characters.rogue,
            ContentPaths.Assets.Characters.warrior
        };

        protected override void DoAction(MapTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var visiblePlayer = entity.GetComponent<VisiblePlayerComponent>();

            for (var i = 0; i < message.Players.Count; i++)
            {
                var playerUnit = this.scene.CreateEntity($"PlayerUnit{i}");
                playerUnit.AddComponent<PositionComponent>().Position = new Vector2(message.Players[i].Position.X * 16 + 8, message.Players[i].Position.Y * 16 + 8);
                playerUnit.AddComponent<UnitComponent>().UnitAnimations = new HeroSprite(Core.Instance.Content, Fate.GlobalFate.Choose<string>(availableAnimations), 6);
            }

            var map = this.scene.FindEntity(visiblePlayer.MapEntityName);
            var tiledMap = map.GetComponent<TiledMapComponent>().TiledMap;

            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");
            var water = (TiledTileLayer)tiledMap.GetLayer("Water");

            tiledMap.Width = maze.Width = message.Map.Regions.GetLength(0);
            tiledMap.Height = maze.Height = message.Map.Regions.GetLength(1);

            maze.Tiles = new TiledTile[maze.Width * maze.Height];
            tiledMap.ObjectGroups.Clear();

            for (var x = 0; x < message.Map.Regions.GetLength(0); x++)
                for (var y = 0; y < message.Map.Regions.GetLength(1); y++)
                {
                    var tile = new TiledTile();
                    if (message.Map.Regions[x, y].HasValue)
                    {
                        tile.Id = 2;
                    }
                    else
                    {
                        tile.Id = 17;
                    }

                    maze.SetTile(x, y, tile);
                }

            for (var i = 0; i < message.Map.Junctions.Count; i++)
            {
                var junction = message.Map.Junctions[i];
                var tile = maze.GetTile((int)junction.X, (int)junction.Y);
                tile.Id = 6;
            }

            maze.GetTile(message.Exit.X, message.Exit.Y).Id = 9;
            for (var i = 0; i < message.Players.Count; i++)
            {
                maze.GetTile(message.Players[i].Position.X, message.Players[i].Position.Y).Id = 8;
            }
        }
    }

    public class MapAIPlayerSystem : ClientReceiveHandlerSystem<MapTransferMessage>
    {
        public MapAIPlayerSystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(MapTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            simpleAI.Exit = message.Exit;
            simpleAI.Map = message.Map;
            simpleAI.Me = message.Me;
            simpleAI.Players = message.Players;
            simpleAI.Pathfinding = new AstarGridGraph(message.Map.Regions.GetLength(0), message.Map.Regions.GetLength(1));
            for (var x = 0; x < message.Map.Regions.GetLength(0); x++)
                for (var y = 0; y < message.Map.Regions.GetLength(1); y++)
                {
                    var pos = new MazeGenerators.Utils.Vector2(x, y);
                    var tile = simpleAI.Map.GetTile(pos);
                    if (!tile.HasValue)
                    {
                        simpleAI.Pathfinding.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                    }
                }
        }
    }

    public class YourTurnAIPlayerSystem : ClientReceiveHandlerSystem<YourTurnTransferMessage>
    {
        public YourTurnAIPlayerSystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(YourTurnTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            simpleAI.NeedAction = true;
        }
    }

    public class PlayerTurnDoneAIPlayerSystem : ClientSendHandlerSystem<PlayerTurnDoneTransferMessage>
    {
        public PlayerTurnDoneAIPlayerSystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override PlayerTurnDoneTransferMessage PrepareSendData(Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            if (simpleAI.NextTurn == null)
            {
                return null;
            }

            var result = new PlayerTurnDoneTransferMessage { NewPosition = simpleAI.NextTurn.Value };
            simpleAI.NextTurn = null;
            return result;
        }
    }

    public class TurnDoneAIPlayerSystem : ClientReceiveHandlerSystem<TurnDoneTransferMessage>
    {
        public TurnDoneAIPlayerSystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(TurnDoneTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;

            simpleAI.Players = message.Players;
            simpleAI.Me = message.Me;
        }
    }

    public class TurnDoneVisiblePlayerSystem : ClientReceiveHandlerSystem<TurnDoneTransferMessage>
    {
        private readonly Scene scene;

        public TurnDoneVisiblePlayerSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(TurnDoneTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            for (var i = 0; i < message.Players.Count; i++)
            {
                var playerUnit = this.scene.FindEntity($"PlayerUnit{i}");
                playerUnit.GetComponent<PositionComponent>().Position = new Vector2(message.Players[i].Position.X * 16 + 8, message.Players[i].Position.Y * 16 + 8);
            }
        }
    }

    public class SimpleAI : IAITurn
    {
        public RoomMazeGenerator.Result Map;
        public List<GameStateComponent.Player> Players;
        public GameStateComponent.Player Me;
        public Point Exit;
        public AstarGridGraph Pathfinding;

        public bool NeedAction;
        public Point? NextTurn;

        public void Tick()
        {
            if (!NeedAction)
            {
                return;
            }

            if (Fate.GlobalFate.Chance(95))
            {
                return;
            }

            var path = AStarPathfinder.Search(Pathfinding, new BrainAI.Pathfinding.Point(this.Me.Position.X, this.Me.Position.Y), new BrainAI.Pathfinding.Point(this.Exit.X, this.Exit.Y));
            if (path == null || path.Count < 2)
            {
                NextTurn = this.Me.Position;
                NeedAction = false;
                return;
            }

            NextTurn = new Point(path[1].X, path[1].Y);
            NeedAction = false;
        }
    }

    public class GameSceneConfig
    {
        public bool IsServer;
        public int ClientsCount = 1;
        public int TotalPlayers = 2;
    }

    public class GameScene : Scene
    {
        public GameScene(GameSceneConfig config)
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new DefaultRenderer());

            var parsers = new ITransferMessageParser[]
            {
                new ConnectedCountTransferMessageParser(),
                new ConnectTransferMessageParser(),
                new MapTransferMessageParser(),
                new PlayerTurnDoneTransferMessageParser(),
                new PlayerTurnReadyTransferMessageParser(),
                new TurnDoneTransferMessageParser(),
                new YourTurnTransferMessageParser(),
            };

            var map = this.CreateEntity("Map");
            map.AddComponent(new TiledMapComponent(Core.Instance.Content.Load<TiledMap>(ContentPaths.Assets.template)));

            this.AddEntitySystem(new ServerReceiveHandlerSystem(
                new ConnectServerRecieveHandler(),
                new PlayerTurnDoneServerRecieveHandler()));
            this.AddEntitySystem(new LocalServerCommunicatorSystem());
            this.AddEntitySystem(new NetworkServerCommunicatorSystem(parsers));
            this.AddEntitySystem(new MapVisiblePlayerSystem(this));
            this.AddEntitySystem(new LocalClientCommunicatorSystem(this, parsers));
            this.AddEntitySystem(new MapAIPlayerSystem());
            this.AddEntitySystem(new YourTurnAIPlayerSystem());
            this.AddEntitySystem(new PlayerTurnDoneAIPlayerSystem());
            this.AddEntitySystem(new TurnDoneAIPlayerSystem());
            this.AddEntitySystem(new TurnDoneVisiblePlayerSystem(this));
            this.AddEntitySystem(new AIUpdateSystem());
            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
            this.AddEntitySystem(new AnimationSpriteUpdateSystem());
            this.AddEntitySystem(new CharSpriteUpdateSystem());
            this.AddEntitySystem(new NetworkClientCommunicatorSystem(parsers));

            if (config.IsServer)
            {
                var server = this.CreateEntity("Server");
                var gameState = server.AddComponent<GameStateComponent>();
                gameState.Map = new RoomMazeGenerator().Generate(new RoomMazeGenerator.Settings(41, 31) { ExtraConnectorChance = 5, WindingPercent = 50 });
                gameState.Players = new Dictionary<int, GameStateComponent.Player>();
                gameState.Exit = new Point(gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].X + gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].Width / 2, gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].Y + gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].Height / 2);
                gameState.MaxPlayersCount = config.TotalPlayers;
                server.AddComponent<ServerComponent>();
                server.AddComponent<LocalServerComponent>();
                server.AddComponent(new NetworkServerComponent("127.0.0.1", 8085));

                for (var i = 0; i < config.ClientsCount; i++)
                {
                    var player = this.CreateEntity();
                    player.AddComponent<ClientComponent>().Message = new ConnectTransferMessage();
                    player.AddComponent<LocalClientComponent>().ServerEntity = server.Name;
                    player.AddComponent<AIComponent>().AIBot = new SimpleAI();
                    if (i == 0)
                    {
                        player.AddComponent(new VisiblePlayerComponent(map.Name));
                    }
                }
            }
            else
            {
                for (var i = 0; i < config.ClientsCount; i++)
                {
                    var player = this.CreateEntity();
                    player.AddComponent<ClientComponent>().Message = new ConnectTransferMessage();
                    player.AddComponent(new NetworkClientComponent(new Uri("ws://127.0.0.1:8085")));
                    player.AddComponent<AIComponent>().AIBot = new SimpleAI();

                    if (i == 0)
                    {
                        player.AddComponent(new VisiblePlayerComponent(map.Name));
                    }
                }
            }
        }
    }
}