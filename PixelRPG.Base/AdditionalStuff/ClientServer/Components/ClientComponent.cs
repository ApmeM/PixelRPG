namespace PixelRPG.Base.AdditionalStuff.ClientServer.Components
{
    #region Using Directives

    using LocomotorECS;
    #endregion

    public class ClientComponent : Component
    {
        public ITransferMessage Message;
        public ITransferMessage Response;
    }
}