namespace MyONez.Graphics.ResolutionPolicy
{
    using Microsoft.Xna.Framework;

    using MyONez.Maths;

    public class ShowAllPixelPerfectSceneResolutionPolicy : SceneResolutionPolicy
    {
        public override Rectangle GetFinalRenderDestinationRect(int screenWidth, int screenHeight, Point designSize)
        {
            var screenAspectRatio = screenWidth / (float)screenHeight;

            int pixelPerfectScale;
            if (designSize.X / (float)designSize.Y > screenAspectRatio)
                pixelPerfectScale = screenWidth / designSize.X;
            else
                pixelPerfectScale = screenHeight / designSize.Y;

            if (pixelPerfectScale == 0)
                pixelPerfectScale = 1;

            var result = new Rectangle();

            result.Width = Mathf.CeilToInt(designSize.X * pixelPerfectScale);
            result.Height = Mathf.CeilToInt(designSize.Y * pixelPerfectScale);
            result.X = (screenWidth - result.Width) / 2;
            result.Y = (screenHeight - result.Height) / 2;

            return result;
        }

        public override Rectangle GetRenderTargetRect(int screenWidth, int screenHeight, Point designSize)
        {
            return new Rectangle(0, 0, designSize.X, designSize.Y);
        }
    }
}