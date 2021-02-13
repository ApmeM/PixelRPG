using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Screens;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class PlayerTurnReadyTransferMessage
    {
        public GameStateComponent.Player Player;
    }

    public class PlayerTurnReadyTransferMessageParser : TransferMessageParser<PlayerTurnReadyTransferMessage>
    {
        protected override string InternalToData(PlayerTurnReadyTransferMessage transferModel)
        {
            return $"{CommonParsers.Player(transferModel.Player)}";
        }

        protected override PlayerTurnReadyTransferMessage InternalToTransferModel(string data)
        {
            return new PlayerTurnReadyTransferMessage
            {
                Player = CommonParsers.Player(data)
            };
        }
    }
}
