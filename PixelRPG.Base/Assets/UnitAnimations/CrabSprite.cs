namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class CrabSprite : CharSprite {
    
        public CrabSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.crab);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.idle = new SpriteAnimation(frames, 0, 1, 0, 2);

            this.run = new SpriteAnimation(frames, 3, 4, 5, 6);

            this.attack = new SpriteAnimation(frames, 7, 8, 9);

            this.die = new SpriteAnimation(frames, 10, 11, 12, 13);
        }
    }
}
