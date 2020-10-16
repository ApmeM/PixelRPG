namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Maths;

    public class CrosshatchEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.crosshatch;

        private readonly EffectParameter crosshatchSizeParam;

        public CrosshatchEffect(Effect effect)
            : base(effect)
        {
            this.crosshatchSizeParam = this.Parameters["crossHatchSize"];
            this.CrosshatchSize = 16;
        }

        public int CrosshatchSize
        {
            get => this.crosshatchSizeParam.GetValueInt32();
            set
            {
                if (!Mathf.IsEven(value))
                {
                    value += 1;
                }

                this.crosshatchSizeParam.SetValue(value);
            }
        }
    }
}