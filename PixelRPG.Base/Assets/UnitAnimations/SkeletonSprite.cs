namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SkeletonSprite : CharSprite
    {
        public SkeletonSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.skeleton);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3);

            this.run = new SpriteAnimation(frames, 4, 5, 6, 7, 8, 9);

            this.attack = new SpriteAnimation(frames, 14, 15, 16);

            this.die = new SpriteAnimation(frames, 10, 11, 12, 13);
        }
    }
}
