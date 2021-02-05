namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class SpriteLightMultiplyEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.spriteLightMultiply;

        public SpriteLightMultiplyEffect(Effect effect)
            : base(effect)
        {
        }

        public Texture2D LightTexture
        {
            get => this.Parameters["_lightTexture"].GetValueTexture2D();
            set => this.Parameters["_lightTexture"].SetValue(value);
        }

        public float MultiplicativeFactor
        {
            get => this.Parameters["_multiplicativeFactor"].GetValueSingle();
            set => this.Parameters["_multiplicativeFactor"].SetValue(value);
        }
    }
}