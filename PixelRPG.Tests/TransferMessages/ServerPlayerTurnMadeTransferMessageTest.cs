﻿using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerPlayerTurnMadeTransferMessageTest
    {
        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = ServerPlayerTurnMadeTransferMessage.Create()
                .SetPlayerId(43);

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerPlayerTurnMadeTransferMessage)parser.Read(data);
            Assert.AreEqual(target.PlayerId, obj.PlayerId);
        }
    }
}
