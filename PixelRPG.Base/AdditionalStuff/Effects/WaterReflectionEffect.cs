namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class WaterReflectionEffect : ReflectionEffect
    {
        private readonly EffectParameter firstDisplacementSpeedParam;

        private readonly EffectParameter perspectiveCorrectionIntensityParam;

        private readonly EffectParameter screenSpaceVerticalOffsetParam;

        private readonly EffectParameter secondDisplacementScaleParam;

        private readonly EffectParameter secondDisplacementSpeedParam;

        private readonly EffectParameter sparkleColorParam;

        private readonly EffectParameter sparkleIntensityParam;

        private readonly EffectParameter timeParam;

        public WaterReflectionEffect(Effect effect)
            : base(effect)
        {
            this.CurrentTechnique = this.Techniques["WaterReflectionTechnique"];

            this.timeParam = this.Parameters["_time"];
            this.sparkleIntensityParam = this.Parameters["_sparkleIntensity"];
            this.sparkleColorParam = this.Parameters["_sparkleColor"];
            this.screenSpaceVerticalOffsetParam = this.Parameters["_screenSpaceVerticalOffset"];
            this.perspectiveCorrectionIntensityParam = this.Parameters["_perspectiveCorrectionIntensity"];
            this.firstDisplacementSpeedParam = this.Parameters["_firstDisplacementSpeed"];
            this.secondDisplacementSpeedParam = this.Parameters["_secondDisplacementSpeed"];
            this.secondDisplacementScaleParam = this.Parameters["_secondDisplacementScale"];

            this.SparkleIntensity = 0.015f;
            this.SparkleColor = Color.White;
            this.PerspectiveCorrectionIntensity = 0.3f;
            this.FirstDisplacementSpeed = 0.06f;
            this.SecondDisplacementSpeed = 0.02f;
            this.SecondDisplacementScale = 3f;
            this.ReflectionIntensity = 0.85f;
            this.NormalMagnitude = 0.03f;
        }

        public float SparkleIntensity
        {
            get => this.sparkleIntensityParam.GetValueSingle();
            set => this.sparkleIntensityParam.SetValue(value);
        }

        public Color SparkleColor
        {
            get => new Color(this.sparkleColorParam.GetValueVector3());
            set => this.sparkleColorParam.SetValue(value.ToVector3());
        }

        public float ScreenSpaceVerticalOffset
        {
            get => this.screenSpaceVerticalOffsetParam.GetValueSingle();
            set => this.screenSpaceVerticalOffsetParam.SetValue(value);
        }

        public float PerspectiveCorrectionIntensity
        {
            get => this.perspectiveCorrectionIntensityParam.GetValueSingle();
            set => this.perspectiveCorrectionIntensityParam.SetValue(value);
        }

        public float FirstDisplacementSpeed
        {
            get => this.firstDisplacementSpeedParam.GetValueSingle();
            set => this.firstDisplacementSpeedParam.SetValue(value);
        }

        public float SecondDisplacementSpeed
        {
            get => this.secondDisplacementSpeedParam.GetValueSingle();
            set => this.secondDisplacementSpeedParam.SetValue(value);
        }

        public float SecondDisplacementScale
        {
            get => this.secondDisplacementScaleParam.GetValueSingle();
            set => this.secondDisplacementScaleParam.SetValue(value);
        }

        public float Time
        {
            get => this.timeParam.GetValueSingle();
            set => this.timeParam.SetValue(value);
        }
    }
}