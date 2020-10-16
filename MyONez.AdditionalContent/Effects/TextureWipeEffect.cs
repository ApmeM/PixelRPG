namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Transitions;

    public class TextureWipeEffect : Effect, IProgressEffect
    {
        public const string EffectAssetName = ContentPaths.Effects.textureWipe;

        public float Opacity
        {
            get => this.Parameters["_opacity"].GetValueSingle();
            set => this.Parameters["_opacity"].SetValue(value);
        }

        public Color Color
        {
            get => new Color(this.Parameters["_color"].GetValueVector4());
            set => this.Parameters["_color"].SetValue(value.ToVector4());
        }

        public Texture2D Texture
        {
            get => this.Parameters["_transitionTex"].GetValueTexture2D();
            set => this.Parameters["_transitionTex"].SetValue(value);
        }

        public float Progress
        {
            get => this.Parameters["_progress"].GetValueSingle();
            set => this.Parameters["_progress"].SetValue(value);
        }

        public TextureWipeEffect(Effect effect)
            : base(effect)
        {
        }
    }
}