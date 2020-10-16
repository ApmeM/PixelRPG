namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class MultiTextureEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.multiTexture;

        public MultiTextureEffect(Effect effect)
            : base(effect)
        {
        }
    }
}