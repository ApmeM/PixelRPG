namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.Maths;

    using Random = MyONez.Maths.Random;

    /// <summary>
    ///     takes a RenderableComponent and cycles the color using different wave forms. A specific color channel can be
    ///     affected or all of them.
    ///     Useful for making flickering lights and adding atmosphere.
    /// </summary>
    public class ColorCyclerUpdateSystem : EntityProcessingSystem
    {
        public ColorCyclerUpdateSystem()
            : base(new Matcher().All(typeof(ColorComponent), typeof(ColorCyclerComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var color = entity.GetComponent<ColorComponent>();
            var colorCycler = entity.GetComponent<ColorCyclerComponent>();
            colorCycler.OriginalColor = colorCycler.OriginalColor ?? color.Color;

            Color newColor;
            switch (colorCycler.ColorChannel)
            {
                case ColorCyclerComponent.ColorChannels.All:
                    newColor = colorCycler.OriginalColor.Value * this.EvaluateWaveFunction(
                        (float)gameTime.TotalSeconds,
                        colorCycler);
                    break;
                case ColorCyclerComponent.ColorChannels.Red:
                    newColor = new Color(
                        (int)(colorCycler.OriginalColor.Value.R * this.EvaluateWaveFunction(
                            (float)gameTime.TotalSeconds,
                            colorCycler)),
                        colorCycler.OriginalColor.Value.G,
                        colorCycler.OriginalColor.Value.B,
                        colorCycler.OriginalColor.Value.A);
                    break;
                case ColorCyclerComponent.ColorChannels.Green:
                    newColor = new Color(
                        colorCycler.OriginalColor.Value.R,
                        (int)(colorCycler.OriginalColor.Value.G * this.EvaluateWaveFunction(
                            (float)gameTime.TotalSeconds,
                            colorCycler)),
                        colorCycler.OriginalColor.Value.B,
                        colorCycler.OriginalColor.Value.A);
                    break;
                case ColorCyclerComponent.ColorChannels.Blue:
                    newColor = new Color(
                        colorCycler.OriginalColor.Value.R,
                        colorCycler.OriginalColor.Value.G,
                        (int)(colorCycler.OriginalColor.Value.B * this.EvaluateWaveFunction(
                            (float)gameTime.TotalSeconds,
                            colorCycler)),
                        colorCycler.OriginalColor.Value.A);
                    break;
                default:
                    newColor = color.Color;
                    break;
            }

            if (colorCycler.AffectsIntensity)
                newColor.A = (byte)(colorCycler.OriginalColor.Value.A
                                    * this.EvaluateWaveFunction((float)gameTime.TotalSeconds, colorCycler));
            else
                newColor.A = colorCycler.OriginalColor.Value.A;

            color.Color = newColor;
        }

        private float EvaluateWaveFunction(float secondsPassed, ColorCyclerComponent colorCycler)
        {
            var t = (secondsPassed + colorCycler.Phase) * colorCycler.Frequency;
            t = t - Mathf.Floor(t); // normalized value (0..1)
            var y = 1f;

            switch (colorCycler.WaveFunction)
            {
                case ColorCyclerComponent.WaveFunctions.Sin:
                    y = Mathf.Sin(1f * t * MathHelper.Pi);
                    break;
                case ColorCyclerComponent.WaveFunctions.Triangle:
                    if (t < 0.5f)
                        y = 4.0f * t - 1.0f;
                    else
                        y = -4.0f * t + 3.0f;
                    break;
                case ColorCyclerComponent.WaveFunctions.Square:
                    if (t < 0.5f)
                        y = 1.0f;
                    else
                        y = -1.0f;
                    break;
                case ColorCyclerComponent.WaveFunctions.SawTooth:
                    y = t;
                    break;
                case ColorCyclerComponent.WaveFunctions.InvertedSawTooth:
                    y = 1.0f - t;
                    break;
                case ColorCyclerComponent.WaveFunctions.Random:
                    y = 1f - Random.NextFloat() * 2f;
                    break;
            }

            return y * colorCycler.Amplitude + colorCycler.Offset;
        }
    }
}