using System;
using System.IO;

namespace PixelRPG.Base.AdditionalStuff.ClientServer
{
    public abstract class BinaryTransferMessageParser<T> : ITransferMessageParser
    {
        private MemoryStream ms;
        private BinaryReader reader;
        private BinaryWriter writer;

        public BinaryTransferMessageParser()
        {
            ms = new MemoryStream();
            reader = new BinaryReader(ms);
            writer = new BinaryWriter(ms);
        }

        protected abstract int Identifier { get; }

        protected abstract T InternalRead(BinaryReader reader);

        protected abstract void InternalWrite(T transferModel, BinaryWriter writer);

        public bool IsReadable(string data)
        {
            var baseData = Convert.FromBase64String(data);
            ms.Seek(0, SeekOrigin.Begin);
            ms.SetLength(0);
            ms.Write(baseData, 0, baseData.Length);
            ms.Seek(0, SeekOrigin.Begin);
            return reader.ReadInt32() == this.Identifier;
        }

        public bool IsWritable(object transferModel)
        {
            return transferModel is T;
        }

        public string Write(object transferModel)
        {
            ms.Seek(0, SeekOrigin.Begin);
            ms.SetLength(0);
            writer.Write(Identifier);
            InternalWrite((T)transferModel, writer);
            writer.Flush();
            ms.Seek(0, SeekOrigin.Begin);
            return Convert.ToBase64String(ms.ToArray());
        }

        public object Read(string data)
        {
            var baseData = Convert.FromBase64String(data);
            ms.Seek(0, SeekOrigin.Begin);
            ms.SetLength(0);
            ms.Write(baseData, 0, baseData.Length);
            ms.Seek(0, SeekOrigin.Begin);
            reader.ReadInt32();
            return InternalRead(reader);
        }
    }
}
