namespace PixelRPG.Base.Screens
{
    using LocomotorECS;
    using LocomotorECS.Matching;

    public abstract class ClientSendHandlerSystem<T> : EntityProcessingSystem
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