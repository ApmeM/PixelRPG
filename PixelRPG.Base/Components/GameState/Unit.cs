﻿namespace PixelRPG.Base.Components.GameState
{
    using Microsoft.Xna.Framework;

    public class Unit
    {
        public UnitUtils.UnitType UnitType;
        public int UnitId;
        public Point Position;
        public int VisionRange = 5;
        public int MoveRange = 2;
        public int MaxHp = 10;
        public int Hp = 10;
        public int AttackDistance = 0;
        public int AttackRadius = 1;
        public int AttackDamage = 2;
        public bool AttackFriendlyFire = false;
    }
}