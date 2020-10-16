namespace MyONez.Graphics.RenderProcessors
{
    using System;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS;
    using MyONez.Graphics.Materials;
    using MyONez.Graphics.Meshes;

    /// <summary>
    ///     Post Processing step for rendering actions after everything done.
    /// </summary>
    public class RenderProcessor : IComparable<RenderProcessor>
    {
        /// <summary>
        ///     specifies the order in which the Renderers will be called by the scene
        /// </summary>
        public readonly int ExecutionOrder;

        /// <summary>
        ///     BlendState used by the DrawFullScreenQuad method
        /// </summary>
        public BlendState BlendState = BlendState.Opaque;

        /// <summary>
        ///     The effect used to render with
        /// </summary>
        public Effect Effect;

        /// <summary>
        ///     Step is Enabled or not.
        /// </summary>
        public bool Enabled;

        /// <summary>
        ///     SamplerState used for the drawFullscreenQuad method
        /// </summary>
        public SamplerState SamplerState = Graphic.DefaultSamplerState;

        protected MeshBatch Batch = new MeshBatch();

        protected readonly Material Material = new Material();

        public RenderProcessor(int executionOrder, Effect effect = null)
        {
            this.Enabled = true;
            this.ExecutionOrder = executionOrder;
            this.Effect = effect;
        }

        public int CompareTo(RenderProcessor other)
        {
            return this.ExecutionOrder.CompareTo(other.ExecutionOrder);
        }

        /// <summary>
        ///     called when the PostProcessor is added to the scene. The scene field is not valid until this is called
        /// </summary>
        public virtual void OnAddedToScene(Scene scene)
        {
        }

        /// <summary>
        ///     this is the meat method here. The source passed in contains the full scene with any previous PostProcessors
        ///     rendering. Render it into the destination RenderTarget. The drawFullScreenQuad methods are there to make
        ///     the process even easier. The default implementation renders source into destination with effect.
        ///     Note that destination might have a previous render! If your PostProcessor Effect is discarding you should clear
        ///     the destination before writing to it!
        /// </summary>
        public virtual void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            this.DrawFullScreenQuad(source, destination);
        }

        public virtual void Update(TimeSpan gameTime)
        {

        }

        /// <summary>
        ///     called when a scene is ended. use this for cleanup.
        /// </summary>
        public virtual void Unload()
        {
        }

        /// <summary>
        ///     helper for drawing a texture into a render target, optionally using a custom shader to apply postprocessing effects.
        /// </summary>
        protected void DrawFullScreenQuad(Texture2D texture, RenderTarget2D renderTarget, Effect effect = null)
        {
            this.Material.Effect = effect ?? this.Effect;
            this.Material.BlendState = this.BlendState;
            this.Material.SamplerState = this.SamplerState;
            this.Material.DepthStencilState = DepthStencilState.None;

            this.Batch.Clear();
            this.Batch.Draw(texture, renderTarget.Bounds, texture.Bounds, Color.White, 0);
            Graphic.Draw(renderTarget, Color.Black, this.Batch, this.Material);
        }
    }
}