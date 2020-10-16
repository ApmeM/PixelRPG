namespace MyONez.Samples.Base.Screens
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.RenderProcessors;
    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens;
    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Graphics;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Maths;
    using MyONez.Maths.Easing;
    using MyONez.Samples.Base.Utils;

    [SampleScene(
        "Sprite Lights",
        "Old-school 2D blended lighting\nPlay with the controls to change the effect and add lights")]
    public class SpriteLightsScene : BaseScene
    {
        public const int SpriteLightRenderLayer = 50;

        public const int UIRenderLayer = 1;

        private bool sceneUnloaded;

        public SpriteLightsScene()
        {
            // setup screen that fits our map
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.ShowAll);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new RenderLayerRenderer(UIRenderLayer)).RenderAfterPostProcessors = true;
            this.AddRenderer(new RenderLayerExcludeRenderer(SpriteLightRenderLayer));
            var lightRenderer = this.AddRenderer(new RenderLayerRenderer(SpriteLightRenderLayer));
            lightRenderer.RenderTexture = new RenderTexture();
            lightRenderer.RenderTargetClearColor = Color.White;

            this.AddRenderProcessor(new SpriteLightRenderProcessor(0, lightRenderer.RenderTexture));
            this.AddRenderProcessor(new ScanlinesRenderProcessor(0));

            var bg = this.Content.Load<Texture2D>(ContentPaths.SpriteLights.bg);
            var bgEntity = this.CreateEntity("bg");
            bgEntity.AddComponent<PositionComponent>().Position = Core.Instance.Screen.Center;
            bgEntity.AddComponent(new SpriteComponent(bg));
            bgEntity.AddComponent<ScaleComponent>().Scale = new Vector2(9.4f);

            var moonTex = this.Content.Load<Texture2D>(ContentPaths.SpriteLights.moon);
            var entity = this.CreateEntity("moon");
            entity.AddComponent(new SpriteComponent(moonTex));
            entity.AddComponent<PositionComponent>().Position = new Vector2(
                Core.Instance.Screen.Width / 4f,
                Core.Instance.Screen.Height / 8f);

            var lightTex = this.Content.Load<Texture2D>(ContentPaths.SpriteLights.spritelight);
            var pixelLightTex = this.Content.Load<Texture2D>(ContentPaths.SpriteLights.pixelspritelight);

            this.AddSpriteLight(lightTex, new Vector2(50, 50), 2);
            this.AddSpriteLight(lightTex, Core.Instance.Screen.Center, 3);
            this.AddSpriteLight(lightTex, new Vector2(Core.Instance.Screen.Width - 100, 150), 2);
            this.AddSpriteLight(pixelLightTex, Core.Instance.Screen.Center + new Vector2(200, 10), 10);
            this.AddSpriteLight(pixelLightTex, Core.Instance.Screen.Center - new Vector2(200, 10), 13);
            this.AddSpriteLight(pixelLightTex, Core.Instance.Screen.Center + new Vector2(10, 200), 8);
        }

        private void AddSpriteLight(Texture2D texture, Vector2 position, float scale)
        {
            // random target to tween towards that is on screen
            var target = new Vector2(
                Random.Range(50, this.SceneRenderTarget.Width - 100),
                Random.Range(50, this.SceneRenderTarget.Height - 100));

            var entity = this.CreateEntity();
            entity.AddComponent(new SpriteComponent(texture));
            var entityPos = entity.AddComponent<PositionComponent>();
            entityPos.Position = position;
            entity.AddComponent<ScaleComponent>().Scale = new Vector2(scale);
            entity.AddComponent<RenderLayerComponent>().Layer = SpriteLightRenderLayer;

            if (Random.Chance(50))
            {
                entity.AddComponent<ColorComponent>().Color = Random.NextColor();
                var cycler = entity.AddComponent(new ColorCyclerComponent());
                cycler.WaveFunction = (ColorCyclerComponent.WaveFunctions)Random.Range(0, 5);
                cycler.Offset = Random.NextFloat();
                cycler.Frequency = Random.Range(0.6f, 1.5f);
                cycler.Phase = Random.NextFloat();
            }
            else
            {
                var tween = entityPos.TweenTo(target, 2);
                tween.CompletionHandler = this.LightTweenCompleted;
                Core.Instance.GetGlobalManager<TweenGlobalManager>().StartTween(tween);
            }
        }

        public override void OnEnd()
        {
            this.sceneUnloaded = true;
            base.OnEnd();
        }

        private void LightTweenCompleted(ITween<Vector2> tween)
        {
            if (this.sceneUnloaded)
            {
                return;
            }

            // get a random point on screen and a random delay for the tweens
            var target = new Vector2(
                Random.Range(50, this.SceneRenderTarget.Width - 100),
                Random.Range(50, this.SceneRenderTarget.Height - 100));
            var delay = Random.Range(0f, 1f);

            var transform = (PositionComponent)tween.Target;
            var nextTween = transform.TweenTo(target, 2);
            nextTween.CompletionHandler = this.LightTweenCompleted;
            nextTween.Delay = delay;
            Core.Instance.GetGlobalManager<TweenGlobalManager>().StartTween(nextTween);

            // every so often add a scale tween
            if (Random.Chance(60))
            {
                var scale = transform.Entity.GetComponent<ScaleComponent>();
                var scaleTween = scale.TweenTo(scale.Scale * 1.2f, 1);
                scaleTween.LoopType = LoopType.PingPong;
                scaleTween.EaseType = EaseType.CubicIn;
                scaleTween.Delay = delay;
                Core.Instance.GetGlobalManager<TweenGlobalManager>().StartTween(scaleTween);
            }

            // every so often change our color
            if (Random.Chance(80))
            {
                var color = transform.Entity.GetOrCreateComponent<ColorComponent>();
                var colorTween = color.TweenTo(Random.NextColor(), 2f);
                colorTween.Delay = delay;
                Core.Instance.GetGlobalManager<TweenGlobalManager>().StartTween(colorTween);
            }
        }
    }
}