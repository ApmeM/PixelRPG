namespace MyONez.AdditionalContent.RenderProcessors
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.Effects;
    using MyONez.ECS;
    using MyONez.Graphics;
    using MyONez.Graphics.Materials;
    using MyONez.Graphics.RenderProcessors;

    public class PixelMosaicRenderProcessor : RenderProcessor<MultiTextureOverlayEffect>, IScreenResolutionChangedListener
    {
        public Color CellColor = new Color(0x808080);

        private int lastMosaicScale = -1;

        private RenderTarget2D mosaicRenderTex;

        private Texture2D mosaicTexture;

        private Material tmpMaterial = new Material { SamplerState = SamplerState.PointWrap };

        public PixelMosaicRenderProcessor(int executionOrder)
            : base(executionOrder)
        {
        }

        public Scene Scene { get; set; }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            var screenWidth = realRenderTarget.Width;
            var screenHeight = realRenderTarget.Height;

            var screenAspectRatio = screenWidth / (float)screenHeight;
            var designSize = this.Scene.DesignResolutionSize;

            var pixelPerfectScale = 1;
            if (designSize.X / (float)designSize.Y > screenAspectRatio)
            {
                pixelPerfectScale = screenWidth / designSize.X;
            }
            else
                pixelPerfectScale = screenHeight / designSize.Y;

            if (pixelPerfectScale == 0)
                pixelPerfectScale = 1;

            if (this.lastMosaicScale != pixelPerfectScale)
            {
                this.CreateMosaicTexture(50 * pixelPerfectScale);
                this.lastMosaicScale = pixelPerfectScale;
            }

            this.mosaicRenderTex?.Dispose();
            this.mosaicRenderTex = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                sceneRenderTarget.Width * pixelPerfectScale,
                sceneRenderTarget.Height * pixelPerfectScale,
                false,
                Core.Instance.Screen.BackBufferFormat,
                DepthFormat.None,
                0,
                RenderTargetUsage.PreserveContents);

            this.Batch.Clear();
            this.Batch.Draw(
                this.mosaicTexture,
                this.mosaicRenderTex.Bounds,
                this.mosaicRenderTex.Bounds,
                Color.White,
                0);

            Graphic.Draw(this.mosaicRenderTex, Color.Black, this.Batch, this.tmpMaterial);

            this.TypedEffect.SecondTexture = this.mosaicRenderTex;
        }

        public override void OnAddedToScene(Scene scene)
        {
            base.OnAddedToScene(scene);
            this.Scene = scene;
            this.Effect = this.Scene.Content.Load<MultiTextureOverlayEffect>(MultiTextureOverlayEffect.EffectAssetName);
        }

        private void CreateMosaicTexture(int size)
        {
            this.mosaicTexture?.Dispose();

            this.mosaicTexture = new Texture2D(Core.Instance.GraphicsDevice, size, size);
            var colors = new uint[size * size];

            for (var i = 0; i < colors.Length; i++)
                colors[i] = this.CellColor.PackedValue;

            colors[0] = 0xffffffff;
            colors[size * size - 1] = 0xff000000;

            for (var x = 1; x < size - 1; x++)
            {
                colors[x * size] = 0xffE0E0E0;
                colors[x * size + 1] = 0xffffffff;
                colors[x * size + size - 1] = 0xff000000;
            }

            for (var y = 1; y < size - 1; y++)
            {
                colors[y] = 0xffffffff;
                colors[(size - 1) * size + y] = 0xff000000;
            }

            this.mosaicTexture.SetData(colors);
        }

        public override void Unload()
        {
            base.Unload();
            this.mosaicTexture.Dispose();
            this.mosaicRenderTex.Dispose();
        }
    }
}