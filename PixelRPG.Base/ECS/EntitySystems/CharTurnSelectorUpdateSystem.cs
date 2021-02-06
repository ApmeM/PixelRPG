namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;
    using System.Linq;
    using BrainAI.Pathfinding.AStar;
    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TurnBase.Components;
    using PixelRPG.Base.ECS.EntitySystems.Models;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    public class CharTurnSelectorUpdateSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public CharTurnSelectorUpdateSystem(Scene scene)
            : base(new Matcher().All(typeof(PlayerTurnComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var playerTurn = entity.GetComponent<PlayerTurnComponent>();

            if (playerTurn.TurnMade)
            {
                return;
            }

            var position = entity.GetComponent<PositionComponent>();
            var start = new BrainAI.Pathfinding.Point(
                ((int)position.Position.X - 8) / 16,
                ((int)position.Position.Y - 8) / 16);
            var map = this.scene.FindEntity("map");
            var graph = map.Cache.GetData<AstarGridGraph>("PathFinding");

            var destination = scene.FindEntity("map").GetComponent<TiledMapComponent>().TiledMap.GetObjectGroup("EndPoint").Objects.First(a => a.Name == "EndPoint");

            var end = new BrainAI.Pathfinding.Point(destination.X / 16, destination.Y / 16);

            var path = AStarPathfinder.Search(graph, start, end);

            playerTurn.TurnData = playerTurn.TurnData ?? new TurnData();

            if (path == null || path.Count < 2)
            {
                ((TurnData)playerTurn.TurnData).MoveTo = start;
            }
            else
            {
                ((TurnData)playerTurn.TurnData).MoveTo = path[1];
            }

            ((TurnData)playerTurn.TurnData).Entity = entity;

            playerTurn.TurnMade = true;
        }
    }
}