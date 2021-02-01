namespace PixelRPG.Base.AdditionalStuff.RenderProcessors
{
    using Microsoft.Xna.Framework;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine.ECS;
    using SpineEngine.Graphics;
    using SpineEngine.Graphics.RenderProcessors;

    /// <summary>
    ///     post processor to assist with making blended sprite lights. Usage is as follows:
    ///     - render all sprite lights with a separate Renderer to a RenderTarget. The clear color of the Renderer is your ambient light color.
    ///     - render all normal objects in standard fashion
    ///     - add this PostProcessor with the RenderTarget from your lights Renderer
    /// </summary>
    public class SpriteLightRenderProcessor : RenderProcessor<SpriteLightMultiplyEffect>, IScreenResolutionChangedListener
    {
        private readonly RenderTexture lightsRenderTexture;

        private float multiplicativeFactor = 1f;

        public SpriteLightRenderProcessor(int executionOrder, RenderTexture lightsRenderTexture)
            : base(executionOrder)
        {
            this.lightsRenderTexture = lightsRenderTexture;
        }

        public float MultiplicativeFactor
        {
            get => this.multiplicativeFactor;
            set
            {
                if (this.TypedEffect != null)
                {
                    this.TypedEffect.MultiplicativeFactor = value;
                }
                this.multiplicativeFactor = value;
            }
        }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.TypedEffect.LightTexture = this.lightsRenderTexture;
        }

        public override void OnAddedToScene(Scene scene)
        {
            this.TypedEffect = scene.Content.Load<SpriteLightMultiplyEffect>(SpriteLightMultiplyEffect.EffectAssetName);
            this.TypedEffect.LightTexture = this.lightsRenderTexture;
            this.TypedEffect.MultiplicativeFactor = this.multiplicativeFactor;
        }
    }
}