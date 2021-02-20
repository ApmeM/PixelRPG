namespace PixelRPG.Base.TransferMessages
{
    public struct PointTransferMessage
    {
        public int X;
        public int Y;

        public PointTransferMessage(int x, int y)
        {
            this.X = x;
            this.Y = y;
        }

        public override string ToString()
        {
            return $"{X} x {Y}";
        }
    }
}
