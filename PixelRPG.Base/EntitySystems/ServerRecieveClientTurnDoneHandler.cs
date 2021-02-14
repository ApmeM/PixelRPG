namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using System.Linq;
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

                if (gameState.MovedPlayers == gameState.MaxPlayersCount)
                {
                    responses.Add(new ServerCurrentStateTransferMessage
                    {
                        Players = gameState.Players.Values.ToList(),
                    });

                    responses.Add(new ServerYourTurnTransferMessage());
                }
            }

            if (gameState.MovedPlayers == gameState.MaxPlayersCount)
            {
                gameState.MovedPlayers = 0;
            }
        }
    }
}