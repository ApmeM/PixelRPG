using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ClientConnectTransferMessageTest
    {
        [Test]
        public void AllData_SerializedDeserialized_Success()
        {
            var target = ClientConnectTransferMessage.Create()
                .SetPlayerName("Player1")
                .AddUnitType(UnitUtils.UnitType.Rogue)
                .AddSkill(0, UnitUtils.Skill.VisionRange);

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientConnectTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
            Assert.AreEqual(target.UnitsData.Count, obj.UnitsData.Count);
            Assert.AreEqual(target.UnitsData[0].UnitType, obj.UnitsData[0].UnitType);
            Assert.AreEqual(target.UnitsData[0].Skills.Count, obj.UnitsData[0].Skills.Count);
            Assert.AreEqual(target.UnitsData[0].Skills[0], obj.UnitsData[0].Skills[0]);
        }

        [Test]
        public void NoSkills_SerializedDeserialized_Success()
        {
            var target = ClientConnectTransferMessage.Create()
                .SetPlayerName("Player1")
                .AddUnitType(UnitUtils.UnitType.Mage);

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientConnectTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
            Assert.AreEqual(target.UnitsData.Count, obj.UnitsData.Count);
            Assert.AreEqual(target.UnitsData[0].UnitType, obj.UnitsData[0].UnitType);
            Assert.AreEqual(target.UnitsData[0].Skills, obj.UnitsData[0].Skills);
        }

        [Test]
        public void MinimumData_SerializedDeserialized_Success()
        {
            var target = ClientConnectTransferMessage.Create();

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientConnectTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
        }
    }
}
