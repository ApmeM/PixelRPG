namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class BurningFistSprite : CharSprite
    {
        public BurningFistSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.burning_fist);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 24, 17);

            this.idle = new SpriteAnimation(frames, 0, 0, 1);

            this.run = new SpriteAnimation(frames, 0, 1);

            this.attack = new SpriteAnimation(frames, 0, 5, 6);

            this.die = new SpriteAnimation(frames, 0, 2, 3, 4);
        }
    }
}
