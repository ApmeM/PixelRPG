namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;

    using LocomotorECS;
    #endregion

    public class LocalServerComponent : Component
    {
        public Dictionary<int, List<object>> SerializedRequest = new Dictionary<int, List<object>>();
        public Dictionary<int, List<object>> SerializedResponse = new Dictionary<int, List<object>>();
    }
}