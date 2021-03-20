using PixelRPG.Base.AdditionalStuff.ClientServer;
using SpineEngine.Utils.Collections;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerPlayerTurnMadeTransferMessage : ITransferMessage
    {
        public int PlayerId;

        public static ServerPlayerTurnMadeTransferMessage Create()
        {
            return Pool<ServerPlayerTurnMadeTransferMessage>.Obtain();
        }

        public ServerPlayerTurnMadeTransferMessage SetPlayerId(int playerId)
        {
            this.PlayerId = playerId;
            return this;
        }
    }
}
