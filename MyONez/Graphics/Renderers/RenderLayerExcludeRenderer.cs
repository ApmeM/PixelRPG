namespace MyONez.Graphics.Renderers
{
    using System.Linq;

    using LocomotorECS;

    using MyONez.ECS.Components;

    /// <summary>
    ///     Renderer that only renders all but one renderLayer. Useful to keep UI rendering separate from the rest of the game
    ///     when used in conjunction
    ///     with a RenderLayerRenderer. Note that UI would most likely want to be rendered in screen space so the camera matrix
    ///     shouldn't be passed to
    ///     Batcher.Begin.
    /// </summary>
    public class RenderLayerExcludeRenderer : Renderer
    {
        public int[] ExcludedRenderLayers;

        public RenderLayerExcludeRenderer(params int[] excludedRenderLayers)
        {
            this.ExcludedRenderLayers = excludedRenderLayers;
        }

        public override bool IsApplicable(Entity entity)
        {
            return !this.ExcludedRenderLayers.Contains(entity.GetComponent<RenderLayerComponent>()?.Layer ?? 0);
        }
    }
}