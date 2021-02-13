namespace PixelRPG.Base.AdditionalStuff.Scenes
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using SpineEngine;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;
    using SpineEngine.Graphics;
    using SpineEngine.Graphics.Renderers;
    using SpineEngine.Graphics.ResolutionPolicy;
    using SpineEngine.Maths;

    public class LoadingScene<T> : Scene where T: Scene, new()
    {
        public LoadingScene(List<LoadingData> loadings, int width, int height)
        {
            this.SetDesignResolution(width, height, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(width, height);
            this.AddRenderer(new DefaultRenderer());

            var progress = this.CreateEntity("progress");
            var progressComponent = progress.AddComponent<ProgressComponent>();
            progressComponent.Loadings = loadings;
            progressComponent.TotalItems = loadings.Sum(a => a.Count);
        
            this.AddEntitySystem(new ProgressUpdateSystem());
            this.AddEntitySystem(new ProgressMeshGeneratorSystem());
        }

        public class ProgressComponent : Component
        {
            public int CurrentLoading;
            public List<LoadingData> Loadings;
            public int TotalItems;
            public int CurrentItem;
        }

        public class ProgressUpdateSystem : EntityProcessingSystem
        {
            public ProgressUpdateSystem() : base(new Matcher().All(typeof(ProgressComponent)))
            {
            }

            protected override void DoAction(Entity entity, TimeSpan gameTime)
            {
                base.DoAction(entity, gameTime);
                var progress = entity.GetComponent<ProgressComponent>();
                if (progress.Loadings.Count < progress.CurrentLoading)
                {
                    return;
                }

                if (progress.Loadings.Count == progress.CurrentLoading)
                {
                    progress.CurrentLoading++;
                    Core.Instance.SwitchScene(new T());
                    return;
                }

                var enumerator = progress.Loadings[progress.CurrentLoading].Enumerator;
                if (!enumerator.MoveNext())
                {
                    progress.CurrentLoading++;
                    return;
                }

                progress.CurrentItem++;
            }
        }

        public class ProgressMeshGeneratorSystem : EntityProcessingSystem
        {

            public ProgressMeshGeneratorSystem() : base(new Matcher().All(typeof(ProgressComponent)))
            {
            }

            protected override void DoAction(Entity entity, TimeSpan gameTime)
            {
                base.DoAction(entity, gameTime);
                var progress = entity.GetComponent<ProgressComponent>();
                var finalRender = entity.GetOrCreateComponent<FinalRenderComponent>();

                finalRender.Batch.Clear();

                if(progress.TotalItems == 0)
                {
                    return;
                }

                finalRender.Batch.Draw(
                    Graphic.PixelTexture,
                    new RectangleF(
                        99,
                        Core.Instance.Screen.Height - 101,
                        Core.Instance.Screen.Width - 198,
                        52),
                    Graphic.PixelTexture.Bounds,
                    Color.Black);

                finalRender.Batch.Draw(
                    Graphic.PixelTexture,
                    new RectangleF(
                        100,
                        Core.Instance.Screen.Height - 100,
                        progress.CurrentItem * (Core.Instance.Screen.Width - 200f) / progress.TotalItems,
                        50),
                    Graphic.PixelTexture.Bounds,
                    Color.White);
            }
        }
    }

    public class LoadingData
    {
        public int Count { get; set; }
        public IEnumerator Enumerator { get; set; }
    }
}