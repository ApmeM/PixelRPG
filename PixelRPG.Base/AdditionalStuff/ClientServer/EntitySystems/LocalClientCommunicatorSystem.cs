﻿namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
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

        public LocalClientCommunicatorSystem(Scene scene, params ITransferMessageParser[] parsers) : base(new Matcher().All(typeof(LocalClientComponent), typeof(ClientComponent)))
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
                var parser = ParserUtils.FindWriter(client.Message, parsers);
                var data = parser.Write(client.Message);
                localServer.Request[localClient.Identifier].Add(data);
                System.Diagnostics.Debug.WriteLine($"Local Client -> {localClient.Identifier} {data}");
                client.Message = null;
            }

            var response = localServer.Response[localClient.Identifier];
            client.Response = null;
            if (response.Count != 0)
            {
                var parser = ParserUtils.FindReader(response[0], parsers);
                var transferMessage = parser.Read(response[0]);
                client.Response = transferMessage;
                localServer.Response[localClient.Identifier].RemoveAt(0);
                System.Diagnostics.Debug.WriteLine($"Local Client <- {localClient.Identifier} {client.Response}");
            }
        }
    }
}