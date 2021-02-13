namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    using SpineEngine.ECS;
    using LocomotorECS.Matching;
    #endregion

    public class LocalServerCommunicatorSystem : EntityProcessingSystem
    {
        public LocalServerCommunicatorSystem() : base(new Matcher().All(typeof(LocalServerComponent), typeof(ServerComponent)))
        {
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
                    localServer.Request[tcpClient] = new List<object>();
                    localServer.Response[tcpClient] = new List<object>();
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
                    server.Request[id].AddRange(data);
                    //System.Diagnostics.Debug.WriteLine($"Local Server <- {client} ({id}) {data.Count} items");
                    data.Clear();
                }

                if (server.Response.ContainsKey(id) && server.Response[id].Count > 0)
                {
                    var data = server.Response[id];
                    localServer.Response[client].AddRange(data);
                    //System.Diagnostics.Debug.WriteLine($"Local Server -> {client} ({id}) {data.Count} items");
                    data.Clear();
                }
            }
        }
    }
}