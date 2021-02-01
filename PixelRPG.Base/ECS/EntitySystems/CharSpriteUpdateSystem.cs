namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using SpineEngine.ECS.Components;

    using PixelRPG.Base.Assets;
    using PixelRPG.Base.ECS.Components;

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
                    break;
                case UnitState.Run:
                    animation.Animation = charSprites.UnitAnimations.Run;
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
            animation.Animation = charSprites.UnitAnimations.Idle;
            animation.IsPlaying = true;
            sprite.Drawable = animation.Animation.Frames[animation.StartFrame];
        }
    }
}