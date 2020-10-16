namespace MyONez.ECS.EntitySystems.VirtualInput
{
    using System;
    using System.Linq;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;

    using MyONez.ECS.Components;
    using MyONez.Maths;

    /// <summary>
    ///     A virtual input represented as a float between -1 and 1
    /// </summary>
    public class VirtualAxis : VirtualInput
    {
        public VirtualAxis(OverlapBehavior overlap)
            : base(overlap)
        {
        }

        public VirtualAxis(OverlapBehavior overlap, params Node[] nodes)
            : base(overlap)
        {
            this.Nodes.AddRange(nodes);
        }

        public float Value { get; private set; }

        public override void Update(
            InputKeyboardComponent inputKeyboard,
            InputMouseComponent inputMouse,
            InputTouchComponent inputTouch,
            InputGamePadComponent inputGamePad)
        {
            base.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);

            var thisTickValue = 0f;
            for (var i = 0; i < this.Nodes.Count; i++)
            {
                var val = ((Node)this.Nodes[i]).Value;

                if (val == null)
                {
                    thisTickValue = this.CheckOverlap(this.Value);
                    break;
                }

                if (val == 0)
                {
                    continue;
                }

                var newResult = Math.Sign(val.Value);
                var oldResult = Math.Sign(thisTickValue);

                if (oldResult == newResult)
                {
                    continue;
                }

                if (thisTickValue == 0)
                {
                    thisTickValue = newResult;
                    continue;
                }

                thisTickValue = this.CheckOverlap(this.Value);
                break;
            }

            this.Value = thisTickValue;
        }

        private float CheckOverlap(float value)
        {
            switch (this.Overlap)
            {
                case OverlapBehavior.CancelOut:
                {
                    return 0;
                }

                case OverlapBehavior.TakeNewer:
                {
                    return -value;
                }

                case OverlapBehavior.TakeOlder:
                {
                    return value;
                }
                default:
                {
                    throw new IndexOutOfRangeException();
                }
            }
        }

        #region Node types

        public abstract class Node : VirtualInputNode
        {
            public float? Value { get; protected set; }

            protected void SetValue(bool left, bool right)
            {
                if (right)
                {
                    if (left)
                    {
                        this.Value = null;
                    }
                    else
                    {
                        this.Value = 1;
                    }
                }
                else if (left)
                {
                    this.Value = -1;
                }
                else
                {
                    this.Value = 0;
                }
            }
        }

        public class GamePadLeftStickX : Node
        {
            public float Deadzone;

            public GamePadLeftStickX(float deadzone = InputGamePadComponent.DEFAULT_DEADZONE)
            {
                this.Deadzone = deadzone;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.Value = Mathf.SignThreshold(inputGamePad.GetLeftStick(this.Deadzone).X, this.Deadzone);
            }
        }

        public class GamePadLeftStickY : Node
        {
            public float Deadzone;

            /// <summary>
            ///     if true, pressing up will return -1 and down will return 1 matching GamePadDpadUpDown
            /// </summary>
            public bool InvertResult = true;

            public GamePadLeftStickY(float deadzone = InputGamePadComponent.DEFAULT_DEADZONE)
            {
                this.Deadzone = deadzone;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                var multiplier = this.InvertResult ? -1 : 1;
                this.Value = multiplier * Mathf.SignThreshold(
                    inputGamePad.GetLeftStick(this.Deadzone).Y,
                    this.Deadzone);
            }
        }

        public class GamePadRightStickX : Node
        {
            public float Deadzone;

            public GamePadRightStickX(float deadzone = InputGamePadComponent.DEFAULT_DEADZONE)
            {
                this.Deadzone = deadzone;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.Value = Mathf.SignThreshold(inputGamePad.GetRightStick(this.Deadzone).X, this.Deadzone);
            }
        }

        public class GamePadRightStickY : Node
        {
            public float Deadzone;

            public GamePadRightStickY(float deadzone = InputGamePadComponent.DEFAULT_DEADZONE)
            {
                this.Deadzone = deadzone;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.Value = Mathf.SignThreshold(inputGamePad.GetRightStick(this.Deadzone).Y, this.Deadzone);
            }
        }

        public class GamePadDpadLeftRight : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                if (inputGamePad.DpadRightDown)
                    this.Value = 1f;
                else if (inputGamePad.DpadLeftDown)
                    this.Value = -1f;
                else
                    this.Value = 0f;
            }
        }

        public class GamePadDpadUpDown : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                if (inputGamePad.DpadDownDown)
                    this.Value = 1f;
                else if (inputGamePad.DpadUpDown)
                    this.Value = -1f;
                else
                    this.Value = 0f;
            }
        }

        public class KeyboardKeys : Node
        {
            public Keys Negative;

            public Keys Positive;

            public KeyboardKeys(Keys negative, Keys positive)
            {
                this.Negative = negative;
                this.Positive = positive;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.SetValue(inputKeyboard.IsKeyDown(this.Negative), inputKeyboard.IsKeyDown(this.Positive));
            }
        }

        public class MouseButtons : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.SetValue(inputMouse.LeftMouseButtonDown, inputMouse.RightMouseButtonDown);
            }
        }

        public class TouchHalfRegion : Node
        {
            private readonly bool isVertical;

            private readonly Rectangle region;

            public TouchHalfRegion(bool isVertical, Rectangle? region = null)
            {
                this.isVertical = isVertical;
                this.region = region ?? Core.Instance.Screen.Bounds;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                if (!inputTouch.IsConnected || !inputTouch.CurrentTouches.Any())
                {
                    this.Value = 0;
                    return;
                }

                bool leftTouch;
                bool rightTouch;

                if (this.isVertical)
                {
                    leftTouch = inputTouch.CurrentTouches.Any(a => a.Position.Y < this.region.Height / 2f);
                    rightTouch = inputTouch.CurrentTouches.Any(a => a.Position.Y >= this.region.Height / 2f);
                }
                else
                {
                    leftTouch = inputTouch.CurrentTouches.Any(a => a.Position.X < this.region.Width / 2f);
                    rightTouch = inputTouch.CurrentTouches.Any(a => a.Position.X >= this.region.Width / 2f);
                }

                this.SetValue(leftTouch, rightTouch);
            }
        }

        public class SettableValue : Node
        {
            public float AxisValue { get; set; }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.Value = this.AxisValue;
            }
        }

        #endregion
    }
}