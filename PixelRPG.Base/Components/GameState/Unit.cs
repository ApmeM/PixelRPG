namespace PixelRPG.Base.Components.GameState
{
    using Microsoft.Xna.Framework;

    public class Unit
    {
        public string UnitTypeName;
        public int UnitId;
        public Point Position;
        public int VisionRange = 5;
        public int MoveRange = 1;
    }
}