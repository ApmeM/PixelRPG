namespace PixelRPG.Base.AdditionalStuff.RenderProcessors
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine;
    using SpineEngine.ECS;
    using SpineEngine.Graphics.RenderProcessors;

    public class BloomRenderProcessor : RenderProcessor, IScreenResolutionChangedListener
    {
        private BloomCombineEffect bloomCombineEffect;

        private BloomExtractEffect bloomExtractEffect;

        private GaussianBlurEffect gaussianBlurEffect;

        private RenderTarget2D renderTarget1;

        private RenderTarget2D renderTarget2;

        private float renderTargetScale = 1f;

        private Scene scene;

        private Rectangle sceneRenderTarget;

        private BloomSettings settings;

        public BloomRenderProcessor(int executionOrder)
            : base(executionOrder)
        {
            this.settings = BloomSettings.PresetSettings[3];
        }

        public BloomSettings Settings
        {
            get => this.settings;
            set => this.SetBloomSettings(value);
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
                this.UpdateBlurEffectDeltas();
            }
        }

        public virtual void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.sceneRenderTarget = sceneRenderTarget;
            this.UpdateBlurEffectDeltas();
        }

        public override void OnAddedToScene(Scene scene)
        {
            this.scene = scene;
            this.bloomExtractEffect = this.scene.Content.Load<BloomExtractEffect>(BloomExtractEffect.EffectAssetName);
            this.bloomCombineEffect = this.scene.Content.Load<BloomCombineEffect>(BloomCombineEffect.EffectAssetName);
            this.gaussianBlurEffect = this.scene.Content.Load<GaussianBlurEffect>(GaussianBlurEffect.EffectAssetName);
            
            this.SetBloomSettings(this.settings);
        }

        public void SetBloomSettings(BloomSettings settings)
        {
            this.settings = settings;

            this.bloomExtractEffect.BloomThreshold = this.settings.Threshold;

            this.bloomCombineEffect.BloomIntensity = this.settings.Intensity;
            this.bloomCombineEffect.BaseIntensity = this.settings.BaseIntensity;
            this.bloomCombineEffect.BloomSaturation = this.settings.Saturation;
            this.bloomCombineEffect.BaseSaturation = this.settings.BaseSaturation;
            
            this.gaussianBlurEffect.BlurAmount = this.settings.BlurAmount;
        }

        private void UpdateBlurEffectDeltas()
        {
            if (this.sceneRenderTarget.Width == 0 || this.sceneRenderTarget.Height == 0)
            {
                return;
            }

            this.gaussianBlurEffect.HorizontalBlurDelta = 1f / (this.sceneRenderTarget.Width * this.renderTargetScale);
            this.gaussianBlurEffect.VerticalBlurDelta = 1f / (this.sceneRenderTarget.Height * this.renderTargetScale);

            this.renderTarget1?.Dispose();
            this.renderTarget1 = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                (int)(this.sceneRenderTarget.Width * this.renderTargetScale),
                (int)(this.sceneRenderTarget.Height * this.renderTargetScale),
                false,
                Core.Instance.Screen.BackBufferFormat,
                DepthFormat.None,
                0,
                RenderTargetUsage.PreserveContents);
            this.renderTarget2?.Dispose();
            this.renderTarget2 = new RenderTarget2D(
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
            this.DrawFullScreenQuad(source, this.renderTarget1, this.bloomExtractEffect);

            this.gaussianBlurEffect.PrepareForHorizontalBlur();
            this.DrawFullScreenQuad(this.renderTarget1, this.renderTarget2, this.gaussianBlurEffect);

            this.gaussianBlurEffect.PrepareForVerticalBlur();
            this.DrawFullScreenQuad(this.renderTarget2, this.renderTarget1, this.gaussianBlurEffect);

            Core.Instance.GraphicsDevice.SamplerStates[1] = SamplerState.LinearClamp;
            this.bloomCombineEffect.BaseMap = source;
            this.DrawFullScreenQuad(this.renderTarget1, destination, this.bloomCombineEffect);
        }

        public class BloomSettings
        {
            public static BloomSettings[] PresetSettings =
            {
                new BloomSettings(0.1f, 0.6f, 2f, 1f, 1, 0), // Default
                new BloomSettings(0, 3, 1, 1, 1, 1), // Soft
                new BloomSettings(0.5f, 8, 2, 1, 0, 1), // Desaturated
                new BloomSettings(0.25f, 8, 1.3f, 1, 1, 0), // Saturated
                new BloomSettings(0, 2, 1, 0.1f, 1, 1), // Blurry
                new BloomSettings(0.5f, 2, 1, 1, 1, 1) // Subtle
            };

            public readonly float BaseIntensity;

            public readonly float BaseSaturation;

            public readonly float BlurAmount;

            public readonly float Intensity;

            public readonly float Saturation;

            public readonly float Threshold;

            public BloomSettings(
                float bloomThreshold,
                float blurAmount,
                float bloomIntensity,
                float baseIntensity,
                float bloomSaturation,
                float baseSaturation)
            {
                this.Threshold = bloomThreshold;
                this.BlurAmount = blurAmount;
                this.Intensity = bloomIntensity;
                this.BaseIntensity = baseIntensity;
                this.Saturation = bloomSaturation;
                this.BaseSaturation = baseSaturation;
            }
        }
    }
}