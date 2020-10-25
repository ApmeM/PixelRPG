namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class WandmakerSprite : CharSprite
    {
        public WandmakerSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.wandmaker);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1);

            this.run = new SpriteAnimation(frames, 0);
            this.attack = new SpriteAnimation(frames, 0);
            this.die = new SpriteAnimation(frames, 0);
        }
    }
}