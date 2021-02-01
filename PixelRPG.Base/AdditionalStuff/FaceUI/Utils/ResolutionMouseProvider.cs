#region File Description
//-----------------------------------------------------------------------------
// Helper utility that implements default mouse and keyboard input for GeonBit.UI.
// You can create your own mouse/keyboard inputs to replace this.
//
// Author: Ronen Ness.
// Since: 2016.
//-----------------------------------------------------------------------------
#endregion

namespace PixelRPG.Base.AdditionalStuff.FaceUI.Utils
{
    using global::FaceUI;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;

    public class ResolutionMouseProvider : IMouseInput
    {
        public struct State
        {
            public float X { get; set; }

            public float Y { get; set; }

            public ButtonState LeftButton { get; set; }

            public ButtonState RightButton { get; set; }

            public ButtonState MiddleButton { get; set; }

            public int ScrollWheelValue { get; set; }
        }

        internal State _newMouseState;
        internal State _oldMouseState;

        Vector2 _newMousePos;
        Vector2 _oldMousePos;

        public int MouseWheel { get; private set; }

        public int MouseWheelChange { get; private set; }
        
        public void Update(GameTime gameTime)
        {
            // get mouse position
            this._oldMousePos = this._newMousePos;
            this._newMousePos = new Vector2(this._newMouseState.X, this._newMouseState.Y);

            // get mouse wheel state
            int prevMouseWheel = this.MouseWheel;
            this.MouseWheel = this._newMouseState.ScrollWheelValue;
            this.MouseWheelChange = System.Math.Sign((double)this.MouseWheel - prevMouseWheel);
        }

        public void UpdateMousePosition(Vector2 pos)
        {
            // move mouse position back to center
            Mouse.SetPosition((int)pos.X, (int)pos.Y);
            this._newMousePos = this._oldMousePos = pos;
        }

        public Vector2 TransformMousePosition(Matrix? transform)
        {
            var newMousePos = this._newMousePos;
            if (transform != null)
            {
                return Vector2.Transform(newMousePos, transform.Value) - new Vector2(transform.Value.Translation.X, transform.Value.Translation.Y);
            }
            return newMousePos;
        }

        public Vector2 MousePosition
        {
            get { return this._newMousePos; }
        }

        public Vector2 MousePositionDiff
        {
            get { return this._newMousePos - this._oldMousePos; }
        }

        public bool MouseButtonDown(MouseButton button = MouseButton.Left)
        {
            return this.GetMouseButtonState(button) == ButtonState.Pressed;
        }

        public bool AnyMouseButtonDown()
        {
            return this.MouseButtonDown(MouseButton.Left) ||
                this.MouseButtonDown(MouseButton.Right) ||
                this.MouseButtonDown(MouseButton.Middle);
        }

        public bool MouseButtonReleased(MouseButton button = MouseButton.Left)
        {
            return this.GetMouseButtonState(button) == ButtonState.Released && this.GetMousePreviousButtonState(button) == ButtonState.Pressed;
        }

        public bool AnyMouseButtonReleased()
        {
            return this.MouseButtonReleased(MouseButton.Left) ||
                this.MouseButtonReleased(MouseButton.Right) ||
                this.MouseButtonReleased(MouseButton.Middle);
        }

        public bool MouseButtonPressed(MouseButton button = MouseButton.Left)
        {
            return this.GetMouseButtonState(button) == ButtonState.Pressed && this.GetMousePreviousButtonState(button) == ButtonState.Released;
        }

        public bool AnyMouseButtonPressed()
        {
            return this.MouseButtonPressed(MouseButton.Left) ||
                this.MouseButtonPressed(MouseButton.Right) ||
                this.MouseButtonPressed(MouseButton.Middle);
        }

        public bool MouseButtonClick(MouseButton button = MouseButton.Left)
        {
            return this.GetMouseButtonState(button) == ButtonState.Released && this.GetMousePreviousButtonState(button) == ButtonState.Pressed;
        }

        public bool AnyMouseButtonClicked()
        {
            return
                this.MouseButtonClick(MouseButton.Left) ||
                this.MouseButtonClick(MouseButton.Right) ||
                this.MouseButtonClick(MouseButton.Middle);
        }

        private ButtonState GetMouseButtonState(MouseButton button = MouseButton.Left)
        {
            switch (button)
            {
                case MouseButton.Left:
                    return this._newMouseState.LeftButton;
                case MouseButton.Right:
                    return this._newMouseState.RightButton;
                case MouseButton.Middle:
                    return this._newMouseState.MiddleButton;
            }
            return ButtonState.Released;
        }

        private ButtonState GetMousePreviousButtonState(MouseButton button = MouseButton.Left)
        {
            switch (button)
            {
                case MouseButton.Left:
                    return this._oldMouseState.LeftButton;
                case MouseButton.Right:
                    return this._oldMouseState.RightButton;
                case MouseButton.Middle:
                    return this._oldMouseState.MiddleButton;
            }
            return ButtonState.Released;
        }
    }
}
