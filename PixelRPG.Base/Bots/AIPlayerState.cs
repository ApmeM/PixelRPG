namespace PixelRPG.Base.Screens
{
    using SpineEngine.Utils.Collections;
    #region Using Directives

    using System.Collections.Generic;
    #endregion

    public partial class AIPlayerState : IPoolable
    {
        public int PlayerId;
        public readonly List<UnitSubMessage> Units = new List<UnitSubMessage>();
        public int LevelScore;
        public int TotalScore;

        public static AIPlayerState Create()
        {
            return Pool<AIPlayerState>.Obtain();
        }

        public void Free()
        {
            Pool<AIPlayerState>.Free(this);
        }

        public void Reset()
        {
            PlayerId = 0;
            LevelScore = 0;
            TotalScore = 0;
            for (var i = 0; i < Units.Count; i++)
            {
                Units[i].Free();
            }

            Units.Clear();
        }

        public partial class UnitSubMessage : IPoolable
        {
            public int UnitId;
            public PointSubMessage Position;
            public int Hp;

            public static UnitSubMessage Create()
            {
                return Pool<UnitSubMessage>.Obtain();
            }

            public void Free()
            {
                Pool<UnitSubMessage>.Free(this);
            }

            public void Reset()
            {
                UnitId = 0;
                Hp = 0;
                Position?.Free();
                Position = null;
            }
        }

        public partial class PointSubMessage : IPoolable
        {
            public int X;
            public int Y;
            
            public static PointSubMessage Create()
            {
                return Pool<PointSubMessage>.Obtain();
            }

            public void Free()
            {
                Pool<PointSubMessage>.Free(this);
            }

            public void Reset()
            {
                X = 0;
                Y = 0;
            }
        }
    }
}