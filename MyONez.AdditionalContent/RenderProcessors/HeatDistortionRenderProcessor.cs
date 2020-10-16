namespace MyONez.AdditionalContent.RenderProcessors
{
    using System;

    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.Effects;
    using MyONez.ECS;
    using MyONez.Graphics.RenderProcessors;

    public class HeatDistortionRenderProcessor : RenderProcessor<HeatDistortionEffect>
    {
        private float distortionFactor = 0.005f;

        private float riseFactor = 0.15f;

        public HeatDistortionRenderProcessor(int executionOrder)
            : base(executionOrder)
        {
        }

        public float DistortionFactor
        {
            get => this.distortionFactor;
            set
            {
                if (this.distortionFactor == value)
                {
                    return;
                }

                this.distortionFactor = value;

                if (this.TypedEffect != null)
                    this.TypedEffect.DistortionFactor = this.distortionFactor;
            }
        }

        public float RiseFactor
        {
            get => this.riseFactor;
            set
            {
                if (this.riseFactor == value)
                {
                    return;
                }

                this.riseFactor = value;

                if (this.TypedEffect != null)
                    this.TypedEffect.RiseFactor = this.riseFactor;
            }
        }

        public Texture2D DistortionTexture
        {
            set => this.TypedEffect.DistortionTexture = value;
        }

        public override void OnAddedToScene(Scene scene)
        {
            this.TypedEffect = scene.Content.Load<HeatDistortionEffect>(HeatDistortionEffect.EffectAssetName);

            this.TypedEffect.DistortionFactor = this.distortionFactor;
            this.TypedEffect.RiseFactor = this.riseFactor;

            this.DistortionTexture = scene.Content.Load<Texture2D>(ContentPaths.Textures.heatDistortionNoise);
        }

        private float elapsed;

        public override void Update(TimeSpan gameTime)
        {
            base.Update(gameTime);
            this.elapsed += (float)gameTime.TotalSeconds;
            this.TypedEffect.Time = this.elapsed;
        }
    }
}