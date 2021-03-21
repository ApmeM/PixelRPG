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
    using System.Collections.Generic;

    #endregion

    public class ServerLogic
    {
        public static ServerCurrentStateTransferMessage BuildCurrentStateForPlayer(GameStateComponent gameState, Player player)
        {
            var result = ServerCurrentStateTransferMessage.Create();

            var width = gameState.Map.GetLength(0);
            var height = gameState.Map.GetLength(1);
            for (var x = 0; x < width; x++)
                for (var y = 0; y < height; y++)
                {
                    result.Map.Add(IsVisible(player, gameState.Exit.X, gameState.Exit.Y, x, y) ? gameState.Map[x, y] : (int?)null);
                }

            var idx = 0;
            foreach (var statePlayer in gameState.Players.Values)
            {
                result.AddPlayer(statePlayer.PlayerId, statePlayer.LevelScore, statePlayer.TotalScore);
                for (var j = 0; j < statePlayer.Units.Count; j++)
                {
                    var b = statePlayer.Units[j];
                    if (!IsVisible(player, gameState.Exit.X, gameState.Exit.Y, b.Position.X, b.Position.Y) && player.PlayerId != statePlayer.PlayerId)
                    {
                        continue;
                    }

                    result.AddUnit(idx, b.UnitId, b.Position.X, b.Position.Y, b.Hp);
                }
                idx++;
            }
            if (IsVisible(player, gameState.Exit.X, gameState.Exit.Y, gameState.Exit.X, gameState.Exit.Y))
            {
                result.SetExit(gameState.Exit.X, gameState.Exit.Y);
            }
            for (var i = 0; i < gameState.Doors.Count; i++)
            {
                var door = gameState.Doors[i];
                if (!IsVisible(player, gameState.Exit.X, gameState.Exit.Y, door.X, door.Y))
                {
                    continue;
                }

                result.AddDoor(door.X, door.Y);
            }

            return result;
        }

        public static bool IsVisible(Player fromPlayer, int exitX, int exitY, int x, int y)
        {
            //ToDo: this can be calculated once when last unit died.
            var allDead = true;
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

        public static void StartNewGame(GameStateComponent gameState)
        {
            gameState.AtEnd.Clear();

            var maze = new RoomMazeGenerator().Generate(new RoomMazeGenerator.Settings { 
                Width = 71,
                Height = 41,
                AdditionalPassages = 20, 
                WindingPercent = 50,
                RoomSize = 3
            });
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
                player.Value.LevelScore = 0;
                for (var i = 0; i < player.Value.Units.Count; i++)
                {
                    player.Value.Units[i].Hp = player.Value.Units[i].MaxHp;
                }
            }
            
            gameState.Exit = new Point(maze.Rooms[maze.Rooms.Count - 1].X + maze.Rooms[maze.Rooms.Count - 1].Width / 2, maze.Rooms[maze.Rooms.Count - 1].Y + maze.Rooms[maze.Rooms.Count - 1].Height / 2);
        }

        public static long GetFullUnitId(Player player, Unit unit)
        {
            return GetFullUnitId(player.PlayerId, unit.UnitId);
        }
        public static long GetFullUnitId(int playerId, int unitId)
        {
            return ((long)playerId << 32) | ((long)unitId & 0xFFFFFFFFL);
        }
    }
}