namespace PixelRPG.Base.Assets
{
    using MyONez.ECS.EntitySystems.Animation;

    public class CharSprite
    {
        public SpriteAnimation idle { get; protected set; }

        public SpriteAnimation run { get; protected set; }

        public SpriteAnimation attack { get; protected set; }

        public SpriteAnimation die { get; protected set; }
    }
}
