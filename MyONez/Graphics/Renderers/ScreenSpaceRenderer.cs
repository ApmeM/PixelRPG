namespace MyONez.Graphics.Renderers
{
    using MyONez.Graphics.Cameras;

    /// <summary>
    ///     Renderer that renders using its own Camera which doesn't move.
    /// </summary>
    public class ScreenSpaceRenderer : RenderLayerRenderer
    {
        public ScreenSpaceRenderer(params int[] renderLayers)
            : base(renderLayers)
        {
            this.RenderAfterPostProcessors = true;
            this.RendererCamera = new ScreenSpaceCamera();
        }
    }
}