using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerPlayerTurnMadeTransferMessageTest
    {
        [Test]
        public void WithData_SerializedDserialized_Success()
        {
            var target = new ServerPlayerTurnMadeTransferMessage
            {
                PlayerId = 43
            };

            var parser = new ServerPlayerTurnMadeTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerPlayerTurnMadeTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
        }
    }
}
