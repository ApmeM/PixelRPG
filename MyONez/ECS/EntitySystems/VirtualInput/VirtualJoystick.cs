namespace MyONez.ECS.EntitySystems.VirtualInput
{
    using System;
    using System.Linq;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;

    using MyONez.ECS.Components;

    /// <summary>
    ///     A virtual input that is represented as a Vector2, with both X and Y as values between -1 and 1
    /// </summary>
    public class VirtualJoystick : VirtualInput
    {
        public bool Normalized;

        public VirtualJoystick(OverlapBehavior overlapBehavior, bool normalized)
            : base(overlapBehavior)
        {
            this.Normalized = normalized;
        }

        public VirtualJoystick(OverlapBehavior overlapBehavior, bool normalized, params Node[] nodes)
            : base(overlapBehavior)
        {
            this.Normalized = normalized;
            this.Nodes.AddRange(nodes);
        }

        public Vector2 Value { get; private set; }

        public override void Update(
            InputKeyboardComponent inputKeyboard,
            InputMouseComponent inputMouse,
            InputTouchComponent inputTouch,
            InputGamePadComponent inputGamePad)
        {
            base.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);

            var thisTickValueX = 0f;
            for (var i = 0; i < this.Nodes.Count; i++)
            {
                var val = ((Node)this.Nodes[i]).ValueX;

                if (val == null)
                {
                    thisTickValueX = this.CheckOverlap(this.Value.X);
                    break;
                }

                if (val == 0)
                {
                    continue;
                }

                var newResult = Math.Sign(val.Value);
                var oldResult = Math.Sign(thisTickValueX);

                if (oldResult == newResult)
                {
                    continue;
                }

                if (thisTickValueX == 0)
                {
                    thisTickValueX = newResult;
                    continue;
                }

                thisTickValueX = this.CheckOverlap(this.Value.X);
                break;
            }

            var thisTickValueY = 0f;
            for (var i = 0; i < this.Nodes.Count; i++)
            {
                var val = ((Node)this.Nodes[i]).ValueY;

                if (val == null)
                {
                    thisTickValueY = this.CheckOverlap(this.Value.Y);
                    break;
                }

                if (val == 0)
                {
                    continue;
                }

                var newResult = Math.Sign(val.Value);
                var oldResult = Math.Sign(thisTickValueY);

                if (oldResult == newResult)
                {
                    continue;
                }

                if (thisTickValueY == 0)
                {
                    thisTickValueY = newResult;
                    continue;
                }

                thisTickValueY = this.CheckOverlap(this.Value.Y);
                break;
            }

            this.Value = new Vector2(thisTickValueX, thisTickValueY);
            if (this.Normalized)
            {
                this.Value.Normalize();
            }
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
            public float? ValueX { get; protected set; }

            public float? ValueY { get; protected set; }

            protected void SetValue(bool up, bool down, bool left, bool right)
            {
                if (down)
                {
                    if (up)
                    {
                        this.ValueY = null;
                    }
                    else
                    {
                        this.ValueY = 1;
                    }
                }
                else if (up)
                {
                    this.ValueY = -1;
                }
                else
                {
                    this.ValueY = 0;
                }

                if (right)
                {
                    if (left)
                    {
                        this.ValueX = null;
                    }
                    else
                    {
                        this.ValueX = 1;
                    }
                }
                else if (left)
                {
                    this.ValueX = -1;
                }
                else
                {
                    this.ValueX = 0;
                }
            }
        }

        public class GamePadLeftStick : Node
        {
            public float Deadzone;

            public GamePadLeftStick(float deadzone = InputGamePadComponent.DEFAULT_DEADZONE)
            {
                this.Deadzone = deadzone;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                var value = inputGamePad.GetLeftStick(this.Deadzone);
                this.ValueX = value.X;
                this.ValueY = value.Y;
            }
        }

        public class GamePadRightStick : Node
        {
            public float Deadzone;

            public GamePadRightStick(float deadzone = InputGamePadComponent.DEFAULT_DEADZONE)
            {
                this.Deadzone = deadzone;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                var value = inputGamePad.GetRightStick(this.Deadzone);
                this.ValueX = value.X;
                this.ValueY = value.Y;
            }
        }

        public class GamePadDpad : Node
        {
            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                if (inputGamePad.DpadRightDown)
                    this.ValueX = 1;
                else if (inputGamePad.DpadLeftDown)
                    this.ValueX = -1;
                else
                    this.ValueX = 0;

                if (inputGamePad.DpadDownDown)
                    this.ValueY = 1;
                else if (inputGamePad.DpadUpDown)
                    this.ValueY = -1;
                else
                    this.ValueY = 0;
            }
        }

        public class KeyboardKeys : Node
        {
            public Keys Down;

            public Keys Left;

            public Keys Right;

            public Keys Up;

            public KeyboardKeys(Keys left, Keys right, Keys up, Keys down)
            {
                this.Left = left;
                this.Right = right;
                this.Up = up;
                this.Down = down;
            }

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                var up = inputKeyboard.IsKeyDown(this.Up);
                var down = inputKeyboard.IsKeyDown(this.Down);
                var left = inputKeyboard.IsKeyDown(this.Left);
                var right = inputKeyboard.IsKeyDown(this.Right);

                this.SetValue(up, down, left, right);
            }
        }

        public class TouchHalfRegion : Node
        {
            private readonly Rectangle region;

            public TouchHalfRegion(Rectangle? region = null)
            {
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
                    this.ValueX = 0;
                    this.ValueY = 0;
                    return;
                }

                bool leftTouch;
                bool rightTouch;
                bool upTouch;
                bool downTouch;

                upTouch = inputTouch.CurrentTouches.Any(a => a.Position.Y < this.region.Height / 2f);
                downTouch = inputTouch.CurrentTouches.Any(a => a.Position.Y >= this.region.Height / 2f);
                leftTouch = inputTouch.CurrentTouches.Any(a => a.Position.X < this.region.Width / 2f);
                rightTouch = inputTouch.CurrentTouches.Any(a => a.Position.X >= this.region.Width / 2f);

                this.SetValue(upTouch, downTouch, leftTouch, rightTouch);
            }
        }

        public class SettableValue : Node
        {
            public Vector2 JoysticValue;

            public override void Update(
                InputKeyboardComponent inputKeyboard,
                InputMouseComponent inputMouse,
                InputTouchComponent inputTouch,
                InputGamePadComponent inputGamePad)
            {
                this.ValueX = this.JoysticValue.X;
                this.ValueY = this.JoysticValue.Y;
            }
        }

        #endregion
    }
}