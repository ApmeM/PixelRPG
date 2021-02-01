namespace PixelRPG.Base.AdditionalStuff.Materials
{
    using System;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine;
    using SpineEngine.Graphics.Materials;

    public class PaletteCyclerMaterial : Material<PaletteCyclerEffect>
    {
        public PaletteCyclerMaterial()
            : base(Core.Instance.Content.Load<PaletteCyclerEffect>(PaletteCyclerEffect.EffectAssetName))
        {
        }

        public override void Update(TimeSpan gameTime)
        {
            base.Update(gameTime);
            this.TypedEffect.Time = (float)gameTime.TotalSeconds;
        }
    }
}