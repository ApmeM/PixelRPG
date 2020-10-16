namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;

    /// <summary>
    ///     Input component that is filled by InputMouseUpdateSystem for mouse data
    /// </summary>
    public class InputMouseComponent : Component
    {
        internal Point ResolutionOffset;

        internal Vector2 ResolutionScale = Vector2.One;

        internal MouseState PreviousMouseState { get; set; }

        public MouseState CurrentMouseState { get; internal set; }

        /// <summary>
        ///     only true if down this frame
        /// </summary>
        public bool LeftMouseButtonPressed =>
            this.CurrentMouseState.LeftButton == ButtonState.Pressed
            && this.PreviousMouseState.LeftButton == ButtonState.Released;

        /// <summary>
        ///     true while the button is down
        /// </summary>
        public bool LeftMouseButtonDown => this.CurrentMouseState.LeftButton == ButtonState.Pressed;

        /// <summary>
        ///     true only the frame the button is released
        /// </summary>
        public bool LeftMouseButtonReleased =>
            this.CurrentMouseState.LeftButton == ButtonState.Released
            && this.PreviousMouseState.LeftButton == ButtonState.Pressed;

        /// <summary>
        ///     only true if pressed this frame
        /// </summary>
        public bool RightMouseButtonPressed =>
            this.CurrentMouseState.RightButton == ButtonState.Pressed
            && this.PreviousMouseState.RightButton == ButtonState.Released;

        /// <summary>
        ///     true while the button is down
        /// </summary>
        public bool RightMouseButtonDown => this.CurrentMouseState.RightButton == ButtonState.Pressed;

        /// <summary>
        ///     true only the frame the button is released
        /// </summary>
        public bool RightMouseButtonReleased =>
            this.CurrentMouseState.RightButton == ButtonState.Released
            && this.PreviousMouseState.RightButton == ButtonState.Pressed;

        /// <summary>
        ///     only true if down this frame
        /// </summary>
        public bool MiddleMouseButtonPressed =>
            this.CurrentMouseState.MiddleButton == ButtonState.Pressed
            && this.PreviousMouseState.MiddleButton == ButtonState.Released;

        /// <summary>
        ///     true while the button is down
        /// </summary>
        public bool MiddleMouseButtonDown => this.CurrentMouseState.MiddleButton == ButtonState.Pressed;

        /// <summary>
        ///     true only the frame the button is released
        /// </summary>
        public bool MiddleMouseButtonReleased =>
            this.CurrentMouseState.MiddleButton == ButtonState.Released
            && this.PreviousMouseState.MiddleButton == ButtonState.Pressed;

        /// <summary>
        ///     gets the raw ScrollWheelValue
        /// </summary>
        /// <value>The mouse wheel.</value>
        public int MouseWheel => this.CurrentMouseState.ScrollWheelValue;

        /// <summary>
        ///     gets the delta ScrollWheelValue
        /// </summary>
        /// <value>The mouse wheel delta.</value>
        public int MouseWheelDelta =>
            this.CurrentMouseState.ScrollWheelValue - this.PreviousMouseState.ScrollWheelValue;

        /// <summary>
        ///     unscaled mouse position. This is the actual screen space value
        /// </summary>
        /// <value>The raw mouse position.</value>
        public Point RawMousePosition => new Point(this.CurrentMouseState.X, this.CurrentMouseState.Y);

        /// <summary>
        ///     alias for scaledMousePosition
        /// </summary>
        /// <value>The mouse position.</value>
        public Vector2 MousePosition => this.ScaledMousePosition;

        /// <summary>
        ///     this takes into account the SceneResolutionPolicy and returns the value scaled to the RenderTargets coordinates
        /// </summary>
        /// <value>The scaled mouse position.</value>
        public Vector2 ScaledMousePosition =>
            new Vector2(
                this.CurrentMouseState.X - this.ResolutionOffset.X,
                this.CurrentMouseState.Y - this.ResolutionOffset.Y) * this.ResolutionScale;

        public Point MousePositionDelta =>
            new Point(this.CurrentMouseState.X, this.CurrentMouseState.Y) - new Point(
                this.PreviousMouseState.X,
                this.PreviousMouseState.Y);

        public Vector2 ScaledMousePositionDelta =>
            this.ScaledMousePosition - new Vector2(
                this.PreviousMouseState.X - this.ResolutionOffset.X,
                this.PreviousMouseState.Y - this.ResolutionOffset.Y) * this.ResolutionScale;
    }
}