namespace PixelRPG.Base.Assets
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Drawable;

    public class ItemSprite
    {
        public SubtextureDrawable sprite;

        public ItemSprite(ContentManager content, ItemSpriteSheet itemType)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.items);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.sprite = frames[(int)itemType];
        }
    }
}