namespace MyONez.Graphics.ResolutionPolicy
{
    using Microsoft.Xna.Framework;

    using MyONez.Maths;

    public class FixedWidthSceneResolutionPolicy : SceneResolutionPolicy
    {
        public override Rectangle GetFinalRenderDestinationRect(int screenWidth, int screenHeight, Point designSize)
        {
            var resolutionScaleX = screenWidth / (float)designSize.X;
            var resolutionScaleY = screenHeight / (float)designSize.Y;

            resolutionScaleY = resolutionScaleX;

            // calculate the display rect of the RenderTarget
            var renderWidth = designSize.X * resolutionScaleX;
            var renderHeight = designSize.Y * resolutionScaleY;

            return new Rectangle(
                (int)(screenWidth - renderWidth) / 2,
                (int)(screenHeight - renderHeight) / 2,
                (int)renderWidth,
                (int)renderHeight);
        }

        public override Rectangle GetRenderTargetRect(int screenWidth, int screenHeight, Point designSize)
        {
            var resolutionScaleX = screenWidth / (float)designSize.X;
            var resolutionScaleY = screenHeight / (float)designSize.Y;

            resolutionScaleY = resolutionScaleX;

            var newHeight = Mathf.CeilToInt(screenHeight / resolutionScaleY);

            return new Rectangle(0, 0, designSize.X, newHeight);
        }
    }
}