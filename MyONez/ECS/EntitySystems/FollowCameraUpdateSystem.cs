namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.Maths;

    public class FollowCameraUpdateSystem : EntityProcessingSystem
    {
        public FollowCameraUpdateSystem()
            : base(new Matcher().All(typeof(FollowCameraComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var follow = entity.GetComponent<FollowCameraComponent>();

            this.UpdateFollow(entity);

            follow.Camera.Position = Vector2.Lerp(
                follow.Camera.Position,
                follow.DesiredPosition,
                follow.FollowLerp);

            follow.Camera.Position = new Vector2(
                (float)Math.Round(follow.Camera.Position.X),
                (float)Math.Round(follow.Camera.Position.Y));
        }

        private void UpdateFollow(Entity entity)
        {
            var follow = entity.GetComponent<FollowCameraComponent>();

            follow.DesiredPosition.X = follow.DesiredPosition.Y = 0;

            var transform = TransformationUtils.GetTransformation(entity);

            follow.DesiredPosition.X = transform.Position.X;
            follow.DesiredPosition.Y = transform.Position.Y;
        }
    }
}