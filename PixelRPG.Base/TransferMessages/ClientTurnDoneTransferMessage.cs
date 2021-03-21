using PixelRPG.Base.AdditionalStuff.ClientServer;
using SpineEngine.Utils.Collections;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ClientTurnDoneTransferMessage : ITransferMessage
    {
        public readonly Dictionary<int, UnitActionSubMessage> UnitActions = new Dictionary<int, UnitActionSubMessage>();

        public static ClientTurnDoneTransferMessage Create()
        {
            return Pool<ClientTurnDoneTransferMessage>.Obtain();
        }

        public ClientTurnDoneTransferMessage SetNewPosition(int unitId, int x, int y)
        {
            if (!UnitActions.ContainsKey(unitId))
            {
                UnitActions[unitId] = UnitActionSubMessage.Create();
            }

            UnitActions[unitId].NewPosition = UnitActions[unitId].NewPosition ?? PointSubMessage.Create();
            UnitActions[unitId].NewPosition.X = x;
            UnitActions[unitId].NewPosition.Y = y;
            return this;
        }
        public ClientTurnDoneTransferMessage SetAttackDirection(int unitId, int x, int y)
        {
            if (!UnitActions.ContainsKey(unitId))
            {
                UnitActions[unitId] = UnitActionSubMessage.Create();
            }

            UnitActions[unitId].AttackDirection = UnitActions[unitId].AttackDirection ?? PointSubMessage.Create();
            UnitActions[unitId].AttackDirection.X = x;
            UnitActions[unitId].AttackDirection.Y = y;
            return this;
        }

        public partial class UnitActionSubMessage
        {
            public PointSubMessage NewPosition;
            public PointSubMessage AttackDirection;

            public static UnitActionSubMessage Create()
            {
                return Pool<UnitActionSubMessage>.Obtain();
            }
        }

        public partial class PointSubMessage
        {
            public int X;
            public int Y;

            public static PointSubMessage Create()
            {
                return Pool<PointSubMessage>.Obtain();
            }
        }
    }
}
