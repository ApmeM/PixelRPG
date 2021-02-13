using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class YourTurnTransferMessage
    {
    }


    public class YourTurnTransferMessageParser : TransferMessageParser<YourTurnTransferMessage>
    {
        protected override string InternalToData(YourTurnTransferMessage transferModel)
        {
            return string.Empty;
        }

        protected override YourTurnTransferMessage InternalToTransferModel(string data)
        {
            return new YourTurnTransferMessage{};
        }
    }
}
