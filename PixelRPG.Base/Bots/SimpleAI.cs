namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using BrainAI.Pathfinding.AStar;

    using FateRandom;
    using BrainAI.AI;
    using PixelRPG.Base.TransferMessages;
    using System;
    using PixelRPG.Base.EntitySystems;
    #endregion

    public class SimpleAI : IAITurn
    {
        public int MePlayerId;
        public int?[,] Regions;
        public List<ServerCurrentStateTransferMessage.PlayerSubMessage> Players;
        public PointSubMessage Exit;
        public Dictionary<int, PointSubMessage> SearchPoint = new Dictionary<int, PointSubMessage>();
        public AstarGridGraph Pathfinding;

        public bool NeedAction;
        public Dictionary<int, PointSubMessage> NextTurn;
        internal Dictionary<int, string> UnitDesription;

        public void Tick()
        {
            if (!NeedAction)
            {
                return;
            }

            var me = FindMe();

            NextTurn = new Dictionary<int, PointSubMessage>();

            for (var i = 0; i < me.Units.Count; i++)
            {
                if (!SearchPoint.ContainsKey(me.Units[i].UnitId) || SearchPoint[me.Units[i].UnitId] == null || 
                    (SearchPoint[me.Units[i].UnitId].X == me.Units[i].Position.X && SearchPoint[me.Units[i].UnitId].Y == me.Units[i].Position.Y))
                {
                    SearchPoint[me.Units[i].UnitId] = new PointSubMessage(Fate.GlobalFate.NextInt(Regions.GetLength(0)), Fate.GlobalFate.NextInt(Regions.GetLength(1)));
                }

                var pathToGo = this.Exit ?? SearchPoint[me.Units[i].UnitId];

                var path = AStarPathfinder.Search(Pathfinding, new BrainAI.Pathfinding.Point(me.Units[i].Position.X, me.Units[i].Position.Y), new BrainAI.Pathfinding.Point(pathToGo.X, pathToGo.Y));

                if (path == null || path.Count < 2)
                {
                    SearchPoint[me.Units[i].UnitId] = null;
                    continue;
                }
                
                for (var j = 0; j < me.Units.Count; j++)
                {
                    if (me.Units[j].Position.X == path[1].X && me.Units[j].Position.Y == path[1].Y)
                    {
                        SearchPoint[me.Units[i].UnitId] = null;
                    }
                }
                var unitDescription = UnitDesription[me.Units[i].UnitId];

                if (unitDescription == nameof(RogueUnitType) && path.Count > 2)
                {
                    NextTurn[me.Units[i].UnitId] = new PointSubMessage(path[2].X, path[2].Y);
                }
                else
                {
                    NextTurn[me.Units[i].UnitId] = new PointSubMessage(path[1].X, path[1].Y);
                }
            }

            NeedAction = false;
        }

        private ServerCurrentStateTransferMessage.PlayerSubMessage FindMe()
        {
            for (var i = 0; i < this.Players.Count; i++)
            {
                if(this.Players[i].PlayerId == this.MePlayerId)
                {
                    return this.Players[i];
                }
            }

            return null;
        }
    }
}