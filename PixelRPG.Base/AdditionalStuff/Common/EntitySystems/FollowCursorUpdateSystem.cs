namespace PixelRPG.Base.AdditionalStuff.Common.EntitySystems
{
    using System;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.Common.Components;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    public class FollowCursorUpdateSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public FollowCursorUpdateSystem(Scene scene)
            : base(new Matcher().All(typeof(FollowCursorComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var pos = entity.GetOrCreateComponent<PositionComponent>();
            var mouse = entity.GetOrCreateComponent<InputMouseComponent>();
            var touch = entity.GetOrCreateComponent<InputTouchComponent>();

            if (touch.CurrentTouches.Any())
            {
                pos.Position = touch.GetScaledPosition(touch.CurrentTouches.First().Position);
            }
            else
            {
                pos.Position = mouse.MousePosition;
            }

            pos.Position = this.scene.Camera.ScreenToWorldPoint(pos.Position);
        }
    }
}