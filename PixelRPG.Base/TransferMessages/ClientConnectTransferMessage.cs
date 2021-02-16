using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientConnectTransferMessage
    {
        public string PlayerName;
    }

    public class ClientConnectTransferMessageParser : TransferMessageParser<ClientConnectTransferMessage>
    {
        protected override string InternalToData(ClientConnectTransferMessage transferModel)
        {
            return transferModel.PlayerName;
        }

        protected override ClientConnectTransferMessage InternalToTransferModel(string data)
        {
            return new ClientConnectTransferMessage
            {
                PlayerName = data
            };
        }
    }
}
