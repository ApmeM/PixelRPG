namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class PixelGlitchEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.pixelGlitch;

        public float VerticalSize
        {
            get => this.Parameters["_verticalSize"].GetValueSingle();
            set => this.Parameters["_verticalSize"].SetValue(value);
        }

        public float HorizontalOffset
        {
            get => this.Parameters["_horizontalOffset"].GetValueSingle();
            set => this.Parameters["_horizontalOffset"].SetValue(value);
        }

        public Vector2 ScreenSize
        {
            get => this.Parameters["_screenSize"].GetValueVector2();
            set => this.Parameters["_screenSize"].SetValue(value);
        }

        public PixelGlitchEffect(Effect effect)
            : base(effect)
        {
        }
    }
}