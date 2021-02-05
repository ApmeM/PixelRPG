namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class YogSprite : UnitAnimation
    {
        public YogSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.yog);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 20, 19);

            this.Idle = new SpriteAnimation(frames, 0, 1, 2, 2, 1, 0, 3, 4, 4, 3, 0, 5, 6, 6, 5);

            this.Run = new SpriteAnimation(frames, 0);

            this.Attack = new SpriteAnimation(frames, 0);

            this.Die = new SpriteAnimation(frames, 0, 7, 8, 9);
        }
    }
}