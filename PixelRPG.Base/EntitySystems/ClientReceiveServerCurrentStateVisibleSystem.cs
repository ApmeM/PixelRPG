namespace PixelRPG.Base.EntitySystems
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
    using PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components;
    #endregion

    public class ClientReceiveServerCurrentStateVisibleSystem : ClientReceiveHandlerSystem<ServerCurrentStateTransferMessage>
    {
        private readonly Scene scene;

        public ClientReceiveServerCurrentStateVisibleSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(ServerCurrentStateTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var visiblePlayer = entity.GetComponent<VisiblePlayerComponent>();

            for (var i = 0; i < visiblePlayer.KnownPlayers.Count; i++)
            {
                visiblePlayer.KnownPlayers[i].Enabled = false;
            }

            var stat = scene.FindEntity("Stat");
            var text = stat.GetComponent<TextComponent>();
            text.Text = "Statistic:\nPlayer | Lvl | Tot\n";
            for (var i = 0; i < message.Players.Count; i++)
            {
                var player = message.Players[i];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var entityName = $"PlayerUnit{player.PlayerId}_{player.Units[j].UnitId}";
                    var playerUnit = this.scene.FindEntity(entityName);
                    var newPosition = new Vector2(player.Units[j].Position.X * 16 + 8, player.Units[j].Position.Y * 16 + 8);
                    var positionComponent = playerUnit.GetComponent<PositionComponent>();
                    if (player.Units[j].Hp <= 0)
                    {
                        playerUnit.GetComponent<UnitComponent>().State = Assets.UnitState.Dead;
                    }
                    else if (newPosition.X == positionComponent.Position.X && newPosition.Y == positionComponent.Position.Y)
                    {
                        playerUnit.GetComponent<UnitComponent>().State = Assets.UnitState.Idle;
                    }
                    else
                    {
                        playerUnit.GetComponent<UnitComponent>().State = Assets.UnitState.Run;
                    }

                    positionComponent.Position = newPosition;
                    playerUnit.Enabled = true;
                }

                text.Text += $"{ player.PlayerId } | { player.LevelScore, 3 } | {player.TotalScore, 3}\n";
            }

            var map = this.scene.FindEntity(visiblePlayer.MapEntityName);
            var tiledMap = map.GetComponent<TiledMapComponent>().TiledMap;

            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");
            var fog = (TiledTileLayer)tiledMap.GetLayer("Fog");

            for (var x = 0; x < message.Map.GetLength(0); x++)
                for (var y = 0; y < message.Map.GetLength(1); y++)
                {
                    var fogTile = fog.GetTile(x, y);
                    if (message.Map[x, y] == GameSceneConfig.UnknownRegionValue)
                    {
                        if (fogTile == null)
                        {
                            fogTile = new TiledTile { Id = 70 };
                            fog.SetTile(x, y, fogTile);
                            continue;
                        }

                        fogTile.Id = 70;
                        continue;
                    }
                    if (fogTile != null)
                    {
                        fogTile.Id = 71;
                    }

                    var currentTile = maze.GetTile(x, y);
                    if (currentTile == null)
                    {
                        currentTile = new TiledTile();
                    }

                    if (message.Map[x, y] == GameSceneConfig.WallRegionValue)
                    {
                        currentTile.Id = 17;
                    }
                    else if (message.Map[x, y] == GameSceneConfig.PathRegionValue)
                    {
                        currentTile.Id = 2;
                    }
                    maze.SetTile(x, y, currentTile);
                }

            for (var i = 0; i < message.Doors.Count; i++)
            {
                var junction = message.Doors[i];
                var tile = maze.GetTile(junction.X, junction.Y);
                tile.Id = 6;
            }

            if (message.Exit != null)
            {
                var currentTile = maze.GetTile(message.Exit.X, message.Exit.Y);
                if (currentTile == null)
                {
                    currentTile = new TiledTile();
                    maze.SetTile(message.Exit.X, message.Exit.Y, currentTile);
                }

                currentTile.Id = 9;
            }
        }
    }
}