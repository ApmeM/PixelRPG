namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class StatueSprite : CharSprite
    {
        public StatueSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.statue);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 1, 1);

            this.run = new SpriteAnimation(frames, 2, 3, 4, 5, 6, 7);

            this.attack = new SpriteAnimation(frames, 8, 9, 10);

            this.die = new SpriteAnimation(frames, 11, 12, 13, 14, 15, 15);
        }
    }
}