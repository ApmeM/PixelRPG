namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.Graphics.Transitions;

    public class SquaresEffect : Effect, IProgressEffect
    {
        public const string EffectAssetName = ContentPaths.Effects.squares;

        public Color Color
        {
            get => new Color(this.Parameters["_color"].GetValueVector4());
            set => this.Parameters["_color"].SetValue(value.ToVector4());
        }

        public float Smoothness
        {
            get => this.Parameters["_smoothness"].GetValueSingle();
            set => this.Parameters["_smoothness"].SetValue(value);
        }

        public Vector2 Size
        {
            get => this.Parameters["_size"].GetValueVector2();
            set => this.Parameters["_size"].SetValue(value);
        }

        public float Progress
        {
            get => this.Parameters["_progress"].GetValueSingle();
            set => this.Parameters["_progress"].SetValue(value);
        }

        public SquaresEffect(Effect effect)
            : base(effect)
        {
            this.Color = Color.Black;
            this.Smoothness = 0.5f;
            this.Size = new Vector2(30, 30);
            this.Progress = 0;
        }
    }
}