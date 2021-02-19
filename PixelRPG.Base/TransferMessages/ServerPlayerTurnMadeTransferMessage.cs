using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerPlayerTurnMadeTransferMessage
    {
        public int PlayerId;
    }

    public class ServerPlayerTurnMadeTransferMessageParser : BinaryTransferMessageParser<ServerPlayerTurnMadeTransferMessage>
    {
        protected override int Identifier => 6;

        protected override void InternalWrite(ServerPlayerTurnMadeTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.PlayerId);
        }

        protected override ServerPlayerTurnMadeTransferMessage InternalRead(BinaryReader reader)
        {
            var playerId = reader.ReadInt32();
            return new ServerPlayerTurnMadeTransferMessage
            {
                PlayerId = playerId,
            };
        }
    }
}
