namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;
    using LocomotorECS;
    using LocomotorECS.Matching;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.AdditionalStuff.TurnBase.Components;
    using PixelRPG.Base.ECS.Components;
    using PixelRPG.Base.ECS.EntitySystems.Models;
    using SpineEngine.ECS.Components;

    public class GameTurnAnimationSystem : EntityProcessingSystem
    {
        public GameTurnAnimationSystem() : base(new Matcher().All(typeof(ApplyTurnComponent)))
        {

        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var applyTurn = entity.GetComponent<ApplyTurnComponent>();
            if (applyTurn.TurnApplied)
            {
                return;
            }

            var moved = false;
            for (var i = 0; i < applyTurn.TurnsData.Count; i++)
            {
                var turnData = (TurnData)applyTurn.TurnsData[i];
                var position = turnData.Entity.GetComponent<PositionComponent>();
                var unit = turnData.Entity.GetComponent<UnitComponent>();
                var end = turnData.MoveTo;

                if (end.X * 16 + 8 == position.Position.X && end.Y * 16 + 8 == position.Position.Y)
                {
                    unit.State = Assets.UnitState.Idle;
                    continue;
                }

                unit.State = Assets.UnitState.Run;
                moved = true;
                position.Position += new Vector2(Math.Sign(end.X * 16 + 8 - position.Position.X), Math.Sign(end.Y * 16 + 8 - position.Position.Y));
            }

            applyTurn.TurnApplied = !moved;
        }
    }
}