namespace PixelRPG.Base.Screens
{
    using System.Collections.Generic;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;
    using System;

    public class ServerReceiveHandlerSystem : EntityProcessingSystem
    {
        private readonly Dictionary<Type, IHandler> handlers;

        public ServerReceiveHandlerSystem(params IHandler[] handlers) : base(new Matcher().All(typeof(ServerComponent)))
        {
            this.handlers = handlers.ToDictionary(a => a.MessageType);
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var server = entity.GetComponent<ServerComponent>();
            foreach (var req in server.SerializedRequest)
            {
                if (!server.SerializedResponse.ContainsKey(req.Key))
                {
                    server.SerializedResponse[req.Key] = new List<object>();
                }

                for (var i = 0; i < req.Value.Count; i++)
                {
                    handlers[req.Value[i].GetType()].Handle(server, req.Key, req.Value[i]);
                }

                req.Value.Clear();
            }
        }

        public interface IHandler
        {
            Type MessageType { get; }

            void Handle(ServerComponent server, int connectionKey, object message);
        }

        public abstract class Handler<TMessage> : IHandler
        {
            public Type MessageType => typeof(TMessage);

            public void Handle(ServerComponent server, int connectionKey, object message)
            {
                Handle(server, connectionKey, (TMessage)message);
            }

            protected abstract void Handle(ServerComponent server, int connectionKey, TMessage message);
        }
    }
}