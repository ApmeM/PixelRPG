using PixelRPG.Base.Screens;

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
            if (
                simpleAI.Regions == null ||
                simpleAI.Regions.GetLength(0) != message.Width ||
                simpleAI.Regions.GetLength(1) != message.Height
                )
            {
                simpleAI.Pathfinding = new AstarGridGraph(message.Width, message.Height);
                simpleAI.Regions = new RegionValue[message.Width, message.Height];
            }
            
            simpleAI.Pathfinding.Walls.Clear();
            for (var x = 0; x < message.Width; x++)
                for (var y = 0; y < message.Height; y++)
                {
                    simpleAI.Regions[x, y] = RegionValue.Unknown;
                }
            simpleAI.Exit?.Free();
            simpleAI.Exit = null;
        }
    }
}