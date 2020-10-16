namespace MyONez.ECS
{
    using Microsoft.Xna.Framework;

    public interface IScreenResolutionChangedListener
    {
        void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget);
    }
}