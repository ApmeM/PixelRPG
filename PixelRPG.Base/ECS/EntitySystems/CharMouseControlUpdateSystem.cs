namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using SpineEngine.ECS.Components;

    using PixelRPG.Base.ECS.Components;

    public class CharMouseControlUpdateSystem : EntityProcessingSystem
    {
        public CharMouseControlUpdateSystem()
            : base(new Matcher().All(typeof(UnitComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var unitMove = entity.GetComponent<UnitMoveComponent>();
            var mouse = entity.GetComponent<InputMouseComponent>();

            if (mouse.LeftMouseButtonPressed)
            {
                unitMove.Destination = new Point((int)mouse.MousePosition.X + 8, (int)mouse.MousePosition.Y + 8);
            }
        }
    }
}