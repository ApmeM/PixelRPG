using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientTurnDoneTransferMessage
    {
        public Dictionary<int, PointTransferMessage> NewPosition;
    }

    public class ClientTurnDoneTransferMessageParser : BinaryTransferMessageParser<ClientTurnDoneTransferMessage>
    {
        protected override int Identifier => 2;

        protected override void InternalWrite(ClientTurnDoneTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.NewPosition.Count);
            foreach (var pos in transferModel.NewPosition)
            {
                writer.Write(pos.Key);
                writer.Write(pos.Value.X);
                writer.Write(pos.Value.Y);
            }
        }

        protected override ClientTurnDoneTransferMessage InternalRead(BinaryReader reader)
        {
            var positions = new Dictionary<int, PointTransferMessage>();
            var count = reader.ReadInt32();
            for (var i = 0; i < count; i++)
            {
                var key = reader.ReadInt32();
                var x = reader.ReadInt32();
                var y = reader.ReadInt32();
                positions[key] = new PointTransferMessage(x, y);
            }

            return new ClientTurnDoneTransferMessage
            {
                NewPosition = positions,
            };
        }
    }
}
