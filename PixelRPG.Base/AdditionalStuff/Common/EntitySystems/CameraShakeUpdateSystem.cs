﻿namespace PixelRPG.Base.AdditionalStuff.Common.EntitySystems
{
    using System;
    using FateRandom;
    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.Common.Components;

    public class CameraShakeUpdateSystem : EntityProcessingSystem
    {
        public CameraShakeUpdateSystem()
            : base(new Matcher().All(typeof(CameraShakeComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var shake = entity.GetComponent<CameraShakeComponent>();

            if (!shake.Enabled)
            {
                return;
            }

            if (Math.Abs(shake.ShakeIntensity) > 0f)
            {
                shake.ShakeOffset = shake.ShakeDirection;
                if (shake.ShakeOffset.X != 0f || shake.ShakeOffset.Y != 0f)
                {
                    shake.ShakeOffset.Normalize();
                }
                else
                {
                    shake.ShakeOffset.X = shake.ShakeOffset.X + Fate.GlobalFate.NextFloat() - 0.5f;
                    shake.ShakeOffset.Y = shake.ShakeOffset.Y + Fate.GlobalFate.NextFloat() - 0.5f;
                }

                // ToDo: this needs to be multiplied by camera zoom so that less shake gets applied when zoomed in
                shake.ShakeOffset *= shake.ShakeIntensity;
                shake.ShakeIntensity *= -shake.ShakeDegredation;
                if (Math.Abs(shake.ShakeIntensity) <= 0.01f)
                {
                    shake.ShakeIntensity = 0f;
                    shake.Enabled = false;
                }
            }

            shake.Camera.Position += shake.ShakeOffset;
        }
    }
}