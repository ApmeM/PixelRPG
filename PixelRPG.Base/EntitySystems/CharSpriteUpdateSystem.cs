namespace PixelRPG.Base.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using SpineEngine.ECS.Components;

    using PixelRPG.Base.Assets;
    using PixelRPG.Base.Components;

    public class CharSpriteUpdateSystem : EntityProcessingSystem
    {
        public CharSpriteUpdateSystem()
            : base(new Matcher().All(typeof(UnitComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var animation = entity.GetOrCreateComponent<AnimationSpriteComponent>();
            var charSprites = entity.GetComponent<UnitComponent>();

            if (animation.IsPlaying)
            {
                return;
            }

            switch (charSprites.State)
            {
                case UnitState.Idle:
                    animation.Animation = charSprites.UnitAnimations.Idle;
                    animation.Animation.Loop = false;
                    animation.IsPlaying = true;
                    break;
                case UnitState.Run:
                    animation.Animation = charSprites.UnitAnimations.Run;
                    animation.Animation.Loop = false;
                    animation.IsPlaying = true;
                    break;
                case UnitState.Dead:
                    if (animation.Animation == charSprites.UnitAnimations.Die)
                    {
                        return;
                    }

                    animation.Animation = charSprites.UnitAnimations.Die;
                    animation.Animation.Loop = false;
                    animation.IsPlaying = true;
                    break;
            }

            animation.IsPlaying = true;
        }

        protected override void OnMatchedEntityAdded(Entity entity)
        {
            base.OnMatchedEntityAdded(entity);
            var charSprites = entity.GetComponent<UnitComponent>();
            var animation = entity.GetOrCreateComponent<AnimationSpriteComponent>();
            var sprite = entity.GetOrCreateComponent<SpriteComponent>();
            animation.Animation = animation.Animation ?? charSprites.UnitAnimations.Idle;
            animation.Animation.Loop = false;
            animation.IsPlaying = true;
            sprite.Drawable = animation.Animation.Frames[animation.StartFrame];
        }
    }
}