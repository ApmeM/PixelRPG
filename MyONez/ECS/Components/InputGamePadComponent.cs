namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;

    /// <summary>
    ///     Input component that is filled by InputGamePadUpdateSystem for game pad data
    /// </summary>
    public class InputGamePadComponent : Component
    {
        public const float DEFAULT_DEADZONE = 0.1f;

        internal GamePadState CurrentState;

        /// <summary>
        ///     toggles inverting the left sticks vertical value
        /// </summary>
        public bool IsLeftStickVerticalInverted = false;

        /// <summary>
        ///     toggles inverting the right sticks vertical value
        /// </summary>
        public bool IsRightStickVerticalInverted = false;

        internal PlayerIndex PlayerIndex;

        internal GamePadState PreviousState;

        internal float RumbleTime;

        public bool ThisTickConnected = false;

        public bool ThisTickDisconnected = false;

        public InputGamePadComponent()
        {
            this.PlayerIndex = 0;
            this.PreviousState = new GamePadState();
            this.CurrentState = GamePad.GetState(this.PlayerIndex);
        }

        public InputGamePadComponent(PlayerIndex playerIndex)
        {
            this.PlayerIndex = playerIndex;
            this.PreviousState = new GamePadState();
            this.CurrentState = GamePad.GetState(this.PlayerIndex);
        }

        public void SetVibration(float left, float right, float duration)
        {
            this.RumbleTime = duration;
            GamePad.SetVibration(this.PlayerIndex, left, right);
        }

        public void StopVibration()
        {
            GamePad.SetVibration(this.PlayerIndex, 0, 0);
            this.RumbleTime = 0f;
        }

        /// <summary>
        ///     returns true if this game pad is connected
        /// </summary>
        /// <returns><c>true</c>, if connected was ised, <c>false</c> otherwise.</returns>
        public bool IsConnected()
        {
            return this.CurrentState.IsConnected;
        }

        #region Buttons

        /// <summary>
        ///     only true if down this frame
        /// </summary>
        /// <returns><c>true</c>, if button pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="button">Button.</param>
        public bool IsButtonPressed(Buttons button)
        {
            return this.CurrentState.IsButtonDown(button) && !this.PreviousState.IsButtonDown(button);
        }

        /// <summary>
        ///     true the entire time the button is down
        /// </summary>
        /// <returns><c>true</c>, if button down was ised, <c>false</c> otherwise.</returns>
        /// <param name="button">Button.</param>
        public bool IsButtonDown(Buttons button)
        {
            return this.CurrentState.IsButtonDown(button);
        }

        /// <summary>
        ///     true only the frame the button is released
        /// </summary>
        /// <returns><c>true</c>, if button released was ised, <c>false</c> otherwise.</returns>
        /// <param name="button">Button.</param>
        public bool IsButtonReleased(Buttons button)
        {
            return !this.CurrentState.IsButtonDown(button) && this.PreviousState.IsButtonDown(button);
        }

        #endregion

        #region Sticks

        public Vector2 GetLeftStick()
        {
            var res = this.CurrentState.ThumbSticks.Left;

            if (this.IsLeftStickVerticalInverted)
                res.Y = -res.Y;

            return res;
        }

        public Vector2 GetLeftStick(float deadzone)
        {
            var res = this.CurrentState.ThumbSticks.Left;

            if (res.LengthSquared() < deadzone * deadzone)
                res = Vector2.Zero;
            else if (this.IsLeftStickVerticalInverted)
                res.Y = -res.Y;

            return res;
        }

        public Vector2 GetRightStick()
        {
            var res = this.CurrentState.ThumbSticks.Right;

            if (this.IsRightStickVerticalInverted)
                res.Y = -res.Y;

            return res;
        }

        public Vector2 GetRightStick(float deadzone)
        {
            var res = this.CurrentState.ThumbSticks.Right;

            if (res.LengthSquared() < deadzone * deadzone)
                res = Vector2.Zero;
            else if (this.IsRightStickVerticalInverted)
                res.Y = -res.Y;

            return res;
        }

        #endregion

        #region Sticks as Buttons

        public bool IsLeftStickLeft(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.X < -deadzone;
        }

        /// <summary>
        ///     true only the frame the stick passes the deadzone in the direction
        /// </summary>
        /// <returns><c>true</c>, if left stick left pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="deadzone">Deadzone.</param>
        public bool IsLeftStickLeftPressed(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.X < -deadzone
                   && this.PreviousState.ThumbSticks.Left.X > -deadzone;
        }

        public bool IsLeftStickRight(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.X > deadzone;
        }

        /// <summary>
        ///     true only the frame the stick passes the deadzone in the direction
        /// </summary>
        /// <returns><c>true</c>, if left stick right pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="deadzone">Deadzone.</param>
        public bool IsLeftStickRightPressed(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.X > deadzone && this.PreviousState.ThumbSticks.Left.X < deadzone;
        }

        public bool IsLeftStickUp(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.Y > deadzone;
        }

        /// <summary>
        ///     true only the frame the stick passes the deadzone in the direction
        /// </summary>
        /// <returns><c>true</c>, if left stick up pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="deadzone">Deadzone.</param>
        public bool IsLeftStickUpPressed(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.Y > deadzone && this.PreviousState.ThumbSticks.Left.Y < deadzone;
        }

        public bool IsLeftStickDown(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.Y < -deadzone;
        }

        /// <summary>
        ///     true only the frame the stick passes the deadzone in the direction
        /// </summary>
        /// <returns><c>true</c>, if left stick down pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="deadzone">Deadzone.</param>
        public bool IsLeftStickDownPressed(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Left.Y < -deadzone
                   && this.PreviousState.ThumbSticks.Left.Y > -deadzone;
        }

        public bool IsRightStickLeft(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Right.X < -deadzone;
        }

        public bool IsRightStickRight(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Right.X > deadzone;
        }

        public bool IsRightStickUp(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Right.Y > deadzone;
        }

        public bool IsRightStickDown(float deadzone = DEFAULT_DEADZONE)
        {
            return this.CurrentState.ThumbSticks.Right.Y < -deadzone;
        }

        #endregion

        #region Dpad

        /// <summary>
        ///     true the entire time the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left down; otherwise, <c>false</c>.</value>
        public bool DpadLeftDown => this.CurrentState.DPad.Left == ButtonState.Pressed;

        /// <summary>
        ///     true only the first frame the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left pressed; otherwise, <c>false</c>.</value>
        public bool DpadLeftPressed =>
            this.CurrentState.DPad.Left == ButtonState.Pressed && this.PreviousState.DPad.Left == ButtonState.Released;

        /// <summary>
        ///     true only the frame the dpad is released
        /// </summary>
        /// <value><c>true</c> if dpad left released; otherwise, <c>false</c>.</value>
        public bool DpadLeftReleased =>
            this.CurrentState.DPad.Left == ButtonState.Released && this.PreviousState.DPad.Left == ButtonState.Pressed;

        /// <summary>
        ///     true the entire time the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left down; otherwise, <c>false</c>.</value>
        public bool DpadRightDown => this.CurrentState.DPad.Right == ButtonState.Pressed;

        /// <summary>
        ///     true only the first frame the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left pressed; otherwise, <c>false</c>.</value>
        public bool DpadRightPressed =>
            this.CurrentState.DPad.Right == ButtonState.Pressed
            && this.PreviousState.DPad.Right == ButtonState.Released;

        /// <summary>
        ///     true only the frame the dpad is released
        /// </summary>
        /// <value><c>true</c> if dpad left released; otherwise, <c>false</c>.</value>
        public bool DpadRightReleased =>
            this.CurrentState.DPad.Right == ButtonState.Released
            && this.PreviousState.DPad.Right == ButtonState.Pressed;

        /// <summary>
        ///     true the entire time the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left down; otherwise, <c>false</c>.</value>
        public bool DpadUpDown => this.CurrentState.DPad.Up == ButtonState.Pressed;

        /// <summary>
        ///     true only the first frame the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left pressed; otherwise, <c>false</c>.</value>
        public bool DpadUpPressed =>
            this.CurrentState.DPad.Up == ButtonState.Pressed && this.PreviousState.DPad.Up == ButtonState.Released;

        /// <summary>
        ///     true only the frame the dpad is released
        /// </summary>
        /// <value><c>true</c> if dpad left released; otherwise, <c>false</c>.</value>
        public bool DpadUpReleased =>
            this.CurrentState.DPad.Up == ButtonState.Released && this.PreviousState.DPad.Up == ButtonState.Pressed;

        /// <summary>
        ///     true the entire time the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left down; otherwise, <c>false</c>.</value>
        public bool DpadDownDown => this.CurrentState.DPad.Down == ButtonState.Pressed;

        /// <summary>
        ///     true only the first frame the dpad is down
        /// </summary>
        /// <value><c>true</c> if dpad left pressed; otherwise, <c>false</c>.</value>
        public bool DpadDownPressed =>
            this.CurrentState.DPad.Down == ButtonState.Pressed && this.PreviousState.DPad.Down == ButtonState.Released;

        /// <summary>
        ///     true only the frame the dpad is released
        /// </summary>
        /// <value><c>true</c> if dpad left released; otherwise, <c>false</c>.</value>
        public bool DpadDownReleased =>
            this.CurrentState.DPad.Down == ButtonState.Released && this.PreviousState.DPad.Down == ButtonState.Pressed;

        #endregion

        #region Triggers

        public float GetLeftTriggerRaw()
        {
            return this.CurrentState.Triggers.Left;
        }

        public float GetRightTriggerRaw()
        {
            return this.CurrentState.Triggers.Right;
        }

        /// <summary>
        ///     true whenever the trigger is down past the threshold
        /// </summary>
        /// <returns><c>true</c>, if left trigger down was ised, <c>false</c> otherwise.</returns>
        /// <param name="threshold">Threshold.</param>
        public bool IsLeftTriggerDown(float threshold = 0.2f)
        {
            return this.CurrentState.Triggers.Left > threshold;
        }

        /// <summary>
        ///     true only the frame that the trigger passed the threshold
        /// </summary>
        /// <returns><c>true</c>, if left trigger pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="threshold">Threshold.</param>
        public bool IsLeftTriggerPressed(float threshold = 0.2f)
        {
            return this.CurrentState.Triggers.Left > threshold && this.PreviousState.Triggers.Left < threshold;
        }

        /// <summary>
        ///     true the frame the trigger is released
        /// </summary>
        /// <returns><c>true</c>, if left trigger released was ised, <c>false</c> otherwise.</returns>
        /// <param name="threshold">Threshold.</param>
        public bool IsLeftTriggerReleased(float threshold = 0.2f)
        {
            return this.CurrentState.Triggers.Left < threshold && this.PreviousState.Triggers.Left > threshold;
        }

        /// <summary>
        ///     true whenever the trigger is down past the threshold
        /// </summary>
        /// <returns><c>true</c>, if left trigger down was ised, <c>false</c> otherwise.</returns>
        /// <param name="threshold">Threshold.</param>
        public bool IsRightTriggerDown(float threshold = 0.2f)
        {
            return this.CurrentState.Triggers.Right > threshold;
        }

        /// <summary>
        ///     true only the frame that the trigger passed the threshold
        /// </summary>
        /// <returns><c>true</c>, if left trigger pressed was ised, <c>false</c> otherwise.</returns>
        /// <param name="threshold">Threshold.</param>
        public bool IsRightTriggerPressed(float threshold = 0.2f)
        {
            return this.CurrentState.Triggers.Right > threshold && this.PreviousState.Triggers.Right < threshold;
        }

        /// <summary>
        ///     true the frame the trigger is released
        /// </summary>
        /// <returns><c>true</c>, if left trigger released was ised, <c>false</c> otherwise.</returns>
        /// <param name="threshold">Threshold.</param>
        public bool IsRightTriggerReleased(float threshold = 0.2f)
        {
            return this.CurrentState.Triggers.Right < threshold && this.PreviousState.Triggers.Right > threshold;
        }

        #endregion
    }
}