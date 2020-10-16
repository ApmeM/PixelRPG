namespace MyONez.Samples.Base.Screens
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using FaceUI;
    using FaceUI.Entities;

    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.FaceUI.ECS.Components;
    using MyONez.AdditionalContent.FaceUI.ECS.EntitySystems;
    using MyONez.AdditionalContent.SceneTransitions;
    using MyONez.ECS;
    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens;
    using MyONez.Graphics.Renderers;
    using MyONez.Samples.Base.Utils;

    public abstract class BaseScene : Scene
    {
        public const int ScreenSpaceRenderLayer = 100;

        public BaseScene()
        {
            this.AddEntitySystem(new UIUpdateSystem(Core.Instance.Content));
            this.AddRenderer(new RenderLayerRenderer(ScreenSpaceRenderLayer) { RenderAfterPostProcessors = true });
            var entity = this.CreateEntity("basic-ui");
            entity.AddComponent<RenderLayerComponent>().Layer = ScreenSpaceRenderLayer;
            entity.AddComponent<ScaleComponent>().Scale = Vector2.One * 0.7f;
            var ui = entity.AddComponent<UIComponent>().UserInterface;
            var panel = new Panel(new Vector2(300, 1000), anchor: Anchor.CenterRight);
            ui.AddEntity(panel);
            UserInterface.TimeToShowTooltipText = 0.5f;
            // find every Scene with the SampleSceneAttribute and create a button for each one
            foreach (var type in GetTypesWithSampleSceneAttribute())
            {
                var sampleAttr = type.Item2;
                var button = new Button(sampleAttr.ButtonName);
                panel.AddChild(button);
                button.OnClick += butt =>
                {
                    // stop all tweens in case any demo scene started some up
                    Core.Instance.GetGlobalManager<TweenGlobalManager>().StopAllTweens();
                    Core.Instance.SwitchScene(new FadeTransition
                    {
                        SceneLoadAction = () => Activator.CreateInstance(type.Item1) as Scene
                    });
                };

                // optionally add instruction text for the current scene
                if (sampleAttr.InstructionText != null)
                {
                    button.ToolTipText = sampleAttr.InstructionText;
                }
            }


            // add exit button
            var exitBtn = new Button("Exit", anchor: Anchor.BottomCenter);
            exitBtn.OnClick = butt => { Core.Instance.Exit(); };
            panel.AddChild(exitBtn);
        }


        private IEnumerable<Tuple<Type, SampleSceneAttribute>> GetTypesWithSampleSceneAttribute()
        {
            var assembly = typeof(SampleSceneAttribute).Assembly;
            var scenes = assembly.GetTypes()
                .Select(
                    t => new Tuple<Type, SampleSceneAttribute>(
                        t,
                        (SampleSceneAttribute)t.GetCustomAttributes(typeof(SampleSceneAttribute), true)
                            .FirstOrDefault())).Where(t => t.Item2 != null).OrderBy(t => t.Item1.Name);

            foreach (var s in scenes)
                yield return s;
        }
    }
}