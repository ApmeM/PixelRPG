using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerCurrentStateTransferMessage
    {
        public List<PlayerSubMessage> Players;
        public PointSubMessage Exit;
        public int?[,] Map;
        public List<PointSubMessage> Doors;

        public class PlayerSubMessage
        {
            public int PlayerId;
            public List<UnitSubMessage> Units;
        }

        public class UnitSubMessage
        {
            public int UnitId;
            public PointSubMessage Position;
        }

        public class PointSubMessage
        {
            public int X;
            public int Y;
        }
    }
}
