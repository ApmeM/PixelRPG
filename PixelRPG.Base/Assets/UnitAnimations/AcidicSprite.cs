namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class AcidicSprite : UnitAnimation
    {
        public AcidicSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.scorpio);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 18, 17);

            this.Idle = new SpriteAnimation(frames, 14, 14, 14, 14, 14, 14, 14, 14, 15, 16, 15, 16, 15, 16);

            this.Run = new SpriteAnimation(frames, 19, 20);

            this.Attack = new SpriteAnimation(frames, 14, 17, 18);
            
            this.Die = new SpriteAnimation(frames, 14, 21, 22, 23, 24);
        }
    }
}