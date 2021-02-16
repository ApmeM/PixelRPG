namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    using System;
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class LocalServerComponent : Component
    {
        public Dictionary<Guid, List<object>> Request = new Dictionary<Guid, List<object>>();
        public Dictionary<Guid, List<object>> Response = new Dictionary<Guid, List<object>>();
        public List<Guid> PendingConnections = new List<Guid>();

        public Dictionary<Guid, int> ClientToPlayerId = new Dictionary<Guid, int>();
        public Dictionary<int, Guid> PlayerIdToClient = new Dictionary<int, Guid>();
        public List<Guid> Clients = new List<Guid>();
    }
}