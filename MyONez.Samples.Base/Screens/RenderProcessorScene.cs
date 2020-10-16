namespace MyONez.Samples.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using FaceUI.Entities;

    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.FaceUI.ECS.Components;
    using MyONez.AdditionalContent.RenderProcessors;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.RenderProcessors;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Samples.Base.Utils;

    #endregion

    [SampleScene("Render Processors Scene", "Scene that shows different render processors.")]
    public class RenderProcessorScene : BaseScene
    {
        public RenderProcessorScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.BestFit);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new RenderLayerExcludeRenderer(ScreenSpaceRenderLayer));

            var entity = this.CreateEntity("ui");
            var ui = entity.AddComponent<UIComponent>().UserInterface;
            var panel = new Panel(new Vector2(600, -1), PanelSkin.None);
            ui.AddEntity(panel);
            foreach (var renderProcessor in this.GetPostProcessors())
            {
                var checkBox = new CheckBox(renderProcessor.GetType().Name);
                panel.AddChild(checkBox);
                checkBox.OnClick += butt =>
                {
                    if (checkBox.Checked)
                    {
                        this.AddRenderProcessor(renderProcessor);
                    }
                    else
                    {
                        this.RemoveRenderProcessor(renderProcessor);
                    }
                };
            }
        }

        private IEnumerable<RenderProcessor> GetPostProcessors()
        {
            yield return new BloomRenderProcessor(1);
            yield return new GaussianBlurRenderProcessor(1);
            yield return new HeatDistortionRenderProcessor(1);
            yield return new PixelGlitchRenderProcessor(1);
            yield return new PixelMosaicRenderProcessor(1);
            yield return new ScanlinesRenderProcessor(1);
            yield return new VignetteRenderProcessor(1);
        }
    }
}