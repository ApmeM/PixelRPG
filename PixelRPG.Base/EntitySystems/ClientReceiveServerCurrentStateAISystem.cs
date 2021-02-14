using PixelRPG.Base.Screens;

namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    #endregion

    public class ClientReceiveServerCurrentStateAISystem : ClientReceiveHandlerSystem<ServerCurrentStateTransferMessage>
    {
        public ClientReceiveServerCurrentStateAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(ServerCurrentStateTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;

            simpleAI.Players = message.Players;
        }
    }
}