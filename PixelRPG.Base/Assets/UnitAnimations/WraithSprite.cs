namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class WraithSprite : CharSprite
    {
        public WraithSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.wraith);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 15);

            this.idle = new SpriteAnimation(frames, 0, 1);

            this.run = new SpriteAnimation(frames, 0, 1);

            this.attack = new SpriteAnimation(frames, 0, 2, 3);

            this.die = new SpriteAnimation(frames, 0, 4, 5, 6, 7);
        }
    }
}