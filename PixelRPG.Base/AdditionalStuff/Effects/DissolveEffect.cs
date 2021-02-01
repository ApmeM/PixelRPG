namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class DissolveEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.dissolve;

        private readonly EffectParameter dissolveTexParam;

        private readonly EffectParameter dissolveThresholdColorParam;

        private readonly EffectParameter dissolveThresholdParam;

        private readonly EffectParameter progressParam;

        public DissolveEffect(Effect effect)
            : base(effect)
        {
            this.progressParam = this.Parameters["_progress"];
            this.dissolveThresholdParam = this.Parameters["_dissolveThreshold"];
            this.dissolveThresholdColorParam = this.Parameters["_dissolveThresholdColor"];
            this.dissolveTexParam = this.Parameters["_dissolveTex"];

            this.Progress = 0;
            this.DissolveThreshold = 0.1f;
            this.DissolveThresholdColor = Color.Red;
        }

        public float Progress
        {
            get => this.progressParam.GetValueSingle();
            set => this.progressParam.SetValue(value);
        }

        public float DissolveThreshold
        {
            get => this.dissolveThresholdParam.GetValueSingle();
            set => this.dissolveThresholdParam.SetValue(value);
        }

        public Color DissolveThresholdColor
        {
            get => new Color(this.dissolveThresholdColorParam.GetValueVector4());
            set => this.dissolveThresholdColorParam.SetValue(value.ToVector4());
        }

        public Texture2D DissolveTexture
        {
            get => this.dissolveTexParam.GetValueTexture2D();
            set => this.dissolveTexParam.SetValue(value);
        }
    }
}