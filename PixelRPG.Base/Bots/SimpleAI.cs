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
        public AstarGridGraph Pathfinding;

        public bool NeedAction;
        public Dictionary<int, Point> NextTurn;
        public List<BrainAI.Pathfinding.Point> PointsAdded = new List<BrainAI.Pathfinding.Point>();

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
                PointsAdded.Clear();
                for (var j = 0; j < me.Units.Count; j++)
                {
                    if (i == j)
                    {
                        continue;
                    }

                    var point = new BrainAI.Pathfinding.Point(me.Units[j].Position.X, me.Units[j].Position.Y);
                    PointsAdded.Add(point);
                    Pathfinding.Walls.Add(point);
                }

                var path = AStarPathfinder.Search(Pathfinding, new BrainAI.Pathfinding.Point(me.Units[i].Position.X, me.Units[i].Position.Y), new BrainAI.Pathfinding.Point(this.Exit?.X ?? 0, this.Exit?.Y ?? 0));

                for (var j = 0; j < PointsAdded.Count; j++)
                {
                    Pathfinding.Walls.Remove(PointsAdded[j]);
                }

                if (path == null)
                {
                    path = AStarPathfinder.Search(Pathfinding, new BrainAI.Pathfinding.Point(me.Units[i].Position.X, me.Units[i].Position.Y), new BrainAI.Pathfinding.Point(this.Exit?.X ?? 0, this.Exit?.Y ?? 0));
                }

                if (path == null || path.Count < 2)
                {
                    continue;
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