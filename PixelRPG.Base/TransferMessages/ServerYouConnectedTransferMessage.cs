using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerYouConnectedTransferMessage : ITransferMessage
    {
        public int PlayerId;
        public List<UnitSubMessage> UnitsData = new List<UnitSubMessage>();

        public class UnitSubMessage
        {
            public UnitUtils.UnitType UnitType;
            public int UnitId;
            public int VisionRange;
            public int MoveRange;
            public int MaxHp;
            public int Hp;
            public int AttackDistance;
            public int AttackRadius;
            public int AttackDamage;
            public bool AttackFriendlyFire;
        }
    }
}
