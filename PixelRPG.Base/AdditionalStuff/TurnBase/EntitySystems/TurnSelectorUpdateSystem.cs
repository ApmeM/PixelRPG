namespace PixelRPG.Base.AdditionalStuff.TurnBase.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.TurnBase.Components;

    public class TurnSelectorUpdateSystem : EntityProcessingSystem
    {
        public TurnSelectorUpdateSystem()
            : base(new Matcher().All(typeof(ApplyTurnComponent), typeof(PlayerSwitcherComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var applyTurn = entity.GetComponent<ApplyTurnComponent>();
            if (!applyTurn.TurnApplied)
            {
                // Previously selected turn was not applied to game state by game specified logic.
                return;
            }

            var switcher = entity.GetComponent<PlayerSwitcherComponent>();
            if (switcher.WaitingForTurnApply)
            {
                switcher.WaitingForTurnApply = false;
                applyTurn.TurnsData.Clear();

                switch (switcher.SwitchType)
                {
                    case PlayerSwitcherComponent.PlayerSwitchType.OneByOne:
                        switcher.Players[switcher.CurrentPlayer].TurnMade = false;
                        break;
                    case PlayerSwitcherComponent.PlayerSwitchType.AllAtOnce:
                        for (var i = 0; i < switcher.Players.Length; i++)
                        {
                            switcher.Players[i].TurnMade = false;
                        }
                        break;
                }
            }

            var playerTurn = switcher.Players[switcher.CurrentPlayer];
            if (!playerTurn.TurnMade)
            {
                return;
            }

            switch (switcher.SwitchType)
            {
                case PlayerSwitcherComponent.PlayerSwitchType.OneByOne:
                    applyTurn.TurnApplied = false;
                    switcher.WaitingForTurnApply = true;
                    break;
                case PlayerSwitcherComponent.PlayerSwitchType.AllAtOnce:
                    if (switcher.CurrentPlayer == switcher.Players.Length - 1)
                    {
                        applyTurn.TurnApplied = false;
                        switcher.WaitingForTurnApply = true;
                    }
                    break;
            }

            applyTurn.TurnsData.Add(playerTurn.TurnData);
            switcher.CurrentPlayer = (switcher.CurrentPlayer + 1) % switcher.Players.Length;
        }
    }
}