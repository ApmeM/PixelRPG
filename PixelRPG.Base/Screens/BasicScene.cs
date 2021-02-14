namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using SpineEngine.ECS;
    using SpineEngine.Graphics.Renderers;
    using SpineEngine.Graphics.ResolutionPolicy;
    using SpineEngine;
    using PixelRPG.Base.AdditionalStuff.FaceUI.ECS.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components;
    using FaceUI.Entities;
    using Microsoft.Xna.Framework;

    #endregion

    public class BasicScene : Scene
    {
        public BasicScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new DefaultRenderer());

            this.AddEntitySystem(new UIUpdateSystem(Core.Instance.Content));

            var uiEntity = this.CreateEntity("UI");
            var ui = uiEntity.AddComponent<UIComponent>();
            ui.UserInterface.ShowCursor = false;

            var panel = new Panel(new Vector2(500, 500));
            panel.AddChild(new Label("Server"));
            panel.AddChild(new Label("Total Players"));
            var totalPlayersCount = new TextInput { Value = "2" };
            panel.AddChild(totalPlayersCount);
#if !Bridge
            panel.AddChild(new Label("Local Players"));
            var localPlayersCount = new TextInput { Value = "1" };
            panel.AddChild(localPlayersCount);
#endif
            panel.AddChild(new Button("Start")).OnClick =
                (b) => Core.Instance.SwitchScene(new GameScene(new GameSceneConfig
                {
                    IsServer = true,
#if !Bridge
                    ClientsCount = int.Parse(localPlayersCount.Value),
#else
                    ClientsCount = int.Parse(totalPlayersCount.Value),
#endif
                    TotalPlayers = int.Parse(totalPlayersCount.Value)
                }));

            panel.AddChild(new Label("Client"));
            panel.AddChild(new Label("Network Players"));
            var networkPlayersCount = new TextInput { Value = "1" };
            panel.AddChild(networkPlayersCount);
            panel.AddChild(new Button("Start")).OnClick =
                (b) => Core.Instance.SwitchScene(new GameScene(new GameSceneConfig
                {
                    IsServer = false,
                    ClientsCount = int.Parse(networkPlayersCount.Value)
                }));

            ui.UserInterface.AddEntity(panel);
        }
    }
}