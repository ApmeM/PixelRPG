namespace MyONez.GlobalManagers.Timers
{
    using System;

    using Microsoft.Xna.Framework;

    /// <summary>
    ///     private class hiding the implementation of ITimer
    /// </summary>
    public class Timer
    {
        private float elapsedTime;

        private bool isDone;

        private Action<Timer> onTime;

        private bool repeats;

        private float timeInSeconds;

        /// <summary>
        ///     call stop to stop this timer from being run again. This has no effect on a non-repeating timer.
        /// </summary>
        public void Stop()
        {
            this.isDone = true;
        }

        /// <summary>
        ///     resets the elapsed time of the timer to 0
        /// </summary>
        public void Reset()
        {
            this.elapsedTime = 0f;
        }

        internal bool Tick(GameTime gameTime)
        {
            // if stop was called before the tick then isDone will be true and we should not tick again no matter what
            if (!this.isDone && this.elapsedTime > this.timeInSeconds)
            {
                this.elapsedTime -= this.timeInSeconds;
                this.onTime(this);

                if (!this.isDone && !this.repeats)
                    this.isDone = true;
            }

            this.elapsedTime += (float)gameTime.ElapsedGameTime.TotalSeconds;

            return this.isDone;
        }

        internal void Initialize(float timeInSeconds, bool repeats, Action<Timer> onTime)
        {
            this.timeInSeconds = timeInSeconds;
            this.repeats = repeats;
            this.onTime = onTime;
            this.isDone = false;
        }

        /// <summary>
        ///     nulls out the object references so the GC can pick them up if needed
        /// </summary>
        internal void Unload()
        {
            this.onTime = null;
        }
    }
}