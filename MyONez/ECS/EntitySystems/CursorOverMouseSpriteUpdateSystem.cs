namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.Maths;
    using MyONez.Utils;

    public class CursorOverMouseSpriteUpdateSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public CursorOverMouseSpriteUpdateSystem(Scene scene)
            : base(new Matcher().All(typeof(InputMouseComponent), typeof(CursorOverComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var mouse = entity.GetComponent<InputMouseComponent>();
            var clickable = entity.GetComponent<CursorOverComponent>();

            var mousePosition = this.scene.Camera.ScreenToWorldPoint(mouse.MousePosition);
            var entityPosition = TransformationUtils.GetTransformation(entity);

            var matrix = entityPosition.LocalTransformMatrix;

            Matrix.Invert(ref matrix, out matrix);
            Vector2.Transform(ref mousePosition, ref matrix, out mousePosition);

            var rect = clickable.OverRegion;

            clickable.IsMouseOver = rect.Contains(mousePosition);
        }
    }
}