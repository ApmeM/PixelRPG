using PixelRPG.Base.Components.GameState;
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
            public UnitUtils.UnitType UnitType;
            public int UnitId;
        }
    }
}
