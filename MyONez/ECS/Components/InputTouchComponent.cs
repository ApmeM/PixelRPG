namespace MyONez.ECS.Components
{
    using System.Collections.Generic;

    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input.Touch;

    /// <summary>
    ///     Require SpriteComponent. If it not exists - it will be created automatically by EntitySystem.
    /// </summary>
    public class InputTouchComponent : Component
    {
        internal List<GestureSample> PreviousGestures = new List<GestureSample>();

        internal TouchCollection PreviousTouches;

        internal Point ResolutionOffset;

        internal Vector2 ResolutionScale = Vector2.One;

        public bool IsConnected { get; internal set; }

        public TouchCollection CurrentTouches { get; internal set; }

        public List<GestureSample> CurrentGestures { get; internal set; } = new List<GestureSample>();

        public Vector2 GetScaledPosition(Vector2 position)
        {
            return new Vector2(position.X - this.ResolutionOffset.X, position.Y - this.ResolutionOffset.Y)
                   * this.ResolutionScale;
        }
    }
}