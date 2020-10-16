namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.ECS.Components;
    using MyONez.Graphics.Meshes;
    using MyONez.Maths;

    public class SpriteMeshGeneratorSystem : EntityProcessingSystem
    {
        public SpriteMeshGeneratorSystem()
            : base(new Matcher().All(typeof(SpriteComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var sprite = entity.GetComponent<SpriteComponent>();
            var effect = entity.GetComponent<SpriteEffectsComponent>()?.SpriteEffects ?? SpriteEffects.None;
            var color = entity.GetComponent<ColorComponent>()?.Color ?? Color.White;
            var depth = entity.GetComponent<DepthLayerComponent>()?.Depth ?? 0;

            if (sprite.Drawable == null)
            {
                entity.RemoveComponent<FinalRenderComponent>();
                return;
            }

            var finalRender = entity.GetOrCreateComponent<FinalRenderComponent>();
            finalRender.Batch.Clear();

            sprite.Drawable.DrawInto(color, depth, finalRender.Batch);
            var transformation = TransformationUtils.GetTransformation(entity).LocalTransformMatrix;
            foreach (var mesh in finalRender.Batch.Meshes)
            {
                mesh.ApplyEffectToMesh(effect);
                mesh.ApplyTransformMesh(transformation);
            }
        }
    }
}