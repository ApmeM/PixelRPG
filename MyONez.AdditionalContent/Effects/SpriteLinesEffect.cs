namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class SpriteLinesEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.spriteLines;

        private readonly EffectParameter lineColorParam;

        private readonly EffectParameter lineSizeParam;

        public SpriteLinesEffect(Effect effect)
            : base(effect)
        {
            this.lineColorParam = this.Parameters["_lineColor"];
            this.lineSizeParam = this.Parameters["_lineSize"];

            this.LineColor = Color.Red;
            this.LineSize = 5f;
        }

        public Color LineColor
        {
            get => new Color(this.lineColorParam.GetValueVector4());
            set => this.lineColorParam.SetValue(value.ToVector4());
        }

        public float LineSize
        {
            get => this.lineSizeParam.GetValueSingle();
            set => this.lineSizeParam.SetValue(value);
        }

        public bool IsVertical
        {
            get => this.CurrentTechnique == this.Techniques["VerticalLines"];
            set => this.CurrentTechnique = this.Techniques[value ? "VerticalLines:" : "HorizontalLines"];
        }
    }
}