namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class ScanlinesEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.scanlines;

        private readonly EffectParameter attenuationParam;

        private readonly EffectParameter linesFactorParam;

        public ScanlinesEffect(Effect effect)
            : base(effect)
        {
            this.attenuationParam = this.Parameters["_attenuation"];
            this.linesFactorParam = this.Parameters["_linesFactor"];

            this.Attenuation = 0.04f;
            this.LinesFactor = 800f;
        }

        public float Attenuation
        {
            get => this.attenuationParam.GetValueSingle();
            set => this.attenuationParam.SetValue(value);
        }

        public float LinesFactor
        {
            get => this.linesFactorParam.GetValueSingle();
            set => this.linesFactorParam.SetValue(value);
        }
    }
}