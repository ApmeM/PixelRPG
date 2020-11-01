namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class WarlockSprite : UnitAnimation {
        public WarlockSprite(ContentManager content) {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.warlock );
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15 );
        
            this.Idle = new SpriteAnimation( frames, 0, 0, 0, 1, 0, 0, 1, 1 );

            this.Run = new SpriteAnimation( frames, 0, 2, 3, 4 );

            this.Attack = new SpriteAnimation( frames, 0, 5, 6 );
    
            this.Die = new SpriteAnimation( frames, 0, 7, 8, 8, 9, 10 );
        }
    }
}
