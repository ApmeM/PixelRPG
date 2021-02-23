using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientTurnDoneTransferMessage
    {
        public Dictionary<int, PointSubMessage> NewPosition;

        public class PointSubMessage
        {
            public int X;
            public int Y;
        }
    }
}
