namespace MyONez.GlobalManagers.Tweens.Interfaces
{
    using MyONez.Maths.Easing;

    /// <summary>
    ///     a series of strongly typed, chainable methods to setup various tween properties
    /// </summary>
    public interface ITween
    {
        /// <summary>
        ///     sets the ease type used for this tween
        /// </summary>
        EaseType EaseType { get; set; }

        /// <summary>
        ///     sets the delay before starting the tween
        /// </summary>
        float Delay { get; set; }

        /// <summary>
        ///     sets the tween duration
        /// </summary>
        float Duration { get; set; }

        /// <summary>
        ///     allows you to add a tween that will get run after this tween completes. Note that nextTween must be an ITweenable!
        ///     Also note that all ITweenTs are ITweenable.
        /// </summary>
        ITween NextTween { get; set; }

        int Loops { get; set; }

        LoopType LoopType { get; set; }

        float DelayBetweenLoops { get; set; }

        void UpdateValue(float elapsedTime);

        void Start();

        void NotifyLoopCompleted();

        void NotifyCompleted();

        void Stop();
    }
}