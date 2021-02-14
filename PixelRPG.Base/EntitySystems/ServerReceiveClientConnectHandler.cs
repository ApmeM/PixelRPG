namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    using PixelRPG.Base.TransferMessages;

    #endregion

    public class ServerReceiveClientConnectHandler : ServerReceiveHandlerSystem.Handler<ClientConnectTransferMessage>
    {
        protected override void Handle(ServerComponent server, int connectionKey, ClientConnectTransferMessage message)
        {
            var gameState = server.Entity.GetComponent<GameStateComponent>();

            gameState.Players[connectionKey] = new GameStateComponent.Player
            {
                PlayerId = connectionKey + 100500
            };

            foreach (var player in gameState.Players)
            {
                var responses = server.Response[player.Key];
                responses.Add(new ServerClientConnectedTransferMessage
                {
                    PlayerId = player.Key,
                    PlayerName = message.PlayerName,
                    WaitingCount = gameState.MaxPlayersCount,
                    CurrentCount = gameState.Players.Count
                });

                if (player.Value.PlayerId == gameState.Players[connectionKey].PlayerId)
                {
                    responses.Add(new ServerYouConnectedTransferMessage
                    {
                        PlayerId = player.Value.PlayerId
                    });
                }
            }

            if (gameState.Players.Count == gameState.MaxPlayersCount)
            {
                var startGameResponse = ServerLogic.StartNewGame(gameState);

                foreach (var player in gameState.Players)
                {
                    var responses = server.Response[player.Key];
                    responses.Add(startGameResponse);
                    responses.Add(ServerLogic.BuildCurrentStateForPlayer(gameState, player.Value));
                    responses.Add(new ServerYourTurnTransferMessage());
                }
            }
        }
    }
}