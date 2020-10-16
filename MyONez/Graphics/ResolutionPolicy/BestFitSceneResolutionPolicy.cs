namespace MyONez.Graphics.ResolutionPolicy
{
    using Microsoft.Xna.Framework;

    public class BestFitSceneResolutionPolicy : SceneResolutionPolicy
    {
        public Point BleedSize { get; set; }

        public override Rectangle GetFinalRenderDestinationRect(int screenWidth, int screenHeight, Point designSize)
        {
            var resolutionScaleX = screenWidth / (float)designSize.X;
            var resolutionScaleY = screenHeight / (float)designSize.Y;

            var safeScaleX = (float)screenWidth / (designSize.X - this.BleedSize.X);
            var safeScaleY = (float)screenHeight / (designSize.Y - this.BleedSize.Y);

            var resolutionScale = MathHelper.Max(resolutionScaleX, resolutionScaleY);
            var safeScale = MathHelper.Min(safeScaleX, safeScaleY);

            resolutionScaleX = resolutionScaleY = MathHelper.Min(resolutionScale, safeScale);

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
            return new Rectangle(0, 0, designSize.X, designSize.Y);
        }
    }
}