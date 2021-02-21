using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;

namespace PixelRPG.Tests.AdditionalContent
{
    [TestFixture]
    public class ServerClientConnectedTransferMessageTest
    {
        [Test]
        public void AllDataWithPlayerName_SerializedDeserialized_Success()
        {
            var target = new ServerClientConnectedTransferMessage
            {
                CurrentCount = 12,
                PlayerId = 34,
                PlayerName = "Player1",
                WaitingCount = 43,
                Units = new List<ServerClientConnectedTransferMessage.UnitTransferMessage>
                {
                    new ServerClientConnectedTransferMessage.UnitTransferMessage
                    {
                        UnitId = 16,
                        UnitType = "UnitType"
                    }
                }
            };

            var parser = new ServerClientConnectedTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerClientConnectedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.CurrentCount, obj.CurrentCount);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
            Assert.AreEqual(target.WaitingCount, obj.WaitingCount);
            Assert.AreEqual(target.Units.Count, obj.Units.Count);
            Assert.AreEqual(target.Units[0].UnitId, obj.Units[0].UnitId);
            Assert.AreEqual(target.Units[0].UnitType, obj.Units[0].UnitType);
        }

        [Test]
        public void AllDataWithoutPlayerNameAndUnits_SerializedDeserialized_Success()
        {
            var target = new ServerClientConnectedTransferMessage
            {
                CurrentCount = 12,
                PlayerId = 34,
                PlayerName = null,
                WaitingCount = 43,
            };

            var parser = new ServerClientConnectedTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerClientConnectedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.CurrentCount, obj.CurrentCount);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
            Assert.AreEqual(target.WaitingCount, obj.WaitingCount);
        }
    }
}
