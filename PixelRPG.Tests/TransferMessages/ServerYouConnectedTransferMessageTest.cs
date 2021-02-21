using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerYouConnectedTransferMessageTest
    {
        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = new ServerYouConnectedTransferMessage
            {
                PlayerId = 35
            };

            var parser = new ServerYouConnectedTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerYouConnectedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
        }
    }
}
