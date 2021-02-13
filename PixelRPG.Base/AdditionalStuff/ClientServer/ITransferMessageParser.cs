namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public interface ITransferMessageParser
    {
        bool IsParsable(string data);
        bool IsStringable(object transferModel);
        string ToData(object transferModel);
        object ToTransferModel(string data);
    }
}
