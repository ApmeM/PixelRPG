namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class EyeSprite :UnitAnimation {
    
        public EyeSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.eye);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 18);

            this.Idle = new SpriteAnimation(frames, 0, 1, 2);

            this.Run = new SpriteAnimation(frames, 5, 6);

            this.Attack = new SpriteAnimation(frames, 4, 3);

            this.Die = new SpriteAnimation(frames, 7, 8, 9);
        }
    }
}
