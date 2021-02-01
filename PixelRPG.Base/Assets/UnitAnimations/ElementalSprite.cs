namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class ElementalSprite : UnitAnimation {
        public ElementalSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.elemental);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14);

            this.Idle = new SpriteAnimation(frames, 0, 1, 2);

            this.Run = new SpriteAnimation(frames, 0, 1, 3);

            this.Attack = new SpriteAnimation(frames, 4, 5, 6);

            this.Die = new SpriteAnimation(frames, 7, 8, 9, 10, 11, 12, 13, 12);
        }
    }
}
