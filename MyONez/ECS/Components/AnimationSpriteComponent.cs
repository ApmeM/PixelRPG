namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    using MyONez.ECS.EntitySystems.Animation;

    /// <summary>
    ///     Require SpriteComponent. If it not exists - it will be created automatically by EntitySystem.
    /// </summary>
    public class AnimationSpriteComponent : Component
    {
        public SpriteAnimation Animation;

        internal int CurrentFrame;

        internal bool DelayComplete;

        internal double ElapsedDelay;

        internal SpriteAnimation ExecutingAnimation;

        private bool isPlaying;

        public bool IsReversed;

        public int StartFrame;

        public float TotalElapsedTime { get; internal set; }

        public bool IsLoopingBackOnPingPong { get; internal set; }

        public int CompletedIterations { get; internal set; }

        public bool IsPlaying
        {
            get => this.isPlaying;
            set
            {
                if (this.isPlaying == value)
                {
                    return;
                }

                this.isPlaying = value;
                if (this.isPlaying)
                {
                    this.TotalElapsedTime = 0;
                }
            }
        }

        public event Action OnAnimationCompletedEvent;

        internal void NotifyAninmationCompleted()
        {
            this.OnAnimationCompletedEvent?.Invoke();
        }
    }
}