namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class ServerComponent : Component
    {
        public int ConnectedPlayers;
        public Dictionary<int, List<object>> Request = new Dictionary<int, List<object>>();
        public Dictionary<int, List<object>> Response = new Dictionary<int, List<object>>();
    }
}