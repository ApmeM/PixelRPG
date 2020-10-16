namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework.Input;

    /// <summary>
    ///     Input component that is filled by InputKayboardUpdateSystem for keyboard data
    /// </summary>
    public class InputKeyboardComponent : Component
    {
        public bool IsShiftDown => this.IsKeyDown(Keys.LeftShift) || this.IsKeyDown(Keys.RightShift);

        public bool IsAltDown => this.IsKeyDown(Keys.LeftAlt) || this.IsKeyDown(Keys.RightAlt);

        public bool IsControlDown => this.IsKeyDown(Keys.LeftControl) || this.IsKeyDown(Keys.RightControl);

        internal KeyboardState PreviousKeyboardState { get; set; }

        public KeyboardState CurrentKeyboardState { get; internal set; }

        /// <summary>
        ///     only true if down this frame
        /// </summary>
        /// <returns><c>true</c>, if key pressed was gotten, <c>false</c> otherwise.</returns>
        public bool IsKeyPressed(Keys key)
        {
            return this.CurrentKeyboardState.IsKeyDown(key) && !this.PreviousKeyboardState.IsKeyDown(key);
        }

        /// <summary>
        ///     true the entire time the key is down
        /// </summary>
        /// <returns><c>true</c>, if key down was gotten, <c>false</c> otherwise.</returns>
        public bool IsKeyDown(Keys key)
        {
            return this.CurrentKeyboardState.IsKeyDown(key);
        }

        /// <summary>
        ///     true only the frame the key is released
        /// </summary>
        /// <returns><c>true</c>, if key up was gotten, <c>false</c> otherwise.</returns>
        public bool IsKeyReleased(Keys key)
        {
            return !this.CurrentKeyboardState.IsKeyDown(key) && this.PreviousKeyboardState.IsKeyDown(key);
        }

        public Keys[] GetDownKeys()
        {
            return this.CurrentKeyboardState.GetPressedKeys();
        }
    }
}