namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class RatSprite : UnitAnimation
    {
        public RatSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.rat);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 1);

            this.Run = new SpriteAnimation(frames, 6, 7, 8, 9, 10);

            this.Attack = new SpriteAnimation(frames, 2, 3, 4, 5, 0);

            this.Die = new SpriteAnimation(frames, 11, 12, 13, 14);
        }
    }
}