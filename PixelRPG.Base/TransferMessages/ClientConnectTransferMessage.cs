using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public class ClientConnectTransferMessage
    {
        public class UnitDescription
        {
            public string UnitName;
            public List<string> Skills;
            public string UnitType;
        }

        public string PlayerName;
        public List<UnitDescription> UnitsData = new List<UnitDescription>();
    }
}
