namespace PixelRPG.Base.ECS.Components
{
    using LocomotorECS;

    using PixelRPG.Base.Assets;

    public class UnitComponent: Component
    {
        public UnitAnimation UnitAnimations { get; set; }

        public UnitState State { get; set; }
    }
}