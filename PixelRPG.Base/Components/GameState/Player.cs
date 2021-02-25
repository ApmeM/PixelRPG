namespace PixelRPG.Base.Components.GameState
{
    using System.Collections.Generic;

    public class Player
    {
        public int PlayerId;
        public List<Unit> Units;
        public string PlayerName;
        public int LevelScore;
        public int TotalScore;
    }
}