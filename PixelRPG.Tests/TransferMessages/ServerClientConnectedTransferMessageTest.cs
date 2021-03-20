using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Tests.AdditionalContent
{
    [TestFixture]
    public class ServerClientConnectedTransferMessageTest
    {
        [Test]
        public void AllDataWithPlayerName_SerializedDeserialized_Success()
        {
            var target = ServerClientConnectedTransferMessage.Create()
                .SetData(34, "Player1", 43, 12)
                .AddUnit(16, UnitUtils.UnitType.Warrior);

            var parser = TransferMessageParserUtils.FindWriter(target);
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
            var target = ServerClientConnectedTransferMessage.Create()
                .SetData(34, null, 43, 12);

            var parser = TransferMessageParserUtils.FindWriter(target);
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
