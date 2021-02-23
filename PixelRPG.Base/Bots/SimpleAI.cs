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
    using PixelRPG.Base.Components.GameState.Skills;
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
        public Dictionary<int, ClientTurnDoneTransferMessage.UnitActionSubAction> NextTurn;
        public Dictionary<int, ServerYouConnectedTransferMessage.UnitSubMessage> UnitDesription;

        public bool Connected;
        public string PlayerName = $"Player Bot.";

        public void Tick()
        {
            if (!NeedAction)
            {
                return;
            }

            var me = FindMe();

            NextTurn = new Dictionary<int, ClientTurnDoneTransferMessage.UnitActionSubAction>();

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
                NextTurn[me.Units[i].UnitId] = new ClientTurnDoneTransferMessage.UnitActionSubAction
                {
                    NewPosition = new ClientTurnDoneTransferMessage.PointSubMessage
                    {
                        X = path[distance].X,
                        Y = path[distance].Y
                    },
                    AttackDirection = unitDescription.AttackFriendlyFire ? null : new ClientTurnDoneTransferMessage.PointSubMessage { X = 0, Y = 0 }
                };
            }

            NeedAction = false;
        }

        public List<ClientConnectTransferMessage.UnitSubMessage> GenerateUnitData()
        {
            return new List<ClientConnectTransferMessage.UnitSubMessage>
            {
                new ClientConnectTransferMessage.UnitSubMessage
                {
                    UnitType = nameof(RangerUnitType),
                    Skills = new List<string>
                    {
                        nameof(VisionRangeSkill)
                    }
                },
                new ClientConnectTransferMessage.UnitSubMessage
                {
                    UnitType = nameof(RogueUnitType),
                    Skills = new List<string>
                    {
                        nameof(MoveRangeSkill)
                    }
                }
            };
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