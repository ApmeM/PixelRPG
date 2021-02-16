using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerGameStartedTransferMessage
    {
        public int Width;
        public int Height;
    }

    public class ServerGameStartedTransferMessageParser : TransferMessageParser<ServerGameStartedTransferMessage>
    {
        protected override string InternalToData(ServerGameStartedTransferMessage transferModel)
        {
            return $"{transferModel.Width}:{transferModel.Height}";
        }

        protected override ServerGameStartedTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            return 
                new ServerGameStartedTransferMessage
                {
                    Width = int.Parse(splittedData[0]),
                    Height = int.Parse(splittedData[1])
                };
        }
    }
}
