namespace PixelRPG.PipelineImporter.Tiled.ImportModels
{
    using System.Collections.Generic;
    using System.Xml.Serialization;

    public class TmxData
    {
        [XmlAttribute( AttributeName = "encoding" )]
        public string Encoding;

        [XmlAttribute( AttributeName = "compression" )]
        public string Compression;

        [XmlElement( ElementName = "tile" )]
        public List<TmxDataTile> Tiles = new List<TmxDataTile>();

        [XmlText]
        public string Value;
    }
}