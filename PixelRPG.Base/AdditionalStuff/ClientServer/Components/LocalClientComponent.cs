namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    #region Using Directives

    using LocomotorECS;
    using System;
    #endregion

    public class LocalClientComponent : Component
    {
        public string ServerEntity;
        public Guid Identifier = Guid.Empty;
    }
}