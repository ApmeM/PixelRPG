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

        public LocalServerCommunicatorSystem(params ITransferMessageParser[] parsers) : base(new Matcher().All(typeof(LocalServerComponent), typeof(ServerComponent)))
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
                    localServer.PlayerIdToClient[server.ConnectedPlayers] = tcpClient;
                    localServer.ClientToPlayerId[tcpClient] = server.ConnectedPlayers;
                    server.Request[localServer.ClientToPlayerId[tcpClient]] = new List<object>();
                    server.Response[localServer.ClientToPlayerId[tcpClient]] = new List<object>();
                    localServer.Request[tcpClient] = new List<string>();
                    localServer.Response[tcpClient] = new List<string>();
                }
                localServer.PendingConnections.Clear();
            }

            for (var i = 0; i < localServer.Clients.Count; i++)
            {
                var client = localServer.Clients[i];
                var id = localServer.ClientToPlayerId[client];
                if (localServer.Request.ContainsKey(client) && localServer.Request[client].Count > 0)
                {
                    var data = localServer.Request[client];
                    for(var j = 0; j < data.Count; j++)
                    {
                        var parser = ParserUtils.FindReader(data[j], parsers);
                        var transferMessage = parser.Read(data[j]);
                        System.Diagnostics.Debug.WriteLine($"Local Server <- {data[j]}");
                        server.Request[id].Add(transferMessage);
                    }
                    data.Clear();
                }

                if (server.Response.ContainsKey(id) && server.Response[id].Count > 0)
                {
                    var transferMessages = server.Response[id];
                    for (var j = 0; j < transferMessages.Count; j++)
                    {
                        var parser = ParserUtils.FindWriter(transferMessages[j], parsers);
                        var data = parser.Write(transferMessages[j]);
                        System.Diagnostics.Debug.WriteLine($"Local Server -> {data}");
                        localServer.Response[client].Add(data);
                    }
                    transferMessages.Clear();
                }
            }
        }
    }
}