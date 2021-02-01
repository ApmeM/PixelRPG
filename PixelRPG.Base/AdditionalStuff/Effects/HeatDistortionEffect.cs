namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class HeatDistortionEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.heatDistortion;

        public HeatDistortionEffect(Effect effect)
            : base(effect)
        {
        }

        public float DistortionFactor
        {
            get => this.Parameters["_distortionFactor"].GetValueSingle();
            set => this.Parameters["_distortionFactor"].SetValue(value);
        }

        public float RiseFactor
        {
            get => this.Parameters["_riseFactor"].GetValueSingle();
            set => this.Parameters["_riseFactor"].SetValue(value);
        }

        public float Time
        {
            get => this.Parameters["_time"].GetValueSingle();
            set => this.Parameters["_time"].SetValue(value);
        }

        public Texture2D DistortionTexture
        {
            get => this.Parameters["_distortionTexture"].GetValueTexture2D();
            set => this.Parameters["_distortionTexture"].SetValue(value);
        }
    }
}