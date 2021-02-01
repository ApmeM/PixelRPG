namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class SpriteBlinkEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.spriteBlinkEffect;

        private readonly EffectParameter blinkColorParam;

        public SpriteBlinkEffect(Effect effect)
            : base(effect)
        {
            this.blinkColorParam = this.Parameters["_blinkColor"];

            this.BlinkColor = Color.TransparentBlack;
        }

        public Color BlinkColor
        {
            get => new Color(this.blinkColorParam.GetValueVector4());
            set => this.blinkColorParam.SetValue(value.ToVector4());
        }
    }
}