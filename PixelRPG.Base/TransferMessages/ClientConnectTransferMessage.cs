using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientConnectTransferMessage
    {
        public string PlayerName;
    }

    public class ClientConnectTransferMessageParser : BinaryTransferMessageParser<ClientConnectTransferMessage>
    {
        protected override int Identifier => 1;

        protected override void InternalWrite(ClientConnectTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.PlayerName != null);
            if (transferModel.PlayerName != null)
            {
                writer.Write(transferModel.PlayerName);
            }
        }

        protected override ClientConnectTransferMessage InternalRead(BinaryReader reader)
        {
            var playerNameExists = reader.ReadBoolean();
            string playerName = null;
            if (playerNameExists)
            {
                playerName = reader.ReadString();
            }

            return new ClientConnectTransferMessage
            {
                PlayerName = playerName
            };
        }
    }
}
