namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using SpineEngine.Utils.Collections;
    #endregion

    public partial class AIPoint : IPoolable
    {
        public int X;
        public int Y;

        public static AIPoint Create()
        {
            return Pool<AIPoint>.Obtain();
        }

        public void Free()
        {
            Pool<AIPoint>.Free(this);
        }

        public void Reset()
        {
            X = 0;
            Y = 0;
        }
    }
}