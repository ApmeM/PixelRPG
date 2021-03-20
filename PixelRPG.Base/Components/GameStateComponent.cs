namespace PixelRPG.Base.Components
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components.GameState;
    using PixelRPG.Base.TransferMessages;

    #endregion

    public class GameStateComponent : Component
    {
        public int?[,] Map;
        public List<Point> Doors;
        public Dictionary<int, Player> Players = new Dictionary<int, Player>();
        public Point Exit;
        public int MaxPlayersCount;
        public int MaxUnitsCount = 4;
        public int MaxSkillsCount = 1;
        public Dictionary<int, Dictionary<int, ClientTurnDoneTransferMessage.UnitActionSubMessage>> CurrentTurn = new Dictionary<int, Dictionary<int, ClientTurnDoneTransferMessage.UnitActionSubMessage>>();
        public HashSet<long> AtEnd = new HashSet<long>();
    }
}