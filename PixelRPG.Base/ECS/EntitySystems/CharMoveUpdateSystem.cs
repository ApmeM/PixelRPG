namespace PixelRPG.Base.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using BrainAI.Pathfinding.AStar;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    using PixelRPG.Base.Assets;
    using PixelRPG.Base.ECS.Components;

    public class CharMoveUpdateSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public CharMoveUpdateSystem(Scene scene)
            : base(new Matcher().All(typeof(UnitComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var unit = entity.GetComponent<UnitComponent>();
            var unitMove = entity.GetComponent<UnitMoveComponent>();
            var position = entity.GetComponent<PositionComponent>();

            if (unitMove.Destination != null)
            {
                var start = new BrainAI.Pathfinding.Point(
                    ((int)position.Position.X - 8) / 16,
                    ((int)position.Position.Y - 8) / 16);
                var map = this.scene.FindEntity("map");
                var graph = map.Cache.GetData<AstarGridGraph>("PathFinding");

                var end = new BrainAI.Pathfinding.Point(
                    ((int)unitMove.Destination.Value.X - 8) / 16,
                    ((int)unitMove.Destination.Value.Y - 8) / 16);

                var path = AStarPathfinder.Search(graph, start, end);

                if (path != null)
                {
                    unitMove.Move.Clear();
                    unitMove.Move.AddRange(path.Select(a => new Point(a.X * 16 + 8, a.Y * 16 + 8)));
                }
                else
                {
                    unitMove.Move.Clear();
                }
                unitMove.Destination = null;
            }

            if (unitMove.Move.Count == 0)
            {
                if (unit.State == UnitState.Run)
                {
                    unit.State = UnitState.Idle;
                }
                return;
            }

            unit.State = UnitState.Run;
            var destination = unitMove.Move[0];
            if (destination.X == position.Position.X && destination.Y == position.Position.Y)
            {
                unitMove.Move.RemoveAt(0);
                return;
            }

            position.Position += new Vector2(Math.Sign(destination.X - position.Position.X), Math.Sign(destination.Y - position.Position.Y));
        }
    }
}