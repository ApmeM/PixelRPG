namespace MyONez.Graphics.Meshes
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Maths;

    public abstract class IMesh
    {
        public abstract void Build(Texture2D texture, RectangleF destRect, RectangleF srcRect, Color color, float depth);
        public abstract void Draw(SpriteBatch spriteBatch);
        public abstract void ApplyEffectToMesh(SpriteEffects effect);
        public abstract void ApplyTransformMesh(Matrix transformation);
        public abstract void SetColor(Color value);
        protected abstract Vector3 GetCenter();

        public void MoveMesh(Vector3 offset)
        {
            this.ApplyTransformMesh(Matrix.CreateTranslation(offset));
        }

        public void ScaleMesh(Vector3 scale)
        {
            this.ScaleMesh(this.GetCenter(), scale);
        }

        public void ScaleMesh(Vector3 origin, Vector3 scale)
        {
            this.ApplyTransformMesh(Matrix.CreateTranslation(-origin));
            this.ApplyTransformMesh(Matrix.CreateScale(scale));
            this.ApplyTransformMesh(Matrix.CreateTranslation(origin));
        }

        public void RotateMesh(float rotationRadians)
        {
            this.RotateMesh(this.GetCenter(), rotationRadians);
        }

        public void RotateMesh(Vector3 origin, float rotationRadians)
        {
            if (rotationRadians == 0)
            {
                return;
            }

            this.ApplyTransformMesh(Matrix.CreateTranslation(-origin));
            this.ApplyTransformMesh(Matrix.CreateRotationZ(rotationRadians));
            this.ApplyTransformMesh(Matrix.CreateTranslation(origin));
        }
    }
}