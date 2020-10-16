namespace MyONez.Graphics
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class SpriteEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.spriteEffect;

        private readonly EffectParameter matrixTransformParam;

        public SpriteEffect(Effect cloneSource)
            : base(cloneSource)
        {
            this.matrixTransformParam = this.Parameters["MatrixTransform"];
        }

        public void SetMatrixTransform(ref Matrix matrixTransform)
        {
            this.matrixTransformParam.SetValue(matrixTransform);
        }
    }
}