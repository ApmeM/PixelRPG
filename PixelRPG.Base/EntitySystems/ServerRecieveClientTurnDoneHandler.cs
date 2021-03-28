namespace PixelRPG.Base.EntitySystems
{
    using System;
    using System.Linq;
    using FateRandom;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.TransferMessages;
    using SpineEngine.Utils.Collections;

    public partial class ServerRecieveClientTurnDoneHandler : ServerReceiveHandlerSystem.Handler<ClientTurnDoneTransferMessage>
    {
        public partial class UnitAction : IPoolable
        {
            public int NewPositionX;
            public int NewPositionY;
            public int? AttackDirectionX;
            public int? AttackDirectionY;

            public static UnitAction Create()
            {
                return Pool<UnitAction>.Obtain();
            }

            public void Free()
            {
                Pool<UnitAction>.Free(this);
            }

            public void Reset()
            {
                this.NewPositionX = 0;
                this.NewPositionY = 0;
                this.AttackDirectionX = null;
                this.AttackDirectionY = null;
            }
        }

        protected override void Handle(ServerComponent server, int connectionKey, ClientTurnDoneTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();
            gameState.PlayersMoved.Add(gameState.Players[connectionKey].PlayerId);
            foreach(var actionKVP in message.UnitActions)
            {
                var fullId = ServerLogic.GetFullUnitId(gameState.Players[connectionKey].PlayerId, actionKVP.Key);
                gameState.CurrentTurn[fullId] = UnitAction.Create();
                gameState.CurrentTurn[fullId].NewPositionX = actionKVP.Value.NewPosition.X;
                gameState.CurrentTurn[fullId].NewPositionY = actionKVP.Value.NewPosition.Y;
                gameState.CurrentTurn[fullId].AttackDirectionX = actionKVP.Value.AttackDirection?.X;
                gameState.CurrentTurn[fullId].AttackDirectionY = actionKVP.Value.AttackDirection?.Y;
            }

            foreach (var player in gameState.Players)
            {
                server.Response[player.Key].Enqueue(ServerPlayerTurnMadeTransferMessage.Create()
                    .SetPlayerId(gameState.Players[connectionKey].PlayerId));
            }

            if (gameState.PlayersMoved.Count() != gameState.MaxPlayersCount)
            {
                return;
            }
            gameState.PlayersMoved.Clear();

            var playersList = gameState.Players.Values.ToList();
            Fate.GlobalFate.Shuffle(playersList);

            for (var i = 0; i < playersList.Count; i++)
            {
                var player = playersList[i];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var unit = player.Units[j];
                    var fullId = ServerLogic.GetFullUnitId(player, unit);
                    if (!gameState.CurrentTurn.ContainsKey(fullId) && unit.Hp > 0 && unit.Hp < unit.MaxHp)
                    {
                        unit.Hp++;
                    }
                }
            }


            for (var i = 0; i < playersList.Count; i++)
            {
                var player = playersList[i];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var unit = player.Units[j];
                    var fullId = ServerLogic.GetFullUnitId(player, unit);
                    if (!gameState.CurrentTurn.ContainsKey(fullId) || unit.Hp <= 0)
                    {
                        continue;
                    }

                    var newPositionX = gameState.CurrentTurn[fullId].NewPositionX;
                    var newPositionY = gameState.CurrentTurn[fullId].NewPositionY;
                    var canMove = true;
                    if (newPositionX != gameState.Exit.X || newPositionY != gameState.Exit.Y)
                    {
                        foreach (var playerKVP in gameState.Players)
                        {
                            var otherPlayer = playerKVP.Value;
                            for (var k = 0; k < otherPlayer.Units.Count; k++)
                            {
                                var otherUnit = otherPlayer.Units[k];
                                if (otherUnit.Hp > 0 && otherUnit.Position.X == newPositionX && otherUnit.Position.Y == newPositionY)
                                {
                                    canMove = false;
                                    break;
                                }
                            }

                            if (!canMove)
                            {
                                break;
                            }
                        }
                    }

                    if (canMove)
                    {
                        var distance = Math.Abs(unit.Position.X - newPositionX) + Math.Abs(unit.Position.Y - newPositionY);

                        if (distance <= unit.MoveRange)
                        {
                            unit.Position.X = newPositionX;
                            unit.Position.Y = newPositionY;
                        }
                    }
                }
            }

            for (var i = 0; i < playersList.Count; i++)
            {
                var player = playersList[i];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var unit = player.Units[j];
                    var fullId = ServerLogic.GetFullUnitId(player, unit);

                    if (!gameState.CurrentTurn.ContainsKey(fullId) || unit.Hp <= 0)
                    {
                        continue;
                    }

                    if (gameState.CurrentTurn[fullId].AttackDirectionX == null || gameState.CurrentTurn[fullId].AttackDirectionY == null)
                    {
                        continue;
                    }

                    if (unit.Position == gameState.Exit)
                    {
                        continue;
                    }

                    var attackToX = gameState.CurrentTurn[fullId].NewPositionX + gameState.CurrentTurn[fullId].AttackDirectionX.Value;
                    var attackToY = gameState.CurrentTurn[fullId].NewPositionY + gameState.CurrentTurn[fullId].AttackDirectionY.Value;
                    var distance = gameState.CurrentTurn[fullId].AttackDirectionX + gameState.CurrentTurn[fullId].AttackDirectionY;
                    if (distance > unit.AttackDistance)
                    {
                        continue;
                    }

                    foreach (var playerKVP in gameState.Players)
                    {
                        var otherPlayer = playerKVP.Value;
                        if (!unit.AttackFriendlyFire && otherPlayer.PlayerId == player.PlayerId)
                        {
                            continue;
                        }

                        for (var k = 0; k < otherPlayer.Units.Count; k++)
                        {
                            var otherUnit = otherPlayer.Units[k];
                            if (otherUnit.Hp <= 0)
                            {
                                continue;
                            }

                            var distanceToAttackPoint = Math.Abs(attackToX - otherUnit.Position.X) + Math.Abs(attackToY - otherUnit.Position.Y);
                            if (distanceToAttackPoint > unit.AttackRadius)
                            {
                                continue;
                            }

                            otherUnit.Hp -= unit.AttackDamage;
                        }
                    }
                }
            }

            foreach(var actionKVP in gameState.CurrentTurn)
            {
                actionKVP.Value.Free();
            }
            gameState.CurrentTurn.Clear();

            var allAtEnd = true;
            foreach (var player in gameState.Players)
            {
                for (var i = 0; i < player.Value.Units.Count; i++)
                {
                    var unit = player.Value.Units[i];
                    var fullUnitId = ServerLogic.GetFullUnitId(player.Value, unit);
                    if (unit.Position != gameState.Exit) 
                    {
                        if (unit.Hp > 0)
                        {
                            allAtEnd = false;
                        }
                    }
                    else if (!gameState.AtEnd.Contains(fullUnitId))
                    {
                        gameState.AtEnd.Add(fullUnitId);
                        player.Value.LevelScore += gameState.MaxUnitsCount * gameState.MaxPlayersCount - gameState.AtEnd.Count();
                        player.Value.TotalScore += gameState.MaxUnitsCount * gameState.MaxPlayersCount - gameState.AtEnd.Count();
                    }
                }
            }
                
            if (allAtEnd)
            {
                ServerLogic.StartNewGame(gameState);
            }

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                if (allAtEnd)
                {
                    responses.Enqueue(ServerGameStartedTransferMessage.Create().SetSize(gameState.Map.GetLength(0), gameState.Map.GetLength(1)));
                }

                responses.Enqueue(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                responses.Enqueue(ServerYourTurnTransferMessage.Create());
            }
        }
    }
}