namespace MyONez.ECS.Components
{
    using LocomotorECS;

    public class RenderLayerComponent : Component
    {
        public RenderLayerComponent()
        {
        }

        public RenderLayerComponent(int layer)
        {
            this.Layer = layer;
        }

        public int Layer { get; set; }
    }
}