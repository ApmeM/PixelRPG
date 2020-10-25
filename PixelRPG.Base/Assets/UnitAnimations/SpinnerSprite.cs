namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SpinnerSprite : CharSprite
    {
        public SpinnerSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.spinner);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 1, 0, 1);

            this.run = new SpriteAnimation(frames, 0, 2, 0, 3);

            this.attack = new SpriteAnimation(frames, 0, 4, 5, 0);

            this.die = new SpriteAnimation(frames, 6, 7, 8, 9);
        }
    }
}