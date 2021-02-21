using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerGameStartedTransferMessageTest
    {
        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = new ServerGameStartedTransferMessage
            {
                Width = 32,
                Height = 76
            };

            var parser = new ServerGameStartedTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerGameStartedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.Width, obj.Width);
            Assert.AreEqual(target.Height, obj.Height);
        }
    }
}
