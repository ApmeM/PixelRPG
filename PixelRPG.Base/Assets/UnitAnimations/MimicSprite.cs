namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class MimicSprite : UnitAnimation
    {
        public MimicSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.mimic);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 1, 1);

            this.Run = new SpriteAnimation(frames, 0, 1, 2, 3, 3, 2, 1);

            this.Attack = new SpriteAnimation(frames, 0, 4, 5, 6);

            this.Die = new SpriteAnimation(frames, 7, 8, 9);
        }
    }
}