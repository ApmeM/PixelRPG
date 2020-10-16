namespace MyONez.GlobalManagers.Tweens.Interfaces
{
    /// <summary>
    ///     any object that wants to be tweened needs to implement this. TweenManager internally likes to make a simple object
    ///     that implements this interface and stores a reference to the object being tweened. That makes for tiny, simple,
    ///     lightweight implementations that can be handed off to any TweenT
    /// </summary>
    public interface ITweenTarget<T>
    {
        /// <summary>
        ///     sets the final, tweened value on the object of your choosing.
        /// </summary>
        T TweenedValue { get; set; }

        object Target { get; }
    }
}