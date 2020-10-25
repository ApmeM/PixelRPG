namespace MyONez.AdditionalContent.TiledMap.Models
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class TiledTileSet
    {
        public int Spacing;
        public int Margin;
        public Dictionary<string,string> Properties = new Dictionary<string,string>();
        public List<TiledTileSetTile> Tiles = new List<TiledTileSetTile>();
        public int FirstGid;
        public string Image;
        public Texture2D ImageTexture;

        public static TiledTileSet Build(int imageWidth, int imageHeight, int tileWidth, int tileHeight, int spacing = 2, int margin = 2, int columns = 2 )
        {
            var tileSet = new TiledTileSet();
            tileSet.Spacing = spacing;
            tileSet.Margin = margin;

            var id = 0;
            for (var y = margin; y < imageHeight - margin; y += tileHeight + spacing)
            {
                var column = 0;

                for (var x = margin; x < imageWidth - margin; x += tileWidth + spacing)
                {
                    tileSet.Tiles.Add(new TiledTileSetTile { Id = id, SourceRect = new Rectangle(x, y, tileWidth, tileHeight) });
                    id++;

                    if (++column >= columns)
                        break;
                }
            }

            return tileSet;
        }
    }
}