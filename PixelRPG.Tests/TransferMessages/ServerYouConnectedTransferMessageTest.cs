using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using System.Collections.Generic;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerYouConnectedTransferMessageTest
    {
        [Test]
        public void EmptyData_SerializedDeserialized_Success()
        {
            var target = new ServerYouConnectedTransferMessage
            {
            };

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerYouConnectedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
            Assert.AreEqual(target.UnitsData, obj.UnitsData);
        }

        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = new ServerYouConnectedTransferMessage
            {
                PlayerId = 35,
                UnitsData = new List<ServerYouConnectedTransferMessage.UnitSubMessage>
                {
                    new ServerYouConnectedTransferMessage.UnitSubMessage
                    {
                        MoveRange = 1,
                        VisionRange = 2,
                        UnitId = 3,
                        UnitType = "type"
                    }
                }
            };

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerYouConnectedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
            Assert.AreEqual(target.UnitsData.Count, obj.UnitsData.Count);
            Assert.AreEqual(target.UnitsData[0].UnitType, obj.UnitsData[0].UnitType);
            Assert.AreEqual(target.UnitsData[0].VisionRange, obj.UnitsData[0].VisionRange);
            Assert.AreEqual(target.UnitsData[0].MoveRange, obj.UnitsData[0].MoveRange);
            Assert.AreEqual(target.UnitsData[0].UnitId, obj.UnitsData[0].UnitId);
        }
    }
}
