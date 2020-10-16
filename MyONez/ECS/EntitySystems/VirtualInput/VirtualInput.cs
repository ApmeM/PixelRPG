namespace MyONez.ECS.EntitySystems.VirtualInput
{
    using System.Collections.Generic;

    using MyONez.ECS.Components;

    /// <summary>
    ///     Represents a virtual button, axis or joystick whose state is determined by the state of its VirtualInputNodes
    /// </summary>
    public abstract class VirtualInput
    {
        public enum OverlapBehavior
        {
            /// <summary>
            ///     duplicate input will result in canceling each other out and no input will be recorded. Example: press left arrow
            ///     key and while
            ///     holding it down press right arrow. This will result in canceling each other out.
            /// </summary>
            CancelOut,

            /// <summary>
            ///     the first input found will be used
            /// </summary>
            TakeOlder,

            /// <summary>
            ///     the last input found will be used
            /// </summary>
            TakeNewer
        }

        protected readonly List<VirtualInputNode> Nodes = new List<VirtualInputNode>();

        protected readonly OverlapBehavior Overlap;

        protected VirtualInput(OverlapBehavior overlap)
        {
            this.Overlap = overlap;
        }

        public virtual void Update(
            InputKeyboardComponent inputKeyboard,
            InputMouseComponent inputMouse,
            InputTouchComponent inputTouch,
            InputGamePadComponent inputGamePad)
        {
            foreach (var node in this.Nodes)
            {
                node.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);
            }
        }
    }
}