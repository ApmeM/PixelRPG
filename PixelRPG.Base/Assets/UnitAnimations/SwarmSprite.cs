namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Graphics.Drawable;

    public class SwarmSprite : UnitAnimation
    {
        public SwarmSprite(ContentManager content)
        {
            var texture = content.Load<Texture2D>(ContentPaths.Assets.Enemy.swarm);

            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 16, 16);

            this.Idle = new SpriteAnimation(frames, 0, 1, 2, 3, 4, 5);

            this.Run = new SpriteAnimation(frames, 0, 1, 2, 3, 4, 5);

            this.Attack = new SpriteAnimation(frames, 6, 7, 8, 9);

            this.Die = new SpriteAnimation(frames, 10, 11, 12, 13, 14);
        }
    }
}