using MazeGenerators;
using Microsoft.Xna.Framework;
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
}
