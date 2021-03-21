using PixelRPG.Base.AdditionalStuff.ClientServer;
using SpineEngine.Utils.Collections;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerYourTurnTransferMessage : ITransferMessage
    {
        public static ServerYourTurnTransferMessage Create()
        {
            return Pool<ServerYourTurnTransferMessage>.Obtain();
        }
    }
}
