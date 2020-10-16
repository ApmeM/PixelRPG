namespace MyONez.Graphics
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Materials;
    using MyONez.Graphics.Meshes;

    public class Graphic
    {
        private static Texture2D pixelTexture;

        private static SpriteEffect spriteEffect;

        private static SpriteBatch spriteBatch;

        /// <summary>
        ///     default SamplerState used by Materials. Note that this must be set at launch! Changing it after that time will
        ///     result in only
        ///     Materials created after it was set having the new SamplerState
        /// </summary>
        public static SamplerState DefaultSamplerState = SamplerState.PointClamp;

        /// <summary>
        ///     default wrapped SamplerState. Determined by the Filter of the defaultSamplerState.
        /// </summary>
        /// <value>The default state of the wrapped sampler.</value>
        public static SamplerState DefaultWrappedSamplerState =>
            DefaultSamplerState.Filter == TextureFilter.Point ? SamplerState.PointWrap : SamplerState.LinearWrap;

        /// <summary>
        ///     A subtexture used to draw rectangles, lines, circles, etc.
        ///     Will be generated at startup, but you can replace this with a subtexture from your atlas to reduce texture swaps.
        ///     Should be a 1x1 white pixel
        /// </summary>
        public static Texture2D PixelTexture
        {
            get
            {
                pixelTexture = pixelTexture ?? Core.Instance.Content.Load<Texture2D>(ContentPaths.Textures.pixel);
                return pixelTexture;
            }
        }

        public static SpriteEffect SpriteEffect
        {
            get
            {
                spriteEffect = spriteEffect ?? Core.Instance.Content.Load<Graphics.SpriteEffect>(Graphics.SpriteEffect.EffectAssetName);
                return spriteEffect;
            }
        }

        public static SpriteBatch SpriteBatch
        {
            get
            {
                spriteBatch = spriteBatch ?? new SpriteBatch(Core.Instance.GraphicsDevice);
                return spriteBatch;
            }
        }

        public static void Draw(
            RenderTarget2D finalRenderTarget,
            Color? clearColor,
            MeshBatch batch,
            Material material)
        {
            var graphicsDevice = Core.Instance.GraphicsDevice;
            graphicsDevice.SetRenderTarget(finalRenderTarget);
            if (clearColor != null)
            {
                graphicsDevice.Clear(clearColor.Value);
            }

            // material?.OnPreRender();
#if SPRITE_BATCH
            SpriteBatch.Begin(
                SpriteSortMode.Deferred,
                material?.BlendState ?? BlendState.AlphaBlend,
                material?.SamplerState ?? Graphic.DefaultSamplerState,
                material?.DepthStencilState ?? DepthStencilState.None,
                RasterizerState.CullNone,
                material?.Effect);
#else
            graphicsDevice.BlendState = material?.BlendState ?? BlendState.Opaque;
            graphicsDevice.SamplerStates[0] = material?.SamplerState ?? DefaultSamplerState;
            graphicsDevice.DepthStencilState = material?.DepthStencilState ?? DepthStencilState.None;

            var orthographic = Matrix.CreateOrthographicOffCenter(
                0,
                graphicsDevice.Viewport.Width,
                graphicsDevice.Viewport.Height,
                0,
                0,
                -1);

            SpriteEffect.SetMatrixTransform(ref orthographic);
#endif

            foreach (var mesh in batch.Meshes)
            {
#if SPRITE_BATCH
#else
                SpriteEffect.CurrentTechnique.Passes[0].Apply();

                if (material?.Effect != null)
                {
                    foreach (var pass in material.Effect.CurrentTechnique.Passes)
                    {
                        pass.Apply();
                    }
                }
#endif
                mesh.Draw(SpriteBatch);
            }
#if SPRITE_BATCH
            SpriteBatch.End();
#else
#endif
        }
    }
}