namespace MyONez.Samples.Base.Screens
{
    #region Using Directives

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.Components;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Samples.Base.Utils;

    #endregion

    [SampleScene("Basic Scene", "Scene with a single Entity. The minimum to have something to show")]
    public class BasicScene : BaseScene
    {
        public BasicScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new RenderLayerExcludeRenderer(ScreenSpaceRenderLayer));

            var moonTex = this.Content.Load<Texture2D>(ContentPaths.Basic.moon);
            var playerEntity = this.CreateEntity();
            playerEntity.AddComponent<PositionComponent>().Position = Core.Instance.Screen.Center;
            playerEntity.AddComponent<RotateComponent>().Rotation = 0.1f;
            playerEntity.AddComponent<ScaleComponent>().Scale = new Vector2(0.5f, 1);
            playerEntity.AddComponent(new SpriteComponent(moonTex));

            playerEntity = this.CreateEntity();
            playerEntity.AddComponent<PositionComponent>().Position = Core.Instance.Screen.Center;
            playerEntity.AddComponent(new SpriteComponent(moonTex));
            playerEntity.AddComponent<RenderOrderComponent>().Order = -1;
        }
    }
}