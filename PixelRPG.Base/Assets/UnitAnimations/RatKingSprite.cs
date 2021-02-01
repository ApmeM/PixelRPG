
namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class RatKingSprite : UnitAnimation
    {
        public RatKingSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.ratking);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 1);

            this.Run = new SpriteAnimation(frames, 2, 3, 4, 5, 6);

            this.Attack = new SpriteAnimation(frames, 0);

            this.Die = new SpriteAnimation(frames, 0);
        }
    }
}