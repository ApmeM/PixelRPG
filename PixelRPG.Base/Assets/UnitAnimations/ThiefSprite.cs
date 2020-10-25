namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ThiefSprite : CharSprite
    {
        public ThiefSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.thief);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 13);

            this.idle = new SpriteAnimation(frames, 0, 0, 0, 1, 0, 0, 0, 0, 1);

            this.run = new SpriteAnimation(frames, 0, 0, 2, 3, 3, 4);

            this.die = new SpriteAnimation(frames, 5, 6, 7, 8, 9);

            this.attack = new SpriteAnimation(frames, 10, 11, 12, 0);
        }
    }
}