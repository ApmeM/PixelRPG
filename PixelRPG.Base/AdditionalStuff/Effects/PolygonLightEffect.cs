namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class PolygonLightEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.polygonLight;

        public PolygonLightEffect(Effect effect)
            : base(effect)
        {
        }
    }
}