namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SpinnerSprite : UnitAnimation
    {
        public SpinnerSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.spinner);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 1, 0, 1);

            this.Run = new SpriteAnimation(frames, 0, 2, 0, 3);

            this.Attack = new SpriteAnimation(frames, 0, 4, 5, 0);

            this.Die = new SpriteAnimation(frames, 6, 7, 8, 9);
        }
    }
}