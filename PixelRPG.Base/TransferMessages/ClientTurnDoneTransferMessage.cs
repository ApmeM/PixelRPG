using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ClientTurnDoneTransferMessage : ITransferMessage
    {
        public Dictionary<int, UnitActionSubAction> UnitActions;

        public class UnitActionSubAction
        {
            public PointSubMessage NewPosition;
            public PointSubMessage AttackDirection;
        }

        public class PointSubMessage
        {
            public int X;
            public int Y;
        }
    }
}
