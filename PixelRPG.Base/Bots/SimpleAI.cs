namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using BrainAI.Pathfinding.AStar;

    using FateRandom;
    using Microsoft.Xna.Framework;
    using BrainAI.AI;
    using PixelRPG.Base.Components;
    #endregion

    public class SimpleAI : IAITurn
    {
        public int MePlayerId;
        public int?[,] Regions;
        public List<GameStateComponent.Player> Players;
        public Point? Exit;
        public Dictionary<int, Point?> SearchPoint = new Dictionary<int, Point?>();
        public AstarGridGraph Pathfinding;

        public bool NeedAction;
        public Dictionary<int, Point> NextTurn;

        public void Tick()
        {
            if (!NeedAction)
            {
                return;
            }

            if (Fate.GlobalFate.Chance(50))
            {
                return;
            }

            var me = FindMe();

            NextTurn = new Dictionary<int, Point>();

            for (var i = 0; i < me.Units.Count; i++)
            {
                if (!SearchPoint.ContainsKey(me.Units[i].UnitId) || SearchPoint[me.Units[i].UnitId] == null || SearchPoint[me.Units[i].UnitId].Value == me.Units[i].Position)
                {
                    SearchPoint[me.Units[i].UnitId] = new Point(Fate.GlobalFate.NextInt(Regions.GetLength(0)), Fate.GlobalFate.NextInt(Regions.GetLength(1)));
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

                NextTurn[me.Units[i].UnitId] = new Point(path[1].X, path[1].Y);
            }

            NeedAction = false;
        }

        private GameStateComponent.Player FindMe()
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