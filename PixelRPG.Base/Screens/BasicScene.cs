namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;
    using System.Linq;

    using BrainAI.Pathfinding.AStar;

    using LocomotorECS;

    using MazeGenerators;

    using Microsoft.Xna.Framework;

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
    using PixelRPG.Base.AdditionalStuff.TurnBase.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.TurnBase.Components;
    using FateRandom;

    #endregion

    public class BasicScene : Scene
    {
        public BasicScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new DefaultRenderer());

            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
            this.AddEntitySystem(new AnimationSpriteUpdateSystem());
            this.AddEntitySystem(new CharSpriteUpdateSystem());
            this.AddEntitySystem(new GameTurnAnimationSystem());
            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
            this.AddEntitySystem(new CharTurnSelectorUpdateSystem(this));
            this.AddEntitySystem(new LevelCompleteUpdateSystem(this));
            this.AddEntitySystem(new TurnSelectorUpdateSystem());

            var tiledMap = Core.Instance.Content.Load<TiledMap>(ContentPaths.Assets.template);
            GenerateMap(tiledMap);

            var map = this.CreateEntity("map");
            map.AddComponent(new TiledMapComponent(tiledMap));
            map.AddComponent(new PlayerSwitcherComponent(PlayerSwitcherComponent.PlayerSwitchType.AllAtOnce, 
                AddPlayer(tiledMap, "1"),
                AddPlayer(tiledMap, "2"),
                AddPlayer(tiledMap, "3"),
                AddPlayer(tiledMap, "4")
                ));
            map.AddComponent<ApplyTurnComponent>();
            GeneratePathFinding(map);
        }

        List<string> availableAnimations = new List<string>
        {
            ContentPaths.Assets.Characters.mage,
            ContentPaths.Assets.Characters.ranger,
            ContentPaths.Assets.Characters.rogue,
            ContentPaths.Assets.Characters.warrior
        };

        private PlayerTurnComponent AddPlayer(TiledMap tiledMap, string playerIndex)
        {
            var player1StartPoint = tiledMap.GetObjectGroup("StartPoint").Objects.First(a => a.Name == $"Player{playerIndex}StartPoint");
            var player1 = this.CreateEntity();
            player1.AddComponent<PositionComponent>().Position = new Vector2(player1StartPoint.X + 8, player1StartPoint.Y + 8);
            player1.AddComponent<UnitComponent>().UnitAnimations = new HeroSprite(Core.Instance.Content, Fate.GlobalFate.Choose<string>(availableAnimations), 6);
            var player1Turn = player1.AddComponent<PlayerTurnComponent>();
            return player1Turn;
        }

        public static void GeneratePathFinding(Entity mapEntity)
        {
            var map = mapEntity.GetComponent<TiledMapComponent>().TiledMap;

            var graph = new AstarGridGraph(map.Width, map.Height);

            var maze = (TiledTileLayer)map.GetLayer("Maze");
            for (var x = 0; x < maze.Width; x++)
            for (var y = 0; y < maze.Height; y++)
            {
                if (
                    maze.GetTile(x, y).Id != 2 &&
                    maze.GetTile(x, y).Id != 8 &&
                    maze.GetTile(x, y).Id != 9 &&
                    maze.GetTile(x, y).Id != 6)
                {
                    graph.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                }
            }

            mapEntity.Cache.PutData("PathFinding", graph);
        }

        public static void GenerateMap(TiledMap tiledMap)
        {
            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");
            var water = (TiledTileLayer)tiledMap.GetLayer("Water");

            tiledMap.Width = maze.Width = 41;
            tiledMap.Height = maze.Height = 31;

            maze.Tiles = new TiledTile[maze.Width * maze.Height];
            tiledMap.ObjectGroups.Clear();

            var generatedMaze = (new RoomMazeGenerator()).Generate(
                new RoomMazeGenerator.Settings(maze.Width, maze.Height) { ExtraConnectorChance = 5, WindingPercent = 50 });

            for (var x = 0; x < generatedMaze.Regions.GetLength(0); x++)
                for (var y = 0; y < generatedMaze.Regions.GetLength(1); y++)
                {
                    var tile = new TiledTile();
                    if (generatedMaze.Regions[x, y].HasValue)
                    {
                        tile.Id = 2;
                    }
                    else
                    {
                        tile.Id = 17;
                    }

                    maze.SetTile(x, y, tile);
                }

            for (var i = 0; i < generatedMaze.Junctions.Count; i++)
            {
                var junction = generatedMaze.Junctions[i];
                var tile = maze.GetTile((int)junction.X, (int)junction.Y);
                tile.Id = 6;
            }

            var startGroup = new TiledObjectGroup
            {
                Name = "StartPoint",
                Objects = new List<TiledObject>()
            };
            tiledMap.ObjectGroups.Add(startGroup);
            
            GenerateStartPoint(tiledMap, 0, maze, generatedMaze, startGroup);
            GenerateStartPoint(tiledMap, 1, maze, generatedMaze, startGroup);
            GenerateStartPoint(tiledMap, 2, maze, generatedMaze, startGroup);
            GenerateStartPoint(tiledMap, 3, maze, generatedMaze, startGroup);
            GenerateStartPoint(tiledMap, 4, maze, generatedMaze, startGroup);

            var endRoom = generatedMaze.Rooms[generatedMaze.Rooms.Count - 1];
            var endRoomCenter = new Point(endRoom.X + endRoom.Width / 2, endRoom.Y + endRoom.Height / 2);
            tiledMap.ObjectGroups.Add(
                new TiledObjectGroup
                {
                    Name = "EndPoint",
                    Objects = new List<TiledObject>
                    {
                        new TiledObject
                        {
                            X = endRoomCenter.X * tiledMap.TileWidth,
                            Y = endRoomCenter.Y * tiledMap.TileHeight,
                            Name = "EndPoint"
                        }
                    }
                });
            maze.GetTile(endRoomCenter.X, endRoomCenter.Y).Id = 9;
        }

        private static void GenerateStartPoint(TiledMap tiledMap, int idx, TiledTileLayer maze, RoomMazeGenerator.Result generatedMaze, TiledObjectGroup startGroup)
        {
            var startRoom = generatedMaze.Rooms[idx];
            var startRoomCenter = new Point(startRoom.X + startRoom.Width / 2, startRoom.Y + startRoom.Height / 2);
            startGroup.Objects.Add(
                        new TiledObject
                        {
                            X = startRoomCenter.X * tiledMap.TileWidth,
                            Y = startRoomCenter.Y * tiledMap.TileHeight,
                            Name = $"Player{idx + 1}StartPoint"
                        });
            maze.GetTile(startRoomCenter.X, startRoomCenter.Y).Id = 8;
        }
    }
}