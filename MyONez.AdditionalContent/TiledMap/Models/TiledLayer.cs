namespace MyONez.AdditionalContent.TiledMap.Models
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    public abstract class TiledLayer
    {
        public Vector2 Offset;
        public string Name;
        public Dictionary<string,string> Properties = new Dictionary<string, string>();
        public bool Visible = true;
        public float Opacity;
    }
}