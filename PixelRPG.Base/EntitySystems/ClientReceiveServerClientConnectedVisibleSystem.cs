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
                var charAnimation = string.Empty;
                switch (message.Units[j].UnitType)
                {
                    case nameof(WarriorUnitType):
                        {
                            charAnimation = ContentPaths.Assets.Characters.warrior;
                            break;
                        }
                    case nameof(MageUnitType):
                        {
                            charAnimation = ContentPaths.Assets.Characters.mage;
                            break;
                        }
                    case nameof(RogueUnitType):
                        {
                            charAnimation = ContentPaths.Assets.Characters.rogue;
                            break;
                        }
                    case nameof(RangerUnitType):
                        {
                            charAnimation = ContentPaths.Assets.Characters.ranger;
                            break;
                        }
                }


                var playerUnit = this.scene.CreateEntity(entityName);
                playerUnit.AddComponent<PositionComponent>();
                playerUnit.AddComponent<UnitComponent>().UnitAnimations = new HeroSprite(Core.Instance.Content, charAnimation, 6);
                visiblePlayer.KnownPlayers.Add(playerUnit);
                playerUnit.Enabled = false;
            }
        }
    }
}