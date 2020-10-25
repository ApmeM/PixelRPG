namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class GolemSprite : CharSprite {
    
        public GolemSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.golem);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.idle = new SpriteAnimation(frames, 0, 1);

            this.run = new SpriteAnimation(frames, 2, 3, 4, 5);

            this.attack = new SpriteAnimation(frames, 6, 7, 8);

            this.die = new SpriteAnimation(frames, 9, 10, 11, 12, 13);
        }
    }
}
