namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent;

    public class SpriteAlphaTestEffect : Effect
    {
        public enum AlphaTestCompareFunction
        {
            Greater,

            LessThan,

            Always,

            Never
        }

        public const string EffectAssetName = ContentPaths.Effects.spriteAlphaTest;

        private readonly EffectParameter alphaTestParam;

        private AlphaTestCompareFunction compareFunction = AlphaTestCompareFunction.Greater;

        private float referenceAlpha = 0.5f;

        public SpriteAlphaTestEffect(Effect effect)
            : base(effect)
        {
            this.alphaTestParam = this.Parameters["_alphaTest"];
            this.UpdateEffectParameter();
        }

        public float ReferenceAlpha
        {
            get => this.referenceAlpha;
            set
            {
                if (this.referenceAlpha == value)
                {
                    return;
                }

                this.referenceAlpha = value;
                this.UpdateEffectParameter();
            }
        }

        public AlphaTestCompareFunction CompareFunction
        {
            get => this.compareFunction;
            set
            {
                if (this.compareFunction == value)
                {
                    return;
                }

                this.compareFunction = value;
                this.UpdateEffectParameter();
            }
        }

        private void UpdateEffectParameter()
        {
            var value = new Vector3();

            value.X = this.referenceAlpha;

            switch (this.compareFunction)
            {
                case AlphaTestCompareFunction.Greater:
                    value.Y = -1;
                    value.Z = 1;
                    break;
                case AlphaTestCompareFunction.LessThan:
                    value.Y = 1;
                    value.Z = -1;
                    break;
                case AlphaTestCompareFunction.Always:
                    value.Y = 1;
                    value.Z = 1;
                    break;
                case AlphaTestCompareFunction.Never:
                    value.Y = -1;
                    value.Z = -1;
                    break;
            }

            this.alphaTestParam.SetValue(value);
        }
    }
}