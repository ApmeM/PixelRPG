using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerClientConnectedTransferMessage
    {
        public string PlayerName;
        public int PlayerId;
        public int CurrentCount;
        public int WaitingCount;
    }

    public class ServerClientConnectedTransferMessageParser : TransferMessageParser<ServerClientConnectedTransferMessage>
    {
        protected override string InternalToData(ServerClientConnectedTransferMessage transferModel)
        {
            return $"{transferModel.PlayerId}:{transferModel.PlayerName}:{transferModel.CurrentCount}:{transferModel.WaitingCount}";
        }

        protected override ServerClientConnectedTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            return new ServerClientConnectedTransferMessage
            {
                PlayerId = int.Parse(splittedData[0]),
                PlayerName = splittedData[1],
                CurrentCount = int.Parse(splittedData[2]),
                WaitingCount = int.Parse(splittedData[3])
            };
        }
    }
}
