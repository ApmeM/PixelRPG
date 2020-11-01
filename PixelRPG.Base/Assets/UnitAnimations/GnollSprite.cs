namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class GnollSprite : UnitAnimation {
    
        public GnollSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.gnoll);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

            this.Idle = new SpriteAnimation(frames, 0, 0, 0, 1, 0, 0, 1, 1);

            this.Run = new SpriteAnimation(frames, 4, 5, 6, 7);

            this.Attack = new SpriteAnimation(frames, 2, 3, 0);

            this.Die = new SpriteAnimation(frames, 8, 9, 10);
        }
    }
}
