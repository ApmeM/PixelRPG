using FateRandom;
using PixelRPG.Base.Components.GameState.Skills;
using System.Collections.Generic;

namespace PixelRPG.Base.Components.GameState
{
    public static class UnitUtils
    {
        public enum UnitType
        {
            Warrior,
            Rogue,
            Mage,
            Ranger,
            Bat
        };

        private static Dictionary<UnitType, Unit> UnitTypeTemplates = new Dictionary<UnitType, Unit>
        {
            {
                UnitType.Warrior, new Unit
                {
                    MaxHp = 20,
                    Hp = 20,
                    AttackDamage = 3

                }
            },
            {
                UnitType.Rogue, new Unit
                {
                    AttackRadius = 2
                }
            },
            {
                UnitType.Mage, new Unit
                {
                    AttackDistance = 3,
                    AttackRadius = 2,
                    AttackFriendlyFire = true
                }
            },
            {
                UnitType.Ranger, new Unit
                {
                    VisionRange = 7,
                    AttackDistance = 3
                }
            },
            {
                UnitType.Bat, new Unit
                {
                    MoveRange = 3,
                    MaxHp = 5,
                    Hp = 5
                }
            },
        };

        private static List<UnitType> UnitTypeTemplateList = new List<UnitType>();

        static UnitUtils()
        {
            UnitTypeTemplateList.AddRange(UnitTypeTemplates.Keys);
        }

        public static Unit BuildUnit(UnitType unitType)
        {
            var unit = new Unit();
            var template = UnitTypeTemplates[unitType];
            unit.UnitType = unitType;
            unit.UnitId = template.UnitId;
            unit.Position = template.Position;
            unit.VisionRange = template.VisionRange;
            unit.MoveRange = template.MoveRange;
            unit.MaxHp = template.MaxHp;
            unit.Hp = template.Hp;
            unit.AttackDistance = template.AttackDistance;
            unit.AttackRadius = template.AttackRadius;
            unit.AttackDamage = template.AttackDamage;
            unit.AttackFriendlyFire = template.AttackFriendlyFire;
            return unit;
        }

        public static Unit GetRandomUnit()
        {
            return BuildUnit(Fate.GlobalFate.Choose<UnitType>(UnitTypeTemplateList));
        }

        public enum Skill
        {
            VisionRange,
            MoveRange
        };
        
        private static Dictionary<Skill, ISkill> SupporteSkills = new Dictionary<Skill, ISkill>
        {
            { Skill.VisionRange, new VisionRangeSkill() },
            { Skill.MoveRange, new MoveRangeSkill() },
        };

        public static void ApplySkill(Player player, Unit unit, Skill skill)
        {
            SupporteSkills[skill].Apply(player, unit);
        }
    }
}