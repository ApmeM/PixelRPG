using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;
using SpineEngine.Utils.Collections;
using System;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ServerYouConnectedTransferMessage : ITransferMessage
    {
        public int PlayerId;
        public readonly List<UnitSubMessage> UnitsData = new List<UnitSubMessage>();

        public static ServerYouConnectedTransferMessage Create()
        {
            return Pool<ServerYouConnectedTransferMessage>.Obtain();
        }

        public ServerYouConnectedTransferMessage SetPlayerId(int playerId)
        {
            this.PlayerId = playerId;
            return this;
        }

        public ServerYouConnectedTransferMessage PopulateUnits(List<Unit> units)
        {
            for (var i = 0; i < units.Count; i++)
            {
                var newUnit = units[i];
                AddUnit(
                    newUnit.UnitId,
                    newUnit.UnitType, 
                    newUnit.VisionRange, 
                    newUnit.MoveRange, 
                    newUnit.AttackDamage, 
                    newUnit.AttackDistance, 
                    newUnit.AttackFriendlyFire, 
                    newUnit.AttackRadius, 
                    newUnit.Hp, 
                    newUnit.MaxHp);
            }

            return this;
        }

        public ServerYouConnectedTransferMessage AddUnit(
            int unitId, 
            UnitUtils.UnitType unitType, 
            int visionRange, 
            int moveRange, 
            int attackDamage, 
            int attackDistance, 
            bool attackFriendlyFire, 
            int attackRadius, 
            int hp, 
            int maxHp)
        {
            var unit = UnitSubMessage.Create();
            unit.UnitId = unitId;
            unit.UnitType = unitType;
            unit.VisionRange = visionRange;
            unit.MoveRange = moveRange;
            unit.AttackDamage = attackDamage;
            unit.AttackDistance = attackDistance;
            unit.AttackFriendlyFire = attackFriendlyFire;
            unit.AttackRadius = attackRadius;
            unit.Hp = hp;
            unit.MaxHp = maxHp;
            this.UnitsData.Add(unit);
            return this;
        }

        public partial class UnitSubMessage
        {
            public UnitUtils.UnitType UnitType;
            public int UnitId;
            public int VisionRange;
            public int MoveRange;
            public int MaxHp;
            public int Hp;
            public int AttackDistance;
            public int AttackRadius;
            public int AttackDamage;
            public bool AttackFriendlyFire;

            public static UnitSubMessage Create()
            {
                return Pool<UnitSubMessage>.Obtain();
            }
        }
    }
}
