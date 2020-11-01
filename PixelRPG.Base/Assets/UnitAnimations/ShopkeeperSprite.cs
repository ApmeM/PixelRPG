namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class ShopkeeperSprite : UnitAnimation {
    
        public ShopkeeperSprite(ContentManager content) {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Neutral.shopkeeper );
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 14, 14 );
        
            this.Idle = new SpriteAnimation(frames, 1, 1, 1, 1, 1, 0, 0, 0, 0 );

            this.Die = new SpriteAnimation(frames, 0);
            this.Run = new SpriteAnimation(frames, 0);
            this.Attack = new SpriteAnimation(frames, 0);
        }
    }
}
