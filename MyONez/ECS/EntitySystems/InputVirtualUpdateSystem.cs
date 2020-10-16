namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using MyONez.ECS.Components;

    public class InputVirtualUpdateSystem : EntityProcessingSystem
    {
        public InputVirtualUpdateSystem()
            : base(new Matcher().All(typeof(InputVirtualComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var inputKeyboard = entity.GetComponent<InputKeyboardComponent>();
            var inputMouse = entity.GetComponent<InputMouseComponent>();
            var inputTouch = entity.GetComponent<InputTouchComponent>();
            var inputGamePad = entity.GetComponent<InputGamePadComponent>();
            var input = entity.GetComponent<InputVirtualComponent>();

            foreach (var inputConfig in input.InputConfiguration)
            {
                inputConfig.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);
            }
        }
    }
}