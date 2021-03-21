using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using PixelRPG.Base.AdditionalStuff.ClientServer;
using PixelRPG.Base.Components.GameState;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerYouConnectedTransferMessageTest
    {
        [Test]
        public void EmptyData_SerializedDeserialized_Success()
        {
            var target = ServerYouConnectedTransferMessage.Create();

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
            var target = ServerYouConnectedTransferMessage.Create()
                .SetPlayerId(35)
                .AddUnit(3, UnitUtils.UnitType.Ranger, 2, 1, 0, 0, true, 0, 0, 0);

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
            Assert.AreEqual(target.UnitsData[0].AttackFriendlyFire, obj.UnitsData[0].AttackFriendlyFire);
        }
    }
}
