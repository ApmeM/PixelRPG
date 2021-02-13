namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public static class ParserUtils
    {
        public static ITransferMessageParser FindStringifier(object transferModel, ITransferMessageParser[] parsers)
        {
            for (var j = 0; j < parsers.Length; j++)
            {
                if (parsers[j].IsStringable(transferModel))
                {
                    return parsers[j];
                }
            }

            return null;
        }
        public static ITransferMessageParser FindParser(string data, ITransferMessageParser[] parsers)
        {
            for (var j = 0; j < parsers.Length; j++)
            {
                if (parsers[j].IsParsable(data))
                {
                    return parsers[j];
                }
            }

            return null;
        }
    }
}
