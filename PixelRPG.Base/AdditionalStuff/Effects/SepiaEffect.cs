namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class SepiaEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.sepia;

        private readonly EffectParameter sepiaToneParam;

        public SepiaEffect(Effect effect)
            : base(effect)
        {
            this.sepiaToneParam = this.Parameters["_sepiaTone"];
            this.SepiaTone = new Vector3(1.2f, 1.0f, 0.8f);
        }

        public Vector3 SepiaTone
        {
            get => this.sepiaToneParam.GetValueVector3();
            set => this.sepiaToneParam.SetValue(value);
        }
    }
}