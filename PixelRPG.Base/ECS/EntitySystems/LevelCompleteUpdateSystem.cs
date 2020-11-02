namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez;
    using MyONez.AdditionalContent.TiledMap.ECS.Components;
    using MyONez.AdditionalContent.TiledMap.Models;
    using MyONez.ECS;
    using MyONez.ECS.Components;

    using PixelRPG.Base.ECS.Components;
    using PixelRPG.Base.Screens;

    using Random = MyONez.Maths.Random;

    public class LevelCompleteUpdateSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public LevelCompleteUpdateSystem(Scene scene)
            : base(new Matcher().All(typeof(UnitComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var map = this.scene.FindEntity("map");
            var tiledMap = map.GetComponent<TiledMapComponent>().TiledMap;
            var startPoint = tiledMap.GetObjectGroup("StartPoint").Objects.First(a => a.Name == "Player1StartPoint");
            var endPoint = tiledMap.GetObjectGroup("EndPoint").Objects.First(a => a.Name == "EndPoint");
            var position = entity.GetComponent<PositionComponent>();

            if (endPoint.X + 8 == position.Position.X && endPoint.Y + 8 == position.Position.Y)
            {
                BasicScene.GenerateMap(tiledMap);
                BasicScene.GeneratePathFinding(map);
                startPoint = tiledMap.GetObjectGroup("StartPoint").Objects.First(a => a.Name == "Player1StartPoint");
                endPoint = tiledMap.GetObjectGroup("EndPoint").Objects.First(a => a.Name == "EndPoint");
                entity.GetComponent<PositionComponent>().Position = new Vector2(startPoint.X + 8, startPoint.Y + 8);
                entity.GetComponent<UnitMoveComponent>().Destination = new Point(endPoint.X + 8, endPoint.Y + 8);

                tiledMap.TileSets[1].ImageTexture = Core.Instance.Content.Load<Texture2D>($"{ContentPaths.Assets.water0.Trim('0')}{Random.NextInt(5)}");
                tiledMap.TileSets[0].ImageTexture = Core.Instance.Content.Load<Texture2D>($"{ContentPaths.Assets.tiles0.Trim('0')}{Random.NextInt(5)}");
            }
        }
    }
}