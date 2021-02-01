namespace PixelRPG.Base.Assets.UnitAnimations
{
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.ECS.EntitySystems.Animation;
    using SpineEngine.Graphics.Drawable;

    public class HeroSprite : UnitAnimation {
    
        public HeroSprite(ContentManager content, string heroType, int heroLevel)
        {
            var texture = content.Load<Texture2D>(heroType);
            var frames = SubtextureDrawable.SubtexturesFromAtlas(texture, 12, 15);

            const int LevelSize = 21;

            this.Idle = new SpriteAnimation(frames, 0 + heroLevel * LevelSize, 0 + heroLevel * LevelSize, 0 + heroLevel * LevelSize, 1 + heroLevel * LevelSize, 0 + heroLevel * LevelSize, 0 + heroLevel * LevelSize, 1 + heroLevel * LevelSize, 1 + heroLevel * LevelSize);

            this.Run = new SpriteAnimation(frames, 2 + heroLevel * LevelSize, 3 + heroLevel * LevelSize, 4 + heroLevel * LevelSize, 5 + heroLevel * LevelSize, 6 + heroLevel * LevelSize, 7 + heroLevel * LevelSize);

            this.Attack = new SpriteAnimation(frames, 13 + heroLevel * LevelSize, 14 + heroLevel * LevelSize, 15 + heroLevel * LevelSize, 0 + heroLevel * LevelSize);

            this.Die = new SpriteAnimation(frames, 8 + heroLevel * LevelSize, 9 + heroLevel * LevelSize, 10 + heroLevel * LevelSize, 11 + heroLevel * LevelSize, 12 + heroLevel * LevelSize, 11 + heroLevel * LevelSize);
            
            var operate = new SpriteAnimation(frames, 16 + heroLevel * LevelSize, 17 + heroLevel * LevelSize, 16 + heroLevel * LevelSize, 17 + heroLevel * LevelSize);
        
            var read = new SpriteAnimation(frames, 19 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 20 + heroLevel * LevelSize, 19 + heroLevel * LevelSize);
        }
    }
}
