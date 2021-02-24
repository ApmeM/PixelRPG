namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;


    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    using PixelRPG.Base.Assets.UnitAnimations;
    using SpineEngine;
    using FateRandom;
    using LocomotorECS.Matching;
    using Microsoft.Xna.Framework;
    using PixelRPG.Base.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    using Microsoft.Xna.Framework.Graphics;
    using PixelRPG.Base.Components.GameState;
    #endregion

    public class ClientReceiveServerClientConnectedVisibleSystem : ClientReceiveHandlerSystem<ServerClientConnectedTransferMessage>
    {
        private readonly Scene scene;
        public Dictionary<string, string> availableAnimations = new Dictionary<string, string>();
        public ClientReceiveServerClientConnectedVisibleSystem(Scene scene) : base(new Matcher().All(typeof(VisiblePlayerComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(ServerClientConnectedTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var visiblePlayer = entity.GetComponent<VisiblePlayerComponent>();

            for (var j = 0; j < message.Units.Count; j++)
            {
                var entityName = $"PlayerUnit{message.PlayerId}_{message.Units[j].UnitId}";
                var playerUnit = this.scene.CreateEntity(entityName);
                playerUnit.AddComponent<PositionComponent>();
                var unitComponent = playerUnit.AddComponent<UnitComponent>();

                switch (message.Units[j].UnitType)
                {
                    case UnitUtils.UnitType.Warrior:
                        {
                            unitComponent.UnitAnimations = new HeroSprite(Core.Instance.Content, ContentPaths.Assets.Characters.warrior, 6);
                            break;
                        }
                    case UnitUtils.UnitType.Mage:
                        {
                            unitComponent.UnitAnimations = new HeroSprite(Core.Instance.Content, ContentPaths.Assets.Characters.mage, 6);
                            break;
                        }
                    case UnitUtils.UnitType.Rogue:
                        {
                            unitComponent.UnitAnimations = new HeroSprite(Core.Instance.Content, ContentPaths.Assets.Characters.rogue, 6);
                            break;
                        }
                    case UnitUtils.UnitType.Ranger:
                        {
                            unitComponent.UnitAnimations = new HeroSprite(Core.Instance.Content, ContentPaths.Assets.Characters.ranger, 6);
                            break;
                        }
                    case UnitUtils.UnitType.Bat:
                        {
                            unitComponent.UnitAnimations = new BatSprite(Core.Instance.Content);
                            break;
                        }
                }


                visiblePlayer.KnownPlayers.Add(playerUnit);
                playerUnit.Enabled = false;
            }
        }
    }
}