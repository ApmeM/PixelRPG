namespace PixelRPG.Base.AdditionalStuff.SceneTransitions
{
    using System;
    using System.Collections;

    using Microsoft.Xna.Framework;

    using SpineEngine.GlobalManagers.Coroutines;
    using SpineEngine.Graphics;
    using SpineEngine.Graphics.Transitions;
    using SpineEngine.Maths.Easing;

    public class FadeTransition : SceneTransition
    {
        public float DelayBeforeFadeInDuration = 0.2f;

        public EaseType FadeEaseType = EaseType.Linear;

        public float FadeInDuration = 0.8f;

        public float FadeOutDuration = 0.8f;

        public Color FadeToColor = Color.Black;

        private Color fromColor = Color.White;

        private Color toColor = Color.Transparent;

        private Color color;

        public override IEnumerator OnBeginTransition()
        {
            var startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < this.FadeOutDuration)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                this.color = Lerps.Ease(
                    this.FadeEaseType,
                    ref this.fromColor,
                    ref this.toColor,
                    elapsed,
                    this.FadeOutDuration);

                yield return null;
            }

            this.SetNextScene();

            yield return DefaultCoroutines.Wait(this.DelayBeforeFadeInDuration);

            startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < this.FadeInDuration)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                this.color = Lerps.Ease(
                    EaseHelper.OppositeEaseType(this.FadeEaseType),
                    ref this.toColor,
                    ref this.fromColor,
                    elapsed,
                    this.FadeInDuration);

                yield return null;
            }

            this.TransitionComplete();
        }

        public override void Render()
        {
            this.Batch.Clear();
            this.Batch.Draw(
                this.PreviousSceneRender,
                this.PreviousSceneRender.Bounds,
                this.PreviousSceneRender.Bounds,
                this.color,
                0);

            this.Material.Effect = this.Effect;

            Graphic.Draw(null, Color.Black, this.Batch, this.Material);
        }
    }
}