namespace PixelRPG.Base.EntitySystems
{
    using System;
    #region Using Directives

    using System.Linq;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.TransferMessages;
    #endregion

    public class ServerRecieveClientTurnDoneHandler : ServerReceiveHandlerSystem.Handler<ClientTurnDoneTransferMessage>
    {
        protected override void Handle(ServerComponent server, int connectionKey, ClientTurnDoneTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();

            gameState.Players[connectionKey].Position = message.NewPosition;
            gameState.MovedPlayers++;

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                responses.Add(new ServerPlayerTurnMadeTransferMessage
                {
                    PlayerId = connectionKey
                });
            }

            if (gameState.MovedPlayers == gameState.MaxPlayersCount)
            {
                gameState.MovedPlayers = 0;

                var allAtEnd = true;
                foreach (var player in gameState.Players)
                {
                    if (player.Value.Position != gameState.Exit)
                    {
                        allAtEnd = false;
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
                        responses.Add(startGameResponse);
                    }

                    responses.Add(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                    responses.Add(new ServerYourTurnTransferMessage());
                }
            }
        }
    }
}