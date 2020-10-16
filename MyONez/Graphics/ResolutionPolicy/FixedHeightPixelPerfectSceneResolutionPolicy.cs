namespace MyONez.Graphics.ResolutionPolicy
{
    using Microsoft.Xna.Framework;

    using MyONez.Maths;

    public class FixedHeightPixelPerfectSceneResolutionPolicy : SceneResolutionPolicy
    {
        public override Rectangle GetFinalRenderDestinationRect(int screenWidth, int screenHeight, Point designSize)
        {
            var screenAspectRatio = screenWidth / (float)screenHeight;
            var resolutionScaleX = screenWidth / (float)designSize.X;

            // we are going to do some cropping so we need to use floats for the scale then round up
            int pixelPerfectScale;
            if (designSize.X / (float)designSize.Y < screenAspectRatio)
            {
                var floatScale = screenWidth / (float)designSize.X;
                pixelPerfectScale = Mathf.CeilToInt(floatScale);
            }
            else
            {
                var floatScale = screenHeight / (float)designSize.Y;
                pixelPerfectScale = Mathf.CeilToInt(floatScale);
            }

            if (pixelPerfectScale == 0)
                pixelPerfectScale = 1;

            var result = new Rectangle();

            result.Width = Mathf.CeilToInt(designSize.X * resolutionScaleX);
            result.Height = Mathf.CeilToInt(designSize.Y * pixelPerfectScale);
            result.X = (screenWidth - result.Width) / 2;
            result.Y = (screenHeight - result.Height) / 2;

            return result;
        }

        public override Rectangle GetRenderTargetRect(int screenWidth, int screenHeight, Point designSize)
        {
            var screenAspectRatio = screenWidth / (float)screenHeight;
            var resolutionScaleX = screenWidth / (float)designSize.X;

            // we are going to do some cropping so we need to use floats for the scale then round up
            int pixelPerfectScale;
            if (designSize.X / (float)designSize.Y < screenAspectRatio)
            {
                var floatScale = screenWidth / (float)designSize.X;
                pixelPerfectScale = Mathf.CeilToInt(floatScale);
            }
            else
            {
                var floatScale = screenHeight / (float)designSize.Y;
                pixelPerfectScale = Mathf.CeilToInt(floatScale);
            }

            if (pixelPerfectScale == 0)
                pixelPerfectScale = 1;

            return new Rectangle(0, 0, (int)(designSize.X * resolutionScaleX / pixelPerfectScale), designSize.Y);
        }
    }
}