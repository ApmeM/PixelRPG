namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class DM300Sprite :CharSprite {
    
        public DM300Sprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.dm300);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 22, 20);

            this.idle = new SpriteAnimation(frames, 0, 1);

            this.run = new SpriteAnimation(frames, 2, 3);

            this.attack = new SpriteAnimation(frames, 4, 5, 6);

            this.die = new SpriteAnimation(frames, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 8);
        }
    }
}
