namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ImpSprite : CharSprite {
    
        public ImpSprite(ContentManager content) {

        
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.demon );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 14 );
        
            this.idle = new SpriteAnimation( frames, 
                0, 1, 2, 3, 0, 1, 2, 3, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
                0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 3, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4 );

            this.run = new SpriteAnimation( frames, 0 );
            
            this.attack = new SpriteAnimation( frames, 0 );

            this.die = new SpriteAnimation( frames, 0, 3, 2, 1, 0, 3, 2, 1, 0 );
        }
    }
}
