using MazeGenerators;
using Microsoft.Xna.Framework;
using PixelRPG.Base.Components;
using System;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class CommonParsers
    {
        public static string Player(GameStateComponent.Player message)
        {
            return $"{message.PlayerId},{message.Position.X},{message.Position.Y}";
        }

        public static GameStateComponent.Player Player(string data)
        {
            var values = data.Split(',');
            return new GameStateComponent.Player
            {
                PlayerId = int.Parse(values[0]),
                Position = new Point
                {
                    X = int.Parse(values[1]),
                    Y = int.Parse(values[2])
                }
            };
        }

        public static string Point(Point message)
        {
            return $"{message.X},{message.Y}";
        }

        public static Point Point(string data)
        {
            var values = data.Split(',');
            return new Point
            {
                X = int.Parse(values[0]),
                Y = int.Parse(values[1]),
            };
        }

        public static string Map(RoomMazeGenerator.Result message)
        {
            var result = $"{message.Junctions.Count}";
            for (var i = 0; i < message.Junctions.Count; i++)
            {
                result += $",{ message.Junctions[i].X},{message.Junctions[i].Y}";
            }
            result += $",{message.Rooms.Count}";
            for (var i = 0; i < message.Rooms.Count; i++)
            {
                result += $",{ message.Rooms[i].X},{message.Rooms[i].Y},{ message.Rooms[i].Width},{message.Rooms[i].Height}";
            }
            result += $",{message.Regions.GetLength(0)},{message.Regions.GetLength(1)}";
            for (var x = 0; x < message.Regions.GetLength(0); x++)
                for (var y = 0; y < message.Regions.GetLength(1); y++)
                {
                    result += $",{ message.Regions[x, y] ?? -1}";
                }
            return result;
        }

        public static RoomMazeGenerator.Result Map(string data)
        {
            var values = data.Split(',');
            var result = new RoomMazeGenerator.Result
            {
                Junctions = new List<MazeGenerators.Utils.Vector2>(),
                Rooms = new List<MazeGenerators.Utils.Rectangle>(),
            };

            var start = 0;
            var junctionsCount = int.Parse(values[start]);
            start += 1;
            for (var i = 0; i < junctionsCount; i++)
            {
                result.Junctions.Add(new MazeGenerators.Utils.Vector2(
                    int.Parse(values[start + i * 2]),
                    int.Parse(values[start + i * 2 + 1])));
            }

            start += junctionsCount * 2;
            var roomsCount = int.Parse(values[start]);
            start += 1;
            for (var i = 0; i < roomsCount; i++)
            {
                result.Rooms.Add(new MazeGenerators.Utils.Rectangle(
                    int.Parse(values[start + i * 4]),
                    int.Parse(values[start + i * 4 + 1]),
                    int.Parse(values[start + i * 4 + 2]),
                    int.Parse(values[start + i * 4 + 3])));
            }
            start += roomsCount * 4;
            var width = int.Parse(values[start]);
            var height = int.Parse(values[start + 1]);
            start += 2;
            result.Regions = new int?[width, height];
            for (var x = 0; x < width; x++)
                for (var y = 0; y < height; y++)
                {
                    result.Regions[x, y] = int.Parse(values[start + x * height + y]);
                    if (result.Regions[x, y] == -1)
                    {
                        result.Regions[x, y] = null;
                    }
                }

            return result;
        }
    }
}
