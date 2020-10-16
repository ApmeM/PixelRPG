namespace MyONez.GlobalManagers.Timers
{
    using System;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    using MyONez.Utils.Collections;

    public class TimerGlobalManager : GlobalManager
    {
        private readonly List<Timer> timers = new List<Timer>();

        public override void Update(GameTime gameTime)
        {
            for (var i = this.timers.Count - 1; i >= 0; i--)
            {
                // tick our timer. if it returns true it is done so we remove it
                var timer = this.timers[i];
                if (timer.Tick(gameTime))
                {
                    timer.Unload();
                    this.timers.RemoveAt(i);
                    Pool<Timer>.Free(timer);
                }
            }
        }

        /// <summary>
        ///     schedules a one-time or repeating timer that will call the passed in Action
        /// </summary>
        /// <param name="timeInSeconds">Time in seconds.</param>
        /// <param name="repeats">If set to <c>true</c> repeats.</param>
        /// <param name="onTime">On time.</param>
        internal Timer Schedule(float timeInSeconds, bool repeats, Action<Timer> onTime)
        {
            var timer = Pool<Timer>.Obtain();
            timer.Initialize(timeInSeconds, repeats, onTime);
            this.timers.Add(timer);

            return timer;
        }
    }
}