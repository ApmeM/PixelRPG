using FateRandom;
using PixelRPG.Base.Components.GameState.Skills;
using PixelRPG.Base.EntitySystems;
using System.Collections.Generic;

namespace PixelRPG.Base.Components.GameState
{
    public static class GameStateUtils
    {
        private static IUnitType[] SupportedUnitTypes = new IUnitType[]
        {
            new WarriorUnitType(),
            new RogueUnitType(),
            new MageUnitType(),
            new RangerUnitType()
        };

        private static ISkill[] SupporteSkills = new ISkill[]
        {
            new VisionRangeSkill(),
            new MoveRangeSkill(),
        };

        public static IUnitType FindUnitType(string unitType)
        {
            for (var i = 0; i < SupportedUnitTypes.Length; i++)
            {
                if (SupportedUnitTypes[i].GetType().Name == unitType)
                {
                    return SupportedUnitTypes[i];
                }
            }

            return null;
        }

        public static string GetUnitTypeName(IUnitType unitType)
        {
            return unitType.GetType().Name;
        }

        public static IUnitType GetRandomUnitType()
        {
            return Fate.GlobalFate.Choose(SupportedUnitTypes);
        }

        public static ISkill FindSkill(string skillType)
        {
            for (var i = 0; i < SupporteSkills.Length; i++)
            {
                if (SupporteSkills[i].GetType().Name == skillType)
                {
                    return SupporteSkills[i];
                }
            }

            return null;
        }
    }
}