namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using BrainAI.Pathfinding.AStar;

    using FateRandom;
    using BrainAI.AI;
    using PixelRPG.Base.TransferMessages;
    using System;
    using PixelRPG.Base.Components.GameState;
    using BrainAI.Pathfinding;

    #endregion

    public class SimpleAI : IAITurn
    {
        public int MePlayerId;
        public RegionValue[,] Regions;
        public AIPoint Exit;
        public readonly List<AIPlayerState> Players = new List<AIPlayerState>();
        private readonly Dictionary<int, AIPoint> SearchPoint = new Dictionary<int, AIPoint>();
        public readonly Dictionary<int, Queue<Point>> SearchPath = new Dictionary<int, Queue<Point>>();
        public readonly Dictionary<int, AIUnitDescription> UnitDesription = new Dictionary<int, AIUnitDescription>();
        public AstarGridGraph Pathfinding;
        
        public bool NeedAction;
        public bool Connected;
        public string PlayerName = $"Player Bot.";

        public void Tick()
        {
        }

        public ClientTurnDoneTransferMessage GetNextTurn()
        {
            var me = FindMe();
            var result = ClientTurnDoneTransferMessage.Create();

            for (var i = 0; i < me.Units.Count; i++)
            {
                var unit = me.Units[i];
                if (unit.Hp <= 0)
                {
                    continue;
                }

                Do(unit, me.Units, result);
            }

            return result;
        }

        public void Do(AIPlayerState.UnitSubMessage unit, List<AIPlayerState.UnitSubMessage> units, ClientTurnDoneTransferMessage result)
        {
            if (!SearchPoint.ContainsKey(unit.UnitId))
            {
                SearchPoint[unit.UnitId] = null;
            }

            if (SearchPoint[unit.UnitId] == null ||
                (SearchPoint[unit.UnitId].X == unit.Position.X && SearchPoint[unit.UnitId].Y == unit.Position.Y))
            {
                SearchPoint[unit.UnitId]?.Free();
                var point = AIPoint.Create();
                point.X = this.Exit?.X ?? Fate.GlobalFate.NextInt(Regions.GetLength(0));
                point.Y = this.Exit?.Y ?? Fate.GlobalFate.NextInt(Regions.GetLength(1));
                SearchPoint[unit.UnitId] = point;

                var pathfind = AStarPathfinder.Search(Pathfinding, new Point(unit.Position.X, unit.Position.Y), new Point(SearchPoint[unit.UnitId].X, SearchPoint[unit.UnitId].Y));
                if (pathfind == null)
                {
                    SearchPoint[unit.UnitId]?.Free();
                    SearchPoint[unit.UnitId] = null;
                    return;
                }
                this.SearchPath[unit.UnitId] = new Queue<Point>(pathfind);
            }

            var path = SearchPath[unit.UnitId];

            if (path == null || path.Count < 2)
            {
                SearchPoint[unit.UnitId]?.Free();
                SearchPoint[unit.UnitId] = null;
                return;
            }

            var unitDescription = UnitDesription[unit.UnitId];
            var distance = Math.Min(unitDescription.MoveRange, path.Count - 1);

            Point target = path.Dequeue();
            if (target.X != unit.Position.X || target.Y != unit.Position.Y)
            {
                SearchPoint[unit.UnitId]?.Free();
                SearchPoint[unit.UnitId] = null;
                return;
            }

            for (var j = 0; j < distance - 1; j++)
            {
                target = path.Dequeue();
                if (Regions[target.X, target.Y] == RegionValue.Wall)
                {
                    SearchPoint[unit.UnitId]?.Free();
                    SearchPoint[unit.UnitId] = null;
                    return;
                }
            }

            target = path.Peek();
            if (Regions[target.X, target.Y] == RegionValue.Wall)
            {
                SearchPoint[unit.UnitId]?.Free();
                SearchPoint[unit.UnitId] = null;
                return;
            }

            for (var j = 0; j < units.Count; j++)
            {
                if (units[j].UnitId != unit.UnitId && units[j].Position.X == target.X && units[j].Position.Y == target.Y && this.Exit == null)
                {
                    SearchPoint[unit.UnitId]?.Free();
                    SearchPoint[unit.UnitId] = null;
                    return;
                }
            }

            result.SetNewPosition(unit.UnitId, target.X, target.Y);
            if (!unitDescription.AttackFriendlyFire)
            {
                result.SetAttackDirection(unit.UnitId, 0, 0);
            }
        }

        public ClientConnectTransferMessage GetPlayerData()
        {
            return ClientConnectTransferMessage.Create()
                .SetPlayerName(PlayerName)
                .AddUnitType(UnitUtils.UnitType.Ranger)
                .AddUnitType(UnitUtils.UnitType.Rogue)
                .AddSkill(0, UnitUtils.Skill.VisionRange)
                .AddSkill(1, UnitUtils.Skill.MoveRange);
        }

        private AIPlayerState FindMe()
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