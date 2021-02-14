namespace PixelRPG.Base.Components
{
    #region Using Directives

    using LocomotorECS;
    using System.Collections.Generic;
    #endregion

    public class VisiblePlayerComponent : Component
    {
        public string MapEntityName;
        public List<Entity> KnownPlayers = new List<Entity>();

        public VisiblePlayerComponent(string mapEntityName)
        {
            this.MapEntityName = mapEntityName;
        }
    }
}