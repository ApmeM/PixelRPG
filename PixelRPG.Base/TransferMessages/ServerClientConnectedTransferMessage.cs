using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerClientConnectedTransferMessage
    {
        public string PlayerName;
        public int PlayerId;
        public int CurrentCount;
        public int WaitingCount;
        public List<UnitTransferMessage> Units;

        public class UnitTransferMessage
        {
            public string UnitType;
            public int UnitId;
        }
    }

    public class ServerClientConnectedTransferMessageParser : BinaryTransferMessageParser<ServerClientConnectedTransferMessage>
    {
        protected override int Identifier => 3;

        protected override void InternalWrite(ServerClientConnectedTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.PlayerId);
            writer.Write(transferModel.CurrentCount);
            writer.Write(transferModel.WaitingCount);
            writer.Write(transferModel.PlayerName != null);
            if (transferModel.PlayerName != null)
            {
                writer.Write(transferModel.PlayerName);
            }
            writer.Write(transferModel.Units?.Count ?? 0);
            for (var i = 0; i < (transferModel.Units?.Count ?? 0); i++)
            {
                writer.Write(transferModel.Units[i].UnitId);
                writer.Write(transferModel.Units[i].UnitType);
            }
        }

        protected override ServerClientConnectedTransferMessage InternalRead(BinaryReader reader)
        {
            var playerId = reader.ReadInt32();
            var currentCount = reader.ReadInt32();
            var waitingCount = reader.ReadInt32();
            string playerName = null;
            var playerNameExists = reader.ReadBoolean();
            if (playerNameExists)
            {
                playerName = reader.ReadString();
            }

            var unitsCount = reader.ReadInt32();
            var units = new List<ServerClientConnectedTransferMessage.UnitTransferMessage>(unitsCount);
            for (var i = 0; i < unitsCount; i++)
            {
                var unitId = reader.ReadInt32();
                var unitType = reader.ReadString();
                units.Add(new ServerClientConnectedTransferMessage.UnitTransferMessage
                {
                    UnitId = unitId,
                    UnitType = unitType
                });
            }

            return new ServerClientConnectedTransferMessage
            {
                PlayerId = playerId,
                PlayerName = playerName,
                CurrentCount = currentCount,
                WaitingCount = waitingCount,
                Units = units
            };
        }
    }
}
