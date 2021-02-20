using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerClientConnectedTransferMessage
    {
        public string PlayerName;
        public int PlayerId;
        public int CurrentCount;
        public int WaitingCount;
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

            return new ServerClientConnectedTransferMessage
            {
                PlayerId = playerId,
                PlayerName = playerName,
                CurrentCount = currentCount,
                WaitingCount = waitingCount
            };
        }
    }
}
