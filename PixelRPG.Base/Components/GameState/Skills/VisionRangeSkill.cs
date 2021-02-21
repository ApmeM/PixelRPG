namespace PixelRPG.Base.Components.GameState.Skills
{
    public class VisionRangeSkill : ISkill
    {
        public void Apply(Player player, Unit unit)
        {
            unit.VisionRange += 2;
        }
    }
}
