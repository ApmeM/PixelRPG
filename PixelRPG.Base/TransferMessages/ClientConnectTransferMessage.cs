using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public  class ClientConnectTransferMessage : ITransferMessage
    {
        public class UnitSubMessage
        {
            public List<UnitUtils.Skill> Skills;
            public UnitUtils.UnitType UnitType;
        }

        public string PlayerName;
        public List<UnitSubMessage> UnitsData = new List<UnitSubMessage>();
    }
}
