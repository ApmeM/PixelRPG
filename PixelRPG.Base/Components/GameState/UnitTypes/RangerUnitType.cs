using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Base.EntitySystems
{
    public class RangerUnitType : IUnitType
    {
        public Unit Generate()
        {
            return new Unit
            {
                VisionRange = 7
            };
        }
    }
}