namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class AlbinoSprite: UnitAnimation {

        public AlbinoSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.rat);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 15);

            this.Idle = new SpriteAnimation(frames, 16, 16, 16, 17);

            this.Run = new SpriteAnimation(frames, 22, 23, 24, 25, 26);

            this.Attack = new SpriteAnimation(frames, 18, 19, 20, 21);

            this.Die = new SpriteAnimation(frames, 27, 28, 29, 30);
        }
    }
}
