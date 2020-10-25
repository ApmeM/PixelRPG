namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Drawable;

    public class RottingFistSprite : CharSprite {
    
        public RottingFistSprite(ContentManager content) {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.rotting_fist );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 24, 17 );
        
            this.idle = new SpriteAnimation( frames, 0, 0, 1 );

            this.run = new SpriteAnimation( frames, 0, 1 );

            this.attack = new SpriteAnimation( frames, 0 );

            this.die = new SpriteAnimation( frames, 0, 2, 3, 4 );
        }
    }
}
