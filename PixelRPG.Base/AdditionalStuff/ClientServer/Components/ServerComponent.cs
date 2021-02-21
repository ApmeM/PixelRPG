namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class ServerComponent : Component
    {
        public int ConnectedPlayers;
        public Dictionary<int, Queue<object>> Request = new Dictionary<int, Queue<object>>();
        public Dictionary<int, Queue<object>> Response = new Dictionary<int, Queue<object>>();
    }
}