namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using System.Linq;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
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
            var width = gameState.Map.Regions.GetLength(0);
            var height = gameState.Map.Regions.GetLength(1);
            var regions = new int?[width, height];
            for (var x = 0; x < width; x++)
                for (var y = 0; y < height; y++)
                {
                    regions[x, y] = IsVisible(player, gameState.Exit.X, gameState.Exit.Y, x, y) ? gameState.Map.Regions[x, y] : (int?)null;
                }

            return new ServerCurrentStateTransferMessage
            {
                Players = gameState.Players.Values.Where(a => IsVisible(player, gameState.Exit.X, gameState.Exit.Y, a.Position.X, a.Position.Y)).ToList(),
                //Exit = IsVisible(player, gameState.Exit.X, gameState.Exit.Y) ? gameState.Exit : (Point?)null,
                Exit = gameState.Exit,
                Map = new RoomMazeGenerator.Result
                {
                    Junctions = gameState.Map.Junctions.Where(a => IsVisible(player, gameState.Exit.X, gameState.Exit.Y, a.X, a.Y)).ToList(),
                    Regions = regions
                },
            };
        }

        public static bool IsVisible(GameStateComponent.Player fromPlayer, int exitX, int exitY, int x, int y)
        {
            if (fromPlayer.Position.X == exitX && fromPlayer.Position.Y == exitY)
            {
                return true;
            }

            return Math.Abs(x - fromPlayer.Position.X) + Math.Abs(y - fromPlayer.Position.Y) < 5;
        }

        public static ServerGameStartedTransferMessage StartNewGame(GameStateComponent gameState)
        {
            gameState.Map = new RoomMazeGenerator().Generate(new RoomMazeGenerator.Settings(41, 31) { ExtraConnectorChance = 5, WindingPercent = 50 });
            for (var x = 0; x < gameState.Map.Regions.GetLength(0); x++)
                for (var y = 0; y < gameState.Map.Regions.GetLength(1); y++)
                {
                    gameState.Map.Regions[x, y] = gameState.Map.Regions[x, y] == null ? GameSceneConfig.WallRegionValue : GameSceneConfig.PathRegionValue;
                }

            gameState.Players = gameState.Players ?? new Dictionary<int, GameStateComponent.Player>();
            var roomIdx = 0;
            foreach(var player in gameState.Players)
            {
                var room = gameState.Map.Rooms[roomIdx];
                roomIdx++;
                player.Value.Position = new Point(room.X + room.Width / 2, room.Y + room.Height / 2);
            }
            
            gameState.Exit = new Point(gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].X + gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].Width / 2, gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].Y + gameState.Map.Rooms[gameState.Map.Rooms.Count - 1].Height / 2);

            return new ServerGameStartedTransferMessage
            {
                Width = gameState.Map.Regions.GetLength(0),
                Height = gameState.Map.Regions.GetLength(1)
            };
        }
    }
}