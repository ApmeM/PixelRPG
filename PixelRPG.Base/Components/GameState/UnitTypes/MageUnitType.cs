using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Base.EntitySystems
{
    public class MageUnitType : IUnitType
    {
        public Unit Generate()
        {
            return new Unit
            {
                AttackDistance = 3,
                AttackRadius = 2,
                AttackFriendlyFire = true
            };
        }
    }
}