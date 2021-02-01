namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class LarvaSprite : UnitAnimation {
    
        public LarvaSprite(ContentManager content) {

        
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.larva );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 8 );

            this.Idle = new SpriteAnimation( frames, 4, 4, 4, 4, 4, 5, 5 );

            this.Run = new SpriteAnimation( frames, 0, 1, 2, 3 );

            this.Attack = new SpriteAnimation( frames, 6, 5, 7 );
        
            this.Die = new SpriteAnimation( frames, 8 );
        }
    }
}
