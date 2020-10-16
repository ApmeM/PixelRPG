namespace MyONez.Samples.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;
    using System.Linq;

    using FaceUI.Entities;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.FaceUI.ECS.Components;
    using MyONez.ECS.Components;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Samples.Base.Utils;

    #endregion

    [SampleScene("Resolution policies Scene", "Scene that shows different resolution policies.")]
    public class ResolutionPoliciesScene : BaseScene
    {
        public ResolutionPoliciesScene()
        {
            this.SetDesignResolution(800, 800, SceneResolutionPolicy.BestFit);
            Core.Instance.Screen.SetSize(800, 800);

            this.AddRenderer(new RenderLayerExcludeRenderer(ScreenSpaceRenderLayer));

            var moonTex = this.Content.Load<Texture2D>(ContentPaths.Basic.moon);
            var playerEntity = this.CreateEntity("player");
            playerEntity.AddComponent<PositionComponent>().Position = Core.Instance.Screen.Center + new Vector2(0, 200);
            playerEntity.AddComponent(new SpriteComponent(moonTex));
            playerEntity.AddComponent(new ScaleComponent()).Scale = Vector2.One * 0.7f;

            var entity = this.CreateEntity("ui");
            entity.AddComponent(new ScaleComponent()).Scale = Vector2.One * 0.7f;
            var ui = entity.AddComponent<UIComponent>().UserInterface;
            var panel = new Panel(new Vector2(500, -1), PanelSkin.None);
            ui.AddEntity(panel);
            var dropDown = new DropDown();
            panel.AddChild(dropDown);
            var dict = this.GetResolutionPolicies().ToDictionary(a => a.Item1, a => a.Item2);
            foreach (var policy in dict)
            {
                dropDown.AddItem(policy.Key);
            }

            dropDown.SelectedValue = "BestFit";
            panel.AddChild(
                new Button("Apply")
                {
                    OnClick = button =>
                    {
                        var policy = dict[dropDown.SelectedValue];
                        this.SetDesignResolution(800, 800, policy);
                    }
                });
            panel.AddChild(new Button("Reset screen size") { OnClick = button => { Core.Instance.Screen.SetSize(800, 800); } });
        }

        private IEnumerable<(string, SceneResolutionPolicy)> GetResolutionPolicies()
        {
            yield return ("None", SceneResolutionPolicy.None);
            yield return ("Stretch", SceneResolutionPolicy.Stretch);
            yield return ("ExactFit", SceneResolutionPolicy.ExactFit);
            yield return ("NoBorder", SceneResolutionPolicy.NoBorder);
            yield return ("NoBorderPixelPerfect", SceneResolutionPolicy.NoBorderPixelPerfect);
            yield return ("ShowAll", SceneResolutionPolicy.ShowAll);
            yield return ("ShowAllPixelPerfect", SceneResolutionPolicy.ShowAllPixelPerfect);
            yield return ("FixedHeight", SceneResolutionPolicy.FixedHeight);
            yield return ("FixedHeightPixelPerfect", SceneResolutionPolicy.FixedHeightPixelPerfect);
            yield return ("FixedWidth", SceneResolutionPolicy.FixedWidth);
            yield return ("FixedWidthPixelPerfect", SceneResolutionPolicy.FixedWidthPixelPerfect);
            ((BestFitSceneResolutionPolicy)SceneResolutionPolicy.BestFit).BleedSize = new Point(123, 321);
            yield return ("BestFit", SceneResolutionPolicy.BestFit);
        }
    }
}