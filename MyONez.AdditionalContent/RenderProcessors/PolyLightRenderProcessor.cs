namespace MyONez.AdditionalContent.RenderProcessors
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.Effects;
    using MyONez.ECS;
    using MyONez.Graphics;
    using MyONez.Graphics.RenderProcessors;

    /// <summary>
    ///     post processor to assist with making blended poly lights. Usage is as follows:
    ///     - render all sprite lights with a separate Renderer to a RenderTarget. The clear color of the Renderer is your ambient light color.
    ///     - render all normal objects in standard fashion
    ///     - add this PostProcessor with the RenderTarget from your lights Renderer
    /// </summary>
    public class PolyLightRenderProcessor : RenderProcessor<SpriteLightMultiplyEffect>, IScreenResolutionChangedListener
    {
        private readonly RenderTexture lightsRenderTexture;

        private GaussianBlurEffect blurEffect;

        private bool blurEnabled;

        private float blurRenderTargetScale = 0.5f;

        private float multiplicativeFactor = 1f;

        private RenderTarget2D renderTarget;

        private Scene scene;

        private Rectangle sceneRenderTarget;

        public PolyLightRenderProcessor(int executionOrder, RenderTexture lightsRenderTexture)
            : base(executionOrder)
        {
            this.lightsRenderTexture = lightsRenderTexture;
        }

        public float MultiplicativeFactor
        {
            get => this.multiplicativeFactor;
            set
            {
                if (this.TypedEffect != null)
                {
                    this.TypedEffect.MultiplicativeFactor = value;
                }
                this.multiplicativeFactor = value;
            }
        }

        public bool EnableBlur
        {
            get => this.blurEnabled;
            set
            {
                if (value == this.blurEnabled)
                {
                    return;
                }

                this.blurEnabled = value;

                if (!this.blurEnabled || this.blurEffect != null || this.scene == null)
                {
                    return;
                }

                this.blurEffect = Core.Instance.Content.Load<GaussianBlurEffect>(GaussianBlurEffect.EffectAssetName);
                this.UpdateBlurEffectDeltas();
            }
        }

        public float BlurRenderTargetScale
        {
            get => this.blurRenderTargetScale;
            set
            {
                if (this.blurRenderTargetScale != value)
                {
                    this.blurRenderTargetScale = value;
                    if (this.blurEffect != null)
                        this.UpdateBlurEffectDeltas();
                }
            }
        }

        public float BlurAmount
        {
            get => this.blurEffect?.BlurAmount ?? -1;
            set
            {
                if (this.blurEffect != null)
                    this.blurEffect.BlurAmount = value;
            }
        }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.sceneRenderTarget = sceneRenderTarget;
            this.TypedEffect.LightTexture = this.lightsRenderTexture;

            if (this.blurEnabled)
                this.UpdateBlurEffectDeltas();
        }

        private void UpdateBlurEffectDeltas()
        {
            if (this.sceneRenderTarget.Width == 0 || this.sceneRenderTarget.Height == 0)
            {
                return;
            }

            this.blurEffect.HorizontalBlurDelta = 1f / (this.sceneRenderTarget.Width * this.blurRenderTargetScale);
            this.blurEffect.VerticalBlurDelta = 1f / (this.sceneRenderTarget.Height * this.blurRenderTargetScale);

            this.renderTarget?.Dispose();
            this.renderTarget = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                (int)(this.sceneRenderTarget.Width * this.blurRenderTargetScale),
                (int)(this.sceneRenderTarget.Height * this.blurRenderTargetScale),
                false,
                Core.Instance.Screen.BackBufferFormat,
                DepthFormat.None,
                0,
                RenderTargetUsage.PreserveContents);
        }

        public override void OnAddedToScene(Scene scene)
        {
            this.scene = scene;
            this.TypedEffect = this.scene.Content.Load<SpriteLightMultiplyEffect>(SpriteLightMultiplyEffect.EffectAssetName);
            this.TypedEffect.LightTexture = this.lightsRenderTexture;
            this.TypedEffect.MultiplicativeFactor = this.multiplicativeFactor;

            if (this.blurEnabled)
                this.blurEffect = Core.Instance.Content.Load<GaussianBlurEffect>(GaussianBlurEffect.EffectAssetName);
        }

        public override void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            if (this.blurEnabled)
            {
                this.blurEffect.PrepareForHorizontalBlur();
                this.DrawFullScreenQuad(this.lightsRenderTexture, this.renderTarget, this.blurEffect);

                this.blurEffect.PrepareForVerticalBlur();
                this.DrawFullScreenQuad(this.renderTarget, this.lightsRenderTexture, this.blurEffect);
            }

            this.DrawFullScreenQuad(source, destination);
        }
    }
}