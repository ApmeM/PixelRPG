namespace MyONez.GlobalManagers.Tweens.PrimitiveTweens
{
    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Maths.Easing;

    public class IntTween : Tween<int>
    {
        public IntTween(ITweenTarget<int> tweenTarget, int toValue, float duration)
            : base(tweenTarget, toValue, duration)
        {
        }

        public override void UpdateValue(float elapsedTime)
        {
            this.TweenTarget.TweenedValue = (int)Lerps.Ease(
                this.EaseType,
                this.FromValue,
                this.ToValue,
                elapsedTime,
                this.Duration);
        }
    }
}