using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class PlayerTurnDoneTransferMessage
    {
        public Point NewPosition;
    }

    public class PlayerTurnDoneTransferMessageParser : TransferMessageParser<PlayerTurnDoneTransferMessage>
    {
        protected override string InternalToData(PlayerTurnDoneTransferMessage transferModel)
        {
            return $"{CommonParsers.Point(transferModel.NewPosition)}";
        }

        protected override PlayerTurnDoneTransferMessage InternalToTransferModel(string data)
        {
            return new PlayerTurnDoneTransferMessage
            {
                NewPosition = CommonParsers.Point(data),
            };
        }
    }
}
