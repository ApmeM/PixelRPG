namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using SpineEngine.ECS;
    using SpineEngine.ECS.EntitySystems;
    using SpineEngine.Graphics.Renderers;
    using SpineEngine.Graphics.ResolutionPolicy;
    using SpineEngine;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using PixelRPG.Base.AdditionalStuff.BrainAI.EntitySystems;
    using System;
    using PixelRPG.Base.AdditionalStuff.ClientServer;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.EntitySystems;
    using PixelRPG.Base.TransferMessages;

    #endregion

    public class GameScene : Scene
    {
        public GameScene(GameSceneConfig config)
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new DefaultRenderer());

            var parsers = new ITransferMessageParser[]
            {
                new ServerClientConnectedTransferMessageParser(),
                new ClientConnectTransferMessageParser(),
                new ServerGameStartedTransferMessageParser(),
                new ClientTurnDoneTransferMessageParser(),
                new ServerPlayerTurnMadeTransferMessageParser(),
                new ServerCurrentStateTransferMessageParser(),
                new ServerYourTurnTransferMessageParser(),
                new ServerYouConnectedTransferMessageParser()
            };

            var map = this.CreateEntity("Map");
            map.AddComponent(new TiledMapComponent(Core.Instance.Content.Load<TiledMap>(ContentPaths.Assets.template)));

            this.AddEntitySystem(new ServerReceiveHandlerSystem(
                new ServerReceiveClientConnectHandler(),
                new ServerRecieveClientTurnDoneHandler()));
            this.AddEntitySystem(new LocalServerCommunicatorSystem(parsers));
            this.AddEntitySystem(new NetworkServerCommunicatorSystem(parsers));
            this.AddEntitySystem(new ClientReceiveServerGameStartedVisibleSystem(this));
            this.AddEntitySystem(new LocalClientCommunicatorSystem(this, parsers));
            this.AddEntitySystem(new ClientReceiveServerGameStartedAISystem());
            this.AddEntitySystem(new ClientRecieveServerYourTurnAISystem());
            this.AddEntitySystem(new ClientRecieveServerYouConnectedAISystem());
            this.AddEntitySystem(new ClientSendClientTurnDoneAISystem());
            this.AddEntitySystem(new ClientReceiveServerCurrentStateAISystem());
            this.AddEntitySystem(new ClientReceiveServerCurrentStateVisibleSystem(this));
            this.AddEntitySystem(new AIUpdateSystem());
            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
            this.AddEntitySystem(new AnimationSpriteUpdateSystem());
            this.AddEntitySystem(new CharSpriteUpdateSystem());
            this.AddEntitySystem(new NetworkClientCommunicatorSystem(parsers));

            if (config.IsServer)
            {
                var server = this.CreateEntity("Server");
                server.AddComponent<GameStateComponent>().MaxPlayersCount = config.TotalPlayers;
                server.AddComponent<ServerComponent>();
                server.AddComponent<LocalServerComponent>();
                server.AddComponent(new NetworkServerComponent("127.0.0.1", 8085));

                for (var i = 0; i < config.ClientsCount; i++)
                {
                    var player = this.CreateEntity();
                    player.AddComponent<ClientComponent>().Message = new ClientConnectTransferMessage { PlayerName = $"Player {i}" };
                    player.AddComponent<AIComponent>().AIBot = new SimpleAI();
                    if (i == 0)
                    {
                        player.AddComponent(new VisiblePlayerComponent(map.Name));
                    }
#if !Bridge
                    if (i % 2 == 0)
                    {
                        player.AddComponent(new NetworkClientComponent(new Uri("ws://127.0.0.1:8085")));
                    }
                    else
#endif
                    {
                        player.AddComponent<LocalClientComponent>().ServerEntity = server.Name;
                    }
                }
            }
            else
            {
                for (var i = 0; i < config.ClientsCount; i++)
                {
                    var player = this.CreateEntity();
                    player.AddComponent<ClientComponent>().Message = new ClientConnectTransferMessage { PlayerName = $"Player {i}" };
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