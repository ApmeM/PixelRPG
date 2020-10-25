namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class BlacksmithSprite : CharSprite
    {
        public BlacksmithSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.blacksmith);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 13, 16);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3);

            this.run = new SpriteAnimation(frames, 0);

            this.attack = new SpriteAnimation(frames, 0);

            this.die = new SpriteAnimation(frames, 0);
        }
    }
}