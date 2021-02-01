namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class DM300Sprite :UnitAnimation {
    
        public DM300Sprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.dm300);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 22, 20);

            this.Idle = new SpriteAnimation(frames, 0, 1);

            this.Run = new SpriteAnimation(frames, 2, 3);

            this.Attack = new SpriteAnimation(frames, 4, 5, 6);

            this.Die = new SpriteAnimation(frames, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 8);
        }
    }
}
