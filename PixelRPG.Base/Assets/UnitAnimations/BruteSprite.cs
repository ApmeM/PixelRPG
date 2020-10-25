
namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class BruteSprite : CharSprite
    {

        public BruteSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.brute);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 1, 0, 0, 1, 1);

            this.run = new SpriteAnimation(frames, 4, 5, 6, 7);

            this.attack = new SpriteAnimation(frames, 2, 3, 0);

            this.die = new SpriteAnimation(frames, 8, 9, 10);
        }
    }
}