﻿namespace MyONez.AdditionalContent.BrainAI.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using MyONez.AdditionalContent.BrainAI.Components;

    public class AIUpdateSystem : EntityProcessingSystem
    {
        public AIUpdateSystem()
            : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var ai = entity.GetComponent<AIComponent>();
            ai.AIBot.Tick();
        }
    }
}