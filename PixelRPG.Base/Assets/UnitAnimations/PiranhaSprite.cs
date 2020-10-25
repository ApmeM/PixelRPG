namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class PiranhaSprite : CharSprite
    {
        public PiranhaSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.piranha);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

            this.idle = new SpriteAnimation(frames, 0, 1, 2, 1);

            this.run = new SpriteAnimation(frames, 0, 1, 2, 1);

            this.attack = new SpriteAnimation(frames, 3, 4, 5, 6, 7, 8, 9, 10, 11);

            this.die = new SpriteAnimation(frames, 12, 13, 14);
        }
    }
}
