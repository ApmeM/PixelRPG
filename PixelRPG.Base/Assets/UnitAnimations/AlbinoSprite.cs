namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class AlbinoSprite: CharSprite {

        public AlbinoSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.rat);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

            this.idle = new SpriteAnimation(frames, 16, 16, 16, 17);

            this.run = new SpriteAnimation(frames, 22, 23, 24, 25, 26);

            this.attack = new SpriteAnimation(frames, 18, 19, 20, 21);

            this.die = new SpriteAnimation(frames, 27, 28, 29, 30);
        }
    }
}
