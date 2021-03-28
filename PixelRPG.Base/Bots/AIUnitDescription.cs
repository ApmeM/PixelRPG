namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using PixelRPG.Base.Components.GameState;
    using SpineEngine.Utils.Collections;
    #endregion

    public partial class AIUnitDescription : IPoolable
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

        public static AIUnitDescription Create()
        {
            return Pool<AIUnitDescription>.Obtain();
        }

        public void Free()
        {
            Pool<AIUnitDescription>.Free(this);
        }

        public void Reset()
        {
            UnitType = 0;
            UnitId = 0;
            VisionRange = 0;
            MoveRange = 0;
            MaxHp = 0;
            Hp = 0;
            AttackDistance = 0;
            AttackRadius = 0;
            AttackDamage = 0;
            AttackFriendlyFire = false;
        }
    }
}