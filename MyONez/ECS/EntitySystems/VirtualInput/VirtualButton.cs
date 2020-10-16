namespace MyONez.ECS.EntitySystems.VirtualInput
{
    using System.Linq;

    using Microsoft.Xna.Framework.Input;

    using MyONez.ECS.Components;

    /// <summary>
    ///     A virtual input that is represented as a boolean. As well as simply checking the current button state, you can ask
    ///     whether
    ///     it was just pressed or released this frame.
    /// </summary>
    public class VirtualButton : VirtualInput
    {
        public VirtualButton(OverlapBehavior overlapBehavior)
            : base(overlapBehavior)
        {
        }

        public VirtualButton(OverlapBehavior overlapBehavior, params Node[] nodes)
            : base(overlapBehavior)
        {
            this.Nodes.AddRange(nodes);
        }

        public bool IsDown { get; private set; }

        public bool IsPressed { get; private set; }

        public bool IsReleased { get; private set; }

        public override void Update(
            InputKeyboardComponent inputKeyboard,
            InputMouseComponent inputMouse,
            InputTouchComponent inputTouch,
            InputGamePadComponent inputGamePad)
        {
            base.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);

            var downLastFrame = this.IsDown;
            this.IsDown = false;
            foreach (var node in this.Nodes)
            {
                if (((Node)node).IsDown)
                {
                    this.IsDown = true;
                    break;
                }
            }

            this.IsPressed = !downLastFrame && this.IsDown;
            this.IsReleased = downLastFrame && !this.IsDown;
        }

        #region Node types

        public abstract class Node : VirtualInputNode
        {
            public bool IsDown { get; protected set; }
        }

        public class KeyboardKey : Node
        {
            public Keys Key;

            public KeyboardKey(Keys key)
            {
                this.Key = key;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputKeyboard.IsKeyDown(this.Key);
            }
        }

        /// <summary>
        ///     works like KeyboardKey except the modifier key must also be down for isDown/isPressed to be true. isReleased checks
        ///     only key.
        /// </summary>
        public class KeyboardModifiedKey : Node
        {
            public Keys Key;

            public Keys Modifier;

            public KeyboardModifiedKey(Keys key, Keys modifier)
            {
                this.Key = key;
                this.Modifier = modifier;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputKeyboard.IsKeyDown(this.Modifier) && inputKeyboard.IsKeyDown(this.Key);
            }
        }

        public class GamePadButton : Node
        {
            public Buttons Button;

            public GamePadButton(Buttons button)
            {
                this.Button = button;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.IsButtonDown(this.Button);
            }
        }

        public class GamePadLeftTrigger : Node
        {
            public float Threshold;

            public GamePadLeftTrigger(float threshold)
            {
                this.Threshold = threshold;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.IsLeftTriggerDown(this.Threshold);
            }
        }

        public class GamePadRightTrigger : Node
        {
            public float Threshold;

            public GamePadRightTrigger(float threshold)
            {
                this.Threshold = threshold;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.IsRightTriggerDown(this.Threshold);
            }
        }

        public class GamePadDPadRight : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.DpadRightDown;
            }
        }

        public class GamePadDPadLeft : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.DpadLeftDown;
            }
        }

        public class GamePadDPadUp : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.DpadUpDown;
            }
        }

        public class GamePadDPadDown : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputGamePad.DpadDownDown;
            }
        }

        public class MouseLeftButton : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputMouse.LeftMouseButtonDown;
            }
        }

        public class MouseMiddleButton : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputMouse.MiddleMouseButtonDown;
            }
        }

        public class MouseRightButton : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputMouse.RightMouseButtonDown;
            }
        }

        public class TouchTouched : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = inputTouch.IsConnected && inputTouch.CurrentTouches.Any();
            }
        }

        public class SettableValue : Node
        {
            public bool ButtonValue;

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.IsDown = this.ButtonValue;
            }
        }

        #endregion
    }
}