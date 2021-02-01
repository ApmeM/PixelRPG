namespace PixelRPG.PipelineImporter.Tiled.ImportModels
{
    using System.Collections.Generic;
    using System.Xml.Serialization;

    public class TmxObject
    {
        [XmlAttribute( DataType = "int", AttributeName = "id" )]
        public int Id;

        [XmlAttribute( DataType = "string", AttributeName = "name" )]
        public string Name;

        [XmlAttribute( DataType = "string", AttributeName = "type" )]
        public string Type;

        [XmlAttribute( DataType = "float", AttributeName = "x" )]
        public float X;

        [XmlAttribute( DataType = "float", AttributeName = "y" )]
        public float Y;

        [XmlAttribute( DataType = "float", AttributeName = "width" )]
        public float Width;

        [XmlAttribute( DataType = "float", AttributeName = "height" )]
        public float Height;

        [XmlAttribute( DataType = "int", AttributeName = "rotation" )]
        public int Rotation;

        [XmlAttribute( DataType = "int", AttributeName = "gid" )]
        public int Gid;

        [XmlAttribute( DataType = "boolean", AttributeName = "visible" )]
        public bool Visible = true;

        [XmlElement( ElementName = "image" )]
        public TmxImage Image;

        [XmlElement( ElementName = "ellipse" )]
        public TmxEllipse Ellipse;

        [XmlElement( ElementName = "polygon" )]
        public TmxPolygon Polygon;

        [XmlElement( ElementName = "polyline" )]
        public TmxPolyLine PolyLine;

        [XmlArray( "properties" )]
        [XmlArrayItem( "property" )]
        public List<TmxProperty> Properties;
    }
}
