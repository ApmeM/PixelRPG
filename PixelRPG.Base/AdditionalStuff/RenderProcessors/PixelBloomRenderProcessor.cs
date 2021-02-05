namespace PixelRPG.Base.AdditionalStuff.RenderProcessors
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.Graphics;
    using SpineEngine.Graphics.RenderProcessors.Impl;

    public class PixelBloomRenderProcessor : BloomRenderProcessor
    {
        private readonly RenderTexture layerRt;

        private readonly RenderTexture tempRt;
        
        public PixelBloomRenderProcessor(RenderTexture layerRenderTexture, int executionOrder)
            : base(executionOrder)
        {
            this.layerRt = layerRenderTexture;
            this.tempRt = new RenderTexture(
                this.layerRt.RenderTarget.Width,
                this.layerRt.RenderTarget.Height,
                DepthFormat.None);
        }

        public override void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            base.SceneBackBufferSizeChanged(realRenderTarget, sceneRenderTarget);

            this.tempRt.Resize(sceneRenderTarget.Width, sceneRenderTarget.Height);
        }

        public override void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            base.Render(this.layerRt, this.tempRt);

            this.Batch.Clear();
            this.Batch.Draw(source, destination.Bounds, source.Bounds, Color.White, 0);
            this.Batch.Draw(this.tempRt, destination.Bounds, this.tempRt.RenderTarget.Bounds, Color.White, 0);
            this.Batch.Draw(this.layerRt, destination.Bounds, this.layerRt.RenderTarget.Bounds, Color.White, 0);

            this.Material.BlendState = BlendState.AlphaBlend;
            this.Material.SamplerState = this.SamplerState;
            this.Material.DepthStencilState = DepthStencilState.None;

            Graphic.Draw(destination, Color.Black, this.Batch, this.Material);
        }

        public override void Unload()
        {
            base.Unload();

            this.tempRt.Dispose();
        }
    }
}