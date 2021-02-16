namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    using System;
    #region Using Directives

    using System.Collections.Generic;
    using System.Net.WebSockets;
    using System.Threading.Tasks;
    using LocomotorECS;
    #endregion

    public class NetworkClientComponent : Component
    {
        public NetworkClientComponent(Uri serverAddress)
        {
            this.ServerAddress = serverAddress;
        }
        public Uri ServerAddress { get; private set; }
        public ClientWebSocket Client;
        internal Task<WebSocketReceiveResult> RecievingTask;
        internal ArraySegment<byte> RecievingBuffer = new ArraySegment<byte>(new byte[2048]);
    }
}