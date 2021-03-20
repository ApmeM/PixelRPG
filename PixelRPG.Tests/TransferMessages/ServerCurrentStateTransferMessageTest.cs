using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerCurrentStateTransferMessageTest
    {

        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = ServerCurrentStateTransferMessage.Create()
                .AddDoor(3,4)
                .SetExit(1,2)
                .AddPlayer(43, 5, 6)
                .AddUnit(0, 3, 7, 8, 9);
            target.Map.Add(10);
            target.Map.Add(11);

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerCurrentStateTransferMessage)parser.Read(data);
            Assert.AreEqual(target.Doors.Count, obj.Doors.Count);
            Assert.AreEqual(target.Doors[0].X, obj.Doors[0].X);
            Assert.AreEqual(target.Doors[0].Y, obj.Doors[0].Y);
            Assert.AreEqual(target.Exit.X, obj.Exit.X);
            Assert.AreEqual(target.Exit.Y, obj.Exit.Y);
            Assert.AreEqual(target.Players.Count, obj.Players.Count);
            Assert.AreEqual(target.Players[0].PlayerId, obj.Players[0].PlayerId);
            Assert.AreEqual(target.Players[0].Units.Count, obj.Players[0].Units.Count);
            Assert.AreEqual(target.Players[0].Units[0].UnitId, obj.Players[0].Units[0].UnitId);
            Assert.AreEqual(target.Players[0].Units[0].Position.X, obj.Players[0].Units[0].Position.X);
            Assert.AreEqual(target.Players[0].Units[0].Position.Y, obj.Players[0].Units[0].Position.Y);
            Assert.AreEqual(target.Map.Count, obj.Map.Count);
            Assert.AreEqual(target.Map[0], obj.Map[0]);
            Assert.AreEqual(target.Map[1], obj.Map[1]);
        }

        [Test]
        public void WithoutData_SerializedDeserialized_Success()
        {
            var target = ServerCurrentStateTransferMessage.Create()
                .AddPlayer(43, 2, 3);

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerCurrentStateTransferMessage)parser.Read(data);
            Assert.AreEqual(target.Doors, obj.Doors);
            Assert.AreEqual(target.Exit, obj.Exit);
            Assert.AreEqual(target.Players.Count, obj.Players.Count);
            Assert.AreEqual(target.Players[0].PlayerId, obj.Players[0].PlayerId);
            Assert.AreEqual(target.Players[0].Units, obj.Players[0].Units);
            Assert.AreEqual(target.Map, obj.Map);
        }
    }
}
