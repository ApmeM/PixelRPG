using PixelRPG.Base.AdditionalStuff.ClientServer;
using SpineEngine.Utils.Collections;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerCurrentStateTransferMessage : ITransferMessage
    {
        public readonly List<PlayerSubMessage> Players = new List<PlayerSubMessage>();
        public PointSubMessage Exit;
        public readonly List<int?> Map = new List<int?>();
        public readonly List<PointSubMessage> Doors = new List<PointSubMessage>();

        public static ServerCurrentStateTransferMessage Create()
        {
            return Pool<ServerCurrentStateTransferMessage>.Obtain();
        }

        public ServerCurrentStateTransferMessage AddPlayer(int playerId, int levelScore, int totalScore)
        {
            var responsePlayer = PlayerSubMessage.Create();
            responsePlayer.PlayerId = playerId;
            responsePlayer.LevelScore = levelScore;
            responsePlayer.TotalScore = totalScore;
            this.Players.Add(responsePlayer);
            return this;
        }

        public ServerCurrentStateTransferMessage AddUnit(int playerIndex, int unitId, int posX, int posY, int hp)
        {
            var unit = UnitSubMessage.Create();
            unit.Hp = hp;
            unit.UnitId = unitId;
            unit.Position = PointSubMessage.Create();
            unit.Position.X = posX;
            unit.Position.Y = posY;
            this.Players[playerIndex].Units.Add(unit);
            return this;
        }

        public ServerCurrentStateTransferMessage SetExit(int x, int y)
        {
            this.Exit = this.Exit ?? PointSubMessage.Create();
            this.Exit.X = x;
            this.Exit.Y = y;
            return this;
        }

        public ServerCurrentStateTransferMessage AddDoor(int x, int y)
        {
            var door = PointSubMessage.Create();
            door.X = x;
            door.Y = y;
            this.Doors.Add(door);
            return this;
        }

        public partial class PlayerSubMessage
        {
            public int PlayerId;
            public readonly List<UnitSubMessage> Units = new List<UnitSubMessage>();
            public int LevelScore;
            public int TotalScore;

            public static PlayerSubMessage Create()
            {
                return Pool<PlayerSubMessage>.Obtain();
            }
        }

        public partial class UnitSubMessage
        {
            public int UnitId;
            public PointSubMessage Position;
            public int Hp;

            public static UnitSubMessage Create()
            {
                return Pool<UnitSubMessage>.Obtain();
            }
        }

        public partial class PointSubMessage
        {
            public int X;
            public int Y;

            public static PointSubMessage Create()
            {
                return Pool<PointSubMessage>.Obtain();
            }
        }
    }
}
