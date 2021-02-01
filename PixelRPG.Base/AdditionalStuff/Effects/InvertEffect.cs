namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class InvertEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.invert;

        public InvertEffect(Effect effect)
            : base(effect)
        {
        }
    }
}