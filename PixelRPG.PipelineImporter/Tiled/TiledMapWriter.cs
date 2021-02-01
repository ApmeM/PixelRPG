namespace PixelRPG.PipelineImporter.Tiled
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework.Content.Pipeline;
    using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Compiler;

    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using PixelRPG.Base.AdditionalStuff.TiledMap.PipelineImporter;

    [ContentTypeWriter]
    public class TiledMapWriter : ContentTypeWriter<TiledMap>
    {
        protected override void Write(ContentWriter writer, TiledMap data)
        {
            writer.Write(data.FirstGid);
            writer.Write(data.Width);
            writer.Write(data.Height);
            writer.Write(data.TileWidth);
            writer.Write(data.TileHeight);
            writer.Write(data.BackgroundColor.HasValue);
            if (data.BackgroundColor.HasValue)
            {
                writer.Write(data.BackgroundColor.Value);
            }
            writer.Write((int)data.RenderOrder);
            writer.Write((int)data.Orientation);
            this.WriteProperties(writer, data.Properties);
            writer.Write(data.Layers.Count);
            for (var i = 0; i < data.Layers.Count; i++)
            {
                if (data.Layers[i].GetType() == typeof(TiledImageLayer))
                {
                    writer.Write((int)1);
                    var layer = (TiledImageLayer)data.Layers[i];
                    writer.Write(layer.AssetName);
                }
                else if (data.Layers[i].GetType() == typeof(TiledTileLayer))
                {
                    writer.Write((int)2);
                    var layer = (TiledTileLayer)data.Layers[i];
                    writer.Write(layer.X);
                    writer.Write(layer.Y);
                    writer.Write(layer.Width);
                    writer.Write(layer.Height);
                    writer.Write(layer.Tiles.Length);
                    for (var j = 0; j < layer.Tiles.Length; j++)
                    {
                        writer.Write(layer.Tiles[j] != null);
                        if (layer.Tiles[j] != null)
                        {
                            writer.Write(layer.Tiles[j].Id);
                            writer.Write(layer.Tiles[j].FlippedHorizonally);
                            writer.Write(layer.Tiles[j].FlippedVertically);
                            writer.Write(layer.Tiles[j].FlippedDiagonally);
                        }
                    }
                    writer.Write(layer.Color);
                }
                else
                {
                    writer.Write((int)0);
                }

                writer.Write(data.Layers[i].Offset);
                this.WriteProperties(writer, data.Layers[i].Properties);
                writer.Write(data.Layers[i].Name);
                writer.Write(data.Layers[i].Visible);
                writer.Write(data.Layers[i].Opacity);
            }
            writer.Write(data.ObjectGroups.Count);
            for (var i = 0; i < data.ObjectGroups.Count; i++)
            {
                writer.Write(data.ObjectGroups[i].Name);
                writer.Write(data.ObjectGroups[i].Color);
                writer.Write(data.ObjectGroups[i].Opacity);
                writer.Write(data.ObjectGroups[i].Visible);
                this.WriteProperties(writer, data.ObjectGroups[i].Properties);
                writer.Write(data.ObjectGroups[i].Objects.Count);
                for (var j = 0; j < data.ObjectGroups[i].Objects.Count; j++)
                {
                    writer.Write(data.ObjectGroups[i].Objects[j].Id);
                    writer.Write(data.ObjectGroups[i].Objects[j].Name);
                    writer.Write(data.ObjectGroups[i].Objects[j].Type);
                    writer.Write(data.ObjectGroups[i].Objects[j].X);
                    writer.Write(data.ObjectGroups[i].Objects[j].Y);
                    writer.Write(data.ObjectGroups[i].Objects[j].Width);
                    writer.Write(data.ObjectGroups[i].Objects[j].Height);
                    writer.Write(data.ObjectGroups[i].Objects[j].Rotation);
                    writer.Write(data.ObjectGroups[i].Objects[j].Gid);
                    writer.Write(data.ObjectGroups[i].Objects[j].Visible);
                    writer.Write((int)data.ObjectGroups[i].Objects[j].TiledObjectType);
                    writer.Write(data.ObjectGroups[i].Objects[j].ObjectType);
                    writer.Write(data.ObjectGroups[i].Objects[j].PolyPoints.Count);
                    for (var k = 0; k < data.ObjectGroups[i].Objects[j].PolyPoints.Count; k++)
                    {
                        writer.Write(data.ObjectGroups[i].Objects[j].PolyPoints[k]);

                    }
                    this.WriteProperties(writer, data.ObjectGroups[i].Objects[j].Properties);
                }
            }
            writer.Write(data.TileSets.Count);
            for (var i = 0; i < data.TileSets.Count; i++)
            {
                writer.Write(data.TileSets[i].Spacing);
                writer.Write(data.TileSets[i].Margin);
                this.WriteProperties(writer, data.TileSets[i].Properties);

                writer.Write(data.TileSets[i].Tiles.Count);
                for (var j = 0; j < data.TileSets[i].Tiles.Count; j++)
                {
                    writer.Write(data.TileSets[i].Tiles[j].Id);
                    writer.Write(data.TileSets[i].Tiles[j].AnimationFrames != null);
                    if (data.TileSets[i].Tiles[j].AnimationFrames != null)
                    {
                        writer.Write(data.TileSets[i].Tiles[j].AnimationFrames.Count);
                        for (var k = 0; k < data.TileSets[i].Tiles[j].AnimationFrames.Count; k++)
                        {
                            writer.Write(data.TileSets[i].Tiles[j].AnimationFrames[k].TileId);
                            writer.Write(data.TileSets[i].Tiles[j].AnimationFrames[k].Duration);
                        }
                    }

                    this.WriteProperties(writer, data.TileSets[i].Tiles[j].Properties);
                    writer.Write(data.TileSets[i].Tiles[j].SourceRect.X);
                    writer.Write(data.TileSets[i].Tiles[j].SourceRect.Y);
                    writer.Write(data.TileSets[i].Tiles[j].SourceRect.Width);
                    writer.Write(data.TileSets[i].Tiles[j].SourceRect.Height);
                }
                
                writer.Write(data.TileSets[i].FirstGid);
                writer.Write(data.TileSets[i].Image);
            }
        }

        private void WriteProperties(ContentWriter writer, Dictionary<string, string> dataProperties)
        {
            writer.Write(dataProperties.Count);
            foreach (var prop in dataProperties)
            {
                writer.Write(prop.Key);
                writer.Write(prop.Value);
            }
        }

        public override string GetRuntimeType(TargetPlatform targetPlatform)
        {
            return typeof(TiledMap).AssemblyQualifiedName;
        }

        public override string GetRuntimeReader(TargetPlatform targetPlatform)
        {
            return typeof(TiledMapReader).AssemblyQualifiedName;
        }
    }
}