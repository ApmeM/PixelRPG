using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ClientConnectTransferMessageTest
    {
        [Test]
        public void PlayerName_SerializedDserialized_Success()
        {
            var target = new ClientConnectTransferMessage
            {
                PlayerName = "Player1"
            };

            var parser = new ClientConnectTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientConnectTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
        }

        [Test]
        public void PlayerNameNull_SerializedDserialized_Success()
        {
            var target = new ClientConnectTransferMessage
            {
                PlayerName = null
            };

            var parser = new ClientConnectTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientConnectTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerName, obj.PlayerName);
        }
    }
}
