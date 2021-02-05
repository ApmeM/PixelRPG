namespace PixelRPG.Base.AdditionalStuff.TiledMap.Models
{
    using System;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    using SpineEngine.Maths;

    public class TiledMap
    {
        public int FirstGid;
        public int Width;
        public int Height;
        public int TileWidth;
        public int TileHeight;
        public Color? BackgroundColor;
        public TiledRenderOrder RenderOrder;
        public TiledMapOrientation Orientation;
        public Dictionary<string, string> Properties = new Dictionary<string, string>();
        public List<TiledLayer> Layers = new List<TiledLayer>();
        public List<TiledObjectGroup> ObjectGroups = new List<TiledObjectGroup>();
        public List<TiledTileSet> TileSets = new List<TiledTileSet>();

        public int GetLayerIndex(string name)
        {
            for (var i = 0; i < this.Layers.Count; i++)
            {
                if (this.Layers[i].Name == name)
                    return i;
            }

            throw new Exception("could not find the layer: " + name);
        }

        public TiledLayer GetLayer( string name )
        {
            for( var i = 0; i < this.Layers.Count; i++ )
            {
                if( this.Layers[i].Name == name )
                    return this.Layers[i];
            }
            return null;
        }

        public TiledObjectGroup GetObjectGroup( string name )
        {
            for( var i = 0; i < this.ObjectGroups.Count; i++ )
            {
                if( this.ObjectGroups[i].Name == name )
                    return this.ObjectGroups[i];
            }
            return null;
        }

        public Point WorldToTilePosition( Vector2 pos, bool clampToTilemapBounds = true )
        {
            return new Point( this.WorldToTilePositionX( pos.X, clampToTilemapBounds ), this.WorldToTilePositionY( pos.Y, clampToTilemapBounds ) );
        }

        public int WorldToTilePositionX( float x, bool clampToTilemapBounds = true )
        {
            var tileX = Mathf.FastFloorToInt( x / this.TileWidth );
            if( !clampToTilemapBounds )
                return tileX;
            return Mathf.Clamp( tileX, 0, this.Width - 1 );
        }


        public int WorldToTilePositionY( float y, bool clampToTilemapBounds = true )
        {
            var tileY = Mathf.FastFloorToInt( y / this.TileHeight );
            if( !clampToTilemapBounds )
                return tileY;
            return Mathf.Clamp( tileY, 0, this.Height - 1 );
        }
        
        public int TileToWorldPositionX( int x )
        {
            return x * this.TileWidth;
        }

        public int TileToWorldPositionY( int y )
        {
            return y * this.TileHeight;
        }
    }
}
