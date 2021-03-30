namespace PixelRPG.Base.Screens
{
    public class GameSceneConfig
    {
        public bool IsServer;
        public int ClientsCount = 1;
        public int TotalPlayers = 2;
    }

    public enum RegionValue
    {
        Wall,
        Path,
        Unknown
    }
}