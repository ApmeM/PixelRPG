namespace MyONez.PipelineImporter.Tiled
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.IO.Compression;
    using System.Linq;
    using System.Xml.Serialization;

    using Microsoft.Xna.Framework.Content.Pipeline;

    using MonoGame.Utilities;

    using MyONez.PipelineImporter.Tiled.ImportModels;
    using MyONez.PipelineImporter.Utils;

    using CompressionMode = System.IO.Compression.CompressionMode;

    [ContentImporter(".tmx", DefaultProcessor = nameof(TiledMapProcessor), DisplayName = "Tiled Map Importer - MyONez")]
    public class TiledMapImporter : ContentImporter<TmxMap>
    {
        public override TmxMap Import(string filename, ContentImporterContext context)
        {
            if (filename == null)
                throw new ArgumentNullException(nameof(filename));

            var mapSerializer = new XmlSerializer(typeof(TmxMap));
            var tileSetSerializer = new XmlSerializer(typeof(TmxTileSet));

            var map = (TmxMap)mapSerializer.Deserialize(new StringReader(File.ReadAllText(filename)));

            map.OriginalFileName = filename;

            for (var i = 0; i < map.TileSets.Count; i++)
            {
                var baseReferenceFile = filename;
                if (!string.IsNullOrWhiteSpace(map.TileSets[i].Source))
                {
                    var tileSetPath = ImportPathHelper.GetReferencedFilePath(
                        filename,
                        map.TileSets[i].Source);

                    context.AddDependency(tileSetPath);

                    var originalFirstGid = map.TileSets[i].FirstGid;

                    map.TileSets[i] = (TmxTileSet)tileSetSerializer.Deserialize(new StringReader(File.ReadAllText(tileSetPath)));
                    map.TileSets[i].FirstGid = originalFirstGid;

                    baseReferenceFile = tileSetPath;
                }

                if (map.TileSets[i].Image != null)
                {
                    map.TileSets[i].Image.Source = ImportPathHelper.GetReferencedFilePath(
                        baseReferenceFile,
                        map.TileSets[i].Image.Source);

                    context.AddDependency(map.TileSets[i].Image.Source);
                }

                foreach (var tile in map.TileSets[i].Tiles)
                {
                    if (tile.Image != null)
                    {
                        tile.Image.Source = ImportPathHelper.GetReferencedFilePath(
                            baseReferenceFile,
                            tile.Image.Source);
                    }
                }
            }

            foreach (var layer in map.Layers.OfType<TmxTileLayer>())
            {
                var data = layer.Data;

                if (data.Encoding == "csv")
                {
                    data.Tiles = data.Value.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(uint.Parse).Select(gid => new TmxDataTile { Gid = gid }).ToList();
                }
                else if (data.Encoding == "base64")
                {
                    var encodedData = data.Value.Trim();
                    var decodedData = Convert.FromBase64String(encodedData);

                    using (var stream = OpenStream(decodedData, data.Compression))
                    using (var reader = new BinaryReader(stream))
                    {
                        data.Tiles = new List<TmxDataTile>();

                        for (var y = 0; y < layer.Width; y++)
                        {
                            for (var x = 0; x < layer.Height; x++)
                            {
                                var gid = reader.ReadUInt32();
                                data.Tiles.Add(new TmxDataTile { Gid = gid });
                            }
                        }
                    }
                }
            }

            foreach (var layer in map.Layers.OfType<TmxImageLayer>())
            {
                if (layer.Image != null)
                {
                    layer.Image.Source = ImportPathHelper.GetReferencedFilePath(
                        filename,
                        layer.Image.Source);
                }
            }

            return map;
        }

        private static Stream OpenStream(byte[] decodedData, string compressionMode)
        {
            var memoryStream = new MemoryStream(decodedData, writable: false);

            if (compressionMode == "gzip")
                return new GZipStream(memoryStream, CompressionMode.Decompress);

            if (compressionMode == "zlib")
                return new ZlibStream(memoryStream, MonoGame.Utilities.CompressionMode.Decompress);

            return memoryStream;
        }

    }
}
