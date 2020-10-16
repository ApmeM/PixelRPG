namespace MyONez.Tests.ECS.InternalUtils
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.Maths;
    using MyONez.Utils;

    using NUnit.Framework;

    [TestFixture]
    public class TransformationUtilsTests
    {
        [Test]
        public void EmptyEntity_LocalIdentity()
        {
            var entity = new Entity();
            var result = TransformationUtils.GetTransformation(entity);

            Assert.AreEqual(Matrix.Identity, result.LocalTransformMatrix);
        }

        [Test]
        public void EntityNull_NullResponse()
        {
            var result = TransformationUtils.GetTransformation(null);

            Assert.IsNull(result);
        }

        [Test]
        public void HaveParentTranslation_LocalMatrixMoved()
        {
            var parent = new Entity();
            parent.AddComponent(new PositionComponent(2, 3));
            parent.AddComponent(new ScaleComponent(4, 5));

            var entity = new Entity();
            entity.AddComponent(new PositionComponent(2, 3));
            entity.AddComponent(new ScaleComponent(4, 5));
            entity.AddComponent(new ParentComponent(parent));
            var result = TransformationUtils.GetTransformation(entity);

            Assert.AreEqual(
                new Matrix
                {
                    M11 = 16,
                    M12 = 0,
                    M13 = 0,
                    M14 = 0,
                    M21 = 0,
                    M22 = 25,
                    M23 = 0,
                    M24 = 0,
                    M31 = 0,
                    M32 = 0,
                    M33 = 1,
                    M34 = 0,
                    M41 = 10,
                    M42 = 18,
                    M43 = 0,
                    M44 = 1
                },
                result.LocalTransformMatrix);
        }

        [Test]
        public void HaveSelfValues_LocalMatrixFilled()
        {
            var entity = new Entity();
            entity.AddComponent(new PositionComponent(2, 3));
            entity.AddComponent(new ScaleComponent(4, 5));
            var result = TransformationUtils.GetTransformation(entity);

            Assert.AreEqual(
                new Matrix
                {
                    M11 = 4,
                    M12 = 0,
                    M13 = 0,
                    M14 = 0,
                    M21 = 0,
                    M22 = 5,
                    M23 = 0,
                    M24 = 0,
                    M31 = 0,
                    M32 = 0,
                    M33 = 1,
                    M34 = 0,
                    M41 = 2,
                    M42 = 3,
                    M43 = 0,
                    M44 = 1
                },
                result.LocalTransformMatrix);
        }
    }
}