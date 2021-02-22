using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ClientTurnDoneTransferMessageTest
    {
        [Test]
        public void NewPositionExists_SerializedDeserialized_Success()
        {
            var target = new ClientTurnDoneTransferMessage
            {
                NewPosition = new Dictionary<int, PointSubMessage>
                {
                    {1,  new PointSubMessage(11, 12) },
                    {3,  new PointSubMessage(12, 11) },
                    {11, new PointSubMessage(110, 0) },
                }
            };

            var parser = new ClientTurnDoneTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientTurnDoneTransferMessage)parser.Read(data);
            Assert.AreEqual(target.NewPosition.Count, obj.NewPosition.Count);
            Assert.AreEqual(target.NewPosition[1].X, obj.NewPosition[1].X);
            Assert.AreEqual(target.NewPosition[1].Y, obj.NewPosition[1].Y);
            Assert.AreEqual(target.NewPosition[3].X, obj.NewPosition[3].X);
            Assert.AreEqual(target.NewPosition[3].Y, obj.NewPosition[3].Y);
            Assert.AreEqual(target.NewPosition[11].X, obj.NewPosition[11].X);
            Assert.AreEqual(target.NewPosition[11].Y, obj.NewPosition[11].Y);
        }

        [Test]
        public void NewPositionNotExists_SerializedDeserialized_Success()
        {
            var target = new ClientTurnDoneTransferMessage
            {
                NewPosition = new Dictionary<int, PointSubMessage>()
            };

            var parser = new ClientTurnDoneTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientTurnDoneTransferMessage)parser.Read(data);
            Assert.AreEqual(target.NewPosition.Count, obj.NewPosition.Count);
        }
    }
}
