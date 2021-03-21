using PixelRPG.Base.AdditionalStuff.ClientServer;
using SpineEngine.Utils.Collections;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerGameStartedTransferMessage : ITransferMessage
    {
        public int Width;
        public int Height;

        public static ServerGameStartedTransferMessage Create()
        {
            return Pool<ServerGameStartedTransferMessage>.Obtain();
        }

        public ServerGameStartedTransferMessage SetSize(int width, int height)
        {
            this.Width = width;
            this.Height = height;
            return this;
        }
    }
}
