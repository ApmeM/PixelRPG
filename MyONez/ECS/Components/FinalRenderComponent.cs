namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using MyONez.Graphics.Meshes;

    public class FinalRenderComponent : Component
    {
        public MeshBatch Batch { get; } = new MeshBatch();
    }
}