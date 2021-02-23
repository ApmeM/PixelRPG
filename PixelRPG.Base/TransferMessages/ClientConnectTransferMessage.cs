using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientConnectTransferMessage
    {
        public class UnitSubMessage
        {
            public List<string> Skills;
            public string UnitType;
        }

        public string PlayerName;
        public List<UnitSubMessage> UnitsData = new List<UnitSubMessage>();
    }
}
