namespace MyONez.Graphics.Renderers
{
    using System;
    using System.Linq;

    using LocomotorECS;

    using MyONez.ECS.Components;

    /// <summary>
    ///     Renderer that only renders the specified renderLayers. Useful to keep UI rendering separate from the rest of the
    ///     game when used in conjunction
    ///     with other RenderLayerRenderers rendering different renderLayers.
    /// </summary>
    public class RenderLayerRenderer : Renderer
    {
        /// <summary>
        ///     the renderLayers this Renderer will render
        /// </summary>
        public int[] RenderLayers;

        public RenderLayerRenderer(params int[] renderLayers)
        {
            Array.Sort(renderLayers);
            Array.Reverse(renderLayers);
            this.RenderLayers = renderLayers;
        }

        public override bool IsApplicable(Entity entity)
        {
            return this.RenderLayers.Contains(entity.GetComponent<RenderLayerComponent>()?.Layer ?? 0);
        }
    }
}