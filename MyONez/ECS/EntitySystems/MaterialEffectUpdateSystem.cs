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
    public class MaterialEffectUpdateSystem : EntityProcessingSystem
    {
        public MaterialEffectUpdateSystem()
            : base(new Matcher().All(typeof(MaterialComponent), typeof(ColorCyclerComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var material = entity.GetComponent<MaterialComponent>();
            material.Material.Update(gameTime);
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