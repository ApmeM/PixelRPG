namespace MyONez.Maths
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;

    public static class TransformationUtils
    {
        public static Transformation GetTransformation(Entity entity)
        {
            if (entity == null)
            {
                return null;
            }

            var localPosition = entity.GetComponent<PositionComponent>()?.Position ?? Vector2.Zero;
            var localScale = entity.GetComponent<ScaleComponent>()?.Scale ?? Vector2.One;
            var localRotation = entity.GetComponent<RotateComponent>()?.Rotation ?? 0;
            var localParent = GetTransformation(entity.GetComponent<ParentComponent>()?.Parent);
            var positionalEntity = entity.Cache.GetOrAddData("TransformationUtils", () => new Transformation());

            var parentChanged = false;

            var parentMatrix = localParent?.LocalTransformMatrix ?? Matrix.Identity;
            var parentRotate = localParent?.Rotate ?? 0;
            var parentScale = localParent?.Scale ?? Vector2.One;

            if (parentMatrix != positionalEntity.ParentTransformMatrix)
            {
                positionalEntity.ParentTransformMatrix = parentMatrix;
                parentChanged = true;
            }

            var localMatrixChanged = false;
            if (positionalEntity.SelfPosition != localPosition || parentChanged)
            {
                positionalEntity.SelfPosition = localPosition;
                positionalEntity.Position = Vector2.Transform(positionalEntity.SelfPosition, parentMatrix);
                positionalEntity.RebuildPositionalMatrix();
                localMatrixChanged = true;
            }

            if (positionalEntity.SelfRotate != localRotation || parentChanged)
            {
                positionalEntity.SelfRotate = localRotation;
                positionalEntity.Rotate = localRotation + parentRotate;
                positionalEntity.RebuildRotateMatrix();
                localMatrixChanged = true;
            }

            if (positionalEntity.SelfScale != localScale || parentChanged)
            {
                positionalEntity.SelfScale = localScale;
                positionalEntity.Scale = localScale * parentScale;
                positionalEntity.RebuildScaleMatrix();
                localMatrixChanged = true;
            }

            if (localMatrixChanged)
            {
                positionalEntity.RebuildLocalTransformationMatrixPositionalEntity();
            }

            return positionalEntity;
        }

        public class Transformation
        {
            public Matrix LocalTransformMatrix = Matrix.Identity;

            public Matrix ParentTransformMatrix = Matrix.Identity;

            public Vector2 Position;

            public Matrix PositionMatrix = Matrix.Identity;

            public float Rotate;

            public Matrix RotateMatrix = Matrix.Identity;

            public Vector2 Scale = Vector2.One;

            public Matrix ScaleMatrix = Matrix.Identity;

            public Vector2 SelfPosition;

            public float SelfRotate;

            public Vector2 SelfScale = Vector2.One;

            public Matrix RebuildLocalTransformationMatrixPositionalEntity()
            {
                Matrix.Multiply(ref this.ScaleMatrix, ref this.RotateMatrix, out this.LocalTransformMatrix);
                Matrix.Multiply(ref this.LocalTransformMatrix, ref this.PositionMatrix, out this.LocalTransformMatrix);
                return this.LocalTransformMatrix;
            }

            public void RebuildScaleMatrix()
            {
                Matrix.CreateScale(this.Scale.X, this.Scale.Y, 1, out this.ScaleMatrix);
            }

            public void RebuildRotateMatrix()
            {
                Matrix.CreateRotationZ(this.Rotate, out this.RotateMatrix);
            }

            public void RebuildPositionalMatrix()
            {
                Matrix.CreateTranslation(this.Position.X, this.Position.Y, 0, out this.PositionMatrix);
            }
        }
    }
}