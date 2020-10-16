namespace MyONez.AdditionalContent.RenderProcessors
{
    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.Effects;
    using MyONez.ECS;
    using MyONez.Graphics.RenderProcessors;

    public class PixelGlitchRenderProcessor : RenderProcessor<PixelGlitchEffect>, IScreenResolutionChangedListener
    {
        private float horizontalOffset = 10f;

        private float verticalSize = 5f;

        public PixelGlitchRenderProcessor(int executionOrder)
            : base(executionOrder)
        {
        }

        public float VerticalSize
        {
            get => this.verticalSize;
            set
            {
                if (this.verticalSize == value)
                {
                    return;
                }

                this.verticalSize = value;

                if (this.TypedEffect != null)
                    this.TypedEffect.VerticalSize = this.verticalSize;
            }
        }

        public float HorizontalOffset
        {
            get => this.horizontalOffset;
            set
            {
                if (this.horizontalOffset == value)
                {
                    return;
                }

                this.horizontalOffset = value;

                if (this.TypedEffect != null)
                    this.TypedEffect.HorizontalOffset = this.horizontalOffset;
            }
        }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            this.TypedEffect.ScreenSize = new Vector2(sceneRenderTarget.Width, sceneRenderTarget.Height);
        }

        public override void OnAddedToScene(Scene scene)
        {
            this.TypedEffect = scene.Content.Load<PixelGlitchEffect>(PixelGlitchEffect.EffectAssetName);
            this.TypedEffect.VerticalSize = this.verticalSize;
            this.TypedEffect.HorizontalOffset = this.horizontalOffset;
            this.TypedEffect.ScreenSize = new Vector2(Core.Instance.Screen.Width, Core.Instance.Screen.Height);
        }
    }
}