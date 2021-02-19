using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Tests.AdditionalContent
{
    [TestFixture]
    public class ServerClientConnectedTransferMessageTest
    {
        [Test]
        public void AllDataWithPlayerName_SerializedDserialized_Success()
        {
            var target = new ServerClientConnectedTransferMessage
            {
                CurrentCount = 12,
                PlayerId = 34,
                PlayerName = "Player1",
                WaitingCount = 43
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
        [Test]
        public void AllDataWithoutPlayerName_SerializedDserialized_Success()
        {
            var target = new ServerClientConnectedTransferMessage
            {
                CurrentCount = 12,
                PlayerId = 34,
                PlayerName = null,
                WaitingCount = 43
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
