namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class GhostSprite : UnitAnimation {
    
        public GhostSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.ghost);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 15);

            this.Idle = new SpriteAnimation(frames, 0, 1);

            this.Run = new SpriteAnimation(frames, 0, 1);

            this.Attack = new SpriteAnimation(frames, 0);

            this.Die = new SpriteAnimation(frames, 0);
        }
    }
}
