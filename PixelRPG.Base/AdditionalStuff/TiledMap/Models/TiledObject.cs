namespace PixelRPG.Base.AdditionalStuff.TiledMap.Models
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    public class TiledObject
    {
        public enum TiledObjectTypes
        {
            None,
            Ellipse,
            Image,
            Polygon,
            Polyline
        }

        public int Id;
        public string Name;
        public string Type;
        public int X;
        public int Y;
        public int Width;
        public int Height;
        public int Rotation;
        public int Gid;
        public bool Visible;
        public TiledObjectTypes TiledObjectType;
        public string ObjectType;
        public List<Vector2> PolyPoints = new List<Vector2>();
        public Dictionary<string,string> Properties = new Dictionary<string,string>();
    }
}

