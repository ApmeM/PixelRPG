namespace PixelRPG.Base.AdditionalStuff.SceneTransitions
{
    using System;
    using System.Collections;

    using Microsoft.Xna.Framework;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine.Graphics.Transitions;
    using SpineEngine.Maths.Easing;
    using SpineEngine.XnaManagers;

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