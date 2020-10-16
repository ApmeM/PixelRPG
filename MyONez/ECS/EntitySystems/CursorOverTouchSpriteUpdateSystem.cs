namespace MyONez.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using MyONez.ECS.Components;

    public class CursorOverTouchSpriteUpdateSystem : EntityProcessingSystem
    {
        public CursorOverTouchSpriteUpdateSystem()
            : base(new Matcher().All(typeof(InputTouchComponent), typeof(CursorOverComponent), typeof(SpriteComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var sprite = entity.GetComponent<SpriteComponent>();
            var touch = entity.GetComponent<InputTouchComponent>();
            var clickable = entity.GetComponent<CursorOverComponent>();

            if (!touch.IsConnected)
            {
                return;
            }

            clickable.IsMouseOver =
                touch.CurrentTouches.Any(a => sprite.Drawable.Bounds.Contains(touch.GetScaledPosition(a.Position)));
        }
    }
}