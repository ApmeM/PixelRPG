namespace MyONez.GlobalManagers.Tweens
{
    using Microsoft.Xna.Framework;

    using MyONez.GlobalManagers.Tweens.Interfaces;

    public class Tweenable
    {
        protected float ElapsedTime;

        private TweenGlobalManager globalManager;

        private bool isRunningInReverse;

        // tween state
        protected TweenStates TweenState = TweenStates.Complete;

        public ITween CurrentTween { get; private set; }

        public void Initialize(TweenGlobalManager globalManager, ITween tween)
        {
            this.globalManager = globalManager;
            this.TweenState = TweenStates.Paused;
            this.CurrentTween = tween;
        }

        public void Start()
        {
            this.ElapsedTime = 0;
            this.isRunningInReverse = false;
            this.TweenState = TweenStates.Running;
            this.CurrentTween.Start();
        }

        public virtual void RecycleSelf()
        {
            this.TweenState = TweenStates.Complete;
            this.CurrentTween = null;
        }

        public bool IsRunning()
        {
            return this.TweenState == TweenStates.Running;
        }

        public bool IsCompleted()
        {
            return this.TweenState == TweenStates.Complete;
        }

        public void Pause()
        {
            this.TweenState = TweenStates.Paused;
        }

        public void Resume()
        {
            this.TweenState = TweenStates.Running;
        }

        public bool Tick(GameTime gameTime)
        {
            if (this.TweenState == TweenStates.Paused)
            {
                return false;
            }

            // when we loop we clamp values between 0 and duration. this will hold the excess that we clamped off so it can be reapplied
            var elapsedTimeExcess = 0f;
            if (!this.isRunningInReverse && this.ElapsedTime >= this.CurrentTween.Duration)
            {
                elapsedTimeExcess = this.ElapsedTime - this.CurrentTween.Duration;
                this.ElapsedTime = this.CurrentTween.Duration;
                this.TweenState = TweenStates.Complete;
            }
            else if (this.isRunningInReverse && this.ElapsedTime <= 0)
            {
                elapsedTimeExcess = 0 - this.ElapsedTime;
                this.ElapsedTime = 0f;
                this.TweenState = TweenStates.Complete;
            }

            // elapsed time will be negative while we are delaying the start of the tween so dont update the value
            if (this.ElapsedTime >= 0 && this.ElapsedTime <= this.CurrentTween.Duration)
            {
                this.CurrentTween.UpdateValue(this.ElapsedTime);
            }

            // if we have a loopType and we are Complete (meaning we reached 0 or duration) handle the loop.
            // handleLooping will take any excess elapsedTime and factor it in and call udpateValue if necessary to keep
            // the tween perfectly accurate.
            if (this.CurrentTween.LoopType != LoopType.None && this.TweenState == TweenStates.Complete
                                                            && this.CurrentTween.Loops > 0)
            {
                this.HandleLooping(elapsedTimeExcess);
            }

            // running in reverse? then we need to subtract deltaTime
            if (this.isRunningInReverse)
                this.ElapsedTime -= (float)gameTime.ElapsedGameTime.TotalSeconds;
            else
                this.ElapsedTime += (float)gameTime.ElapsedGameTime.TotalSeconds;

            if (this.TweenState == TweenStates.Complete)
            {
                this.CurrentTween.NotifyCompleted();

                // if we have a nextTween add it to TweenManager so that it can start running
                if (this.CurrentTween.NextTween != null)
                {
                    this.globalManager.AddTween(this.CurrentTween.NextTween);
                }

                return true;
            }

            return false;
        }

        public void Stop(bool bringToCompletion = false)
        {
            this.TweenState = TweenStates.Complete;

            if (bringToCompletion)
            {
                // if we are running in reverse we finish up at 0 else we go to duration
                this.ElapsedTime = this.isRunningInReverse ? 0f : this.CurrentTween.Duration;
                this.CurrentTween.Stop();
            }
        }

        /// <summary>
        ///     reverses the current tween. if it was going forward it will be going backwards and vice versa.
        /// </summary>
        public void ReverseTween()
        {
            this.isRunningInReverse = !this.isRunningInReverse;
        }

        /// <summary>
        ///     handles loop logic
        /// </summary>
        private void HandleLooping(float elapsedTimeExcess)
        {
            this.CurrentTween.Loops--;
            if (this.CurrentTween.LoopType == LoopType.PingPong)
            {
                this.ReverseTween();
            }

            if (this.CurrentTween.LoopType == LoopType.RestartFromBeginning || this.CurrentTween.Loops % 2 == 0)
            {
                this.CurrentTween.NotifyLoopCompleted();
            }

            // if we have loops left to process reset our state back to Running so we can continue processing them
            if (this.CurrentTween.Loops > 0)
            {
                this.TweenState = TweenStates.Running;

                // now we need to set our elapsed time and factor in our elapsedTimeExcess
                if (this.CurrentTween.LoopType == LoopType.RestartFromBeginning)
                {
                    this.ElapsedTime = elapsedTimeExcess - this.CurrentTween.DelayBetweenLoops;
                }
                else
                {
                    if (this.isRunningInReverse)
                        this.ElapsedTime += this.CurrentTween.DelayBetweenLoops - elapsedTimeExcess;
                    else
                        this.ElapsedTime = elapsedTimeExcess - this.CurrentTween.DelayBetweenLoops;
                }

                // if we had an elapsedTimeExcess and no delayBetweenLoops update the value
                if (this.CurrentTween.DelayBetweenLoops == 0f && elapsedTimeExcess > 0f)
                {
                    this.CurrentTween.UpdateValue(this.ElapsedTime);
                }
            }
        }

        protected enum TweenStates
        {
            Running,

            Paused,

            Complete
        }
    }
}