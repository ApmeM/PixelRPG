namespace MyONez.GlobalManagers.Tweens
{
    using System;

    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Maths.Easing;

    public abstract class Tween<T> : ITween<T>
    {
        private T fromValue;

        private bool isFromValueOverridden;

        protected ITweenTarget<T> TweenTarget;

        protected Tween(ITweenTarget<T> tweenTarget, T toValue, float duration)
        {
            this.TweenTarget = tweenTarget;
            this.ToValue = toValue;
            this.Duration = duration;
        }

        public T ToValue { get; set; }

        public bool IsTimeScaleIndependent { get; set; }

        public float TimeScale { get; set; } = 1f;

        public T FromValue
        {
            get => this.fromValue;
            set
            {
                this.isFromValueOverridden = true;
                this.fromValue = value;
            }
        }

        public EaseType EaseType { get; set; }

        public Action<ITween<T>> CompletionHandler { get; set; }

        public Action<ITween<T>> LoopCompleteHandler { get; set; }

        public ITween NextTween { get; set; }

        public float Delay { get; set; }

        public float Duration { get; set; }

        public LoopType LoopType { get; set; }

        public int Loops { get; set; }

        public float DelayBetweenLoops { get; set; }

        public object Target => this.TweenTarget.Target;

        public void Start()
        {
            if (!this.isFromValueOverridden)
            {
                this.FromValue = this.TweenTarget.TweenedValue;
            }
        }

        public void NotifyLoopCompleted()
        {
            this.LoopCompleteHandler?.Invoke(this);
        }

        public void NotifyCompleted()
        {
            this.CompletionHandler?.Invoke(this);
        }

        public void Stop()
        {
            this.LoopType = LoopType.None;
            this.Loops = 0;
        }

        public abstract void UpdateValue(float elapsedTime);
    }
}