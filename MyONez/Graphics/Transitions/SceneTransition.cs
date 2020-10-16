namespace MyONez.Graphics.Transitions
{
    using System;
    using System.Collections;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS;
    using MyONez.Graphics.Materials;
    using MyONez.Graphics.Meshes;
    using MyONez.Maths.Easing;

    public abstract class SceneTransition
    {
        public Action OnTransitionCompleted;

        protected Effect Effect { get; set; }

        public RenderTarget2D PreviousSceneRender { get; private set; }

        protected MeshBatch Batch = new MeshBatch();

        protected Material Material = new Material
        {
            BlendState = BlendState.NonPremultiplied,
            SamplerState = Graphic.DefaultSamplerState,
            DepthStencilState = DepthStencilState.None
        };

        public Func<Scene> SceneLoadAction;

        protected SceneTransition()
        {
            this.PreviousSceneRender = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                Core.Instance.Screen.Width,
                Core.Instance.Screen.Height,
                false,
                Core.Instance.Screen.BackBufferFormat,
                DepthFormat.None,
                0,
                RenderTargetUsage.PreserveContents);
        }

        protected void SetNextScene()
        {
            Core.Instance.Scene = this.SceneLoadAction();
        }

        public abstract IEnumerator OnBeginTransition();

        public virtual void PreRender()
        {
        }

        public virtual void Render()
        {
            this.Batch.Clear();
            this.Batch.Draw(
                this.PreviousSceneRender,
                this.PreviousSceneRender.Bounds,
                this.PreviousSceneRender.Bounds,
                Color.White,
                0);
            this.Material.Effect = this.Effect;
            Graphic.Draw(null, Color.Black, this.Batch, this.Material);
        }

        protected virtual void TransitionComplete()
        {
            Core.Instance.SceneTransition = null;

            this.PreviousSceneRender?.Dispose();
            this.PreviousSceneRender = null;
            this.OnTransitionCompleted?.Invoke();
        }

        public IEnumerator TickEffectProgressProperty(
            IProgressEffect effect,
            float duration,
            EaseType easeType = EaseType.ExpoOut,
            bool reverseDirection = false)
        {
            var start = reverseDirection ? 1f : 0f;
            var end = reverseDirection ? 0f : 1f;

            var startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < duration)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                var step = Lerps.Ease(easeType, start, end, elapsed, duration);
                effect.Progress = step;

                yield return null;
            }
        }
    }
}