namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;

    public class ColorCyclerComponent : Component
    {
        public enum ColorChannels
        {
            None,

            All,

            Red,

            Green,

            Blue
        }

        public enum WaveFunctions
        {
            Sin,

            Triangle,

            Square,

            SawTooth,

            InvertedSawTooth,

            Random
        }

        // should the alpha be changed as well as colors
        public bool AffectsIntensity = true;

        /// <summary>
        ///     this value is multiplied by the calculated value
        /// </summary>
        public float Amplitude = 1.0f;

        public ColorChannels ColorChannel = ColorChannels.All;

        /// <summary>
        ///     cycles per second
        /// </summary>
        public float Frequency = 0.5f;

        /// <summary>
        ///     This value is added to the final result. 0 - 1 range.
        /// </summary>
        public float Offset = 0.0f;

        internal Color? OriginalColor;

        /// <summary>
        ///     start point in wave function. 0 - 1 range.
        /// </summary>
        public float Phase = 0.0f;

        public WaveFunctions WaveFunction = WaveFunctions.Sin;
    }
}