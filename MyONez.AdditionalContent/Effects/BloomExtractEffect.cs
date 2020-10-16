namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class BloomExtractEffect : Effect
    {
        private readonly EffectParameter bloomThresholdParam;

        public const string EffectAssetName = ContentPaths.Effects.bloomExtract;

        public BloomExtractEffect(Effect effect)
            : base(effect)
        {
            this.bloomThresholdParam = this.Parameters["_bloomThreshold"];
        }

        public float BloomThreshold
        {
            get => this.bloomThresholdParam.GetValueSingle();
            set => this.bloomThresholdParam.SetValue(value);
        }
    }
}