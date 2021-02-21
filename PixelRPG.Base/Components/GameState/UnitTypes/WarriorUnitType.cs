using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Base.EntitySystems
{
    public class WarriorUnitType : IUnitType
    {
        public Unit Generate()
        {
            return new Unit();
        }
    }
}