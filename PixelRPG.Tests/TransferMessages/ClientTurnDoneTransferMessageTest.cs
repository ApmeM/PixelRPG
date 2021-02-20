using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ClientTurnDoneTransferMessageTest
    {
        [Test]
        public void NewPositionExists_SerializedDserialized_Success()
        {
            var target = new ClientTurnDoneTransferMessage
            {
                NewPosition = new Dictionary<int, PointTransferMessage>
                {
                    {1,  new PointTransferMessage(11, 12) },
                    {3,  new PointTransferMessage(12, 11) },
                    {11, new PointTransferMessage(110, 0) },
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
        public void NewPositionNotExists_SerializedDserialized_Success()
        {
            var target = new ClientTurnDoneTransferMessage
            {
                NewPosition = new Dictionary<int, PointTransferMessage>()
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
