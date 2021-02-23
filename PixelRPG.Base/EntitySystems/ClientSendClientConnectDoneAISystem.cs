using PixelRPG.Base.Screens;
using LocomotorECS;
using LocomotorECS.Matching;
using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Base.EntitySystems
{
    public class ClientSendClientConnectDoneAISystem : ClientSendHandlerSystem<ClientConnectTransferMessage>
    {
        public ClientSendClientConnectDoneAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override ClientConnectTransferMessage PrepareSendData(Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            if (simpleAI.Connected)
            {
                return null;
            }

            simpleAI.Connected = true;
        
            return new ClientConnectTransferMessage
            {
                PlayerName = simpleAI.PlayerName,
                UnitsData = simpleAI.GenerateUnitData()
            };
        }
    }
}