﻿using PixelRPG.Base.Screens;

namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using BrainAI.Pathfinding.AStar;

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    #endregion

    public class ClientReceiveServerGameStartedAISystem : ClientReceiveHandlerSystem<ServerGameStartedTransferMessage>
    {
        public ClientReceiveServerGameStartedAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(ServerGameStartedTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            simpleAI.Pathfinding = new AstarGridGraph(message.Width, message.Height);
            simpleAI.Regions = new RegionValue[message.Width, message.Height];
            simpleAI.Exit?.Free();
            simpleAI.Exit = null;
        }
    }
}