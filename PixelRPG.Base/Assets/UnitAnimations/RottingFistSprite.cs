namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Drawable;

    public class RottingFistSprite : UnitAnimation {
    
        public RottingFistSprite(ContentManager content) {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.rotting_fist );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 24, 17 );
        
            this.Idle = new SpriteAnimation( frames, 0, 0, 1 );

            this.Run = new SpriteAnimation( frames, 0, 1 );

            this.Attack = new SpriteAnimation( frames, 0 );

            this.Die = new SpriteAnimation( frames, 0, 2, 3, 4 );
        }
    }
}
