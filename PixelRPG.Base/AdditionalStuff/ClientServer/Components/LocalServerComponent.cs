namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    using System;
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class LocalServerComponent : Component
    {
        public Dictionary<Guid, List<string>> Request = new Dictionary<Guid, List<string>>();
        public Dictionary<Guid, List<string>> Response = new Dictionary<Guid, List<string>>();
        public List<Guid> PendingConnections = new List<Guid>();

        public Dictionary<Guid, int> ClientToPlayerId = new Dictionary<Guid, int>();
        public Dictionary<int, Guid> PlayerIdToClient = new Dictionary<int, Guid>();
        public List<Guid> Clients = new List<Guid>();
    }
}