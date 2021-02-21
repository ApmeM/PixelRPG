using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;
using System.IO;

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

    public class ClientConnectTransferMessageParser : BinaryTransferMessageParser<ClientConnectTransferMessage>
    {
        protected override int Identifier => 1;

        protected override void InternalWrite(ClientConnectTransferMessage transferModel, BinaryWriter writer)
        {
            writer.Write(transferModel.PlayerName != null);
            if (transferModel.PlayerName != null)
            {
                writer.Write(transferModel.PlayerName);
            }

            writer.Write(transferModel.UnitsData.Count);
            for (var i = 0; i < transferModel.UnitsData.Count; i++)
            {
                var unitNameExists = transferModel.UnitsData[i].UnitName != null;
                writer.Write(unitNameExists);
                if (unitNameExists)
                {
                    writer.Write(transferModel.UnitsData[i].UnitName);
                }
                
                writer.Write(transferModel.UnitsData[i].UnitType);
                writer.Write(transferModel.UnitsData[i].Skills?.Count ?? 0);
                for (var j = 0; j < (transferModel.UnitsData[i].Skills?.Count ?? 0); j++)
                {
                    writer.Write(transferModel.UnitsData[i].Skills[j]);
                }
            }
        }

        protected override ClientConnectTransferMessage InternalRead(BinaryReader reader)
        {
            var playerNameExists = reader.ReadBoolean();
            string playerName = null;
            if (playerNameExists)
            {
                playerName = reader.ReadString();
            }
            
            var unitsCount = reader.ReadInt32();
            var unitsData = new List<ClientConnectTransferMessage.UnitDescription>(unitsCount);
            for (var i = 0; i < unitsCount; i++)
            {
                string unitName = null;
                var unitNameExists = reader.ReadBoolean();
                if (unitNameExists)
                {
                    unitName = reader.ReadString();
                }
                var unitType = reader.ReadString();
                var bonusesCount = reader.ReadInt32();
                var bonuses = new List<string>(bonusesCount);
                for (var j = 0; j < bonusesCount; j++)
                {
                    var bonus = reader.ReadString();
                    bonuses.Add(bonus);
                }
                unitsData.Add(new ClientConnectTransferMessage.UnitDescription
                {
                    Skills = bonuses,
                    UnitName = unitName,
                    UnitType = unitType
                });
            }

            return new ClientConnectTransferMessage
            {
                PlayerName = playerName,
                UnitsData = unitsData
            };
        }
    }
}
