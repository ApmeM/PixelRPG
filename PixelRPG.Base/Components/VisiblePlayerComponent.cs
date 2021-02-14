namespace PixelRPG.Base.Components
{
    #region Using Directives

    using LocomotorECS;
    #endregion

    public class VisiblePlayerComponent : Component
    {
        public string MapEntityName;

        public VisiblePlayerComponent(string mapEntityName)
        {
            this.MapEntityName = mapEntityName;
        }
    }
}