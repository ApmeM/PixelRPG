namespace MyONez.GlobalManagers.Tweens
{
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.Xna.Framework;

    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Maths.Easing;
    using MyONez.Utils.Collections;

    public class TweenGlobalManager : GlobalManager
    {
        public static EaseType DefaultEaseType = EaseType.QuartIn;

        /// <summary>
        ///     if true, the active tween list will be cleared when a new level loads
        /// </summary>
        public static bool RemoveAllTweensOnLevelLoad = false;

        /// <summary>
        ///     internal list of all the currently active tweens
        /// </summary>
        private readonly List<Tweenable> activeTweens = new List<Tweenable>();

        public override void Update(GameTime gameTime)
        {
            var list = Pool<List<Tweenable>>.Obtain();
            list.Clear();
            list.AddRange(this.activeTweens);

            // loop backwards so we can remove completed tweens
            for (var i = list.Count - 1; i >= 0; --i)
            {
                var tweenable = list[i];
                if (tweenable.Tick(gameTime))
                {
                    this.RemoveTween(tweenable.CurrentTween);
                }
            }

            list.Clear();
            Pool<List<Tweenable>>.Free(list);
        }

        /// <summary>
        ///     adds a tween to the active tweens list
        /// </summary>
        /// <param name="tween">Tween.</param>
        public void AddTween(ITween tween)
        {
            var tweenable = Pool<Tweenable>.Obtain();
            tweenable.Initialize(this, tween);
            this.activeTweens.Add(tweenable);
        }

        /// <summary>
        ///     removes a tween from the active tweens list
        /// </summary>
        public void RemoveTween(ITween tween)
        {
            var tweenable = this.activeTweens.FirstOrDefault(a => a.CurrentTween == tween);
            if (tweenable == null)
            {
                return;
            }

            tweenable.RecycleSelf();
            this.activeTweens.Remove(tweenable);
            Pool<Tweenable>.Free(tweenable);
        }

        /// <summary>
        ///     stops all tweens optionlly bringing them all to completion
        /// </summary>
        public void StopAllTweens(bool bringToCompletion = false)
        {
            for (var i = this.activeTweens.Count - 1; i >= 0; --i)
                this.activeTweens[i].Stop(bringToCompletion);
        }

        /// <summary>
        ///     stops tween optionlly bringing it to completion
        /// </summary>
        public void StopTween(ITween tween, bool bringToCompletion = false)
        {
            var tweenable = this.activeTweens.FirstOrDefault(a => a.CurrentTween == tween);
            tweenable?.Stop(bringToCompletion);
        }

        /// <summary>
        ///     starts tween
        /// </summary>
        public void StartTween(ITween tween)
        {
            var tweenable = this.activeTweens.FirstOrDefault(a => a.CurrentTween == tween);
            if (tweenable == null)
            {
                this.AddTween(tween);
            }

            tweenable = this.activeTweens.First(a => a.CurrentTween == tween);
            tweenable.Start();
        }

        public bool IsTweenCompleted(ITween tween)
        {
            var tweenable = this.activeTweens.FirstOrDefault(a => a.CurrentTween == tween);
            if (tweenable == null)
            {
                return true;
            }

            return tweenable.IsCompleted();
        }
    }
}