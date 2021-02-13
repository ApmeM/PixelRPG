using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Screens;
using System.Collections.Generic;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class TurnDoneTransferMessage 
    {
        public List<GameStateComponent.Player> Players;
        public GameStateComponent.Player Me;
    }

    public class TurnDoneTransferMessageParser : TransferMessageParser<TurnDoneTransferMessage>
    {
        protected override string InternalToData(TurnDoneTransferMessage transferModel)
        {
            var result = $"{CommonParsers.Player(transferModel.Me)}";
            for (var i = 0; i < transferModel.Players.Count; i++)
            {
                result += $":{CommonParsers.Player(transferModel.Players[i])}";
            }
            return result;
        }

        protected override TurnDoneTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            var players = new List<GameStateComponent.Player>();
            for (var i = 1; i < splittedData.Length; i++)
            {
                players.Add(CommonParsers.Player(splittedData[i]));
            }

            return new TurnDoneTransferMessage
            {
                Me = CommonParsers.Player(splittedData[0]),
                Players = players
            };
        }
    }
}
