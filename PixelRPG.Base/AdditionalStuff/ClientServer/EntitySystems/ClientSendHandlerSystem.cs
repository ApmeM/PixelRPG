namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
{
    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;

    public abstract class ClientSendHandlerSystem<T> : EntityProcessingSystem where T: ITransferMessage
    {
        public ClientSendHandlerSystem(Matcher matcher) : base(matcher.All(typeof(ClientComponent)))
        {
        }

        protected override void DoAction(Entity entity, System.TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var client = entity.GetComponent<ClientComponent>();

            var data = PrepareSendData(entity, gameTime);

            if (data != null)
            {
                client.Message = data;
            }
        }

        protected abstract T PrepareSendData(Entity entity, System.TimeSpan gameTime);
    }
}