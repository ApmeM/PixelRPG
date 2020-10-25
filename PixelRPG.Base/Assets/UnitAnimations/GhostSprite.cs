namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class GhostSprite : CharSprite {
    
        public GhostSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.ghost);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 15);

            this.idle = new SpriteAnimation(frames, 0, 1);

            this.run = new SpriteAnimation(frames, 0, 1);

            this.attack = new SpriteAnimation(frames, 0);

            this.die = new SpriteAnimation(frames, 0);
        }
    }
}
