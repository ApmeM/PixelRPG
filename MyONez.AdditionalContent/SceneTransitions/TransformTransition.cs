namespace MyONez.AdditionalContent.SceneTransitions
{
    using System;
    using System.Collections;

    using Microsoft.Xna.Framework;

    using MyONez.Graphics;
    using MyONez.Graphics.Transitions;
    using MyONez.Maths.Easing;

    public class TransformTransition : SceneTransition
    {
        public enum TransformTransitionType
        {
            ZoomOut,

            ZoomIn,

            SlideRight,

            SlideLeft,

            SlideUp,

            SlideDown,

            SlideBottomRight,

            SlideBottomLeft,

            SlideTopRight,

            SlideTopLeft
        }

        private Rectangle destinationRect;

        public float Duration = 1f;

        private readonly Rectangle finalRenderRect;

        public EaseType TransitionEaseType = EaseType.QuartIn;

        public TransformTransition(TransformTransitionType transitionType = TransformTransitionType.ZoomOut)
        {
            this.destinationRect = this.PreviousSceneRender.Bounds;

            switch (transitionType)
            {
                case TransformTransitionType.ZoomOut:
                    this.finalRenderRect = new Rectangle(
                        Core.Instance.Screen.Width / 2,
                        Core.Instance.Screen.Height / 2,
                        0,
                        0);
                    break;
                case TransformTransitionType.ZoomIn:
                    this.finalRenderRect = new Rectangle(
                        -Core.Instance.Screen.Width * 5,
                        -Core.Instance.Screen.Height * 5,
                        this.destinationRect.Width * 10,
                        this.destinationRect.Height * 10);
                    break;
                case TransformTransitionType.SlideRight:
                    this.finalRenderRect = new Rectangle(
                        Core.Instance.Screen.Width,
                        0,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideLeft:
                    this.finalRenderRect = new Rectangle(
                        -Core.Instance.Screen.Width,
                        0,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideUp:
                    this.finalRenderRect = new Rectangle(
                        0,
                        -Core.Instance.Screen.Height,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideDown:
                    this.finalRenderRect = new Rectangle(
                        0,
                        Core.Instance.Screen.Height,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideBottomRight:
                    this.finalRenderRect = new Rectangle(
                        Core.Instance.Screen.Width,
                        Core.Instance.Screen.Height,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideBottomLeft:
                    this.finalRenderRect = new Rectangle(
                        -Core.Instance.Screen.Width,
                        Core.Instance.Screen.Height,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideTopRight:
                    this.finalRenderRect = new Rectangle(
                        Core.Instance.Screen.Width,
                        -Core.Instance.Screen.Height,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
                case TransformTransitionType.SlideTopLeft:
                    this.finalRenderRect = new Rectangle(
                        -Core.Instance.Screen.Width,
                        -Core.Instance.Screen.Height,
                        this.destinationRect.Width,
                        this.destinationRect.Height);
                    break;
            }
        }

        public override IEnumerator OnBeginTransition()
        {
            yield return null;

            var startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < this.Duration)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                this.destinationRect = Lerps.Ease(
                    this.TransitionEaseType,
                    this.PreviousSceneRender.Bounds,
                    this.finalRenderRect,
                    elapsed,
                    this.Duration);

                yield return null;
            }
            
            this.SetNextScene();

            startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < this.Duration)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                this.destinationRect = Lerps.Ease(
                    this.TransitionEaseType,
                    this.finalRenderRect,
                    this.PreviousSceneRender.Bounds,
                    elapsed,
                    this.Duration);

                yield return null;
            }

            this.TransitionComplete();
        }

        public override void Render()
        {
            this.Batch.Clear();
            this.Batch.Draw(
                this.PreviousSceneRender,
                this.destinationRect,
                this.PreviousSceneRender.Bounds,
                Color.White,
                0);
            this.Material.Effect = this.Effect;

            Graphic.Draw(null, Color.Black, this.Batch, this.Material);
        }
    }
}