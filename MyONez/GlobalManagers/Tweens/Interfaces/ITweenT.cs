namespace MyONez.GlobalManagers.Tweens.Interfaces
{
    using System;

    /// <summary>
    ///     a series of strongly typed, chainable methods to setup various tween properties
    /// </summary>
    public interface ITween<T> : ITween
    {
        /// <summary>
        ///     chainable. sets the action that should be called when the tween is complete.
        /// </summary>
        Action<ITween<T>> CompletionHandler { get; set; }

        /// <summary>
        ///     chainable. sets the action that should be called when a loop is complete. A loop is either when the first part of
        ///     a ping-pong animation completes or when starting over when using a restart-from-beginning loop type. Note that
        ///     ping-pong
        ///     loops (which are really two part tweens) will not fire the loop completion handler on the last iteration. The
        ///     normal
        ///     tween completion handler will fire though
        /// </summary>
        Action<ITween<T>> LoopCompleteHandler { get; set; }

        /// <summary>
        ///     sets the start position for the tween
        /// </summary>
        T FromValue { get; set; }

        object Target { get; }
    }
}