namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class MimicSprite : CharSprite
    {
        public MimicSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.mimic);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 1, 1);

            this.run = new SpriteAnimation(frames, 0, 1, 2, 3, 3, 2, 1);

            this.attack = new SpriteAnimation(frames, 0, 4, 5, 6);

            this.die = new SpriteAnimation(frames, 7, 8, 9);
        }
    }
}