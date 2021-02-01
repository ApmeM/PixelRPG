namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class ThiefSprite : UnitAnimation
    {
        public ThiefSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.thief);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 13);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 1, 0, 0, 0, 0, 1);

            this.Run = new SpriteAnimation(frames, 0, 0, 2, 3, 3, 4);

            this.Die = new SpriteAnimation(frames, 5, 6, 7, 8, 9);

            this.Attack = new SpriteAnimation(frames, 10, 11, 12, 0);
        }
    }
}