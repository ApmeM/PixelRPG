namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class DotsEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.dots;

        private readonly EffectParameter angleParam;

        private readonly EffectParameter scaleParam;

        public DotsEffect(Effect effect)
            : base(effect)
        {
            this.scaleParam = this.Parameters["scale"];
            this.angleParam = this.Parameters["angle"];

            this.Scale = 0.5f;
            this.Angle = 0.5f;
        }

        public float Scale
        {
            get => this.scaleParam.GetValueSingle();
            set => this.scaleParam.SetValue(value);
        }

        public float Angle
        {
            get => this.angleParam.GetValueSingle();
            set => this.angleParam.SetValue(value);
        }
    }
}