namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class LarvaSprite : CharSprite {
    
        public LarvaSprite(ContentManager content) {

        
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.larva );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 8 );

            this.idle = new SpriteAnimation( frames, 4, 4, 4, 4, 4, 5, 5 );

            this.run = new SpriteAnimation( frames, 0, 1, 2, 3 );

            this.attack = new SpriteAnimation( frames, 6, 5, 7 );
        
            this.die = new SpriteAnimation( frames, 8 );
        }
    }
}
