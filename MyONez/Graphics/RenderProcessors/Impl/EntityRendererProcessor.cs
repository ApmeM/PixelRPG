namespace MyONez.Graphics.RenderProcessors.Impl
{
    using System.Collections.Generic;

    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS;
    using MyONez.ECS.Components;
    using MyONez.Graphics.RenderProcessors;
    using MyONez.Graphics.RenderProcessors.Impl.FinalRenderer;

    public class EntityRendererProcessor : RenderProcessor
    {
        private readonly List<Entity> entities;

        private readonly LastState lastState = new LastState();

        private readonly bool postProcessRender;

        private readonly Scene scene;

        private Matrix matrixTransformMatrix;

        public EntityRendererProcessor(bool postProcessRender, Scene scene, List<Entity> entities, int executionOrder)
            : base(executionOrder)
        {
            this.postProcessRender = postProcessRender;
            this.scene = scene;
            this.entities = entities;
        }

        public override void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            base.Render(source, destination);
            var graphicsDevice = Core.Instance.GraphicsDevice;
            var renderers = this.scene.Renderers.GetAll();

            this.lastState.RenderTarget = null;
            this.lastState.RenderTarget2 = null;
            this.lastState.Material = null;
            this.lastState.Camera = null;
#if SPRITE_BATCH
            Graphic.SpriteBatch.Begin();
#else
#endif
            foreach (var renderer in renderers)
            {
                if (renderer.RenderAfterPostProcessors != this.postProcessRender)
                {
                    continue;
                }

                renderer.Begin();

                foreach (var entity in this.entities)
                {
                    if (!entity.Enabled)
                    {
                        continue;
                    }

                    if (!renderer.IsApplicable(entity))
                    {
                        continue;
                    }

                    var finalComponent = entity.GetComponent<FinalRenderComponent>();

                    if (finalComponent.Batch == null)
                    {
                        continue;
                    }

                    var material = renderer.RendererMaterial ?? entity.GetComponent<MaterialComponent>()?.Material;
                    var camera = renderer.RendererCamera ?? entity.GetComponent<CameraComponent>()?.Camera ?? this.scene.Camera;
                    var renderTarget = renderer.RenderTexture ?? destination;
                    var renderTarget2 = renderer.RenderTexture2 == null ? null : (RenderTarget2D)renderer.RenderTexture2;
                    
                    if (this.lastState.RenderTarget != renderTarget || this.lastState.RenderTarget2 != renderTarget2)
                    {
                        this.lastState.RenderTarget = renderTarget;
                        this.lastState.RenderTarget2 = renderTarget2;

                        if (this.lastState.RenderTarget2 == null)
                        {
                            graphicsDevice.SetRenderTarget(this.lastState.RenderTarget);
                        }
                        else
                        {
                            graphicsDevice.SetRenderTargets(this.lastState.RenderTarget, this.lastState.RenderTarget2);
                        }

                        if (!this.postProcessRender)
                        {
                            graphicsDevice.Clear(renderer.RenderTargetClearColor ?? this.scene.ClearColor);
                        }
                    }

                    if (this.lastState.Material != material || this.lastState.Camera != camera)
                    {
                        this.lastState.Material = material;
                        this.lastState.Camera = camera;

                        material?.OnPreRender(camera, entity);
#if SPRITE_BATCH
    Graphic.SpriteBatch.End();
    Graphic.SpriteBatch.Begin(
        SpriteSortMode.Deferred,
        material?.BlendState ?? BlendState.AlphaBlend,
        material?.SamplerState ?? Graphic.DefaultSamplerState,
        material?.DepthStencilState ?? DepthStencilState.None,
        RasterizerState.CullNone,
        material?.Effect,
        camera.TransformMatrix);
#else
                        graphicsDevice.BlendState = material?.BlendState ?? BlendState.AlphaBlend;
                        graphicsDevice.SamplerStates[0] = material?.SamplerState ?? Graphic.DefaultSamplerState;
                        graphicsDevice.DepthStencilState = material?.DepthStencilState ?? DepthStencilState.None;

                        var view = camera.TransformMatrix;
                        var projection = camera.ProjectionMatrix;
                        Matrix.Multiply(ref view, ref projection, out this.matrixTransformMatrix);

                        Graphic.SpriteEffect.SetMatrixTransform(ref this.matrixTransformMatrix);
#endif
                    }

                    foreach (var mesh in finalComponent.Batch.Meshes)
                    {
#if SPRITE_BATCH
#else
                        Graphic.SpriteEffect.CurrentTechnique.Passes[0].Apply();

                        if (material?.Effect != null)
                        {
                            foreach (var pass in material.Effect.CurrentTechnique.Passes)
                            {
                                pass.Apply();
                            }
                        }
#endif
                        mesh.Draw(Graphic.SpriteBatch);
                    }
                }

                renderer.End();
            }
#if SPRITE_BATCH
            Graphic.SpriteBatch.End();
#else
#endif
        }
    }
}