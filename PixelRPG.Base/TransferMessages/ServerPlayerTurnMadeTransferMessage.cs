using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerPlayerTurnMadeTransferMessage : ITransferMessage
    {
        public int PlayerId;
    }
}
