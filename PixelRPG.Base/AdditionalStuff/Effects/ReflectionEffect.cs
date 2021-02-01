namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class ReflectionEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.reflection;

        private readonly EffectParameter matrixTransformParam;

        private readonly EffectParameter normalMagnitudeParam;

        private readonly EffectParameter normalMapParam;

        private readonly EffectParameter reflectionIntensityParam;

        private readonly EffectParameter renderTextureParam;

        public ReflectionEffect(Effect effect)
            : base(effect)
        {
            this.reflectionIntensityParam = this.Parameters["_reflectionIntensity"];
            this.renderTextureParam = this.Parameters["_renderTexture"];
            this.normalMapParam = this.Parameters["_normalMap"];
            this.matrixTransformParam = this.Parameters["_matrixTransform"];
            this.normalMagnitudeParam = this.Parameters["_normalMagnitude"];

            this.ReflectionIntensity = 0.4f;
            this.NormalMagnitude = 0.05f;
        }

        public float ReflectionIntensity
        {
            get => this.reflectionIntensityParam.GetValueSingle();
            set => this.reflectionIntensityParam.SetValue(value);
        }

        public float NormalMagnitude
        {
            get => this.normalMagnitudeParam.GetValueSingle();
            set => this.normalMagnitudeParam.SetValue(value);
        }

        public Texture2D NormalMap
        {
            get => this.normalMapParam.GetValueTexture2D();
            set => this.normalMapParam.SetValue(value);
        }

        public Texture2D RenderTexture
        {
            get => this.renderTextureParam.GetValueTexture2D();
            set => this.renderTextureParam.SetValue(value);
        }

        public Matrix MatrixTransform
        {
            get => this.matrixTransformParam.GetValueMatrix();
            set => this.matrixTransformParam.SetValue(value);
        }
    }
}