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
        private readonly Scene scene;

        public LocalServerCommunicatorSystem(Scene scene) : base(new Matcher().All(typeof(LocalServerComponent), typeof(ServerComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, System.TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var localServer = entity.GetComponent<LocalServerComponent>();
            var server = entity.GetComponent<ServerComponent>();

            foreach (var req in localServer.SerializedRequest)
            {
                if (!server.SerializedRequest.ContainsKey(req.Key))
                {
                    server.SerializedRequest[req.Key] = new List<object>();
                }

                server.SerializedRequest[req.Key].AddRange(req.Value);
                req.Value.Clear();
            }
            foreach (var res in server.SerializedResponse)
            {
                if (!localServer.SerializedResponse.ContainsKey(res.Key))
                {
                    localServer.SerializedResponse[res.Key] = new List<object>();
                }

                localServer.SerializedResponse[res.Key].AddRange(res.Value);
                res.Value.Clear();
            }
        }
    }
}