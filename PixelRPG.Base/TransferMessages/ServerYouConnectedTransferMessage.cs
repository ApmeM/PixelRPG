using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerYouConnectedTransferMessage
    {
        public int PlayerId;
    }

    public class ServerYouConnectedTransferMessageParser : TransferMessageParser<ServerYouConnectedTransferMessage>
    {
        protected override string InternalToData(ServerYouConnectedTransferMessage transferModel)
        {
            return $"{transferModel.PlayerId}";
        }

        protected override ServerYouConnectedTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            return new ServerYouConnectedTransferMessage
            {
                PlayerId = int.Parse(splittedData[0]),
            };
        }
    }
}
