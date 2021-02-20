using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerYourTurnTransferMessage
    {
    }

    public class ServerYourTurnTransferMessageParser : BinaryTransferMessageParser<ServerYourTurnTransferMessage>
    {
        protected override int Identifier => 8;

        protected override void InternalWrite(ServerYourTurnTransferMessage transferModel, BinaryWriter writer)
        {
        }

        protected override ServerYourTurnTransferMessage InternalRead(BinaryReader reader)
        {
            return new ServerYourTurnTransferMessage { };
        }
    }
}
