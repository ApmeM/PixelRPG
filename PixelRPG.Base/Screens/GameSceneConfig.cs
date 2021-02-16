namespace PixelRPG.Base.Screens
{
    public class GameSceneConfig
    {
        public static int? WallRegionValue = 1;
        public static int? PathRegionValue = 0;
        public static int? UnknownRegionValue = null;

        public bool IsServer;
        public int ClientsCount = 1;
        public int TotalPlayers = 2;
    }
}