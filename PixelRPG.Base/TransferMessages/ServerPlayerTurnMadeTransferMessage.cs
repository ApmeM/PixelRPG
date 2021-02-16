using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerPlayerTurnMadeTransferMessage
    {
        public int PlayerId;
    }

    public class ServerPlayerTurnMadeTransferMessageParser : TransferMessageParser<ServerPlayerTurnMadeTransferMessage>
    {
        protected override string InternalToData(ServerPlayerTurnMadeTransferMessage transferModel)
        {
            return $"{transferModel.PlayerId}";
        }

        protected override ServerPlayerTurnMadeTransferMessage InternalToTransferModel(string data)
        {
            return new ServerPlayerTurnMadeTransferMessage
            {
                PlayerId = int.Parse(data)
            };
        }
    }
}
