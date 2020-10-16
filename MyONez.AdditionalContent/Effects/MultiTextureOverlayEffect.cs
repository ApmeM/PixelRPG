namespace MyONez.AdditionalContent.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class MultiTextureOverlayEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.multiTextureOverlay;

        public MultiTextureOverlayEffect(Effect effect)
            : base(effect)
        {
        }

        public Texture2D SecondTexture
        {
            get => this.Parameters["_secondTexture"].GetValueTexture2D();
            set => this.Parameters["_secondTexture"].SetValue(value);
        }
    }
}