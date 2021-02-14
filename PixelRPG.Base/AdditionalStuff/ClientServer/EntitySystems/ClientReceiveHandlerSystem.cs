namespace PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems
{
    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.ClientServer.Components;

    public abstract class ClientReceiveHandlerSystem<T> : EntityProcessingSystem
    {
        public ClientReceiveHandlerSystem(Matcher matcher) : base(matcher.All(typeof(ClientComponent)))
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