namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public interface ITransferMessageParser
    {
        bool IsReadable(string data);
        bool IsWritable(object transferModel);
        string Write(object transferModel);
        object Read(string data);
    }
}
