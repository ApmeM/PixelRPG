namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using SpineEngine.ECS;
    using LocomotorECS.Matching;
    using System;
    using PixelRPG.Base.AdditionalStuff.ClientServer;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;
    #endregion

    public class LocalClientCommunicatorSystem : EntityProcessingSystem
    {
        private readonly Scene scene;
        private readonly ITransferMessageParser[] parsers;

        public LocalClientCommunicatorSystem(Scene scene, ITransferMessageParser[] parsers = null) : base(new Matcher().All(typeof(LocalClientComponent), typeof(ClientComponent)))
        {
            this.scene = scene;
            this.parsers = parsers;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var localClient = entity.GetComponent<LocalClientComponent>();
            var client = entity.GetComponent<ClientComponent>();
            var serverEntity = this.scene.FindEntity(localClient.ServerEntity);
            var localServer = serverEntity.GetComponent<LocalServerComponent>();

            if (localClient.Identifier == Guid.Empty)
            {
                localClient.Identifier = Guid.NewGuid();
                localServer.PendingConnections.Add(localClient.Identifier);
                return;
            }

            if (client.Message != null)
            {
                var transferMessage = client.Message;
                var parser = TransferMessageParserUtils.FindWriter(transferMessage, this.parsers);
                var data = parser.Write(transferMessage);
                localServer.Request[localClient.Identifier].Enqueue(data);
                System.Diagnostics.Debug.WriteLine($"Local Client -> ({transferMessage}): {data}");
                (client.Message as IPoolableTransferMessage)?.Free();
                client.Message = null;
            }

            var response = localServer.Response[localClient.Identifier];
            (client.Response as IPoolableTransferMessage)?.Free();
            client.Response = null;
            if (response.Count > 0)
            {
                var data = response.Dequeue();
                var parser = TransferMessageParserUtils.FindReader(data, parsers);
                var transferMessage = parser.Read(data);
                client.Response = transferMessage;
                System.Diagnostics.Debug.WriteLine($"Local Client <- ({transferMessage}): {data}");
            }
        }
    }
}