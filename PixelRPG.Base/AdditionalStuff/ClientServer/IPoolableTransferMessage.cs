using SpineEngine.Utils.Collections;

namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public interface IPoolableTransferMessage: IPoolable
    {
        void Free();
    }
}
