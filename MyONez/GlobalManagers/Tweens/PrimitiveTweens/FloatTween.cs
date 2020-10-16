namespace MyONez.GlobalManagers.Tweens.PrimitiveTweens
{
    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Maths.Easing;

    public class FloatTween : Tween<float>
    {
        public FloatTween(ITweenTarget<float> tweenTarget, float toValue, float duration)
            : base(tweenTarget, toValue, duration)
        {
        }

        public override void UpdateValue(float elapsedTime)
        {
            this.TweenTarget.TweenedValue = Lerps.Ease(
                this.EaseType,
                this.FromValue,
                this.ToValue,
                elapsedTime,
                this.Duration);
        }
    }
}