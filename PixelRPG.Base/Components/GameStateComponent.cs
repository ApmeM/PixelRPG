namespace PixelRPG.Base.Components
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components.GameState;
    using PixelRPG.Base.EntitySystems;
    using PixelRPG.Base.TransferMessages;

    #endregion

    public class GameStateComponent : Component
    {
        public int?[,] Map;
        public readonly List<Point> Doors = new List<Point>();
        public readonly Dictionary<int, Player> Players = new Dictionary<int, Player>();
        public Point Exit;
        public int MaxPlayersCount;
        public int MaxUnitsCount = 4;
        public int MaxSkillsCount = 1;
        public readonly Dictionary<long, ServerRecieveClientTurnDoneHandler.UnitAction> CurrentTurn = new Dictionary<long, ServerRecieveClientTurnDoneHandler.UnitAction>();
        public readonly HashSet<int> PlayersMoved = new HashSet<int>();
        public readonly HashSet<long> AtEnd = new HashSet<long>();
    }
}