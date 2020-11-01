namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class GooSprite : UnitAnimation
    {
        public GooSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.goo);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 20, 14);

            this.Idle = new SpriteAnimation(frames, 0, 1);

            this.Run = new SpriteAnimation(frames, 0, 1);

            this.Attack = new SpriteAnimation(frames, 5, 0, 6);

            this.Die = new SpriteAnimation(frames, 2, 3, 4);
        }
    }
}
