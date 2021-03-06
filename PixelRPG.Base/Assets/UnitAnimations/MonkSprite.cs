namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class MonkSprite : UnitAnimation
    {
        public MonkSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.monk);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 15, 14);

            this.Idle = new SpriteAnimation(frames, 1, 0, 1, 2);

            this.Run = new SpriteAnimation(frames, 11, 12, 13, 14, 15, 16);

            this.Attack = new SpriteAnimation(frames, 3, 4, 3, 4, 5, 6, 5);

            this.Die = new SpriteAnimation(frames, 1, 7, 8, 8, 9, 10);
        }
    }
}