namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SeniorSprite : UnitAnimation
    {
        public SeniorSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.monk);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 15, 14);

            this.Idle = new SpriteAnimation(frames, 18, 17, 18, 19);

            this.Run = new SpriteAnimation(frames, 28, 29, 30, 31, 32, 33);

            this.Attack = new SpriteAnimation(frames, 20, 21, 20, 21, 22, 23, 22);

            this.Die = new SpriteAnimation(frames, 18, 24, 25, 25, 26, 27);
        }
    }
}