namespace PixelRPG.Base.ECS.Components
{
    using System.Collections.Generic;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    public class UnitMoveComponent: Component
    {
        public Point? Destination { get; set; }

        public List<Point> Move { get; } = new List<Point>();
    }
}