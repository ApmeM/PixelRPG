using MazeGenerators;
using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components;
using System.Collections.Generic;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerCurrentStateTransferMessage
    {
        public List<GameStateComponent.Player> Players;
        public Point? Exit;
        public RoomMazeGenerator.Result Map;
    }

    public class ServerCurrentStateTransferMessageParser : BinaryTransferMessageParser<ServerCurrentStateTransferMessage>
    {
        protected override int Identifier => 4;

        protected override void InternalWrite(ServerCurrentStateTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.Players.Count);
            for (var i = 0; i < transferModel.Players.Count; i++)
            {
                writer.Write(transferModel.Players[i].PlayerId);
                writer.Write(transferModel.Players[i].Units.Count);
                for (var j = 0; j < transferModel.Players[i].Units.Count; j++)
                {
                    writer.Write(transferModel.Players[i].Units[j].UnitId);
                    writer.Write(transferModel.Players[i].Units[j].Position.X);
                    writer.Write(transferModel.Players[i].Units[j].Position.Y);
                }
            }

            writer.Write(transferModel.Exit.HasValue);
            if (transferModel.Exit.HasValue)
            {
                writer.Write(transferModel.Exit.Value.X);
                writer.Write(transferModel.Exit.Value.Y);
            }

            writer.Write(transferModel.Map.Regions.GetLength(0));
            writer.Write(transferModel.Map.Regions.GetLength(1));
            for (var x = 0; x < transferModel.Map.Regions.GetLength(0); x++)
                for (var y = 0; y < transferModel.Map.Regions.GetLength(1); y++)
                {
                    writer.Write(transferModel.Map.Regions[x, y].HasValue);
                    if (transferModel.Map.Regions[x, y].HasValue)
                    {
                        writer.Write(transferModel.Map.Regions[x, y].Value);
                    }
                }

            writer.Write(transferModel.Map.Junctions.Count);
            for (var i = 0; i < transferModel.Map.Junctions.Count; i++)
            {
                writer.Write(transferModel.Map.Junctions[i].X);
                writer.Write(transferModel.Map.Junctions[i].Y);
            }
        }

        protected override ServerCurrentStateTransferMessage InternalRead(BinaryReader reader)
        {
            var playersCount = reader.ReadInt32();
            var players = new List<GameStateComponent.Player>(playersCount);

            for (var i = 0; i < playersCount; i++)
            {
                var playerId = reader.ReadInt32();
                var unitsCount = reader.ReadInt32();
                var units = new List<GameStateComponent.Unit>(unitsCount);
                for (var j = 0; j < unitsCount; j++)
                {
                    var unitId = reader.ReadInt32();
                    var x = reader.ReadInt32();
                    var y = reader.ReadInt32();
                    units.Add(new GameStateComponent.Unit
                    {
                        UnitId = unitId,
                        Position = new Point(x, y)
                    });
                }

                players.Add(new GameStateComponent.Player
                {
                    PlayerId = playerId,
                    Units = units
                });
            }

            var existExists = reader.ReadBoolean();
            Point? exit = null;
            if (existExists)
            {
                var x = reader.ReadInt32();
                var y = reader.ReadInt32();
                exit = new Point(x, y);
            }

            var mapWidth = reader.ReadInt32();
            var mapHeight = reader.ReadInt32();
            var regions = new int?[mapWidth, mapHeight];
            for (var x = 0; x < mapWidth; x++)
                for (var y = 0; y < mapHeight; y++)
                {
                    var regionExists = reader.ReadBoolean();
                    if (regionExists)
                    {
                        regions[x, y] = reader.ReadInt32();
                    }
                }

            var junctionsCount = reader.ReadInt32();
            var junctions = new List<MazeGenerators.Utils.Vector2>(junctionsCount);
            for (var i = 0; i < junctionsCount; i++)
            {
                var x = reader.ReadInt32();
                var y = reader.ReadInt32();
                junctions.Add(new MazeGenerators.Utils.Vector2(x, y));
            }

            return new ServerCurrentStateTransferMessage
            {
                Players = players,
                Exit = exit,
                Map = new RoomMazeGenerator.Result
                {
                    Regions = regions,
                    Junctions = junctions
                }
            };
        }
    }
}
