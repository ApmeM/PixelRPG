namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework.Input;

    using MyONez.ECS.Components;

    public class InputKeyboardUpdateSystem : EntityProcessingSystem
    {
        public InputKeyboardUpdateSystem()
            : base(new Matcher().All(typeof(InputKeyboardComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var text = entity.GetComponent<InputKeyboardComponent>();

            text.PreviousKeyboardState = text.CurrentKeyboardState;
            text.CurrentKeyboardState = Keyboard.GetState();
        }
    }
}