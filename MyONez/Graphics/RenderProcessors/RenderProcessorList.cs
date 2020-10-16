namespace MyONez.Graphics.RenderProcessors
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS;

    public class RenderProcessorList
    {
        private readonly List<RenderProcessor> postProcessors = new List<RenderProcessor>();

        private RenderTarget2D destinationRenderTarget;

        public Scene Scene;

        private RenderTarget2D sourceRenderTarget;

        public RenderProcessorList(Scene scene)
        {
            this.Scene = scene;
        }

        public int Count => this.postProcessors.Count;

        public void NotifyEnd()
        {
            for (var i = 0; i < this.postProcessors.Count; i++)
            {
                this.postProcessors[i].Unload();
            }
        }

        public void NotifyPostProcess(
            RenderTarget2D finalRenderTarget,
            Rectangle finalRenderDestinationRect,
            Rectangle sceneRenderTarget)
        {
            if (this.postProcessors.Count == 0)
            {
                return;
            }

            if (this.destinationRenderTarget == null
                || this.destinationRenderTarget.Bounds.Width != sceneRenderTarget.Width
                || this.destinationRenderTarget.Bounds.Height != sceneRenderTarget.Height)
            {
                this.destinationRenderTarget?.Dispose();
                this.destinationRenderTarget = new RenderTarget2D(
                    Core.Instance.GraphicsDevice,
                    sceneRenderTarget.Width,
                    sceneRenderTarget.Height,
                    false,
                    Core.Instance.Screen.BackBufferFormat,
                    Core.Instance.Screen.PreferredDepthStencilFormat,
                    0,
                    RenderTargetUsage.DiscardContents);
            }

            if (this.sourceRenderTarget == null || this.sourceRenderTarget.Bounds.Width != sceneRenderTarget.Width
                                                || this.sourceRenderTarget.Bounds.Height != sceneRenderTarget.Height)
            {
                this.sourceRenderTarget?.Dispose();
                this.sourceRenderTarget = new RenderTarget2D(
                    Core.Instance.GraphicsDevice,
                    sceneRenderTarget.Width,
                    sceneRenderTarget.Height,
                    false,
                    Core.Instance.Screen.BackBufferFormat,
                    Core.Instance.Screen.PreferredDepthStencilFormat,
                    0,
                    RenderTargetUsage.DiscardContents);
            }

            for (var i = 0; i < this.postProcessors.Count - 1; i++)
            {
                if (!this.postProcessors[i].Enabled)
                {
                    continue;
                }

                this.postProcessors[i].Render(this.sourceRenderTarget, this.destinationRenderTarget);
                var tmpRenderTarget = this.sourceRenderTarget;
                this.sourceRenderTarget = this.destinationRenderTarget;
                this.destinationRenderTarget = tmpRenderTarget;
            }

            this.postProcessors[this.postProcessors.Count - 1].Render(this.sourceRenderTarget, finalRenderTarget);
        }

        public void Add(RenderProcessor renderProcessor)
        {
            this.postProcessors.Add(renderProcessor);
            this.postProcessors.Sort();
            renderProcessor.OnAddedToScene(this.Scene);
        }

        public void Remove(RenderProcessor step)
        {
            this.postProcessors.Remove(step);
        }

        public T Get<T>()
            where T : RenderProcessor
        {
            for (var i = 0; i < this.postProcessors.Count; i++)
            {
                if (this.postProcessors[i] is T)
                    return this.postProcessors[i] as T;
            }

            return null;
        }

        public ReadOnlyCollection<RenderProcessor> GetAll()
        {
            return new ReadOnlyCollection<RenderProcessor>(this.postProcessors);
        }

        public void NotifyUpdate(TimeSpan gameTime)
        {

            for (var i = 0; i < this.postProcessors.Count; i++)
            {
                this.postProcessors[i].Update(gameTime);
            }
        }
    }
}