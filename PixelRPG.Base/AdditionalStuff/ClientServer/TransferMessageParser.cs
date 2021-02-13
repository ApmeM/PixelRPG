namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public abstract class TransferMessageParser<T> : ITransferMessageParser
    {
        private static string TypeName = typeof(T).Name;
        public bool IsParsable(string data)
        {
            return data.StartsWith($"{TypeName}:");
        }

        public bool IsStringable(object transferModel)
        {
            return transferModel is T;
        }

        public string ToData(object transferModel)
        {
            return TypeName + ":" + InternalToData((T)transferModel);
        }

        public object ToTransferModel(string data)
        {
            return InternalToTransferModel(data.Substring(TypeName.Length + 1));
        }

        protected abstract T InternalToTransferModel(string data);
        protected abstract string InternalToData(T transferModel);
    }
}
