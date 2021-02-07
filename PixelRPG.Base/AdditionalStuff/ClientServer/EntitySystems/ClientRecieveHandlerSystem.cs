namespace PixelRPG.Base.Screens
{
    using LocomotorECS;
    using LocomotorECS.Matching;

    public abstract class ClientRecieveHandlerSystem<T> : EntityProcessingSystem
    {
        public ClientRecieveHandlerSystem(Matcher matcher): base(matcher.All(typeof(ClientComponent)))
        {
        }

        protected override void DoAction(Entity entity, System.TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var client = entity.GetComponent<ClientComponent>();
            if (client.Response == null || client.Response.GetType() != typeof(T))
            {
                return;
            }

            var message = (T)client.Response;
            this.DoAction(message, entity, gameTime);
        }

        protected abstract void DoAction(T message, Entity entity, System.TimeSpan gameTime);
    }
}