namespace MyONez.Graphics.RenderProcessors.Impl
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS;
    using MyONez.Graphics.RenderProcessors;
    using MyONez.Maths;

    public class FinalRenderRenderProcessor : RenderProcessor, IScreenResolutionChangedListener
    {
        private readonly SamplerState samplerState;

        private RectangleF finalRenderDestinationRect;

        public FinalRenderRenderProcessor(SamplerState samplerState, int executionOrder)
            : base(executionOrder)
        {
            this.samplerState = samplerState;
        }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.finalRenderDestinationRect = realRenderTarget;
        }

        public override void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            this.Material.SamplerState = this.samplerState;

            this.Batch.Clear();
            this.Batch.Draw(source, this.finalRenderDestinationRect, source.Bounds, Color.White, 0);

            Graphic.Draw(destination, Color.Black, this.Batch, this.Material);
        }
    }
}