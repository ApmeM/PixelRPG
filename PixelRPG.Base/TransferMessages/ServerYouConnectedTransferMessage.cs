using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerYouConnectedTransferMessage
    {
        public int PlayerId;
        public List<UnitSubMessage> UnitsData = new List<UnitSubMessage>();

        public class UnitSubMessage
        {
            public string UnitType;
            public int UnitId;
            public int VisionRange;
            public int MoveRange;
        }
    }
}
