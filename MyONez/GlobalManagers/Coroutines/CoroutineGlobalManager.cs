namespace MyONez.GlobalManagers.Coroutines
{
    using System.Collections;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    using MyONez.Utils.Collections;

    /// <summary>
    ///     basic CoroutineManager. Coroutines can do the following:
    ///     - yield return null (tick again the next frame)
    ///     - yield return DefaultCoroutines.Wait( 5.5f ) (tick again after a 5.5 second delay)
    ///     - yield return StartCoroutine( DefaultCoroutines.Wait( 5.5f ) ) (wait for the other coroutine before getting ticked
    ///     again)
    ///     - yield return StartCoroutine( Another() ) (wait for the other coroutine before getting ticked again)
    ///     - yield return Another() (wait for the other IEnumerable coroutine before getting ticked again)
    /// </summary>
    public class CoroutineGlobalManager : GlobalManager
    {
        private readonly List<Coroutine> nextFrameCoroutines = new List<Coroutine>();

        public Coroutine StartCoroutine(IEnumerator enumerator)
        {
            enumerator = enumerator ?? DefaultCoroutines.Empty();

            // find or create a Coroutine
            var coroutine = Pool<Coroutine>.Obtain();

            // setup the coroutine and add it
            coroutine.Enumerator = enumerator;
            coroutine.IsDone = false;
            coroutine.WaitForCoroutine = null;

            // guard against empty coroutines
            if (!this.TickCoroutine(coroutine))
            {
                return null;
            }

            this.nextFrameCoroutines.Add(coroutine);

            return coroutine;
        }

        public override void Update(GameTime gameTime)
        {
            var unblockedCoroutines = Pool<List<Coroutine>>.Obtain();
            unblockedCoroutines.Clear();
            unblockedCoroutines.AddRange(this.nextFrameCoroutines);
            this.nextFrameCoroutines.Clear();

            foreach (var coroutine in unblockedCoroutines)
            {
                // check for stopped coroutines
                if (coroutine.IsDone)
                {
                    Pool<Coroutine>.Free(coroutine);
                    continue;
                }

                // are we waiting for any other coroutines to finish?
                if (coroutine.WaitForCoroutine != null)
                {
                    if (coroutine.WaitForCoroutine.IsDone)
                    {
                        coroutine.WaitForCoroutine = null;
                    }
                    else
                    {
                        this.nextFrameCoroutines.Add(coroutine);
                        continue;
                    }
                }

                if (!this.TickCoroutine(coroutine))
                {
                    Pool<Coroutine>.Free(coroutine);
                    continue;
                }

                this.nextFrameCoroutines.Add(coroutine);
            }

            unblockedCoroutines.Clear();
            Pool<List<Coroutine>>.Free(unblockedCoroutines);
        }

        private bool TickCoroutine(Coroutine coroutine)
        {
            if (!coroutine.Enumerator.MoveNext() || coroutine.IsDone)
            {
                return false;
            }

            if (coroutine.Enumerator.Current == null)
            {
                return true;
            }

            if (coroutine.Enumerator.Current is Coroutine current)
            {
                coroutine.WaitForCoroutine = current;
                return true;
            }

            if (coroutine.Enumerator.Current is IEnumerator enumerator)
            {
                coroutine.WaitForCoroutine = this.StartCoroutine(enumerator);
                return true;
            }

            return true;
        }
    }
}