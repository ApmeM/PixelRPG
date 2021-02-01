namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class DeferredLightingEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.deferredLighting;

        public DeferredLightingEffect(Effect effect)
            : base(effect)
        {
        }
    }
}