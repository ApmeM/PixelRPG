namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;
    using System.Linq;

    using LocomotorECS;
    using SpineEngine.ECS;
    using LocomotorECS.Matching;
    #endregion

    public class LocalClientCommunicatorSystem : EntityProcessingSystem
    {
        private readonly Scene scene;
        private static int Identifiers = 1;

        public LocalClientCommunicatorSystem(Scene scene) : base(new Matcher().All(typeof(LocalClientComponent), typeof(ClientComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, System.TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var localClient = entity.GetComponent<LocalClientComponent>();
            var client = entity.GetComponent<ClientComponent>();
            var serverEntity = this.scene.FindEntity(localClient.Server);
            var localServer = serverEntity.GetComponent<LocalServerComponent>();

            if (localClient.Identifier == 0)
            {
                Identifiers++;
                localClient.Identifier = Identifiers;
                return;
            }

            if (client.Message != null)
            {
                if (!localServer.SerializedRequest.ContainsKey(localClient.Identifier))
                {
                    localServer.SerializedRequest[localClient.Identifier] = new List<object>();
                }

                localServer.SerializedRequest[localClient.Identifier].Add(client.Message);

                client.Message = null;
                return;
            }

            if (localServer.SerializedResponse.ContainsKey(localClient.Identifier))
            {
                var response = localServer.SerializedResponse[localClient.Identifier];
                client.Response = null;
                if (response.Count != 0)
                {
                    client.Response = response[0];
                    localServer.SerializedResponse[localClient.Identifier].RemoveAt(0);
                    return;
                }
            }
        }
    }
}