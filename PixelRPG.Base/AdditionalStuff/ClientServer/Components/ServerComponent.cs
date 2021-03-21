namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class ServerComponent : Component
    {
        public int ConnectedPlayers;
        public Dictionary<int, Queue<ITransferMessage>> Request = new Dictionary<int, Queue<ITransferMessage>>();
        public Dictionary<int, Queue<ITransferMessage>> Response = new Dictionary<int, Queue<ITransferMessage>>();
    }
}