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
            simpleAI.Exit = message.Exit;
            simpleAI.Map = message.Map;
            simpleAI.Pathfinding = new AstarGridGraph(message.Map.Regions.GetLength(0), message.Map.Regions.GetLength(1));
            for (var x = 0; x < message.Map.Regions.GetLength(0); x++)
                for (var y = 0; y < message.Map.Regions.GetLength(1); y++)
                {
                    var pos = new MazeGenerators.Utils.Vector2(x, y);
                    var tile = simpleAI.Map.GetTile(pos);
                    if (!tile.HasValue)
                    {
                        simpleAI.Pathfinding.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                    }
                }
        }
    }
}