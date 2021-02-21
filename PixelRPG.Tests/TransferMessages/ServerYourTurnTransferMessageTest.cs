using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerYourTurnTransferMessageTest
    {
        [Test]
        public void EmptyObject_SerializedDeserialized_Success()
        {
            var target = new ServerYourTurnTransferMessage
            {
            };

            var parser = new ServerYourTurnTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerYourTurnTransferMessage)parser.Read(data);
            Assert.NotNull(obj);
        }
    }
}
