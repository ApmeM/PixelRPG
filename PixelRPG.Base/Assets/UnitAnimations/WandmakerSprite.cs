namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class WandmakerSprite : UnitAnimation
    {
        public WandmakerSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.wandmaker);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1);

            this.Run = new SpriteAnimation(frames, 0);
            this.Attack = new SpriteAnimation(frames, 0);
            this.Die = new SpriteAnimation(frames, 0);
        }
    }
}