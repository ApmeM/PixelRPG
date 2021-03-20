using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;
using SpineEngine.Utils.Collections;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerClientConnectedTransferMessage : ITransferMessage
    {
        public string PlayerName;
        public int PlayerId;
        public int CurrentCount;
        public int WaitingCount;
        public readonly List<UnitSubMessage> Units = new List<UnitSubMessage>();

        public static ServerClientConnectedTransferMessage Create()
        {
            return Pool<ServerClientConnectedTransferMessage>.Obtain();
        }

        public ServerClientConnectedTransferMessage SetData(int playerId, string playerName, int waitingCount, int currentCount)
        {
            this.PlayerId = playerId;
            this.PlayerName = playerName;
            this.WaitingCount = waitingCount;
            this.CurrentCount = currentCount;
            return this;
        }

        public ServerClientConnectedTransferMessage PopulateUnits(List<Unit> units)
        {
            for (var i = 0; i < units.Count; i++)
            {
                var unit = units[i];
                this.AddUnit(unit.UnitId, unit.UnitType);
            }

            return this;
        }

        public ServerClientConnectedTransferMessage AddUnit(int unitId, UnitUtils.UnitType unitType)
        {
            var unitData = UnitSubMessage.Create();
            unitData.UnitId = unitId;
            unitData.UnitType = unitType;
            this.Units.Add(unitData);
            return this;
        }

        public partial class UnitSubMessage
        {
            public UnitUtils.UnitType UnitType;
            public int UnitId;

            public static UnitSubMessage Create()
            {
                return Pool<UnitSubMessage>.Obtain();
            }
        }
    }
}
