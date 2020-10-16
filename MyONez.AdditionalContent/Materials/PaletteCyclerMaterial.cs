namespace MyONez.AdditionalContent.Materials
{
    using System;

    using MyONez.AdditionalContent.Effects;
    using MyONez.Graphics.Materials;

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