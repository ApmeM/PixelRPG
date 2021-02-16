﻿namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;
    using LocomotorECS.Matching;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    using PixelRPG.Base.Assets.UnitAnimations;
    using FateRandom;
    using SpineEngine;
    using System.Collections.Generic;
    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using PixelRPG.Base.Screens;
    #endregion

    public class ClientReceiveServerCurrentStateVisibleSystem : ClientReceiveHandlerSystem<ServerCurrentStateTransferMessage>
    {
        private readonly Scene scene;

        public ClientReceiveServerCurrentStateVisibleSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
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

        protected override void DoAction(ServerCurrentStateTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var visiblePlayer = entity.GetComponent<VisiblePlayerComponent>();

            for (var i = 0; i < visiblePlayer.KnownPlayers.Count; i++)
            {
                visiblePlayer.KnownPlayers[i].Enabled = false;
            }

            for (var i = 0; i < message.Players.Count; i++)
            {
                var playerUnit = this.scene.FindEntity($"PlayerUnit{message.Players[i].PlayerId}");
                if (playerUnit == null)
                {
                    playerUnit = this.scene.CreateEntity($"PlayerUnit{message.Players[i].PlayerId}");
                    playerUnit.AddComponent<PositionComponent>().Position = new Vector2(message.Players[i].Position.X * 16 + 8, message.Players[i].Position.Y * 16 + 8);
                    playerUnit.AddComponent<UnitComponent>().UnitAnimations = new HeroSprite(Core.Instance.Content, Fate.GlobalFate.Choose<string>(availableAnimations), 6);
                    visiblePlayer.KnownPlayers.Add(playerUnit);
                }
                else
                {
                    playerUnit.GetComponent<PositionComponent>().Position = new Vector2(message.Players[i].Position.X * 16 + 8, message.Players[i].Position.Y * 16 + 8);
                }

                playerUnit.Enabled = true;
            }


            var map = this.scene.FindEntity(visiblePlayer.MapEntityName);
            var tiledMap = map.GetComponent<TiledMapComponent>().TiledMap;

            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");

            for (var x = 0; x < message.Map.Regions.GetLength(0); x++)
                for (var y = 0; y < message.Map.Regions.GetLength(1); y++)
                {
                    if (message.Map.Regions[x, y] == GameSceneConfig.UnknownRegionValue)
                    {
                        continue;
                    }

                    var currentTile = maze.GetTile(x, y);
                    if (currentTile != null)
                    {
                        continue;
                    }

                    var tile = new TiledTile();
                    if (message.Map.Regions[x, y] == GameSceneConfig.WallRegionValue)
                    {
                        tile.Id = 17;
                    }
                    else if (message.Map.Regions[x, y] == GameSceneConfig.PathRegionValue)
                    {
                        tile.Id = 2;
                    }

                    maze.SetTile(x, y, tile);
                }

            for (var i = 0; i < message.Map.Junctions.Count; i++)
            {
                var junction = message.Map.Junctions[i];
                var tile = maze.GetTile(junction.X, junction.Y);
                tile.Id = 6;
            }

            if (message.Exit != null)
            {
                var currentTile = maze.GetTile(message.Exit.Value.X, message.Exit.Value.Y);
                if (currentTile == null)
                {
                    currentTile = new TiledTile();
                    maze.SetTile(message.Exit.Value.X, message.Exit.Value.Y, currentTile);
                }

                currentTile.Id = 9;
            }
        }
    }
}