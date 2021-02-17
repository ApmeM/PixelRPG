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

            for (var i = 0; i < gameState.Players[connectionKey].Units.Count; i++)
            {
                if (!message.NewPosition.ContainsKey(gameState.Players[connectionKey].Units[i].UnitId))
                {
                    continue;
                }

                var newPosition = message.NewPosition[gameState.Players[connectionKey].Units[i].UnitId];
                var canMove = true;
                if (newPosition != gameState.Exit)
                {
                    //foreach (var player in gameState.Players)
                    var player = gameState.Players[connectionKey];
                    {
                        for (var j = 0; j < player.Units.Count; j++)
                        {
                            if (player.Units[j].Position == newPosition)
                            {
                                canMove = false;
                                break;
                            }
                        }

                        //if (!canMove)
                        //{
                        //    break;
                        //}
                    }
                }

                if (canMove)
                {
                    gameState.Players[connectionKey].Units[i].Position = newPosition;
                }
            }

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
                    for (var i = 0; i < player.Value.Units.Count; i++)
                    {
                        if (player.Value.Units[i].Position != gameState.Exit)
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
                        responses.Add(startGameResponse);
                    }

                    responses.Add(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                    responses.Add(new ServerYourTurnTransferMessage());
                }
            }
        }
    }
}