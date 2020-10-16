namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class ForwardLightingEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.forwardLighting;

        public ForwardLightingEffect(Effect effect)
            : base(effect)
        {
        }
    }
}