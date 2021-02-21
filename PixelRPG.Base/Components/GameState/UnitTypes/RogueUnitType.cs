using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Base.EntitySystems
{
    public class RogueUnitType : IUnitType
    {
        public Unit Generate()
        {
            return new Unit
            {
                MoveRange = 2
            };
        }
    }
}