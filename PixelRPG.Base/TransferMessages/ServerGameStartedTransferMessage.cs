using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerGameStartedTransferMessage : ITransferMessage
    {
        public int Width;
        public int Height;
    }
}
