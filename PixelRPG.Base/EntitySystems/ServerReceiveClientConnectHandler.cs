namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    using PixelRPG.Base.TransferMessages;
    using PixelRPG.Base.Components.GameState;
    using System.Collections.Generic;
    using System;
    using System.Linq;

    #endregion

    public class ServerReceiveClientConnectHandler : ServerReceiveHandlerSystem.Handler<ClientConnectTransferMessage>
    {
        protected override void Handle(ServerComponent server, int connectionKey, ClientConnectTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();

            var newPlayer = new Player
            {
                PlayerId = connectionKey + 100500,
                PlayerName = message.PlayerName,
                Units = new List<Unit>()
            };
            var unitsCount = Math.Min(message.UnitsData.Count, gameState.MaxUnitsCount);
            for (var i = 0; i < unitsCount; i++)
            {
                var unitType = GameStateUtils.FindUnitType(message.UnitsData[i].UnitType);
                var newUnit = unitType.Generate();
                newUnit.UnitId = i + 200;
                newUnit.UnitTypeName = GameStateUtils.GetUnitTypeName(unitType);

                var skillsCount = Math.Min(message.UnitsData[i].Skills.Count, gameState.MaxSkillsCount);
                for (var j = 0; j < skillsCount; j++)
                {
                    var skillType = GameStateUtils.FindSkill(message.UnitsData[i].Skills[j]);
                    skillType.Apply(newPlayer, newUnit);
                }

                newPlayer.Units.Add(newUnit);
            }

            for (var i = unitsCount; i < gameState.MaxUnitsCount; i++)
            {
                var unitType = GameStateUtils.GetRandomUnitType();
                var newUnit = unitType.Generate();
                newUnit.UnitId = i + 200;
                newUnit.UnitTypeName = GameStateUtils.GetUnitTypeName(unitType);

                newPlayer.Units.Add(newUnit);
            }

            server.Response[connectionKey].Enqueue(new ServerYouConnectedTransferMessage
            {
                PlayerId = newPlayer.PlayerId,
                UnitsData = newPlayer.Units.Select(a => new ServerYouConnectedTransferMessage.UnitSubMessage
                {
                    UnitId = a.UnitId,
                    UnitType = a.UnitTypeName,
                    VisionRange = a.VisionRange,
                    MoveRange = a.MoveRange,
                    AttackDamage = a.AttackDamage,
                    AttackDistance = a.AttackDistance,
                    AttackFriendlyFire = a.AttackFriendlyFire,
                    AttackRadius = a.AttackRadius,
                    Hp = a.Hp,
                    MaxHp = a.MaxHp,
                }).ToList()
            });

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[connectionKey];
                responses.Enqueue(new ServerClientConnectedTransferMessage
                {
                    PlayerId = player.Value.PlayerId,
                    PlayerName = player.Value.PlayerName,
                    Units = BuildUnits(player.Value.Units),
                    WaitingCount = gameState.MaxPlayersCount,
                    CurrentCount = gameState.Players.Count
                });
            }

            gameState.Players[connectionKey] = newPlayer;

            var units = BuildUnits(newPlayer.Units);
            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                responses.Enqueue(new ServerClientConnectedTransferMessage
                {
                    PlayerId = newPlayer.PlayerId,
                    PlayerName = message.PlayerName,
                    Units = units,
                    WaitingCount = gameState.MaxPlayersCount,
                    CurrentCount = gameState.Players.Count
                });
            }

            if (gameState.Players.Count == gameState.MaxPlayersCount)
            {
                var startGameResponse = ServerLogic.StartNewGame(gameState);

                foreach (var player in gameState.Players)
                {
                    var responses = server.Response[player.Key];
                    responses.Enqueue(startGameResponse);
                    responses.Enqueue(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                    responses.Enqueue(new ServerYourTurnTransferMessage());
                }
            }
        }

        private List<ServerClientConnectedTransferMessage.UnitSubMessage> BuildUnits(List<Unit> units)
        {
            var result = new List<ServerClientConnectedTransferMessage.UnitSubMessage>();
            for (var i = 0; i < units.Count; i++)
            {
                var unit = units[i];
                result.Add(new ServerClientConnectedTransferMessage.UnitSubMessage
                {
                    UnitId = unit.UnitId,
                    UnitType = unit.UnitTypeName
                });
            }

            return result;
        }
    }
}