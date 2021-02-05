namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class UndeadSprite : UnitAnimation
    {
        public UndeadSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.undead);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3);

            this.Run = new SpriteAnimation(frames, 4, 5, 6, 7, 8, 9);

            this.Attack = new SpriteAnimation(frames, 14, 15, 16);

            this.Die = new SpriteAnimation(frames, 10, 11, 12, 13);
        }
    }
}