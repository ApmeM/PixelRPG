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
            simpleAI.Exit = simpleAI.Exit ?? message.Exit;
            for (var x = 0; x < message.Map.GetLength(0); x++)
                for (var y = 0; y < message.Map.GetLength(1); y++)
                {
                    if (message.Map[x, y] == GameSceneConfig.UnknownRegionValue)
                    {
                        continue;
                    }
                    
                    simpleAI.Regions[x, y] = message.Map[x, y];
                    if (message.Map[x, y] == GameSceneConfig.WallRegionValue)
                    {
                        simpleAI.Pathfinding.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                    }
                }
        }
    }
}