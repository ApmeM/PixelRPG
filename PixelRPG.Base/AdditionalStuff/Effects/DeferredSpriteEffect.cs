namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class DeferredSpriteEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.deferredSprite;

        private readonly EffectParameter alphaAsSelfIlluminationParam;

        private readonly EffectParameter alphaCutoffParam;

        private readonly EffectParameter normalMapParam;

        private readonly EffectParameter selfIlluminationPowerParam;

        public DeferredSpriteEffect(Effect effect)
            : base(effect)
        {
            this.normalMapParam = this.Parameters["_normalMap"];
            this.alphaCutoffParam = this.Parameters["_alphaCutoff"];
            this.alphaAsSelfIlluminationParam = this.Parameters["_alphaAsSelfIllumination"];
            this.selfIlluminationPowerParam = this.Parameters["_selfIlluminationPower"];

            this.AlphaCutoff = 0.3f;
            this.SelfIlluminationPower = 1;
        }

        public float AlphaCutoff
        {
            get => this.alphaCutoffParam.GetValueSingle();
            set => this.alphaCutoffParam.SetValue(value);
        }

        public Texture2D NormalMap
        {
            get => this.normalMapParam.GetValueTexture2D();
            set => this.normalMapParam.SetValue(value);
        }

        public bool UseNormalAlphaChannelForSelfIllumination
        {
            get => this.alphaAsSelfIlluminationParam.GetValueSingle() == 1f;
            set => this.alphaAsSelfIlluminationParam.SetValue(value ? 1f : 0f);
        }

        public float SelfIlluminationPower
        {
            get => this.selfIlluminationPowerParam.GetValueSingle();
            set => this.selfIlluminationPowerParam.SetValue(value);
        }
    }
}