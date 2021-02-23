﻿using NUnit.Framework;
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
                UnitActions = new Dictionary<int, ClientTurnDoneTransferMessage.UnitActionSubAction>
                {
                    {1,  new ClientTurnDoneTransferMessage.UnitActionSubAction { NewPosition = new ClientTurnDoneTransferMessage.PointSubMessage { X=11, Y=12 } } },
                    {3,  new ClientTurnDoneTransferMessage.UnitActionSubAction { NewPosition = new ClientTurnDoneTransferMessage.PointSubMessage { X=12, Y=11 } } },
                    {11, new ClientTurnDoneTransferMessage.UnitActionSubAction { NewPosition = new ClientTurnDoneTransferMessage.PointSubMessage {X=110, Y=0 } } },
                }
            };

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientTurnDoneTransferMessage)parser.Read(data);
            Assert.AreEqual(target.UnitActions.Count, obj.UnitActions.Count);
            Assert.AreEqual(target.UnitActions[1].NewPosition.X, obj.UnitActions[1].NewPosition.X);
            Assert.AreEqual(target.UnitActions[1].NewPosition.Y, obj.UnitActions[1].NewPosition.Y);
            Assert.AreEqual(target.UnitActions[3].NewPosition.X, obj.UnitActions[3].NewPosition.X);
            Assert.AreEqual(target.UnitActions[3].NewPosition.Y, obj.UnitActions[3].NewPosition.Y);
            Assert.AreEqual(target.UnitActions[11].NewPosition.X, obj.UnitActions[11].NewPosition.X);
            Assert.AreEqual(target.UnitActions[11].NewPosition.Y, obj.UnitActions[11].NewPosition.Y);
        }

        [Test]
        public void NewPositionNotExists_SerializedDeserialized_Success()
        {
            var target = new ClientTurnDoneTransferMessage
            {
                UnitActions = new Dictionary<int, ClientTurnDoneTransferMessage.UnitActionSubAction>()
            };

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ClientTurnDoneTransferMessage)parser.Read(data);
            Assert.AreEqual(target.UnitActions.Count, obj.UnitActions.Count);
        }
    }
}