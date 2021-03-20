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
            var mapIdx = 0;
            for (var x = 0; x < simpleAI.Regions.GetLength(0); x++)
                for (var y = 0; y < simpleAI.Regions.GetLength(1); y++)
                {
                    var map = message.Map[mapIdx];
                    mapIdx++;
                    if (map == GameSceneConfig.UnknownRegionValue)
                    {
                        continue;
                    }

                    simpleAI.Regions[x, y] = map;
                    if (map == GameSceneConfig.WallRegionValue)
                    {
                        simpleAI.Pathfinding.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                    }
                }
        }
    }
}