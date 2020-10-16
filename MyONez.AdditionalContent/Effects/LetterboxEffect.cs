namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class LetterboxEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.letterbox;

        public Color Color
        {
            get => new Color(this.Parameters["_color"].GetValueVector4());
            set => this.Parameters["_color"].SetValue(value.ToVector4());
        }

        public float LetterboxSize
        {
            get => this.Parameters["_letterboxSize"].GetValueSingle();
            set => this.Parameters["_letterboxSize"].SetValue(value);
        }

        public LetterboxEffect(Effect effect)
            : base(effect)
        {
        }
    }
}