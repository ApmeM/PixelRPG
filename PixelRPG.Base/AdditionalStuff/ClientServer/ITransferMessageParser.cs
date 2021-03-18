namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public interface ITransferMessageParser
    {
        bool IsReadable(string data);
        bool IsWritable(ITransferMessage transferModel);
        string Write(ITransferMessage transferModel);
        ITransferMessage Read(string data);
    }
}
