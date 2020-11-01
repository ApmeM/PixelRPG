namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SheepSprite : UnitAnimation
    {
        public SheepSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.sheep);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0);

            this.Run = new SpriteAnimation(frames, 0);

            this.Attack = new SpriteAnimation(frames, 0);

            this.Die = new SpriteAnimation(frames, 0);
        }
    }
}