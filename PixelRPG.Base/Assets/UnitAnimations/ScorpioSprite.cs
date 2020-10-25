namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ScorpioSprite : CharSprite {
        public ScorpioSprite(ContentManager content) {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.scorpio );
        
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 18, 17 );
        
            this.idle = new SpriteAnimation( frames, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 2 );

            this.run = new SpriteAnimation( frames, 5, 5, 6, 6 );

            this.attack = new SpriteAnimation( frames, 0, 3, 4 );

            this.die = new SpriteAnimation( frames, 0, 7, 8, 9, 10 );
        }
    }
}
