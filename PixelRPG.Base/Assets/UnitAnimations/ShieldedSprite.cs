namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ShieldedSprite : UnitAnimation
    {
        public ShieldedSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.brute);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 16);

            this.Idle = new SpriteAnimation(frames, 21, 21, 21, 22, 21, 21, 22, 22);

            this.Run = new SpriteAnimation(frames, 25, 26, 27, 28);

            this.Attack = new SpriteAnimation(frames, 23, 24);

            this.Die = new SpriteAnimation(frames, 29, 30, 31);
        }
    }
}