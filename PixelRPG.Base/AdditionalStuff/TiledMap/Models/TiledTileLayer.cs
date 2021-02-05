namespace PixelRPG.Base.AdditionalStuff.TiledMap.Models
{
    using Microsoft.Xna.Framework;

    public class TiledTileLayer : TiledLayer
    {
        public int X;
        public int Y;
        public int Width;
        public int Height;
        public TiledTile[] Tiles;
        public Color Color = Color.White;

        public TiledTile GetTile( int x, int y )
        {
            return this.Tiles[x + y * this.Width];
        }

        public void SetTile( int x, int y, TiledTile tile )
        {
            this.Tiles[x + y * this.Width] = tile;
        }

        public void RemoveTile( int x, int y )
        {
            this.Tiles[x + y * this.Width] = null;
        }

        public void RemoveTile(TiledTile tile )
        {
            for (var index = 0; index < this.Tiles.Length; index++)
            {
                if (tile == this.Tiles[index])
                {
                    this.Tiles[index] = null;
                }
            }
        }
    }
}