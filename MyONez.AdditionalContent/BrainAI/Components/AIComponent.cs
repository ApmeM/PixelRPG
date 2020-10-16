namespace MyONez.AdditionalContent.BrainAI.Components
{
    using global::BrainAI.AI;

    using LocomotorECS;

    public class AIComponent : Component
    {
        public IAITurn AIBot { get; set; }
    }
}