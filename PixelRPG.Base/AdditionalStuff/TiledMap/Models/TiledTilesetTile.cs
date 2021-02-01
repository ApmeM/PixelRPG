namespace PixelRPG.Base.AdditionalStuff.TiledMap.Models
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    public class TiledTileSetTile
    {
        public int Id;
        public List<TiledTileSetAnimationFrame> AnimationFrames;
        public Dictionary<string, string> Properties = new Dictionary<string, string>();
        public Rectangle SourceRect;
    }
}
