namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class TwistEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.twist;

        private readonly EffectParameter angleParam;

        private readonly EffectParameter offsetParam;

        private readonly EffectParameter radiusParam;

        public TwistEffect(Effect effect)
            : base(effect)
        {
            this.radiusParam = this.Parameters["radius"];
            this.angleParam = this.Parameters["angle"];
            this.offsetParam = this.Parameters["offset"];

            this.Radius = 0.5f;
            this.Angle = 5f;
            this.Offset = Vector2.One / 2;
        }

        public float Radius
        {
            get => this.radiusParam.GetValueSingle();
            set => this.radiusParam.SetValue(value);
        }

        public float Angle
        {
            get => this.angleParam.GetValueSingle();
            set => this.angleParam.SetValue(value);
        }

        public Vector2 Offset
        {
            get => this.offsetParam.GetValueVector2();
            set => this.offsetParam.SetValue(value);
        }
    }
}