namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
#if !Bridge
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net.Sockets;
#endif
    using LocomotorECS;

    public class NetworkServerComponent : Component
    {
        public NetworkServerComponent(string ip, int port)
        {
            this.Ip = ip;
            this.Port = port;
        }

        public string Ip { get; private set; }
        public int Port { get; private set; }

#if !Bridge
        public Dictionary<TcpClient, int> ClientToPlayerId = new Dictionary<TcpClient, int>();
        public Dictionary<int, TcpClient> PlayerIdToClient = new Dictionary<int, TcpClient>();
        public List<TcpClient> Clients = new List<TcpClient>();

        public TcpListener Listener;
        public IAsyncResult ConnectResult;
#endif
    }
}