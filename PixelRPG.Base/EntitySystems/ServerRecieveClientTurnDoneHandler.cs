namespace PixelRPG.Base.EntitySystems
{
    using System;
    using System.Linq;
    using FateRandom;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.TransferMessages;

    public class ServerRecieveClientTurnDoneHandler : ServerReceiveHandlerSystem.Handler<ClientTurnDoneTransferMessage>
    {
        protected override void Handle(ServerComponent server, int connectionKey, ClientTurnDoneTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();
            gameState.CurrentTurn[gameState.Players[connectionKey].PlayerId] = message.UnitActions;

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                responses.Enqueue(new ServerPlayerTurnMadeTransferMessage
                {
                    PlayerId = gameState.Players[connectionKey].PlayerId
                });
            }

            if (gameState.CurrentTurn.Count() != gameState.MaxPlayersCount)
            {
                return;
            }
            
            var playersList = gameState.Players.Values.ToList();
            Fate.GlobalFate.Shuffle(playersList);

            for (var i = 0; i < playersList.Count; i++)
            {
                var player = playersList[i];
                var unitActions = gameState.CurrentTurn[player.PlayerId];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var unit = player.Units[j];
                    if (!unitActions.ContainsKey(unit.UnitId) && unit.Hp > 0 && unit.Hp < unit.MaxHp)
                    {
                        unit.Hp++;
                    }
                }
            }


            for (var i = 0; i < playersList.Count; i++)
            {
                var player = playersList[i];
                var unitActions = gameState.CurrentTurn[player.PlayerId];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var unit = player.Units[j];
                    if (!unitActions.ContainsKey(unit.UnitId) || unit.Hp <= 0)
                    {
                        continue;
                    }

                    var newPosition = unitActions[unit.UnitId].NewPosition;
                    var canMove = true;
                    if (newPosition.X != gameState.Exit.X || newPosition.Y != gameState.Exit.Y)
                    {
                        foreach (var playerKVP in gameState.Players)
                        {
                            var otherPlayer = playerKVP.Value;
                            for (var k = 0; k < otherPlayer.Units.Count; k++)
                            {
                                var otherUnit = otherPlayer.Units[k];
                                if (otherUnit.Hp > 0 && otherUnit.Position.X == newPosition.X && otherUnit.Position.Y == newPosition.Y)
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
                        var distance = Math.Abs(unit.Position.X - newPosition.X) + Math.Abs(unit.Position.Y - newPosition.Y);

                        if (distance <= unit.MoveRange)
                        {
                            unit.Position.X = newPosition.X;
                            unit.Position.Y = newPosition.Y;
                        }
                    }
                }
            }

            for (var i = 0; i < playersList.Count; i++)
            {
                var player = playersList[i];
                var unitActions = gameState.CurrentTurn[player.PlayerId];
                for (var j = 0; j < player.Units.Count; j++)
                {
                    var unit = player.Units[j];
                    if (!unitActions.ContainsKey(unit.UnitId) || unit.Hp <= 0)
                    {
                        continue;
                    }

                    if (unitActions[unit.UnitId].AttackDirection == null)
                    {
                        continue;
                    }

                    if (unit.Position == gameState.Exit)
                    {
                        continue;
                    }

                    var attackToX = unitActions[unit.UnitId].NewPosition.X + unitActions[unit.UnitId].AttackDirection.X;
                    var attackToY = unitActions[unit.UnitId].NewPosition.Y + unitActions[unit.UnitId].AttackDirection.Y;
                    var distance = unitActions[unit.UnitId].AttackDirection.X + unitActions[unit.UnitId].AttackDirection.Y;
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


            gameState.CurrentTurn.Clear();

            var allAtEnd = true;
            foreach (var player in gameState.Players)
            {
                for (var i = 0; i < player.Value.Units.Count; i++)
                {
                    var unit = player.Value.Units[i];
                    if (unit.Hp > 0 && unit.Position != gameState.Exit)
                    {
                        allAtEnd = false;
                    }
                }
            }
                
            ServerGameStartedTransferMessage startGameResponse = null;
            if (allAtEnd)
            {
                startGameResponse = ServerLogic.StartNewGame(gameState);
            }

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                if (allAtEnd)
                {
                    responses.Enqueue(startGameResponse);
                }

                responses.Enqueue(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                responses.Enqueue(new ServerYourTurnTransferMessage());
            }
        }
    }
}