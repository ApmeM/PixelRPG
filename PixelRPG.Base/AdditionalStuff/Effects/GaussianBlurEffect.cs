namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using System;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class GaussianBlurEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.gaussianBlur;

        private readonly EffectParameter blurOffsetsParam;

        private readonly EffectParameter blurWeightsParam;

        private readonly Vector2[] horizontalSampleOffsets;

        private readonly int sampleCount;

        private readonly float[] sampleWeights;

        private readonly Vector2[] verticalSampleOffsets;

        private float blurAmount = 2f;

        private float horizontalBlurDelta;

        private float verticalBlurDelta;

        public GaussianBlurEffect(Effect effect)
            : base(effect)
        {
            this.blurWeightsParam = this.Parameters["_sampleWeights"];
            this.blurOffsetsParam = this.Parameters["_sampleOffsets"];

            this.sampleCount = this.blurWeightsParam.Elements.Count;

            this.sampleWeights = new float[this.sampleCount];
            this.verticalSampleOffsets = new Vector2[this.sampleCount];
            this.horizontalSampleOffsets = new Vector2[this.sampleCount];

            this.verticalSampleOffsets[0] = Vector2.Zero;
            this.horizontalSampleOffsets[0] = Vector2.Zero;

            this.CalculateSampleWeights();
        }

        public float BlurAmount
        {
            get => this.blurAmount;
            set
            {
                if (this.blurAmount == value)
                {
                    return;
                }

                if (value == 0)
                {
                    value = 0.001f;
                }

                this.blurAmount = value;
                this.CalculateSampleWeights();
            }
        }

        public float HorizontalBlurDelta
        {
            get => this.horizontalBlurDelta;
            set
            {
                if (value == this.horizontalBlurDelta)
                {
                    return;
                }

                this.horizontalBlurDelta = value;
                this.SetBlurEffectParameters(this.horizontalBlurDelta, 0, this.horizontalSampleOffsets);
            }
        }

        public float VerticalBlurDelta
        {
            get => this.verticalBlurDelta;
            set
            {
                if (value == this.verticalBlurDelta)
                {
                    return;
                }

                this.verticalBlurDelta = value;
                this.SetBlurEffectParameters(0, this.verticalBlurDelta, this.verticalSampleOffsets);
            }
        }

        public void PrepareForHorizontalBlur()
        {
            this.blurOffsetsParam.SetValue(this.horizontalSampleOffsets);
        }

        public void PrepareForVerticalBlur()
        {
            this.blurOffsetsParam.SetValue(this.verticalSampleOffsets);
        }

        private void SetBlurEffectParameters(float dx, float dy, Vector2[] offsets)
        {
            for (var i = 0; i < this.sampleCount / 2; i++)
            {
                var sampleOffset = i * 2 + 1.5f;

                var delta = new Vector2(dx, dy) * sampleOffset;

                offsets[i * 2 + 1] = delta;
                offsets[i * 2 + 2] = -delta;
            }
        }

        private void CalculateSampleWeights()
        {
            this.sampleWeights[0] = this.ComputeGaussian(0);

            var totalWeights = this.sampleWeights[0];

            for (var i = 0; i < this.sampleCount / 2; i++)
            {
                var weight = this.ComputeGaussian(i + 1);

                this.sampleWeights[i * 2 + 1] = weight;
                this.sampleWeights[i * 2 + 2] = weight;

                totalWeights += weight * 2;
            }

            for (var i = 0; i < this.sampleWeights.Length; i++)
                this.sampleWeights[i] /= totalWeights;

            this.blurWeightsParam.SetValue(this.sampleWeights);
        }

        private float ComputeGaussian(float n)
        {
            return (float)(1.0 / Math.Sqrt(2 * Math.PI * this.blurAmount)
                           * Math.Exp(-(n * n) / (2 * this.blurAmount * this.blurAmount)));
        }
    }
}