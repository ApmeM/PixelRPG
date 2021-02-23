using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ClientConnectTransferMessageTest
    {
        [Test]
        public void AllData_SerializedDeserialized_Success()
        {
            var target = new ClientConnectTransferMessage
            {
                PlayerName = "Player1",
                UnitsData = new List<ClientConnectTransferMessage.UnitSubMessage>
                {
                    new ClientConnectTransferMessage.UnitSubMessage
                    {
                        UnitType = "UnitType",
                        Skills = new List<string>
                        {
                            "Skill1"
                        }
                    }
                }
            };

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
            var target = new ClientConnectTransferMessage
            {
                PlayerName = "Player1",
                UnitsData = new List<ClientConnectTransferMessage.UnitSubMessage>
                {
                    new ClientConnectTransferMessage.UnitSubMessage
                    {
                        UnitType = "UnitType",
                    }
                }
            };

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
            var target = new ClientConnectTransferMessage();

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientConnectTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
        }
    }
}
