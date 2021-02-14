using MazeGenerators;
using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerGameStartedTransferMessage
    {
        public RoomMazeGenerator.Result Map;
        public Point Exit;
    }

    public class ServerGameStartedTransferMessageParser : TransferMessageParser<ServerGameStartedTransferMessage>
    {
        protected override string InternalToData(ServerGameStartedTransferMessage transferModel)
        {
            var result = $"{CommonParsers.Point(transferModel.Exit)}:{CommonParsers.Map(transferModel.Map)}";
            return result;
        }

        protected override ServerGameStartedTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            var result = new ServerGameStartedTransferMessage
            {
                Exit = CommonParsers.Point(splittedData[0]),
                Map = CommonParsers.Map(splittedData[1]),
            };
            return result;
        }
    }
}
