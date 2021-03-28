using PixelRPG.Base.Screens;

namespace PixelRPG.Base.EntitySystems
{
    #region Using Directives

    using LocomotorECS;
    using LocomotorECS.Matching;
    using PixelRPG.Base.AdditionalStuff.BrainAI.Components;
    using PixelRPG.Base.AdditionalStuff.ClientServer.EntitySystems;
    using PixelRPG.Base.TransferMessages;
    using System.Linq;
    #endregion

    public class ClientRecieveServerYouConnectedAISystem : ClientReceiveHandlerSystem<ServerYouConnectedTransferMessage>
    {
        public ClientRecieveServerYouConnectedAISystem() : base(new Matcher().All(typeof(AIComponent)))
        {
        }

        protected override void DoAction(ServerYouConnectedTransferMessage message, Entity entity, System.TimeSpan gameTime)
        {
            var ai = entity.GetComponent<AIComponent>();
            var simpleAI = (SimpleAI)ai.AIBot;
            simpleAI.MePlayerId = message.PlayerId;
            foreach(var unitKVP in simpleAI.UnitDesription)
            {
                unitKVP.Value.Free();
            }

            for (var i = 0; i < message.UnitsData.Count; i++)
            {
                var unit = AIUnitDescription.Create();
                simpleAI.UnitDesription.Add(message.UnitsData[i].UnitId, unit);
                unit.UnitType = message.UnitsData[i].UnitType;
                unit.UnitId = message.UnitsData[i].UnitId;
                unit.VisionRange = message.UnitsData[i].VisionRange;
                unit.MoveRange = message.UnitsData[i].MoveRange;
                unit.MaxHp = message.UnitsData[i].MaxHp;
                unit.Hp = message.UnitsData[i].Hp;
                unit.AttackDistance = message.UnitsData[i].AttackDistance;
                unit.AttackRadius = message.UnitsData[i].AttackRadius;
                unit.AttackDamage = message.UnitsData[i].AttackDamage;
                unit.AttackFriendlyFire = message.UnitsData[i].AttackFriendlyFire;
            }
        }
    }
}