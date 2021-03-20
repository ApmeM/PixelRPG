using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;
using SpineEngine.Utils.Collections;
using System.Collections.Generic;

namespace PixelRPG.Base.TransferMessages
{
    public partial class ClientConnectTransferMessage : ITransferMessage
    {
        public string PlayerName;
        public readonly List<UnitSubMessage> UnitsData = new List<UnitSubMessage>();

        public static ClientConnectTransferMessage Create()
        {
            return Pool<ClientConnectTransferMessage>.Obtain();
        }

        public ClientConnectTransferMessage AddSkill(int unitIndex, UnitUtils.Skill value)
        {
            this.UnitsData[unitIndex].Skills.Add(value);
            return this;
        }

        public ClientConnectTransferMessage AddUnitType(UnitUtils.UnitType value)
        {
            var unit = UnitSubMessage.Create();
            unit.UnitType = value;
            this.UnitsData.Add(unit);
            return this;
        }

        public ClientConnectTransferMessage SetPlayerName(string value)
        {
            this.PlayerName = value;
            return this;
        }

        public partial class UnitSubMessage
        {
            public readonly List<UnitUtils.Skill> Skills = new List<UnitUtils.Skill>();
            public UnitUtils.UnitType UnitType;

            public static UnitSubMessage Create()
            {
                return Pool<UnitSubMessage>.Obtain();
            }
        }
    }
}
