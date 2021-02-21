using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerCurrentStateTransferMessageTest
    {
        [Test]
        public void WithData_SerializedDserialized_Success()
        {
            var target = new ServerCurrentStateTransferMessage
            {
                Doors = new List<PointTransferMessage>
                {
                    new PointTransferMessage(3,4)
                },
                Exit = new PointTransferMessage(1,2),
                Players = new List<ServerCurrentStateTransferMessage.PlayerTransferMessage>
                {
                    new ServerCurrentStateTransferMessage.PlayerTransferMessage
                    {
                        PlayerId=43,
                        Units = new List<ServerCurrentStateTransferMessage.UnitTransferMessage>
                        {
                            new ServerCurrentStateTransferMessage.UnitTransferMessage
                            {
                                UnitId = 3,
                                Position = new PointTransferMessage(7,8)
                            }
                        }
                    }
                },
                Map = new int?[1, 2] { { 5, null } },
            };

            var parser = new ServerCurrentStateTransferMessageParser();
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerCurrentStateTransferMessage)parser.Read(data);
            Assert.AreEqual(target.Doors.Count, obj.Doors.Count);
            Assert.AreEqual(target.Doors[0].X, obj.Doors[0].X);
            Assert.AreEqual(target.Doors[0].Y, obj.Doors[0].Y);
            Assert.AreEqual(target.Exit.Value.X, obj.Exit.Value.X);
            Assert.AreEqual(target.Exit.Value.Y, obj.Exit.Value.Y);
            Assert.AreEqual(target.Players.Count, obj.Players.Count);
            Assert.AreEqual(target.Players[0].PlayerId, obj.Players[0].PlayerId);
            Assert.AreEqual(target.Players[0].Units.Count, obj.Players[0].Units.Count);
            Assert.AreEqual(target.Players[0].Units[0].UnitId, obj.Players[0].Units[0].UnitId);
            Assert.AreEqual(target.Players[0].Units[0].Position.X, obj.Players[0].Units[0].Position.X);
            Assert.AreEqual(target.Players[0].Units[0].Position.Y, obj.Players[0].Units[0].Position.Y);
            Assert.AreEqual(target.Map.LongLength, obj.Map.LongLength);
            Assert.AreEqual(target.Map[0,0], obj.Map[0,0]);
            Assert.AreEqual(target.Map[0,1], obj.Map[0,1]);
        }
    }
}
