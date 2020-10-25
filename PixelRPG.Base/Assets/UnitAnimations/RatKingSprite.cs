
namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class RatKingSprite : CharSprite
    {
        public RatKingSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.ratking);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 1);

            this.run = new SpriteAnimation(frames, 2, 3, 4, 5, 6);

            this.attack = new SpriteAnimation(frames, 0);

            this.die = new SpriteAnimation(frames, 0);
        }
    }
}