using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class ConnectTransferMessage
    {
    }


    public class ConnectTransferMessageParser : TransferMessageParser<ConnectTransferMessage>
    {
        protected override string InternalToData(ConnectTransferMessage transferModel)
        {
            return string.Empty;
        }

        protected override ConnectTransferMessage InternalToTransferModel(string data)
        {
            return new ConnectTransferMessage();
        }
    }
}
