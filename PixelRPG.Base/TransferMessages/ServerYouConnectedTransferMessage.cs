using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerYouConnectedTransferMessage
    {
        public int PlayerId;
    }

    public class ServerYouConnectedTransferMessageParser : BinaryTransferMessageParser<ServerYouConnectedTransferMessage>
    {
        protected override int Identifier => 7;

        protected override void InternalWrite(ServerYouConnectedTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.PlayerId);
        }

        protected override ServerYouConnectedTransferMessage InternalRead(BinaryReader reader)
        {
            var playerId = reader.ReadInt32();
            return new ServerYouConnectedTransferMessage
            {
                PlayerId = playerId,
            };
        }
    }
}
