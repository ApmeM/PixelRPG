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
                var newUnit = UnitUtils.BuildUnit(message.UnitsData[i].UnitType);
                newUnit.UnitId = i + 200;

                var skillsCount = Math.Min(message.UnitsData[i].Skills.Count, gameState.MaxSkillsCount);
                for (var j = 0; j < skillsCount; j++)
                {
                    UnitUtils.ApplySkill(newPlayer, newUnit, message.UnitsData[i].Skills[j]);
                }

                newPlayer.Units.Add(newUnit);
            }

            for (var i = unitsCount; i < gameState.MaxUnitsCount; i++)
            {
                var newUnit = UnitUtils.GetRandomUnit();
                newUnit.UnitId = i + 200;

                newPlayer.Units.Add(newUnit);
            }

            server.Response[connectionKey].Enqueue(ServerYouConnectedTransferMessage.Create()
                .SetPlayerId(newPlayer.PlayerId)
                .PopulateUnits(newPlayer.Units));

            foreach (var player in gameState.Players)
            {
                server.Response[connectionKey].Enqueue(ServerClientConnectedTransferMessage.Create()
                    .SetData(player.Value.PlayerId, player.Value.PlayerName, gameState.MaxPlayersCount, gameState.Players.Count)
                    .PopulateUnits(player.Value.Units));
            }

            gameState.Players[connectionKey] = newPlayer;

            foreach (var player in gameState.Players)
            {
                server.Response[player.Key].Enqueue(ServerClientConnectedTransferMessage.Create()
                    .SetData(newPlayer.PlayerId, message.PlayerName, gameState.MaxPlayersCount, gameState.Players.Count)
                    .PopulateUnits(newPlayer.Units));
            }

            if (gameState.Players.Count == gameState.MaxPlayersCount)
            {
                ServerLogic.StartNewGame(gameState);

                foreach (var player in gameState.Players)
                {
                    var responses = server.Response[player.Key];
                    responses.Enqueue(ServerGameStartedTransferMessage.Create().SetSize(gameState.Map.GetLength(0), gameState.Map.GetLength(1)));
                    responses.Enqueue(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                    responses.Enqueue(ServerYourTurnTransferMessage.Create());
                }
            }
        }
    }
}