namespace MyONez.Graphics.ResolutionPolicy
{
    using Microsoft.Xna.Framework;

    public class StretchSceneResolutionPolicy : SceneResolutionPolicy
    {
        public override Rectangle GetFinalRenderDestinationRect(int screenWidth, int screenHeight, Point designSize)
        {
            return new Rectangle(0, 0, screenWidth, screenHeight);
        }

        public override Rectangle GetRenderTargetRect(int screenWidth, int screenHeight, Point designSize)
        {
            return new Rectangle(0, 0, designSize.X, designSize.Y);
        }
    }
}