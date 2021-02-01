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
            progressComponent.Total = loadings.Sum(a => a.Count);
        
            this.AddEntitySystem(new LoadElementUpdateSystem(loadings, progressComponent));
            this.AddEntitySystem(new ProgressMeshGeneratorSystem());
        }

        public class ProgressComponent : Component
        {
            public int Current;

            public int Total;
        }

        public class LoadElementUpdateSystem : EntitySystem
        {
            private readonly List<LoadingData> loadings;

            private readonly ProgressComponent progress;

            private int currentLoading;

            public LoadElementUpdateSystem(List<LoadingData> loadings, ProgressComponent progress)
            {
                this.loadings = loadings;
                this.progress = progress;
            }

            public override void DoAction(TimeSpan gameTime)
            {
                base.DoAction(gameTime);
                if (this.loadings.Count == this.currentLoading)
                {
                    Core.Instance.SwitchScene(new T());
                    return;
                }

                var enumerator = this.loadings[this.currentLoading].Enumerator;
                if (!enumerator.MoveNext())
                {
                    this.currentLoading++;
                    return;
                }

                this.progress.Current++;
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
                        progress.Current * (Core.Instance.Screen.Width - 200f) / progress.Total,
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