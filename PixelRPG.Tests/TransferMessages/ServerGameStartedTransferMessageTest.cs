﻿using NUnit.Framework;
using System;
using PixelRPG.Base.TransferMessages;
using PixelRPG.Base.AdditionalStuff.ClientServer;

namespace PixelRPG.Tests.AdditionalContent
{

    [TestFixture]
    public class ServerGameStartedTransferMessageTest
    {
        [Test]
        public void WithData_SerializedDeserialized_Success()
        {
            var target = ServerGameStartedTransferMessage.Create()
                .SetSize(43, 76);

            var parser = TransferMessageParserUtils.FindWriter(target);
            Assert.IsTrue(parser.IsWritable(target));
            var data = parser.Write(target);
            Console.WriteLine(data);
            var obj = (ServerGameStartedTransferMessage)parser.Read(data);
            Assert.AreEqual(target.Width, obj.Width);
            Assert.AreEqual(target.Height, obj.Height);
        }
    }
}
