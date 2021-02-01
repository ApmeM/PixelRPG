namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class BevelsEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.bevels;

        public BevelsEffect(Effect effect)
            : base(effect)
        {
        }
    }
}