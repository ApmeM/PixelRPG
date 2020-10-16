namespace MyONez.ECS
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;

    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Debug;
    using MyONez.ECS.EntitySystems;
    using MyONez.Graphics;
    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.RenderProcessors;
    using MyONez.Graphics.RenderProcessors.Impl;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.XnaManagers;

    public class Scene
    {
        /// <summary>
        ///     Scene-specific ContentManager. Use it to load up any resources that are needed only by this scene. If you have
        ///     global/multi-scene resources you can use Core.contentManager to load them.
        /// </summary>
        public readonly GlobalContentManager Content;

        public Camera Camera;

        public Color ClearColor = Color.CornflowerBlue;

        internal readonly RendererList Renderers;

        private readonly EntityList entities;

        private readonly EntitySystemList entitySystems;

        private readonly EntitySystemList entitySystemsRender;

        private readonly RenderProcessorList renderProcessors;

        private readonly List<IScreenResolutionChangedListener> screenResolutionChangedListeners = new List<IScreenResolutionChangedListener>();

        private bool didSceneBegin;

        public Scene()
        {
            this.Content = new GlobalContentManager();
            this.Camera = new Camera();
            this.entities = new EntityList();
            this.entitySystems = new EntitySystemList(this.entities);
            this.Renderers = new RendererList();
            this.renderProcessors = new RenderProcessorList(this);

            this.AddEntitySystem(new InputMouseUpdateSystem());
            this.AddEntitySystem(new InputTouchUpdateSystem());
            this.AddEntitySystem(new InputGamePadUpdateSystem());
            this.AddEntitySystem(new InputKeyboardUpdateSystem());
            this.AddEntitySystem(new InputVirtualUpdateSystem());
            this.AddEntitySystem(new FollowCursorUpdateSystem(this));
            this.AddEntitySystem(new CursorOverMouseSpriteUpdateSystem(this));
            this.AddEntitySystem(new CursorOverTouchSpriteUpdateSystem());
            this.AddEntitySystem(new ColorCyclerUpdateSystem());
            this.AddEntitySystem(new FollowCameraUpdateSystem());
            this.AddEntitySystem(new CameraShakeUpdateSystem());
            this.AddEntitySystem(new MaterialEffectUpdateSystem());
            this.AddEntitySystem(new AnimationSpriteUpdateSystem());
            this.AddEntitySystem(new SpriteMeshGeneratorSystem());

            this.AddEntitySystemExecutionOrder<InputMouseUpdateSystem, InputVirtualUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputTouchUpdateSystem, InputVirtualUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputGamePadUpdateSystem, InputVirtualUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputKeyboardUpdateSystem, InputVirtualUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputMouseUpdateSystem, FollowCursorUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputTouchUpdateSystem, FollowCursorUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputMouseUpdateSystem, CursorOverMouseSpriteUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputTouchUpdateSystem, CursorOverTouchSpriteUpdateSystem>();
            this.AddEntitySystemExecutionOrder<AnimationSpriteUpdateSystem, SpriteMeshGeneratorSystem>();

            var renderCollectionUpdateSystem = new RenderCollectionUpdateSystem();
            this.entitySystemsRender = new EntitySystemList(this.entities);
            this.entitySystemsRender.Add(renderCollectionUpdateSystem);

            this.AddRenderProcessor(new EntityRendererProcessor(false, this, renderCollectionUpdateSystem.Entities, -1));
            this.AddRenderProcessor(new EntityRendererProcessor(true, this, renderCollectionUpdateSystem.Entities, int.MaxValue - 2));
            this.AddRenderProcessor(new ScreenShotRenderProcessor(int.MaxValue - 1));
            this.AddRenderProcessor(new FinalRenderRenderProcessor(Graphic.DefaultSamplerState, int.MaxValue));

            // setup our resolution policy. we'll commit it in begin
            this.resolutionPolicy = defaultSceneResolutionPolicy;
            this.DesignResolutionSize = defaultDesignResolutionSize;
        }

        #region Utils

        /// <summary>
        ///     after the next draw completes this will clone the backbuffer and call callback with the clone.
        ///     Note that you must dispose of the Texture2D when done with it!
        /// </summary>
        /// <param name="callback">Callback.</param>
        public void RequestScreenshot(Action<Texture2D> callback)
        {
            var screenShotPostProcessor = this.renderProcessors.Get<ScreenShotRenderProcessor>();
            screenShotPostProcessor.Enabled = true;
            screenShotPostProcessor.Action = tex =>
            {
                screenShotPostProcessor.Action = null;
                screenShotPostProcessor.Enabled = false;

                callback(tex);
            };
        }

        #endregion

        #region default SceneResolutionPolicy

        private static Point defaultDesignResolutionSize;

        private static SceneResolutionPolicy defaultSceneResolutionPolicy = SceneResolutionPolicy.None;

        public static void SetDefaultDesignResolution(
            int width,
            int height,
            SceneResolutionPolicy sceneResolutionPolicy)
        {
            defaultDesignResolutionSize = new Point(width, height);
            defaultSceneResolutionPolicy = sceneResolutionPolicy;
        }

        #endregion

        #region SceneResolutionPolicy

        private SceneResolutionPolicy resolutionPolicy;

        public Point DesignResolutionSize { get; private set; }

        protected Rectangle FinalRenderDestinationRect { get; private set; }

        protected Rectangle SceneRenderTarget { get; private set; }

        public void SetDesignResolution(
            int width,
            int height,
            SceneResolutionPolicy sceneResolutionPolicy)
        {
            this.DesignResolutionSize = new Point(width, height);
            this.resolutionPolicy = sceneResolutionPolicy;
            this.UpdateResolutionScaler();
        }

        private void UpdateResolutionScaler()
        {
            this.FinalRenderDestinationRect = this.resolutionPolicy.GetFinalRenderDestinationRect(
                Core.Instance.Screen.Width,
                Core.Instance.Screen.Height,
                this.DesignResolutionSize);

            this.SceneRenderTarget = this.resolutionPolicy.GetRenderTargetRect(
                Core.Instance.Screen.Width,
                Core.Instance.Screen.Height,
                this.DesignResolutionSize);

            // notify the Renderers, PostProcessors and FinalRenderDelegate of the change in render texture size
            foreach (var listener in this.screenResolutionChangedListeners)
            {
                listener.SceneBackBufferSizeChanged(this.FinalRenderDestinationRect, this.SceneRenderTarget);
            }

            this.Camera.OnSceneRenderTargetSizeChanged(this.SceneRenderTarget);
        }

        #endregion

        #region Scene lifecycle

        /// <summary>
        ///     override this in Scene subclasses. this will be called when Core sets this scene as the active scene.
        /// </summary>
        public virtual void OnStart()
        {
        }

        /// <summary>
        ///     override this in Scene subclasses and do any unloading necessary here. this is called when Core removes this scene
        ///     from the active slot.
        /// </summary>
        public virtual void OnEnd()
        {
        }

        internal void Begin()
        {
            Assert.IsFalse(
                this.Renderers.Count == 0,
                "Scene has begun with no renderer. At least one renderer must be present before beginning a scene.");

            this.UpdateResolutionScaler();

            this.entitySystems.NotifyBegin();
            this.entitySystemsRender.NotifyBegin();

            this.entities.CommitChanges();

            this.didSceneBegin = true;
            this.OnStart();
        }

        internal void End()
        {
            this.OnEnd();
            this.didSceneBegin = false;

            this.Renderers.NotifyEnd();
            this.renderProcessors.NotifyEnd();

            this.Camera = null;
            this.Content.Dispose();

            this.entitySystems.NotifyEnd();
            this.entitySystemsRender.NotifyEnd();
        }

        public virtual void Update(GameTime gameTime)
        {
            this.entitySystems?.NotifyDoAction(gameTime.ElapsedGameTime);
            this.renderProcessors.NotifyUpdate(gameTime.ElapsedGameTime);
            this.entities.CommitChanges();
            this.entitySystemsRender.NotifyDoAction(gameTime.ElapsedGameTime);
        }

        internal void Render(RenderTarget2D finalRenderTarget)
        {
            this.renderProcessors.NotifyPostProcess(
                finalRenderTarget,
                this.FinalRenderDestinationRect,
                this.SceneRenderTarget);
        }

        public virtual void OnGraphicsDeviceReset()
        {
            this.UpdateResolutionScaler();
        }

        #endregion

        #region Renderer Management

        /// <summary>
        ///     adds a Renderer to the scene
        /// </summary>
        /// <returns>The renderer.</returns>
        public T AddRenderer<T>(T renderer)
            where T : Renderer
        {
            this.Renderers.Add(renderer);

            if (renderer is IScreenResolutionChangedListener listener)
            {
                this.screenResolutionChangedListeners.Add(listener);
                if (this.didSceneBegin)
                {
                    listener.SceneBackBufferSizeChanged(this.FinalRenderDestinationRect, this.SceneRenderTarget);
                }
            }

            return renderer;
        }

        /// <summary>
        ///     gets the first Renderer of Type T
        /// </summary>
        /// <returns>The renderer.</returns>
        /// <typeparam name="T">The 1st type parameter.</typeparam>
        public T GetRenderer<T>()
            where T : Renderer
        {
            return this.Renderers.Get<T>();
        }

        /// <summary>
        ///     removes the Renderer from the scene
        /// </summary>
        public void RemoveRenderer(Renderer renderer)
        {
            this.Renderers.Remove(renderer);
            if (renderer is IScreenResolutionChangedListener listener)
            {
                this.screenResolutionChangedListeners.Remove(listener);
            }
        }

        #endregion

        #region RenderProcessor Management

        public T AddRenderProcessor<T>(T postProcessor)
            where T : RenderProcessor
        {
            this.renderProcessors.Add(postProcessor);

            if (postProcessor is IScreenResolutionChangedListener listener)
            {
                this.screenResolutionChangedListeners.Add(listener);
                if (this.didSceneBegin)
                {
                    listener.SceneBackBufferSizeChanged(this.FinalRenderDestinationRect, this.SceneRenderTarget);
                }
            }

            return postProcessor;
        }

        public T GetRenderProcessor<T>()
            where T : RenderProcessor
        {
            return this.renderProcessors.Get<T>();
        }

        public ReadOnlyCollection<RenderProcessor> GetRenderProcessors()
        {
            return this.renderProcessors.GetAll();
        }

        public void RemoveRenderProcessor(RenderProcessor renderProcessor)
        {
            this.renderProcessors.Remove(renderProcessor);

            if (renderProcessor is IScreenResolutionChangedListener listener)
            {
                this.screenResolutionChangedListeners.Remove(listener);
            }
        }

        #endregion

        #region Entity Management

        /// <summary>
        ///     add the Entity to this Scene, and return it
        /// </summary>
        /// <returns></returns>
        public Entity CreateEntity(string name = null)
        {
            var entity = new Entity(name);
            return this.AddEntity(entity);
        }

        /// <summary>
        ///     adds an Entity to the Scene's Entities list
        /// </summary>
        /// <param name="entity">The Entity to add</param>
        public Entity AddEntity(Entity entity)
        {
            this.entities.Add(entity);
            return entity;
        }

        /// <summary>
        ///     adds an Entity to the Scene's Entities list
        /// </summary>
        /// <param name="entity">The Entity to add</param>
        public Entity RemoveEntity(Entity entity)
        {
            this.entities.Remove(entity);
            return entity;
        }

        /// <summary>
        ///     searches for and returns the first Entity with name
        /// </summary>
        /// <returns>The entity.</returns>
        /// <param name="name">Name.</param>
        public Entity FindEntity(string name)
        {
            return this.entities.FindEntityByName(name);
        }

        /// <summary>
        ///     returns all entities with the given tag
        /// </summary>
        /// <returns>The entities by tag.</returns>
        /// <param name="tag">Tag.</param>
        public List<Entity> FindEntitiesWithTag(int tag)
        {
            return this.entities.FindEntitiesByTag(tag);
        }

        #endregion

        #region Entity System Processors

        public EntitySystem AddEntitySystem(EntitySystem processor)
        {
            this.entitySystems.Add(processor);

            if (processor is IScreenResolutionChangedListener listener)
            {
                this.screenResolutionChangedListeners.Add(listener);
                if (this.didSceneBegin)
                {
                    listener.SceneBackBufferSizeChanged(this.FinalRenderDestinationRect, this.SceneRenderTarget);
                }
            }

            return processor;
        }

        public void RemoveEntityProcessor(EntitySystem processor)
        {
            this.entitySystems.Remove(processor);

            if (processor is IScreenResolutionChangedListener listener)
            {
                this.screenResolutionChangedListeners.Remove(listener);
            }
        }

        public void AddEntitySystemExecutionOrder<TBefore, TAfter>()
            where TBefore : EntitySystem where TAfter : EntitySystem
        {
            this.entitySystems.AddExecutionOrder<TBefore, TAfter>();
        }

        public void RemoveEntitySystemExecutionOrder<TBefore, TAfter>()
            where TBefore : EntitySystem where TAfter : EntitySystem
        {
            this.entitySystems.RemoveExecutionOrder<TBefore, TAfter>();
        }

        public T GetEntityProcessor<T>()
            where T : EntitySystem
        {
            return this.entitySystems.Get<T>();
        }

        #endregion
    }
}