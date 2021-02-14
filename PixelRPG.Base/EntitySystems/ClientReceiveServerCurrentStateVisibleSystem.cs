namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;
    using LocomotorECS.Matching;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    using PixelRPG.Base.Assets.UnitAnimations;
    using FateRandom;
    using SpineEngine;
    using System.Collections.Generic;
    #endregion

    public class ClientReceiveServerCurrentStateVisibleSystem : ClientReceiveHandlerSystem<ServerCurrentStateTransferMessage>
    {
        private readonly Scene scene;

        public ClientReceiveServerCurrentStateVisibleSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
        {
            this.scene = scene;
        }

        private static readonly List<string> availableAnimations = new List<string>
        {
            ContentPaths.Assets.Characters.mage,
            ContentPaths.Assets.Characters.ranger,
            ContentPaths.Assets.Characters.rogue,
            ContentPaths.Assets.Characters.warrior
        };

        protected override void DoAction(ServerCurrentStateTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            for (var i = 0; i < message.Players.Count; i++)
            {
                var playerUnit = this.scene.FindEntity($"PlayerUnit{message.Players[i].PlayerId}");
                if (playerUnit == null)
                {
                    playerUnit = this.scene.CreateEntity($"PlayerUnit{message.Players[i].PlayerId}");
                    playerUnit.AddComponent<PositionComponent>().Position = new Vector2(message.Players[i].Position.X * 16 + 8, message.Players[i].Position.Y * 16 + 8);
                    playerUnit.AddComponent<UnitComponent>().UnitAnimations = new HeroSprite(Core.Instance.Content, Fate.GlobalFate.Choose<string>(availableAnimations), 6);
                }
                else
                {
                    playerUnit.GetComponent<PositionComponent>().Position = new Vector2(message.Players[i].Position.X * 16 + 8, message.Players[i].Position.Y * 16 + 8);
                }
            }
        }
    }
}