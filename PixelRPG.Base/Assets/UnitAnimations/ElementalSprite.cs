namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ElementalSprite : CharSprite {
        public ElementalSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.elemental);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

            this.idle = new SpriteAnimation(frames, 0, 1, 2);

            this.run = new SpriteAnimation(frames, 0, 1, 3);

            this.attack = new SpriteAnimation(frames, 4, 5, 6);

            this.die = new SpriteAnimation(frames, 7, 8, 9, 10, 11, 12, 13, 12);
        }
    }
}
