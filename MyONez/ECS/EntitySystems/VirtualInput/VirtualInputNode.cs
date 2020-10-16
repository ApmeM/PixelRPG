namespace MyONez.ECS.EntitySystems.VirtualInput
{
    using MyONez.ECS.Components;

    /// <summary>
    ///     Add these to your VirtualInput to define how it determines its current input state.
    ///     For example, if you want to check whether a keyboard key is pressed, create a VirtualButton and add to it a
    ///     VirtualButton.KeyboardKey
    /// </summary>
    public abstract class VirtualInputNode
    {
        public abstract void Update(
            InputKeyboardComponent inputKeyboard,
            InputMouseComponent inputMouse,
            InputTouchComponent inputTouch,
            InputGamePadComponent inputGamePad);
    }
}