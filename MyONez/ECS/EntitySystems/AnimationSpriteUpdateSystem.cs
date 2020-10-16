namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using MyONez.ECS.Components;
    using MyONez.ECS.EntitySystems.Animation;
    using MyONez.Maths;

    public class AnimationSpriteUpdateSystem : EntityProcessingSystem
    {
        public AnimationSpriteUpdateSystem()
            : base(new Matcher().All(typeof(AnimationSpriteComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var animation = entity.GetComponent<AnimationSpriteComponent>();

            if (!animation.IsPlaying)
            {
                return;
            }

            var sprite = entity.GetComponent<SpriteComponent>();
            if (sprite == null)
            {
                sprite = new SpriteComponent();
                entity.AddComponent(sprite);
            }

            if (animation.Animation != animation.ExecutingAnimation)
            {
                animation.ExecutingAnimation = animation.Animation;

                animation.CurrentFrame = animation.StartFrame;
                sprite.Drawable = animation.ExecutingAnimation.Frames[animation.CurrentFrame];

                animation.TotalElapsedTime = animation.StartFrame * animation.ExecutingAnimation.SecondsPerFrame;
            }

            // handle delay
            if (!animation.DelayComplete && animation.ElapsedDelay < animation.ExecutingAnimation.Delay)
            {
                animation.ElapsedDelay += (float)gameTime.TotalSeconds;
                if (animation.ElapsedDelay >= animation.ExecutingAnimation.Delay)
                    animation.DelayComplete = true;

                return;
            }

            // count backwards if we are going in reverse
            if (animation.IsReversed)
                animation.TotalElapsedTime -= (float)gameTime.TotalSeconds;
            else
                animation.TotalElapsedTime += (float)gameTime.TotalSeconds;

            animation.TotalElapsedTime = Mathf.Clamp(
                animation.TotalElapsedTime,
                0f,
                animation.ExecutingAnimation.TotalDuration);
            animation.CompletedIterations = Mathf.FloorToInt(
                animation.TotalElapsedTime / animation.ExecutingAnimation.IterationDuration);
            animation.IsLoopingBackOnPingPong = false;

            // handle ping pong loops. if loop is false but pingPongLoop is true we allow a single forward-then-backward iteration
            if (animation.ExecutingAnimation.PingPong)
            {
                if (animation.ExecutingAnimation.Loop || animation.CompletedIterations < 2)
                    animation.IsLoopingBackOnPingPong = animation.CompletedIterations % 2 != 0;
            }

            float elapsedTime;
            if (animation.TotalElapsedTime < animation.ExecutingAnimation.IterationDuration)
            {
                elapsedTime = animation.TotalElapsedTime;
            }
            else
            {
                elapsedTime = animation.TotalElapsedTime % animation.ExecutingAnimation.IterationDuration;

                // if we arent looping and elapsedTime is 0 we are done. Handle it appropriately
                if (!animation.ExecutingAnimation.Loop && elapsedTime == 0)
                {
                    // the animation is done so fire our event
                    animation.NotifyAninmationCompleted();

                    animation.IsPlaying = false;

                    switch (animation.ExecutingAnimation.CompletionBehavior)
                    {
                        case AnimationCompletionBehavior.RemainOnFinalFrame:
                            return;
                        case AnimationCompletionBehavior.RevertToFirstFrame:
                            sprite.Drawable = animation.ExecutingAnimation.Frames[0];
                            return;
                        case AnimationCompletionBehavior.HideSprite:
                            sprite.Drawable = null;
                            animation.ExecutingAnimation = null;
                            return;
                    }
                }
            }

            // if we reversed the animation and we reached 0 total elapsed time handle un-reversing things and loop continuation
            if (animation.IsReversed && animation.TotalElapsedTime <= 0)
            {
                animation.IsReversed = false;

                if (animation.ExecutingAnimation.Loop)
                {
                    animation.TotalElapsedTime = 0f;
                }
                else
                {
                    // the animation is done so fire our event
                    animation.NotifyAninmationCompleted();

                    animation.IsPlaying = false;
                    return;
                }
            }

            // time goes backwards when we are reversing a ping-pong loop
            if (animation.IsLoopingBackOnPingPong)
                elapsedTime = animation.ExecutingAnimation.IterationDuration - elapsedTime;

            // fetch our desired frame
            var desiredFrame = Mathf.FloorToInt(elapsedTime / animation.ExecutingAnimation.SecondsPerFrame);
            if (desiredFrame != animation.CurrentFrame)
            {
                animation.CurrentFrame = desiredFrame;
                sprite.Drawable = animation.ExecutingAnimation.Frames[animation.CurrentFrame];

                // ping-pong needs special care. we don't want to double the frame time when wrapping so we man-handle the totalElapsedTime
                if (animation.ExecutingAnimation.PingPong
                    && (animation.CurrentFrame == 0
                        || animation.CurrentFrame == animation.ExecutingAnimation.Frames.Count - 1))
                {
                    if (animation.IsReversed)
                        animation.TotalElapsedTime -= animation.ExecutingAnimation.SecondsPerFrame;
                    else
                        animation.TotalElapsedTime += animation.ExecutingAnimation.SecondsPerFrame;
                }
            }
        }
    }
}