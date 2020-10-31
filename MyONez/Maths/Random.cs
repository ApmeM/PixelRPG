namespace MyONez.Maths
{
    using System;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    public class Random
    {
        private static int seed = Environment.TickCount;

        private static System.Random random = new System.Random(seed);

        /// <summary>
        ///     returns current seed value
        /// </summary>
        /// <returns>Seed.</returns>
        public static int GetSeed()
        {
            return seed;
        }

        /// <summary>
        ///     resets rng with new seed
        /// </summary>
        /// <param name="seed">Seed.</param>
        public static void SetSeed(int seed)
        {
            Random.seed = seed;
            random = new System.Random(Random.seed);
        }

        /// <summary>
        ///     returns a random float between 0 (inclusive) and 1 (exclusive)
        /// </summary>
        /// <returns>The float.</returns>
        public static float NextFloat()
        {
            return (float)random.NextDouble();
        }

        /// <summary>
        ///     returns a random float between 0 (inclusive) and max (exclusive)
        /// </summary>
        /// <returns>The float.</returns>
        /// <param name="max">Max.</param>
        public static float NextFloat(float max)
        {
            return (float)random.NextDouble() * max;
        }

        /// <summary>
        ///     returns a random int between 0 (inclusive) and max (exclusive)
        /// </summary>
        /// <returns>The float.</returns>
        /// <param name="max">Max.</param>
        public static int NextInt(int max)
        {
            return random.Next(max);
        }

        /// <summary>
        ///     returns a random float between 0 and 2 * PI
        /// </summary>
        /// <returns>The angle.</returns>
        public static float NextAngle()
        {
            return (float)random.NextDouble() * MathHelper.TwoPi;
        }

        /// <summary>
        ///     returns a random color
        /// </summary>
        /// <returns>The color.</returns>
        public static Color NextColor()
        {
            return new Color(NextFloat(), NextFloat(), NextFloat());
        }

        /// <summary>
        ///     Returns a random integer between min (inclusive) and max (exclusive)
        /// </summary>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public static int Range(int min, int max)
        {
            return random.Next(min, max);
        }

        /// <summary>
        ///     Returns a random float between min (inclusive) and max (exclusive)
        /// </summary>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public static float Range(float min, float max)
        {
            return min + NextFloat(max - min);
        }

        /// <summary>
        ///     Returns a random Vector2, and x- and y-values of which are between min (inclusive) and max (exclusive)
        /// </summary>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public static Vector2 Range(Vector2 min, Vector2 max)
        {
            return min + new Vector2(NextFloat(max.X - min.X), NextFloat(max.Y - min.Y));
        }

        /// <summary>
        ///     returns a random float between -1 and 1
        /// </summary>
        /// <returns>The one to one.</returns>
        public static float MinusOneToOne()
        {
            return NextFloat(2f) - 1f;
        }

        /// <summary>
        ///     returns true if the next random is less than percent. Percent should be between 0 and 1
        /// </summary>
        /// <param name="percent">Percent.</param>
        public static bool Chance(float percent)
        {
            return NextFloat() < percent;
        }

        /// <summary>
        ///     returns true if the next random is less than value. Value should be between 0 and 100.
        /// </summary>
        /// <param name="value">Value.</param>
        public static bool Chance(int value)
        {
            return NextInt(100) < value;
        }

        /// <summary>
        ///     randomly returns one of the given values
        /// </summary>
        /// <param name="first">First.</param>
        /// <param name="second">Second.</param>
        /// <typeparam name="T">The 1st type parameter.</typeparam>
        public static T Choose<T>(T first, T second)
        {
            if (NextInt(2) == 0)
                return first;
            return second;
        }

        /// <summary>
        ///     randomly returns one of the given values
        /// </summary>
        /// <param name="first">First.</param>
        /// <param name="second">Second.</param>
        /// <param name="third">Third.</param>
        /// <typeparam name="T">The 1st type parameter.</typeparam>
        public static T Choose<T>(T first, T second, T third)
        {
            switch (NextInt(3))
            {
                case 0:
                    return first;
                case 1:
                    return second;
                default:
                    return third;
            }
        }

        /// <summary>
        ///     randomly returns one of the given values
        /// </summary>
        /// <param name="first">First.</param>
        /// <param name="second">Second.</param>
        /// <param name="third">Third.</param>
        /// <param name="fourth">Fourth.</param>
        /// <typeparam name="T">The 1st type parameter.</typeparam>
        public static T Choose<T>(T first, T second, T third, T fourth)
        {
            switch (NextInt(4))
            {
                case 0:
                    return first;
                case 1:
                    return second;
                case 2:
                    return third;
                default:
                    return fourth;
            }
        }

        /// <summary>
        ///     randomly returns one of the given values
        /// </summary>
        /// <param name="data">list to choose.</param>
        /// <typeparam name="T">The 1st type parameter.</typeparam>
        public static T Choose<T>(List<T> data)
        {
            return data[NextInt(data.Count)];
        }
    }
}