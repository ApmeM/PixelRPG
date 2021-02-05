namespace PixelRPG.Base.AdditionalStuff.RenderProcessors
{
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine.ECS;
    using SpineEngine.Graphics.RenderProcessors;

    public class VignetteRenderProcessor : RenderProcessor<VignetteEffect>
    {
        private float power = 1f;
        
        private float radius = 1.25f;

        public VignetteRenderProcessor(int executionOrder)
            : base(executionOrder)
        {
        }

        public float Power
        {
            get => this.power;
            set
            {
                if (this.power == value)
                {
                    return;
                }

                this.power = value;

                if (this.TypedEffect != null)
                    this.TypedEffect.Power = this.power;
            }
        }

        public float Radius
        {
            get => this.radius;
            set
            {
                if (this.radius == value)
                {
                    return;
                }

                this.radius = value;

                if (this.TypedEffect != null)
                    this.TypedEffect.Radius = this.radius;;
            }
        }

        public override void OnAddedToScene(Scene scene)
        {
            this.TypedEffect = scene.Content.Load<VignetteEffect>(VignetteEffect.EffectAssetName);

            this.TypedEffect.Power = this.power;
            this.TypedEffect.Radius = this.radius;
        }
    }
}