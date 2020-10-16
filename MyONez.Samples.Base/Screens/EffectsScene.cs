namespace MyONez.Samples.Base.Screens
{
    #region Using Directives

    using System.Collections;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.Effects;
    using MyONez.AdditionalContent.RenderProcessors;
    using MyONez.ECS.Components;
    using MyONez.Graphics;
    using MyONez.Graphics.Drawable;
    using MyONez.Graphics.Materials;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.RenderProcessors.Impl;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Samples.Base.Utils;

    using Random = MyONez.Maths.Random;

    #endregion

    [SampleScene("Effects Scene", "Scene that show additional content effects")]
    public class EffectsScene : BaseScene
    {
        public EffectsScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            var reflectionRenderer = new RenderLayerRenderer(0)
            {
                RenderTargetClearColor = Color.Transparent,
                RenderTexture = new RenderTexture(1, 1),
                RenderOrder = -1
            };

            this.AddRenderer(reflectionRenderer);
            this.AddRenderer(new RenderLayerRenderer(1));

            var moonTex = this.Content.Load<Texture2D>(ContentPaths.Basic.moon);
            var playerEntity = this.CreateEntity("original");
            playerEntity.AddComponent<PositionComponent>().Position = new Vector2(moonTex.Width / 2, moonTex.Height / 2);
            playerEntity.AddComponent(new SpriteComponent(moonTex));
            playerEntity.AddComponent(new RenderOrderComponent()).Order = -1;

            var primitiveDrawable = new PrimitiveDrawable(Color.Black);

            var border = this.CreateEntity();
            border.AddComponent<ScaleComponent>().Scale = new Vector2(moonTex.Width, 4);
            border.AddComponent<PositionComponent>().Position = new Vector2(moonTex.Width / 2, 2);
            border.AddComponent<SpriteComponent>().Drawable = primitiveDrawable;

            border = this.CreateEntity();
            border.AddComponent<ScaleComponent>().Scale = new Vector2(moonTex.Width, 4);
            border.AddComponent<PositionComponent>().Position = new Vector2(moonTex.Width / 2, moonTex.Height - 2);
            border.AddComponent<SpriteComponent>().Drawable = primitiveDrawable;

            border = this.CreateEntity();
            border.AddComponent<ScaleComponent>().Scale = new Vector2(4, moonTex.Height);
            border.AddComponent<PositionComponent>().Position = new Vector2(2, moonTex.Height / 2);
            border.AddComponent<SpriteComponent>().Drawable = primitiveDrawable;

            border = this.CreateEntity();
            border.AddComponent<ScaleComponent>().Scale = new Vector2(4, moonTex.Height);
            border.AddComponent<PositionComponent>().Position = new Vector2(moonTex.Width - 2, moonTex.Height / 2);
            border.AddComponent<SpriteComponent>().Drawable = primitiveDrawable;


            var drawable = new SubtextureDrawable(reflectionRenderer.RenderTexture, 0, 0, moonTex.Width, moonTex.Height);

            var tv = this.CreateEntity();
            tv.AddComponent<SpriteComponent>().Drawable = drawable;
            tv.AddComponent<PositionComponent>().Position = new Vector2(moonTex.Width / 2 + 5, moonTex.Height / 2 + 5);
            tv.AddComponent<RenderLayerComponent>().Layer = 1;

            var startx = 1;
            var starty = 0;

            foreach (var effect in this.GetEffects())
            {
                tv = this.CreateEntity();
                tv.AddComponent<SpriteComponent>().Drawable = drawable;
                tv.AddComponent<PositionComponent>().Position = new Vector2(moonTex.Width / 2 + 5 + startx * 150, moonTex.Height / 2 + 5 + starty * 200);
                tv.AddComponent<MaterialComponent>().Material = new Material(){Effect = effect};
                tv.AddComponent<RenderLayerComponent>().Layer = 1;

                startx++;
                if (startx == 6)
                {
                    startx = 0;
                    starty++;
                }
            }
        }

        public IEnumerable<Effect> GetEffects()
        {
            yield return this.Content.Load<BevelsEffect>(BevelsEffect.EffectAssetName);
            //yield return this.Content.Load<BloomCombineEffect>(BloomCombineEffect.EffectAssetName);
            //yield return this.Content.Load<BloomExtractEffect>(BloomExtractEffect.EffectAssetName);
            yield return this.Content.Load<CrosshatchEffect>(CrosshatchEffect.EffectAssetName);
            //yield return this.Content.Load<DeferredLightingEffect>(DeferredLightingEffect.EffectAssetName);
            //yield return this.Content.Load<DeferredSpriteEffect>(DeferredSpriteEffect.EffectAssetName);
            //yield return this.Content.Load<DissolveEffect>(DissolveEffect.EffectAssetName);
            yield return this.Content.Load<DotsEffect>(DotsEffect.EffectAssetName);
            //yield return this.Content.Load<ForwardLightingEffect>(ForwardLightingEffect.EffectAssetName);
            //yield return this.Content.Load<GaussianBlurEffect>(GaussianBlurEffect.EffectAssetName);
            yield return this.Content.Load<GrayscaleEffect>(GrayscaleEffect.EffectAssetName);
            var heatDistortionEffect = this.Content.Load<HeatDistortionEffect>(HeatDistortionEffect.EffectAssetName);
            heatDistortionEffect.DistortionFactor = 0.02f;
            heatDistortionEffect.RiseFactor = 0.5f;
            heatDistortionEffect.DistortionTexture = this.Content.Load<Texture2D>(AdditionalContent.ContentPaths.Textures.heatDistortionNoise);
            yield return heatDistortionEffect;
            yield return this.Content.Load<InvertEffect>(InvertEffect.EffectAssetName);
            var letterboxEffect = this.Content.Load<LetterboxEffect>(LetterboxEffect.EffectAssetName);
            letterboxEffect.Color = Color.Black;
            letterboxEffect.LetterboxSize = 50;
            yield return letterboxEffect;
            //yield return this.Content.Load<MultiTextureEffect>(MultiTextureEffect.EffectAssetName);
            yield return this.Content.Load<MultiTextureOverlayEffect>(MultiTextureOverlayEffect.EffectAssetName);
            yield return this.Content.Load<NoiseEffect>(NoiseEffect.EffectAssetName);
            //yield return this.Content.Load<PaletteCyclerEffect>(PaletteCyclerEffect.EffectAssetName);
            var pixelGlitchEffect = this.Content.Load<PixelGlitchEffect>(PixelGlitchEffect.EffectAssetName);
            pixelGlitchEffect.VerticalSize = 1;
            pixelGlitchEffect.HorizontalOffset = 1;
            pixelGlitchEffect.ScreenSize = new Vector2(128, 128);
            yield return pixelGlitchEffect;
            //yield return this.Content.Load<PolygonLightEffect>(PolygonLightEffect.EffectAssetName);
            //yield return this.Content.Load<ReflectionEffect>(ScanlinesEffect.EffectAssetName);
            yield return this.Content.Load<ScanlinesEffect>(ScanlinesEffect.EffectAssetName);
            yield return this.Content.Load<SepiaEffect>(SepiaEffect.EffectAssetName);
            //yield return this.Content.Load<SpriteAlphaTestEffect>(SpriteAlphaTestEffect.EffectAssetName);
            //yield return this.Content.Load<SpriteBlinkEffect>(SpriteBlinkEffect.EffectAssetName);
            //yield return this.Content.Load<SpriteLightMultiplyEffect>(SpriteLightMultiplyEffect.EffectAssetName);
            yield return this.Content.Load<SpriteLinesEffect>(SpriteLinesEffect.EffectAssetName);
            var squaresEffect = this.Content.Load<SquaresEffect>(SquaresEffect.EffectAssetName);
            squaresEffect.Color = Color.Transparent;
            squaresEffect.Progress = 0.6f;
            yield return squaresEffect;
            var textureWipeEffect = this.Content.Load<TextureWipeEffect>(TextureWipeEffect.EffectAssetName);
            textureWipeEffect.Opacity = 1;
            textureWipeEffect.Texture = this.Content.Load<Texture2D>(AdditionalContent.ContentPaths.Textures.TextureWipeTransition.angular);
            textureWipeEffect.Progress = 0.01f;
            yield return textureWipeEffect;
            //yield return this.Content.Load<TwistEffect>(TwistEffect.EffectAssetName);
            var vignetteEffect = this.Content.Load<VignetteEffect>(VignetteEffect.EffectAssetName);
            vignetteEffect.Power = 1;
            vignetteEffect.Radius = 1;
            yield return vignetteEffect;
            var windEffect = this.Content.Load<WindEffect>(WindEffect.EffectAssetName);
            windEffect.Progress = 0.1f;
            windEffect.Size = 0.1f;
            windEffect.Segments = 1000;
            yield return windEffect;
        }
    }
}