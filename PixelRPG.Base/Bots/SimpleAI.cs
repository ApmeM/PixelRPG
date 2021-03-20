﻿namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using BrainAI.Pathfinding.AStar;

    using FateRandom;
    using BrainAI.AI;
    using PixelRPG.Base.TransferMessages;
    using System;
    using PixelRPG.Base.EntitySystems;
    using PixelRPG.Base.Components.GameState.Skills;
    using PixelRPG.Base.Components.GameState;
    #endregion

    public class SimpleAI : IAITurn
    {
        public int MePlayerId;
        public int?[,] Regions;
        public List<ServerCurrentStateTransferMessage.PlayerSubMessage> Players;
        public ServerCurrentStateTransferMessage.PointSubMessage Exit;
        public Dictionary<int, ServerCurrentStateTransferMessage.PointSubMessage> SearchPoint = new Dictionary<int, ServerCurrentStateTransferMessage.PointSubMessage>();
        public AstarGridGraph Pathfinding;

        public bool NeedAction;
        public Dictionary<int, ServerYouConnectedTransferMessage.UnitSubMessage> UnitDesription;

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
                if (!SearchPoint.ContainsKey(me.Units[i].UnitId) || SearchPoint[me.Units[i].UnitId] == null || 
                    (SearchPoint[me.Units[i].UnitId].X == me.Units[i].Position.X && SearchPoint[me.Units[i].UnitId].Y == me.Units[i].Position.Y))
                {
                    SearchPoint[me.Units[i].UnitId] = new ServerCurrentStateTransferMessage.PointSubMessage
                    {
                        X = Fate.GlobalFate.NextInt(Regions.GetLength(0)),
                        Y = Fate.GlobalFate.NextInt(Regions.GetLength(1))
                    };
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

                var distance = Math.Min(unitDescription.MoveRange, path.Count - 1);
                result.SetNewPosition(me.Units[i].UnitId, path[distance].X, path[distance].Y);
                if (!unitDescription.AttackFriendlyFire)
                {
                    result.SetAttackDirection(me.Units[i].UnitId, 0, 0);
                }
            }

            return result;
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