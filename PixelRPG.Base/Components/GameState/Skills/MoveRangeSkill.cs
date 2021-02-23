namespace PixelRPG.Base.Components.GameState.Skills
{
    public class MoveRangeSkill : ISkill
    {
        public void Apply(Player player, Unit unit)
        {
            unit.MoveRange += 1;
        }
    }
}
