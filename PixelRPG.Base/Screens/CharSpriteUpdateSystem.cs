namespace PixelRPG.Base.Screens
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using MyONez.ECS.Components;

    public class CharSpriteUpdateSystem : EntityProcessingSystem
    {
        public CharSpriteUpdateSystem()
            : base(new Matcher().All(typeof(CharSpritesComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var animation = entity.GetOrCreateComponent<AnimationSpriteComponent>();
            var charSprites = entity.GetComponent<CharSpritesComponent>();
            
            if (animation.IsPlaying)
            {
                return;
            }

            switch (charSprites.State)
            {
                case CharState.Idle:
                    animation.Animation = charSprites.CharSprites.idle;
                    break;
                case CharState.Run:
                    animation.Animation = charSprites.CharSprites.run;
                    break;
            }

            animation.IsPlaying = true;
        }

        protected override void OnMatchedEntityAdded(Entity entity)
        {
            base.OnMatchedEntityAdded(entity);
            var charSprites = entity.GetComponent<CharSpritesComponent>();
            var animation = entity.GetOrCreateComponent<AnimationSpriteComponent>();
            var sprite = entity.GetOrCreateComponent<SpriteComponent>();
            animation.Animation = charSprites.CharSprites.idle;
            animation.IsPlaying = true;
            sprite.Drawable = animation.Animation.Frames[animation.StartFrame];
        }
    }
}