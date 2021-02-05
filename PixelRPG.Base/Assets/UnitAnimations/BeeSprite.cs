namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class BeeSprite : UnitAnimation
    {
        public BeeSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.bee);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.Idle = new SpriteAnimation(frames, 0, 1, 1, 0, 2, 2);

            this.Run = new SpriteAnimation(frames, 0, 1, 1, 0, 2, 2);

            this.Attack = new SpriteAnimation(frames, 3, 4, 5, 6);

            this.Die = new SpriteAnimation(frames, 7, 8, 9, 10);
        }
    }
}
