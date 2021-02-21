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
    using System.Collections.Generic;

    #endregion

    public class ServerLogic
    {
        public static ServerCurrentStateTransferMessage BuildCurrentStateForPlayer(GameStateComponent gameState, GameStateComponent.Player player)
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
                Players = gameState.Players.Values.Select(a => new ServerCurrentStateTransferMessage.PlayerTransferMessage
                {
                    PlayerId = a.PlayerId,
                    Units = a.Units
                        .Where(b => IsVisible(player, gameState.Exit.X, gameState.Exit.Y, b.Position.X, b.Position.Y))
                        .Select(b => new ServerCurrentStateTransferMessage.UnitTransferMessage { 
                            UnitId = b.UnitId,
                            Position = new PointTransferMessage(b.Position.X, b.Position.Y)
                        })
                        .ToList()
                }).ToList(),
                Exit = IsVisible(player, gameState.Exit.X, gameState.Exit.Y, gameState.Exit.X, gameState.Exit.Y) ? new PointTransferMessage(gameState.Exit.X, gameState.Exit.Y) : (PointTransferMessage?)null,
                Map = regions,
                Doors = gameState.Doors.Where(a => IsVisible(player, gameState.Exit.X, gameState.Exit.Y, a.X, a.Y)).Select(a => new PointTransferMessage(a.X, a.Y)).ToList()
            };
        }

        public static bool IsVisible(GameStateComponent.Player fromPlayer, int exitX, int exitY, int x, int y)
        {
            for (var i = 0; i < fromPlayer.Units.Count; i++)
            {
                if (fromPlayer.Units[i].Position.X == exitX && fromPlayer.Units[i].Position.Y == exitY)
                {
                    return true;
                }

                if (Math.Abs(x - fromPlayer.Units[i].Position.X) + Math.Abs(y - fromPlayer.Units[i].Position.Y) < 7)
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

            gameState.Players = gameState.Players ?? new Dictionary<int, GameStateComponent.Player>();
            var roomIdx = 0;
            foreach (var player in gameState.Players)
            {
                var room = maze.Rooms[roomIdx];
                roomIdx++;
                if (player.Value.Units == null)
                {
                    player.Value.Units = new List<GameStateComponent.Unit>
                    {
                        new GameStateComponent.Unit{UnitId = 1},
                        new GameStateComponent.Unit{UnitId = 2},
                        new GameStateComponent.Unit{UnitId = 3},
                        new GameStateComponent.Unit{UnitId = 4}
                    };
                }

                player.Value.Units[0].Position = new Point(room.X + room.Width / 2 - 1, room.Y + room.Height / 2);
                player.Value.Units[1].Position = new Point(room.X + room.Width / 2 + 1, room.Y + room.Height / 2);
                player.Value.Units[2].Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2 - 1);
                player.Value.Units[3].Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2 + 1);
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