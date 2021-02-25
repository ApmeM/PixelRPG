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
            public int LevelScore;
            public int TotalScore;
        }

        public class UnitSubMessage
        {
            public int UnitId;
            public PointSubMessage Position;
            public int Hp;
        }

        public class PointSubMessage
        {
            public int X;
            public int Y;
        }
    }
}
