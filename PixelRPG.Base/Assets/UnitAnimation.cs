namespace PixelRPG.Base.Assets
{
    using MyONez.ECS.EntitySystems.Animation;

    public class UnitAnimation
    {
        public SpriteAnimation Idle { get; protected set; }

        public SpriteAnimation Run { get; protected set; }

        public SpriteAnimation Attack { get; protected set; }

        public SpriteAnimation Die { get; protected set; }
    }
}
