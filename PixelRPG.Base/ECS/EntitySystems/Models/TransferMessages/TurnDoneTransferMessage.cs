using PixelRPG.Base.Screens;
using System.Collections.Generic;

namespace PixelRPG.Base.ECS.EntitySystems.Models.TransferMessages
{
    public class TurnDoneTransferMessage 
    {
        public List<GameStateComponent.Player> Players;
        public GameStateComponent.Player Me;
    }
}
