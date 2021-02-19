using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerGameStartedTransferMessage
    {
        public int Width;
        public int Height;
    }

    public class ServerGameStartedTransferMessageParser : BinaryTransferMessageParser<ServerGameStartedTransferMessage>
    {
        protected override int Identifier => 5;

        protected override void InternalWrite(ServerGameStartedTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.Width);
            writer.Write(transferModel.Height);
        }

        protected override ServerGameStartedTransferMessage InternalRead(BinaryReader reader)
        {
            var width = reader.ReadInt32();
            var height = reader.ReadInt32();
            return 
                new ServerGameStartedTransferMessage
                {
                    Width = width,
                    Height = height
                };
        }
    }
}
