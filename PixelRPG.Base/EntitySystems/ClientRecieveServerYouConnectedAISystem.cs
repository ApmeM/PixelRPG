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

    public class ClientRecieveServerYouConnectedAISystem : ClientReceiveHandlerSystem<ServerYouConnectedTransferMessage>
    {
        public ClientRecieveServerYouConnectedAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(ServerYouConnectedTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            simpleAI.MePlayerId = message.PlayerId;
        }
    }
}