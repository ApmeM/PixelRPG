namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using LocomotorECS.Matching;
    using System.Net.WebSockets;
    using System.Threading;
    using System.Text;
    using System;
    using System.IO;
    using PixelRPG.Base.AdditionalStuff.ClientServer;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    #endregion

    public class NetworkClientCommunicatorSystem : EntityProcessingSystem
    {
        private readonly MemoryStream ms;
        private readonly StreamReader reader;
        private readonly ITransferMessageParser[] parsers;

        public NetworkClientCommunicatorSystem(ITransferMessageParser[] parsers = null) : base(new Matcher().All(typeof(NetworkClientComponent), typeof(ClientComponent)))
        {
            this.ms = new MemoryStream();
            this.reader = new StreamReader(ms, Encoding.UTF8);
            this.parsers = parsers;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var networkClient = entity.GetComponent<NetworkClientComponent>();
            var client = entity.GetComponent<ClientComponent>();

            if (networkClient.Client == null)
            {
                networkClient.Client = new ClientWebSocket();
                networkClient.Client.ConnectAsync(networkClient.ServerAddress, CancellationToken.None);
            }

            if (networkClient.Client.State != WebSocketState.Open)
            {
                return;
            }

            if (client.Message != null)
            {
                var transferMessage = client.Message;
                var parser = TransferMessageParserUtils.FindWriter(transferMessage, parsers);
                var data = parser.Write(transferMessage);
                System.Diagnostics.Debug.WriteLine($"Network Client -> ({transferMessage}): {data}");
                networkClient.Client.SendAsync(
                    new ArraySegment<byte>(Encoding.UTF8.GetBytes(data)),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None);
                client.Message = null;
                return;
            }
            
            client.Response = null;

            if (networkClient.RecievingTask == null)
            {
                networkClient.RecievingTask = networkClient.Client.ReceiveAsync(networkClient.RecievingBuffer, CancellationToken.None);
            }

            if (networkClient.RecievingTask.IsCompleted)
            {
                var result = networkClient.RecievingTask.Result;
                networkClient.RecievingTask = null;
                ms.Seek(0, SeekOrigin.Begin);
                ms.SetLength(0);
                ms.Write(networkClient.RecievingBuffer.Array, networkClient.RecievingBuffer.Offset, result.Count);

                while (!result.EndOfMessage)
                {
                    result = networkClient.Client.ReceiveAsync(networkClient.RecievingBuffer, CancellationToken.None).Result;
                    ms.Write(networkClient.RecievingBuffer.Array, networkClient.RecievingBuffer.Offset, result.Count);
                };


                ms.Seek(0, SeekOrigin.Begin);
                var data = reader.ReadToEnd();

                var parser = TransferMessageParserUtils.FindReader(data, parsers);
                var transferMessage = parser.Read(data);
                client.Response = transferMessage;
                System.Diagnostics.Debug.WriteLine($"Network Client <- ({transferMessage}): {data}");
            }
        }
    }
}