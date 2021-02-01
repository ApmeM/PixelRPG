namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class PaletteCyclerEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.paletteCycler;

        private readonly EffectParameter cycleSpeedParam;

        private readonly EffectParameter paletteTextureParam;

        private readonly EffectParameter timeParam;

        public PaletteCyclerEffect(Effect effect)
            : base(effect)
        {
            this.paletteTextureParam = this.Parameters["_paletteTexture"];
            this.cycleSpeedParam = this.Parameters["_cycleSpeed"];
            this.timeParam = this.Parameters["_time"];
        }

        public Texture2D PaletteTexture
        {
            get => this.paletteTextureParam.GetValueTexture2D();
            set => this.paletteTextureParam.SetValue(value);
        }

        public float CycleSpeed
        {
            get => this.cycleSpeedParam.GetValueSingle();
            set => this.cycleSpeedParam.SetValue(value);
        }
        
        public float Time
        {
            get => this.timeParam.GetValueSingle();
            set => this.timeParam.SetValue(value);
        }
    }
}