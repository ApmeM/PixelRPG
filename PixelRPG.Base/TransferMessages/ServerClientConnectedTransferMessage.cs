using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerClientConnectedTransferMessage
    {
        public string PlayerName;
        public int PlayerId;
        public int CurrentCount;
        public int WaitingCount;
        public List<UnitSubMessage> Units;

        public class UnitSubMessage
        {
            public string UnitType;
            public int UnitId;
        }
    }
}
