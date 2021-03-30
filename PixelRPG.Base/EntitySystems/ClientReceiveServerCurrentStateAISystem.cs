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
            
            for (var i = 0; i < simpleAI.Players.Count; i++)
            {
                simpleAI.Players[i].Free();
            }
            simpleAI.Players.Clear();

            for (var i = 0; i < message.Players.Count; i++)
            {
                var player = AIPlayerState.Create();
                simpleAI.Players.Add(player);
                player.LevelScore = message.Players[i].LevelScore;
                player.PlayerId = message.Players[i].PlayerId;
                player.TotalScore = message.Players[i].TotalScore;

                for (var j = 0; j < message.Players[i].Units.Count; j++)
                {
                    var unit = AIPlayerState.UnitSubMessage.Create();
                    player.Units.Add(unit);
                    unit.Hp = message.Players[i].Units[j].Hp;
                    unit.UnitId = message.Players[i].Units[j].UnitId;
                    unit.Position = AIPlayerState.PointSubMessage.Create();
                    unit.Position.X = message.Players[i].Units[j].Position.X;
                    unit.Position.Y = message.Players[i].Units[j].Position.Y;
                }
            }

            if (message.Exit != null)
            {
                simpleAI.Exit = simpleAI.Exit ?? AIPoint.Create();
                simpleAI.Exit.X = message.Exit.X;
                simpleAI.Exit.Y = message.Exit.Y;
            }

            var width = simpleAI.Regions.GetLength(0);
            var height = simpleAI.Regions.GetLength(1);
            for (var x = 0; x < width; x++)
                for (var y = 0; y < height; y++)
                {
                    var map = message.Map[x * height + y];
                    switch (map)
                    {
                        case RegionValue.Unknown:
                            {
                                break;
                            }
                        case RegionValue.Path:
                            {
                                simpleAI.Regions[x, y] = map;
                                break;
                            }
                        case RegionValue.Wall:
                            {
                                simpleAI.Regions[x, y] = map;
                                simpleAI.Pathfinding.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                                break;
                            }
                    }
                }
        }
    }
}