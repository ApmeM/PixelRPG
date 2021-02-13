using MazeGenerators;
using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Screens;
using System.Collections.Generic;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class MapTransferMessage
    {
        public RoomMazeGenerator.Result Map;
        public List<GameStateComponent.Player> Players;
        public GameStateComponent.Player Me;
        public Point Exit;
    }

    public class MapTransferMessageParser : TransferMessageParser<MapTransferMessage>
    {
        protected override string InternalToData(MapTransferMessage transferModel)
        {
            var result = $"{CommonParsers.Point(transferModel.Exit)}:{CommonParsers.Player(transferModel.Me)}:{CommonParsers.Map(transferModel.Map)}";
            for (var i = 0; i < transferModel.Players.Count; i++)
            {
                result += $":{CommonParsers.Player(transferModel.Players[i])}";
            }
            return result;
        }

        protected override MapTransferMessage InternalToTransferModel(string data)
        {
            var splittedData = data.Split(':');
            var players = new List<GameStateComponent.Player>();
            for (var i = 3; i < splittedData.Length; i++)
            {
                players.Add(CommonParsers.Player(splittedData[i]));
            }

            var result = new MapTransferMessage
            {
                Exit = CommonParsers.Point(splittedData[0]),
                Me = CommonParsers.Player(splittedData[1]),
                Map = CommonParsers.Map(splittedData[2]),
                Players = players
            };
            return result;
        }
    }
}
