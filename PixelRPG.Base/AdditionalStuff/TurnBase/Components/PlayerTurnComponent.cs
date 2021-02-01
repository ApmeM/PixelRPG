namespace PixelRPG.Base.AdditionalStuff.TurnBase.Components
{
    using LocomotorECS;
    using PixelRPG.Base.AdditionalStuff.TurnBase;

    public class PlayerTurnComponent : Component
    {
        public ITurnData TurnData;

        public bool TurnMade;
    }
}