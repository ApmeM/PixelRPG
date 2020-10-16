namespace MyONez.AdditionalContent.TiledMap.Models
{
    public class TiledTile
    {
        public int Id;
        public bool FlippedHorizonally;
        public bool FlippedVertically;
        public bool FlippedDiagonally;

        public TiledTileSet TileSet { get; internal set; }
        public TiledTileSetTile TileSetTile { get; internal set; }


        internal int OldId;
        internal TiledTileSetTile RenderTileSetTile;
        internal float ElapsedTime;
        internal int CurrentFrame;
    }
}