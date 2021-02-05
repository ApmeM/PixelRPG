namespace PixelRPG.Base.AdditionalStuff.Common.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using SpineEngine.Graphics.Cameras;

    public class CameraShakeComponent : Component
    {
        internal readonly Camera Camera;

        internal float ShakeDegredation = 0.95f;

        internal Vector2 ShakeDirection;

        internal float ShakeIntensity;

        internal Vector2 ShakeOffset;

        public CameraShakeComponent(Camera camera)
        {
            this.Camera = camera;
        }

        /// <summary>
        ///     if the shake is already running this will overwrite the current values only if shakeIntensity > the current
        ///     shakeIntensity.
        ///     if the shake is not currently active it will be started.
        /// </summary>
        /// <param name="shakeIntensity">how much should we shake it</param>
        /// <param name="shakeDegredation">higher values cause faster degradation</param>
        /// <param name="shakeDirection">
        ///     Vector3.zero will result in a shake on just the x/y axis. any other values will result in the passed
        ///     in shakeDirection * intensity being the offset the camera is moved
        /// </param>
        public void Shake(float shakeIntensity = 15f, float shakeDegredation = 0.9f, Vector2 shakeDirection = default)
        {
            this.Enabled = true;
            if (this.ShakeIntensity >= shakeIntensity)
            {
                return;
            }

            this.ShakeDirection = shakeDirection;
            this.ShakeIntensity = shakeIntensity;
            if (shakeDegredation < 0f || shakeDegredation >= 1f)
            {
                shakeDegredation = 0.95f;
            }

            this.ShakeDegredation = shakeDegredation;
        }
    }
}