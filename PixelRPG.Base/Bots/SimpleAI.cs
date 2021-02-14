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
        public Point? NextTurn;

        public void Tick()
        {
            if (!NeedAction)
            {
                return;
            }

            if (Fate.GlobalFate.Chance(95))
            {
                return;
            }

            var me = FindMe();

            var path = AStarPathfinder.Search(Pathfinding, new BrainAI.Pathfinding.Point(me.Position.X, me.Position.Y), new BrainAI.Pathfinding.Point(this.Exit?.X ?? 0, this.Exit?.Y ?? 0));
            if (path == null || path.Count < 2)
            {
                NextTurn = me.Position;
                NeedAction = false;
                return;
            }

            NextTurn = new Point(path[1].X, path[1].Y);
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