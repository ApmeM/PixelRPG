using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerYourTurnTransferMessage
    {
    }


    public class ServerYourTurnTransferMessageParser : TransferMessageParser<ServerYourTurnTransferMessage>
    {
        protected override string InternalToData(ServerYourTurnTransferMessage transferModel)
        {
            return string.Empty;
        }

        protected override ServerYourTurnTransferMessage InternalToTransferModel(string data)
        {
            return new ServerYourTurnTransferMessage { };
        }
    }
}
