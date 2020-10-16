namespace MyONez.AdditionalContent.Materials
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.Effects;
    using MyONez.Graphics;
    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Materials;
    using MyONez.Graphics.Renderers;

    public class WaterReflectionMaterial : Material<WaterReflectionEffect>
    {
        private RenderTarget2D renderTarget;

        public RenderTexture RenderTexture;

        public WaterReflectionMaterial(RenderLayerRenderer reflectionRenderer)
            : base(Core.Instance.Content.Load<WaterReflectionEffect>(ReflectionEffect.EffectAssetName))
        {
            this.RenderTexture = reflectionRenderer.RenderTexture;
        }

        public override void OnPreRender(Camera camera, Entity entity)
        {
            base.OnPreRender(camera, entity);
            if (this.renderTarget == null || this.renderTarget != this.RenderTexture.RenderTarget)
            {
                this.renderTarget = this.RenderTexture.RenderTarget;
                this.TypedEffect.RenderTexture = this.RenderTexture.RenderTarget;
            }

            this.TypedEffect.MatrixTransform = camera.ViewProjectionMatrix;
            this.TypedEffect.CurrentTechnique = this.TypedEffect.Techniques["WaterReflectionTechnique"];
        }

        public override void Update(TimeSpan gameTime)
        {
            base.Update(gameTime);
            this.TypedEffect.Time = (float)gameTime.TotalSeconds;
        }
    }
}