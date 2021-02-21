using PixelRPG.Base.Screens;

namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    using System.Linq;
    #endregion

    public class ClientReceiveServerClientConnectedAISystem : ClientReceiveHandlerSystem<ServerClientConnectedTransferMessage>
    {
        public ClientReceiveServerClientConnectedAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(ServerClientConnectedTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;

            if (simpleAI.MePlayerId == message.PlayerId)
            {
                simpleAI.UnitDesription = message.Units.ToDictionary(a => a.UnitId, a => a.UnitType);
            }
        }
    }
}