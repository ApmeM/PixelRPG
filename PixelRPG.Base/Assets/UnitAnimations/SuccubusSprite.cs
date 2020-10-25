namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SuccubusSprite : CharSprite
    {
        public SuccubusSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.succubus);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1);

            this.run = new SpriteAnimation(frames, 3, 4, 5, 6, 7, 8);

            this.attack = new SpriteAnimation(frames, 9, 10, 11);

            this.die = new SpriteAnimation(frames, 12);
        }
    }
}