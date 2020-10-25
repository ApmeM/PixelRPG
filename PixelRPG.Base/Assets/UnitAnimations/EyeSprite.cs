namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class EyeSprite :CharSprite {
    
        public EyeSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.eye);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 18);

            this.idle = new SpriteAnimation(frames, 0, 1, 2);

            this.run = new SpriteAnimation(frames, 5, 6);

            this.attack = new SpriteAnimation(frames, 4, 3);

            this.die = new SpriteAnimation(frames, 7, 8, 9);
        }
    }
}
