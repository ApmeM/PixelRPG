namespace PixelRPG.Base.TransferMessages
{
    public class PointSubMessage
    {
        public int X;
        public int Y;

        public PointSubMessage()
        {
        }

        public PointSubMessage(int x, int y)
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
