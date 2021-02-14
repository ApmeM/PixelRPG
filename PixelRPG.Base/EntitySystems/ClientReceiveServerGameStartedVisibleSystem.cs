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
                var tile = maze.GetTile(junction.X, junction.Y);
                tile.Id = 6;
            }

            maze.GetTile(message.Exit.X, message.Exit.Y).Id = 9;
        }
    }
}