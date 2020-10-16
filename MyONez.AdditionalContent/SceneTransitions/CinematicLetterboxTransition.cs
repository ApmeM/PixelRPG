namespace MyONez.AdditionalContent.SceneTransitions
{
    using System;
    using System.Collections;

    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.Effects;
    using MyONez.Graphics.Transitions;
    using MyONez.Maths.Easing;
    using MyONez.XnaManagers;

    public class CinematicLetterboxTransition : SceneTransition
    {
        private readonly GlobalContentManager tmpContentManager = new GlobalContentManager();

        public float Duration { get; set; } = 2;

        public CinematicLetterboxTransition()
        {
            this.Effect = this.tmpContentManager.Load<LetterboxEffect>(LetterboxEffect.EffectAssetName);
        }

        public Color Color
        {
            get => ((LetterboxEffect)this.Effect).Color;
            set => ((LetterboxEffect)this.Effect).Color = value;
        }

        public float LetterboxSize
        {
            get => ((LetterboxEffect)this.Effect).LetterboxSize;
            set => ((LetterboxEffect)this.Effect).LetterboxSize = value;
        }

        public override IEnumerator OnBeginTransition()
        {
            var startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < this.Duration / 2)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                this.LetterboxSize = Lerps.Ease(EaseType.ExpoIn, 0, this.PreviousSceneRender.Bounds.Height, elapsed, this.Duration / 2);
                yield return null;
            }

            this.SetNextScene();

            startAt = DateTime.Now;
            while ((DateTime.Now - startAt).TotalSeconds < this.Duration / 2)
            {
                var elapsed = (float)(DateTime.Now - startAt).TotalSeconds;
                this.LetterboxSize = Lerps.Ease(EaseType.ExpoOut, this.PreviousSceneRender.Bounds.Height, 0, elapsed, this.Duration / 2);
                yield return null;
            }

            this.TransitionComplete();

            // cleanup
            this.tmpContentManager.Unload();
        }
    }
}