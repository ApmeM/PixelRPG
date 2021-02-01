namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class SuccubusSprite : UnitAnimation
    {
        public SuccubusSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.succubus);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1);

            this.Run = new SpriteAnimation(frames, 3, 4, 5, 6, 7, 8);

            this.Attack = new SpriteAnimation(frames, 9, 10, 11);

            this.Die = new SpriteAnimation(frames, 12);
        }
    }
}