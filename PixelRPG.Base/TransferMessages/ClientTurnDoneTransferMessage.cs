using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientTurnDoneTransferMessage
    {
        public Dictionary<int, Point> NewPosition;
    }

    public class ClientTurnDoneTransferMessageParser : TransferMessageParser<ClientTurnDoneTransferMessage>
    {
        protected override string InternalToData(ClientTurnDoneTransferMessage transferModel)
        {
            var result = string.Empty;
            foreach(var pos in transferModel.NewPosition)
            {
                result += $":{pos.Key}:{CommonParsers.Point(pos.Value)}";
            }

            return result;
        }

        protected override ClientTurnDoneTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            var positions = new Dictionary<int, Point>();
            for (var i = 0; i < (splittedData.Length - 1) / 2; i++)
            {
                positions[int.Parse(splittedData[i * 2 + 1])] = CommonParsers.Point(splittedData[i * 2 + 2]);
            }

            return new ClientTurnDoneTransferMessage
            {
                NewPosition = positions,
            };
        }
    }
}
