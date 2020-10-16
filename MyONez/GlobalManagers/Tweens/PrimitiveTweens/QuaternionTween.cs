namespace MyONez.GlobalManagers.Tweens.PrimitiveTweens
{
    using Microsoft.Xna.Framework;

    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Maths.Easing;

    public class QuaternionTween : Tween<Quaternion>
    {
        public QuaternionTween(ITweenTarget<Quaternion> tweenTarget, Quaternion toValue, float duration)
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