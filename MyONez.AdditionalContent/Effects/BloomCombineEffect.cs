namespace MyONez.AdditionalContent.Effects
{
    #region Using Directives

    using Microsoft.Xna.Framework.Graphics;

    #endregion

    public class BloomCombineEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.bloomCombine;

        private readonly EffectParameter baseIntensityParam;

        private readonly EffectParameter baseMapParam;

        private readonly EffectParameter baseSaturationParam;

        private readonly EffectParameter bloomIntensityParam;

        private readonly EffectParameter bloomSaturationParam;

        public BloomCombineEffect(Effect effect)
            : base(effect)
        {
            this.bloomIntensityParam = this.Parameters["_bloomIntensity"];
            this.baseIntensityParam = this.Parameters["_baseIntensity"];
            this.bloomSaturationParam = this.Parameters["_bloomSaturation"];
            this.baseSaturationParam = this.Parameters["_baseSaturation"];
            this.baseMapParam = this.Parameters["_baseMap"];
        }

        public float BloomIntensity
        {
            get => this.bloomIntensityParam.GetValueSingle();
            set => this.bloomIntensityParam.SetValue(value);
        }

        public float BaseIntensity
        {
            get => this.baseIntensityParam.GetValueSingle();
            set => this.baseIntensityParam.SetValue(value);
        }

        public float BloomSaturation
        {
            get => this.bloomSaturationParam.GetValueSingle();
            set => this.bloomSaturationParam.SetValue(value);
        }

        public float BaseSaturation
        {
            get => this.baseSaturationParam.GetValueSingle();
            set => this.baseSaturationParam.SetValue(value);
        }

        public Texture2D BaseMap
        {
            get => this.baseMapParam.GetValueTexture2D();
            set => this.baseMapParam.SetValue(value);
        }
    }
}