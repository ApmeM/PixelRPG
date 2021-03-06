﻿using PixelRPG.Base.Screens;

namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    #endregion

    public class ClientSendClientTurnDoneAISystem : ClientSendHandlerSystem<ClientTurnDoneTransferMessage>
    {
        public ClientSendClientTurnDoneAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override ClientTurnDoneTransferMessage PrepareSendData(Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            if (!simpleAI.NeedAction)
            {
                return null;
            }

            simpleAI.NeedAction = false;
            return simpleAI.GetNextTurn();
        }
    }
}