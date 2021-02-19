using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;
using System.IO;

namespace PixelRPG.Base.TransferMessages
{
    public class ServerCurrentStateTransferMessage
    {
        public List<Player> Players;
        public PointTransferMessage? Exit;
        public int?[,] Map;
        public List<PointTransferMessage> Doors;

        public class Player
        {
            public int PlayerId;
            public List<Unit> Units;
        }

        public class Unit
        {
            public int UnitId;
            public PointTransferMessage Position;
        }
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

            writer.Write(transferModel.Map.GetLength(0));
            writer.Write(transferModel.Map.GetLength(1));
            for (var x = 0; x < transferModel.Map.GetLength(0); x++)
                for (var y = 0; y < transferModel.Map.GetLength(1); y++)
                {
                    writer.Write(transferModel.Map[x, y].HasValue);
                    if (transferModel.Map[x, y].HasValue)
                    {
                        writer.Write(transferModel.Map[x, y].Value);
                    }
                }

            writer.Write(transferModel.Doors.Count);
            for (var i = 0; i < transferModel.Doors.Count; i++)
            {
                writer.Write(transferModel.Doors[i].X);
                writer.Write(transferModel.Doors[i].Y);
            }
        }

        protected override ServerCurrentStateTransferMessage InternalRead(BinaryReader reader)
        {
            var playersCount = reader.ReadInt32();
            var players = new List<ServerCurrentStateTransferMessage.Player>(playersCount);

            for (var i = 0; i < playersCount; i++)
            {
                var playerId = reader.ReadInt32();
                var unitsCount = reader.ReadInt32();
                var units = new List<ServerCurrentStateTransferMessage.Unit>(unitsCount);
                for (var j = 0; j < unitsCount; j++)
                {
                    var unitId = reader.ReadInt32();
                    var x = reader.ReadInt32();
                    var y = reader.ReadInt32();
                    units.Add(new ServerCurrentStateTransferMessage.Unit
                    {
                        UnitId = unitId,
                        Position = new PointTransferMessage(x, y)
                    });
                }

                players.Add(new ServerCurrentStateTransferMessage.Player
                {
                    PlayerId = playerId,
                    Units = units
                });
            }

            var existExists = reader.ReadBoolean();
            PointTransferMessage? exit = null;
            if (existExists)
            {
                var x = reader.ReadInt32();
                var y = reader.ReadInt32();
                exit = new PointTransferMessage(x, y);
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
            var junctions = new List<PointTransferMessage>(junctionsCount);
            for (var i = 0; i < junctionsCount; i++)
            {
                var x = reader.ReadInt32();
                var y = reader.ReadInt32();
                junctions.Add(new PointTransferMessage(x, y));
            }

            return new ServerCurrentStateTransferMessage
            {
                Players = players,
                Exit = exit,
                Map = regions,
                Doors = junctions
            };
        }
    }
}
