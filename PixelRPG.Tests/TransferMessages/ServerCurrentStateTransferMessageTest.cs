using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerCurrentStateTransferMessageTest
    {

        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = new ServerCurrentStateTransferMessage
            {
                Doors = new List<ServerCurrentStateTransferMessage.PointSubMessage>
                {
                    new ServerCurrentStateTransferMessage.PointSubMessage { X = 3,Y = 4 }
                },
                Exit = new ServerCurrentStateTransferMessage.PointSubMessage { X = 1, Y = 2 },
                Players = new List<ServerCurrentStateTransferMessage.PlayerSubMessage>
                {
                    new ServerCurrentStateTransferMessage.PlayerSubMessage
                    {
                        PlayerId=43,
                        Units = new List<ServerCurrentStateTransferMessage.UnitSubMessage>
                        {
                            new ServerCurrentStateTransferMessage.UnitSubMessage
                            {
                                UnitId = 3,
                                Position = new ServerCurrentStateTransferMessage.PointSubMessage { X = 7,Y = 8 }
                            }
                        }
                    }
                },
                Map = new int?[1, 2] { { 5, null } },
            };

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
            Assert.AreEqual(target.Map.LongLength, obj.Map.LongLength);
            Assert.AreEqual(target.Map[0, 0], obj.Map[0, 0]);
            Assert.AreEqual(target.Map[0, 1], obj.Map[0, 1]);
        }

        [Test]
        public void WithoutData_SerializedDeserialized_Success()
        {
            var target = new ServerCurrentStateTransferMessage
            {
                Players = new List<ServerCurrentStateTransferMessage.PlayerSubMessage>
                {
                    new ServerCurrentStateTransferMessage.PlayerSubMessage
                    {
                        PlayerId=43,
                    }
                },
            };

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
