namespace MyONez.Graphics.Cameras
{
    public class ScreenSpaceCamera : Camera
    {
        /// <summary>
        ///     we are screen space, so our matrix should always be identity
        /// </summary>
        protected override void UpdateMatrices()
        {
        }
    }
}