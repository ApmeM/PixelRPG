namespace PixelRPG.Base.Components
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;

    using Microsoft.Xna.Framework;
    
    #endregion

    public class GameStateComponent : Component
    {
        public int?[,] Map;
        public List<Point> Doors;
        public Dictionary<int, Player> Players = new Dictionary<int, Player>();
        public Point Exit;
        public int MaxPlayersCount;
        public int MovedPlayers;

        public class Player
        {
            public int PlayerId;
            public List<Unit> Units;
        }

        public class Unit
        {
            public int UnitId;
            public Point Position;
        }
    }
}