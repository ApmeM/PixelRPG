namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class RatSprite : CharSprite
    {
        public RatSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.rat);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 1);

            this.run = new SpriteAnimation(frames, 6, 7, 8, 9, 10);

            this.attack = new SpriteAnimation(frames, 2, 3, 4, 5, 0);

            this.die = new SpriteAnimation(frames, 11, 12, 13, 14);
        }
    }
}