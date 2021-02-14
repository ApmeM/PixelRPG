namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using System.Linq;
    using Microsoft.Xna.Framework;
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

            var room = gameState.Map.Rooms[gameState.Players.Count];
            gameState.Players[connectionKey] = new GameStateComponent.Player
            {
                Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2),
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

                if (gameState.Players.Count == gameState.MaxPlayersCount)
                {
                    responses.Add(new ServerGameStartedTransferMessage
                    {
                        Map = gameState.Map,
                        Exit = gameState.Exit,
                    });


                    responses.Add(new ServerCurrentStateTransferMessage
                    {
                        Players = gameState.Players.Values.ToList()
                    });

                    responses.Add(new ServerYourTurnTransferMessage());
                }
            }
        }
    }
}