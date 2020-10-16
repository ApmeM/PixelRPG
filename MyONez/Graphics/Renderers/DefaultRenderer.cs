namespace MyONez.Graphics.Renderers
{
    using LocomotorECS;

    public class DefaultRenderer : Renderer
    {
        public override bool IsApplicable(Entity entity)
        {
            return true;
        }
    }
}