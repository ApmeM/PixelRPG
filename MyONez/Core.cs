namespace MyONez
{
    using System;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Debug;
    using MyONez.ECS;
    using MyONez.GlobalManagers;
    using MyONez.GlobalManagers.Coroutines;
    using MyONez.GlobalManagers.Timers;
    using MyONez.GlobalManagers.Tweens;
    using MyONez.Graphics.Transitions;
    using MyONez.XnaManagers;

    public class Core : Game
    {
        public static Core Instance;

        private readonly GlobalManagerList globalManagerList = new GlobalManagerList();

        private Timer graphicsDeviceChangeTimer;

        private Scene nextScene;

        private Scene scene;

        public bool PauseOnFocusLost = true;


        public Core(
            int width = 1280,
            int height = 720,
            bool isFullScreen = false,
            string windowTitle = "MyONez",
            string contentDirectory = "Content")
        {
#if DEBUG
            this.windowTitle = windowTitle;
#endif

            Instance = this;

            this.Screen = new GlobalGraphicsDeviceManager(this)
            {
                PreferredBackBufferWidth = width,
                PreferredBackBufferHeight = height,
                IsFullScreen = isFullScreen,
                SynchronizeWithVerticalRetrace = false,
                PreferredDepthStencilFormat = DepthFormat.None
            };
            this.Screen.DeviceReset += this.OnGraphicsDeviceReset;
            this.Window.ClientSizeChanged += this.OnGraphicsDeviceReset;
            this.Window.OrientationChanged += this.OnGraphicsDeviceReset;

            this.Content = new GlobalContentManager { RootDirectory = contentDirectory };
            this.IsMouseVisible = true;
            this.IsFixedTimeStep = false;
            this.TargetElapsedTime = new TimeSpan(0, 0, 0, 0, 16);

            // setup systems
            this.globalManagerList.Add(new CoroutineGlobalManager());
            this.globalManagerList.Add(new TweenGlobalManager());
            this.globalManagerList.Add(new TimerGlobalManager());
        }

        public GlobalGraphicsDeviceManager Screen { get; }
        
        protected void OnGraphicsDeviceReset(object sender, EventArgs e)
        {
            if (this.graphicsDeviceChangeTimer != null)
            {
                this.graphicsDeviceChangeTimer.Reset();
            }
            else
            {
                this.GetGlobalManager<TimerGlobalManager>().Schedule(
                    0.05f,
                    false,
                    t =>
                    {
                        this.graphicsDeviceChangeTimer = null;
                        this.scene?.OnGraphicsDeviceReset();
                        this.nextScene?.OnGraphicsDeviceReset();
                    });
            }
        }
        
#if DEBUG
        private TimeSpan frameCounterElapsedTime = TimeSpan.Zero;

        private int frameCounter;

        private readonly string windowTitle;
#endif

        #region Game overides

        protected override void Update(GameTime gameTime)
        {
            if (this.PauseOnFocusLost && !this.IsActive)
            {
                this.SuppressDraw();
                return;
            }

            this.globalManagerList.NotifyUpdate(gameTime);

            this.scene?.Update(gameTime);

            if (this.scene != this.nextScene)
            {
                this.scene?.End();

                this.scene = this.nextScene;
#if !Bridge
                GC.Collect();
#endif

                this.scene?.Begin();
                this.scene?.Update(gameTime);
            }
        }

        protected override void Draw(GameTime gameTime)
        {
            if (this.PauseOnFocusLost && !this.IsActive)
                return;

#if DEBUG
            // fps counter
            this.frameCounter++;
            this.frameCounterElapsedTime += gameTime.ElapsedGameTime;
            if (this.frameCounterElapsedTime >= TimeSpan.FromSeconds(1))
            {
#if !Bridge
                var totalMemory = (GC.GetTotalMemory(false) / 1048576f).ToString("F");
#else
                var totalMemory = string.Empty;
#endif

                this.Window.Title =
                    $"{this.windowTitle} {this.frameCounter} fps - {totalMemory} MB - {this.frameCounterElapsedTime.TotalSeconds / this.frameCounter}";
                this.frameCounter = 0;
                this.frameCounterElapsedTime -= TimeSpan.FromSeconds(1);
            }
#endif

            this.SceneTransition?.PreRender();
            this.scene?.Render(this.SceneTransition?.PreviousSceneRender);
            this.SceneTransition?.Render();
        }

        #endregion

        #region Scene switching

        internal Scene Scene
        {
            get => this.scene;
            set => this.nextScene = value;
        }

        internal SceneTransition SceneTransition;

        public void SwitchScene(Scene newScene)
        {
            var transition = new QuickTransition();
            this.SwitchScene(newScene, transition);
        }

        public void SwitchScene(Scene newScene, SceneTransition transition)
        {
            transition.SceneLoadAction = () => newScene;
            this.SwitchScene(transition);
        }

        public void SwitchScene(SceneTransition transition)
        {
            Assert.IsNull(
                this.SceneTransition,
                "You cannot start a new SceneTransition until the previous one has completed");

            if (transition.SceneLoadAction == null)
            {
                transition.SceneLoadAction = () => this.scene;
            }

            this.SceneTransition = transition;

            this.GetGlobalManager<CoroutineGlobalManager>().StartCoroutine(this.SceneTransition.OnBeginTransition());
        }

        #endregion

        #region Global Managers

        public void AddGlobalManager(GlobalManager manager)
        {
            this.globalManagerList.Add(manager);
        }

        public void RemoveGlobalManager(GlobalManager manager)
        {
            this.globalManagerList.Remove(manager);
        }

        public T GetGlobalManager<T>()
            where T : GlobalManager
        {
            return this.globalManagerList.GetGlobalManager<T>();
        }

        #endregion
    }
}