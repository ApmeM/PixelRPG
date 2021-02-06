namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    using PixelRPG.Base.ECS.Components;
    using PixelRPG.Base.Screens;

    using SpineEngine;
    using FateRandom;
    using PixelRPG.Base.AdditionalStuff.TurnBase.Components;
    using PixelRPG.Base.ECS.EntitySystems.Models;

    public class LevelCompleteUpdateSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public LevelCompleteUpdateSystem(Scene scene)
            : base(new Matcher().All(typeof(PlayerSwitcherComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var playerSwitcher = entity.GetComponent<PlayerSwitcherComponent>();
            var tiledMap = entity.GetComponent<TiledMapComponent>().TiledMap;
            var endPoint = tiledMap.GetObjectGroup("EndPoint").Objects.First(a => a.Name == "EndPoint");

            var found = true;
            for (var i = 0; i < playerSwitcher.Players.Length; i++)
            {
                var turnData = (TurnData)playerSwitcher.Players[i].TurnData;
                if (turnData == null || turnData.Entity == null)
                {
                    found = false;
                    continue;
                }

                var position = turnData.Entity.GetComponent<PositionComponent>();

                if (endPoint.X + 8 != position.Position.X || endPoint.Y + 8 != position.Position.Y)
                {
                    found = false;
                    continue;
                }
            }

            if (!found)
            {
                return;
            }

            BasicScene.GenerateMap(tiledMap);
            BasicScene.GeneratePathFinding(entity);
            tiledMap.TileSets[1].ImageTexture = Core.Instance.Content.Load<Texture2D>($"{ContentPaths.Assets.water0.Trim('0')}{Fate.GlobalFate.NextInt(5)}");
            tiledMap.TileSets[0].ImageTexture = Core.Instance.Content.Load<Texture2D>($"{ContentPaths.Assets.tiles0.Trim('0')}{Fate.GlobalFate.NextInt(5)}");

            for (var i = 0; i < playerSwitcher.Players.Length; i++)
            {
                var turnData = (TurnData)playerSwitcher.Players[i].TurnData;
                var player = turnData.Entity;

                var startPoint = tiledMap.GetObjectGroup("StartPoint").Objects.First(a => a.Name == $"Player{i + 1}StartPoint");
                player.GetComponent<PositionComponent>().Position = new Vector2(startPoint.X + 8, startPoint.Y + 8);
                turnData.MoveTo = new BrainAI.Pathfinding.Point(startPoint.X / 16, startPoint.Y / 16);
            }
        }
    }
}