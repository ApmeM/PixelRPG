namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;


    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    using PixelRPG.Base.Assets.UnitAnimations;
    using SpineEngine;
    using FateRandom;
    using LocomotorECS.Matching;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    using Microsoft.Xna.Framework.Graphics;
    #endregion

    public class ClientReceiveServerGameStartedVisibleSystem : ClientReceiveHandlerSystem<ServerGameStartedTransferMessage>
    {
        private readonly Scene scene;

        public ClientReceiveServerGameStartedVisibleSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(ServerGameStartedTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var visiblePlayer = entity.GetComponent<VisiblePlayerComponent>();

            var map = this.scene.FindEntity(visiblePlayer.MapEntityName);
            var tiledMap = map.GetComponent<TiledMapComponent>().TiledMap;

            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");
            var water = (TiledTileLayer)tiledMap.GetLayer("Water");
            var fog = (TiledTileLayer)tiledMap.GetLayer("Fog");

            tiledMap.Width = maze.Width = water.Width = fog.Width = message.Width;
            tiledMap.Height = maze.Height = water.Height = fog.Height = message.Height;
            tiledMap.ObjectGroups.Clear();

            maze.Tiles = new TiledTile[maze.Width * maze.Height];
            water.Tiles = new TiledTile[water.Width * water.Height];
            fog.Tiles = new TiledTile[water.Width * water.Height];

            tiledMap.TileSets[1].ImageTexture = Core.Instance.Content.Load<Texture2D>($"{ContentPaths.Assets.water0.Trim('0')}{Fate.GlobalFate.NextInt(5)}");
            tiledMap.TileSets[0].ImageTexture = Core.Instance.Content.Load<Texture2D>($"{ContentPaths.Assets.tiles0.Trim('0')}{Fate.GlobalFate.NextInt(5)}");
        }
    }
}