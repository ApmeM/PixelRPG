namespace MyONez.AdditionalContent.Materials
{
    using LocomotorECS;

    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.Effects;
    using MyONez.Graphics;
    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Materials;
    using MyONez.Graphics.Renderers;

    public class ReflectionMaterial : Material<ReflectionEffect>
    {
        private RenderTarget2D renderTarget;

        public RenderTexture RenderTexture;

        public ReflectionMaterial(RenderLayerRenderer reflectionRenderer)
            : base(Core.Instance.Content.Load<ReflectionEffect>(ReflectionEffect.EffectAssetName))
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
        }
    }
}