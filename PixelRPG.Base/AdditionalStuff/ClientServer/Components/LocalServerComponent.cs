namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    using System;
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class LocalServerComponent : Component
    {
        public Dictionary<Guid, Queue<string>> Request = new Dictionary<Guid, Queue<string>>();
        public Dictionary<Guid, Queue<string>> Response = new Dictionary<Guid, Queue<string>>();
        public List<Guid> PendingConnections = new List<Guid>();

        public Dictionary<Guid, int> ClientToConnectionKey = new Dictionary<Guid, int>();
        public Dictionary<int, Guid> ConnectionKeyToClient = new Dictionary<int, Guid>();
        public List<Guid> Clients = new List<Guid>();
    }
}