namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ShieldedSprite : CharSprite
    {
        public ShieldedSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.brute);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

            this.idle = new SpriteAnimation(frames, 21, 21, 21, 22, 21, 21, 22, 22);

            this.run = new SpriteAnimation(frames, 25, 26, 27, 28);

            this.attack = new SpriteAnimation(frames, 23, 24);

            this.die = new SpriteAnimation(frames, 29, 30, 31);
        }
    }
}