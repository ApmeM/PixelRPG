namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent;

    public class GrayscaleEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.grayscale;

        public GrayscaleEffect(Effect cloneSource)
            : base(cloneSource)
        {
        }
    }
}