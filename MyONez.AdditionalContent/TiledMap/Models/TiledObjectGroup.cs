namespace MyONez.AdditionalContent.TiledMap.Models
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;

    public class TiledObjectGroup
    {
        public string Name;
        public Color Color;
        public float Opacity;
        public bool Visible;
        public Dictionary<string,string> Properties = new Dictionary<string,string>();
        public List<TiledObject> Objects;

        public TiledObject ObjectWithName( string name )
        {
            for( int i = 0; i < this.Objects.Count; i++ )
            {
                if( this.Objects[i].Name == name )
                    return this.Objects[i];
            }
            return null;
        }

        public List<TiledObject> ObjectsWithName( string name )
        {
            var list = new List<TiledObject>();
            for( int i = 0; i < this.Objects.Count; i++ )
            {
                if( this.Objects[i].Name == name )
                    list.Add( this.Objects[i] );
            }
            return list;
        }

        public List<TiledObject> ObjectsWithType( string type )
        {
            var list = new List<TiledObject>();
            for( int i = 0; i < this.Objects.Count; i++ )
            {
                if( this.Objects[i].Type == type )
                    list.Add( this.Objects[i] );
            }
            return list;
        }
    }
}

