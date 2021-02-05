namespace PixelRPG.Base.AdditionalStuff.TurnBase.Components
{
    using System.Collections.Generic;

    using LocomotorECS;

    public class PlayerSwitcherComponent : Component
    {
        public enum PlayerSwitchType
        {
            /// <summary>
            /// Next turn made become available after previous turn applied
            /// </summary>
            OneByOne,

            /// <summary>
            /// Next turn for all players become available when last player turn was applied
            /// </summary>
            AllAtOnce
        }

        public PlayerSwitcherComponent(PlayerSwitchType switchType, params PlayerTurnComponent[] players)
        {
            this.SwitchType = switchType;
            this.Players = players;

            this.Players[0].TurnMade = false;
            for (var i = 1; i < this.Players.Length; i++)
            {
                this.Players[i].TurnMade = this.SwitchType == PlayerSwitchType.OneByOne;
            }
        }

        internal PlayerTurnComponent[] Players;
        internal PlayerSwitchType SwitchType;
        internal int CurrentPlayer;
        internal bool WaitingForTurnApply;
    }
}