using MazeGenerators;
using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerCurrentStateTransferMessage
    {
        public List<GameStateComponent.Player> Players;
        public Point? Exit;
        public RoomMazeGenerator.Result Map;
    }

    public class ServerCurrentStateTransferMessageParser : TransferMessageParser<ServerCurrentStateTransferMessage>
    {
        protected override string InternalToData(ServerCurrentStateTransferMessage transferModel)
        {
            var result = $"1";
            for (var i = 0; i < transferModel.Players.Count; i++)
            {
                result += $":{CommonParsers.Player(transferModel.Players[i])}";
            }
            return result;
        }

        protected override ServerCurrentStateTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            var players = new List<GameStateComponent.Player>();
            for (var i = 1; i < splittedData.Length; i++)
            {
                players.Add(CommonParsers.Player(splittedData[i]));
            }

            return new ServerCurrentStateTransferMessage
            {
                Players = players
            };
        }
    }
}
