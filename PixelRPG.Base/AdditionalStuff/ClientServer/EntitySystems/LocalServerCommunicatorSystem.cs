namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    using SpineEngine.ECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    #endregion

    public class LocalServerCommunicatorSystem : EntityProcessingSystem
    {
        private readonly ITransferMessageParser[] parsers;

        public LocalServerCommunicatorSystem(ITransferMessageParser[] parsers = null) : base(new Matcher().All(typeof(LocalServerComponent), typeof(ServerComponent)))
        {
            this.parsers = parsers;
        }

        protected override void DoAction(Entity entity, System.TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var localServer = entity.GetComponent<LocalServerComponent>();
            var server = entity.GetComponent<ServerComponent>();

            if (localServer.PendingConnections.Count > 0)
            {
                for (var i = 0; i < localServer.PendingConnections.Count; i++)
                {
                    server.ConnectedPlayers++;
                    var tcpClient = localServer.PendingConnections[i];
                    localServer.Clients.Add(tcpClient);
                    localServer.ConnectionKeyToClient[server.ConnectedPlayers] = tcpClient;
                    localServer.ClientToConnectionKey[tcpClient] = server.ConnectedPlayers;
                    server.Request[localServer.ClientToConnectionKey[tcpClient]] = new Queue<ITransferMessage>();
                    server.Response[localServer.ClientToConnectionKey[tcpClient]] = new Queue<ITransferMessage>();
                    localServer.Request[tcpClient] = new Queue<string>();
                    localServer.Response[tcpClient] = new Queue<string>();
                }
                localServer.PendingConnections.Clear();
            }

            for (var i = 0; i < localServer.Clients.Count; i++)
            {
                var client = localServer.Clients[i];
                var connectionKey = localServer.ClientToConnectionKey[client];
                if (localServer.Request.ContainsKey(client) && localServer.Request[client].Count > 0)
                {
                    var request = localServer.Request[client];
                    while (request.Count > 0)
                    {
                        var data = request.Dequeue();
                        var parser = TransferMessageParserUtils.FindReader(data, parsers);
                        var transferMessage = parser.Read(data);
                        System.Diagnostics.Debug.WriteLine($"Local Server <- ({connectionKey}.{transferMessage}): {data}");
                        server.Request[connectionKey].Enqueue(transferMessage);
                    }
                }

                if (server.Response.ContainsKey(connectionKey) && server.Response[connectionKey].Count > 0)
                {
                    var response = server.Response[connectionKey];
                    while (response.Count > 0)
                    {
                        var transferMessage = response.Dequeue();
                        var parser = TransferMessageParserUtils.FindWriter(transferMessage, parsers);
                        var data = parser.Write(transferMessage);
                        System.Diagnostics.Debug.WriteLine($"Local Server -> ({connectionKey}.{transferMessage}): {data}");
                        localServer.Response[client].Enqueue(data);
                        (transferMessage as IPoolableTransferMessage)?.Free();
                    }
                }
            }
        }
    }
}