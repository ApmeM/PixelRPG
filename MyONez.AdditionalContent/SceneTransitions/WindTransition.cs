namespace MyONez.AdditionalContent.SceneTransitions
{
    using System.Collections;

    using MyONez.AdditionalContent.Effects;
    using MyONez.Graphics.Transitions;
    using MyONez.Maths.Easing;
    using MyONez.XnaManagers;

    public class WindTransition : SceneTransition
    {
        private readonly GlobalContentManager tmpContentManager = new GlobalContentManager();

        public float Duration = 1f;

        public EaseType EaseType = EaseType.QuartOut;

        public WindTransition()
        {
            this.Effect = this.tmpContentManager.Load<WindEffect>(WindEffect.EffectAssetName);
            this.Size = 0.3f;
            this.WindSegments = 100;
        }

        public float WindSegments
        {
            set => ((WindEffect)this.Effect).Segments = value;
        }

        public float Size
        {
            set => ((WindEffect)this.Effect).Size = value;
        }

        public override IEnumerator OnBeginTransition()
        {
            yield return this.TickEffectProgressProperty(((WindEffect)this.Effect), this.Duration, this.EaseType);

            this.SetNextScene();

            this.TransitionComplete();

            this.tmpContentManager.Unload();
        }
    }
}