namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class ImpSprite : UnitAnimation {
    
        public ImpSprite(ContentManager content) {

        
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.demon );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14 );
        
            this.Idle = new SpriteAnimation( frames, 
                0, 1, 2, 3, 0, 1, 2, 3, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
                0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 3, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4 );

            this.Run = new SpriteAnimation( frames, 0 );
            
            this.Attack = new SpriteAnimation( frames, 0 );

            this.Die = new SpriteAnimation( frames, 0, 3, 2, 1, 0, 3, 2, 1, 0 );
        }
    }
}
