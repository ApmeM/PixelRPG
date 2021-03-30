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

            for (var x = 0; x < maze.Width; x++)
                for (var y = 0; y < maze.Height; y++)
                {
                    var mapTile = message.Map[x * maze.Height + y];
                    switch (mapTile)
                    {
                        case RegionValue.Unknown:
                            {
                                fog.GetTile(x, y).Id = 70;
                                break;
                            }
                        case RegionValue.Wall:
                            {
                                fog.GetTile(x, y).Id = 71;
                                maze.GetTile(x, y).Id = 17;
                                break;
                            }
                        case RegionValue.Path:
                            {
                                fog.GetTile(x, y).Id = 71;
                                maze.GetTile(x, y).Id = 2;
                                break;
                            }
                    }
                }

            for (var i = 0; i < message.Doors.Count; i++)
            {
                var junction = message.Doors[i];
                maze.GetTile(junction.X, junction.Y).Id = 6;
            }

            if (message.Exit != null)
            {
                maze.GetTile(message.Exit.X, message.Exit.Y).Id = 9;
            }
        }
    }
}