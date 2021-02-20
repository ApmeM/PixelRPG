namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using BrainAI.Pathfinding.AStar;

    using FateRandom;
    using BrainAI.AI;
    using PixelRPG.Base.TransferMessages;
    using System;
    #endregion

    public class SimpleAI : IAITurn
    {
        public int MePlayerId;
        public int?[,] Regions;
        public List<ServerCurrentStateTransferMessage.Player> Players;
        public PointTransferMessage? Exit;
        public Dictionary<int, PointTransferMessage?> SearchPoint = new Dictionary<int, PointTransferMessage?>();
        public AstarGridGraph Pathfinding;

        public bool NeedAction;
        public Dictionary<int, PointTransferMessage> NextTurn;

        public void Tick()
        {
            if (!NeedAction)
            {
                return;
            }

            var me = FindMe();

            NextTurn = new Dictionary<int, PointTransferMessage>();

            for (var i = 0; i < me.Units.Count; i++)
            {
                if (!SearchPoint.ContainsKey(me.Units[i].UnitId) || SearchPoint[me.Units[i].UnitId] == null || 
                    (SearchPoint[me.Units[i].UnitId].Value.X == me.Units[i].Position.X && SearchPoint[me.Units[i].UnitId].Value.Y == me.Units[i].Position.Y))
                {
                    SearchPoint[me.Units[i].UnitId] = new PointTransferMessage(Fate.GlobalFate.NextInt(Regions.GetLength(0)), Fate.GlobalFate.NextInt(Regions.GetLength(1)));
                }

                var pathToGo = this.Exit ?? SearchPoint[me.Units[i].UnitId].Value;

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

                NextTurn[me.Units[i].UnitId] = new PointTransferMessage(path[1].X, path[1].Y);
            }

            NeedAction = false;
        }

        private ServerCurrentStateTransferMessage.Player FindMe()
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