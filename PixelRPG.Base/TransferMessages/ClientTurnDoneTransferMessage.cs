using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientTurnDoneTransferMessage
    {
        public Point NewPosition;
    }

    public class ClientTurnDoneTransferMessageParser : TransferMessageParser<ClientTurnDoneTransferMessage>
    {
        protected override string InternalToData(ClientTurnDoneTransferMessage transferModel)
        {
            return $"{CommonParsers.Point(transferModel.NewPosition)}";
        }

        protected override ClientTurnDoneTransferMessage InternalToTransferModel(string data)
        {
            return new ClientTurnDoneTransferMessage
            {
                NewPosition = CommonParsers.Point(data),
            };
        }
    }
}
