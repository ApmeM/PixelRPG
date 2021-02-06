namespace PixelRPG.Base.ECS.EntitySystems.Models
{
    using BrainAI.Pathfinding;
    using LocomotorECS;
    using PixelRPG.Base.AdditionalStuff.TurnBase;

    public class TurnData : ITurnData
    {
        public Entity Entity { get; set; }
        public Point MoveTo { get; set; }
    }
}