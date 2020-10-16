namespace MyONez.Graphics.Renderers
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using MyONez.ECS;
    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Materials;

    public abstract class Renderer : IComparable<Renderer>, IScreenResolutionChangedListener
    {
        /// <summary>
        ///     material that is renderer specific. If set - all other materials will be ignored.
        /// </summary>
        public Material RendererMaterial { get; set; }

        /// <summary>
        ///     camera that is renderer specific. If set - all other cameras will be ignored
        /// </summary>
        public Camera RendererCamera { get; set; }

        /// <summary>
        ///     specifies the order in which the Renderers will be called by the scene
        /// </summary>
        public int RenderOrder { get; set; }

        /// <summary>
        ///     if RenderTexture is not null this renderer will render into the RenderTarget instead of to the screen
        /// </summary>
        public RenderTexture RenderTexture { get; set; }

        /// <summary>
        ///     if RenderTexture2 is not null - it will be used in SetRenderTargets method with RenderTexture as a first parameter.
        /// </summary>
        public RenderTexture RenderTexture2 { get; set; }

        /// <summary>
        ///     if renderTarget is not null this Color will be used to clear the screen
        /// </summary>
        public Color? RenderTargetClearColor { get; set; }

        /// <summary>
        ///     if true, the Scene will call the render method AFTER all PostProcessors have finished. Renderer should NOT have a
        ///     renderTexture.
        ///     The main reason for this type of Renderer  is so that you can render your UI without post processing on top of the
        ///     rest of your Scene.
        ///     The ScreenSpaceRenderer is an example Renderer that sets this to true;
        /// </summary>
        public bool RenderAfterPostProcessors { get; set; }

        public int CompareTo(Renderer other)
        {
            if (ReferenceEquals(this, other)) return 0;
            if (ReferenceEquals(null, other)) return 1;
            return this.RenderOrder.CompareTo(other.RenderOrder);
        }

        public virtual void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.RenderTexture?.OnSceneBackBufferSizeChanged(sceneRenderTarget.Width, sceneRenderTarget.Height);
            this.RenderTexture2?.OnSceneBackBufferSizeChanged(sceneRenderTarget.Width, sceneRenderTarget.Height);
        }

        public virtual void Begin()
        {
        }

        public virtual void End()
        {
        }

        public abstract bool IsApplicable(Entity entity);
    }
}