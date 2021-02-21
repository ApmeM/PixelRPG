namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public static class TransferMessageParserUtils
    {
        public static ITransferMessageParser FindWriter(object transferModel, ITransferMessageParser[] parsers)
        {
            for (var j = 0; j < parsers.Length; j++)
            {
                if (parsers[j].IsWritable(transferModel))
                {
                    return parsers[j];
                }
            }

            return null;
        }

        public static ITransferMessageParser FindReader(string data, ITransferMessageParser[] parsers)
        {
            for (var j = 0; j < parsers.Length; j++)
            {
                if (parsers[j].IsReadable(data))
                {
                    return parsers[j];
                }
            }

            return null;
        }
    }
}
