namespace PixelRPG.Base.AdditionalStuff.RenderProcessors
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine;
    using SpineEngine.ECS;
    using SpineEngine.Graphics.RenderProcessors;

    public class GaussianBlurRenderProcessor : RenderProcessor<GaussianBlurEffect>, IScreenResolutionChangedListener
    {
        private RenderTarget2D renderTarget;

        private float renderTargetScale = 1f;

        private Rectangle sceneRenderTarget;

        public GaussianBlurRenderProcessor(int executionOrder)
            : base(executionOrder, Core.Instance.Content.Load<GaussianBlurEffect>(GaussianBlurEffect.EffectAssetName))
        {
        }

        public float RenderTargetScale
        {
            get => this.renderTargetScale;
            set
            {
                if (this.renderTargetScale == value)
                {
                    return;
                }

                this.renderTargetScale = value;
                this.UpdateEffectDeltas();
            }
        }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.sceneRenderTarget = sceneRenderTarget;
            this.UpdateEffectDeltas();
        }

        private void UpdateEffectDeltas()
        {
            if (this.sceneRenderTarget.Width == 0 || this.sceneRenderTarget.Height == 0)
            {
                return;
            }

            this.TypedEffect.HorizontalBlurDelta = 1f / (this.sceneRenderTarget.Width * this.renderTargetScale);
            this.TypedEffect.VerticalBlurDelta = 1f / (this.sceneRenderTarget.Height * this.renderTargetScale);
            this.renderTarget?.Dispose();
            this.renderTarget = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                (int)(this.sceneRenderTarget.Width * this.renderTargetScale),
                (int)(this.sceneRenderTarget.Height * this.renderTargetScale),
                false,
                Core.Instance.Screen.BackBufferFormat,
                DepthFormat.None,
                0,
                RenderTargetUsage.PreserveContents);
        }

        public override void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            this.TypedEffect.PrepareForHorizontalBlur();
            this.DrawFullScreenQuad(source, this.renderTarget);

            this.TypedEffect.PrepareForVerticalBlur();
            this.DrawFullScreenQuad(this.renderTarget, destination);
        }
    }
}