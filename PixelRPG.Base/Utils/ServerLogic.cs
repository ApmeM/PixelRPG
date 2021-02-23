namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using System.Linq;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.TransferMessages;
    using System;
    using MazeGenerators;
    using PixelRPG.Base.Screens;
    using PixelRPG.Base.Components.GameState;

    #endregion

    public class ServerLogic
    {
        public static ServerCurrentStateTransferMessage BuildCurrentStateForPlayer(GameStateComponent gameState, Player player)
        {
            var width = gameState.Map.GetLength(0);
            var height = gameState.Map.GetLength(1);
            var regions = new int?[width, height];
            for (var x = 0; x < width; x++)
                for (var y = 0; y < height; y++)
                {
                    regions[x, y] = IsVisible(player, gameState.Exit.X, gameState.Exit.Y, x, y) ? gameState.Map[x, y] : (int?)null;
                }

            return new ServerCurrentStateTransferMessage
            {
                Players = gameState.Players.Values.Select(a => new ServerCurrentStateTransferMessage.PlayerSubMessage
                {
                    PlayerId = a.PlayerId,
                    Units = a.Units
                        .Where(b => IsVisible(player, gameState.Exit.X, gameState.Exit.Y, b.Position.X, b.Position.Y) || player.PlayerId == a.PlayerId)
                        .Select(b => new ServerCurrentStateTransferMessage.UnitSubMessage
                        {
                            UnitId = b.UnitId,
                            Position = new ServerCurrentStateTransferMessage.PointSubMessage
                            {
                                X = b.Position.X,
                                Y = b.Position.Y
                            },
                            Hp = b.Hp
                        })
                        .ToList()
                }).ToList(),
                Exit = IsVisible(player, gameState.Exit.X, gameState.Exit.Y, gameState.Exit.X, gameState.Exit.Y) ? new ServerCurrentStateTransferMessage.PointSubMessage
                {
                    X = gameState.Exit.X,
                    Y = gameState.Exit.Y
                } : null,
                Map = regions,
                Doors = gameState.Doors.Where(a => IsVisible(player, gameState.Exit.X, gameState.Exit.Y, a.X, a.Y)).Select(a => new ServerCurrentStateTransferMessage.PointSubMessage
                {
                    X = a.X,
                    Y = a.Y
                }).ToList()
            };
        }

        public static bool IsVisible(Player fromPlayer, int exitX, int exitY, int x, int y)
        {
            //ToDo: this can be calculated once when last unit died.
            var allDead = false;
            for (var i = 0; i < fromPlayer.Units.Count; i++)
            {
                var unit = fromPlayer.Units[i];
                if (unit.Hp <= 0)
                {
                    continue;
                }
                allDead = false;
            }
            
            if (allDead)
            {
                return true;
            }

            for (var i = 0; i < fromPlayer.Units.Count; i++)
            {
                var unit = fromPlayer.Units[i];
                if (unit.Hp <= 0)
                {
                    continue;
                }

                if (unit.Position.X == exitX && unit.Position.Y == exitY)
                {
                    return true;
                }

                if (Math.Abs(x - unit.Position.X) + Math.Abs(y - unit.Position.Y) < unit.VisionRange)
                {
                    return true;
                }
            }
            return false;
        }

        public static ServerGameStartedTransferMessage StartNewGame(GameStateComponent gameState)
        {
            var maze = new RoomMazeGenerator().Generate(new RoomMazeGenerator.Settings(71, 41) { ExtraConnectorChance = 5, WindingPercent = 50 });
            gameState.Map = maze.Regions;
            gameState.Doors = maze.Junctions.Select(a => new Point(a.X, a.Y)).ToList();
            for (var x = 0; x < gameState.Map.GetLength(0); x++)
                for (var y = 0; y < gameState.Map.GetLength(1); y++)
                {
                    gameState.Map[x, y] = gameState.Map[x, y] == null ? GameSceneConfig.WallRegionValue : GameSceneConfig.PathRegionValue;
                }

            var roomIdx = 0;
            foreach (var player in gameState.Players)
            {
                var room = maze.Rooms[roomIdx];
                roomIdx++;
                player.Value.Units[0].Position = new Point(room.X + room.Width / 2 - 1, room.Y + room.Height / 2);
                player.Value.Units[1].Position = new Point(room.X + room.Width / 2 + 1, room.Y + room.Height / 2);
                player.Value.Units[2].Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2 - 1);
                player.Value.Units[3].Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2 + 1);
                
                for (var i = 0; i < player.Value.Units.Count; i++)
                {
                    player.Value.Units[i].Hp = player.Value.Units[i].MaxHp;
                }
            }
            
            gameState.Exit = new Point(maze.Rooms[maze.Rooms.Count - 1].X + maze.Rooms[maze.Rooms.Count - 1].Width / 2, maze.Rooms[maze.Rooms.Count - 1].Y + maze.Rooms[maze.Rooms.Count - 1].Height / 2);

            return new ServerGameStartedTransferMessage
            {
                Width = gameState.Map.GetLength(0),
                Height = gameState.Map.GetLength(1)
            };
        }
    }
}