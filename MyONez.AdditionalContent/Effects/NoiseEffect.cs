namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class NoiseEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.noise;

        private readonly EffectParameter noiseParam;

        public NoiseEffect(Effect effect)
            : base(effect)
        {
            this.noiseParam = this.Parameters["noise"];
            this.Noise = 1;
        }

        public float Noise
        {
            get => this.noiseParam.GetValueSingle();
            set => this.noiseParam.SetValue(value);
        }
    }
}