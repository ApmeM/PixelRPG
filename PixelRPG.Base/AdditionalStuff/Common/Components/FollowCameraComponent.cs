namespace PixelRPG.Base.AdditionalStuff.Common.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using SpineEngine.Graphics.Cameras;

    public class FollowCameraComponent : Component
    {
        internal Vector2 DesiredPosition;

        /// <summary>
        ///     how fast the camera closes the distance to the target position
        /// </summary>
        public float FollowLerp = 0.2f;

        public FollowCameraComponent(Camera camera)
        {
            this.Camera = camera;
        }

        public Camera Camera { get; }
    }
}