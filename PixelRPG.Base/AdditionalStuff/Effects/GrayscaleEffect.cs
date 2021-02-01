namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff;

    public class GrayscaleEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.grayscale;

        public GrayscaleEffect(Effect cloneSource)
            : base(cloneSource)
        {
        }
    }
}