namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using MyONez.Graphics.Materials;

    public class MaterialComponent : Component
    {
        public Material Material;

        public MaterialComponent()
        {
            this.Material = new Material();
        }

        public MaterialComponent(Material material)
        {
            this.Material = material;
        }
    }
}