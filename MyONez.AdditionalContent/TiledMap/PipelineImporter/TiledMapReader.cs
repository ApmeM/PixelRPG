namespace MyONez.AdditionalContent.TiledMap.PipelineImporter
{
    using System;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.TiledMap.Models;

    public class TiledMapReader : ContentTypeReader<TiledMap>
    {
        protected override TiledMap Read(ContentReader reader, TiledMap existingInstance)
        {
            var result = new TiledMap();
            result.FirstGid = reader.ReadInt32();
            result.Width = reader.ReadInt32();
            result.Height = reader.ReadInt32();
            result.TileWidth = reader.ReadInt32();
            result.TileHeight = reader.ReadInt32();
            if (reader.ReadBoolean())
            {
                result.BackgroundColor = reader.ReadColor();
            }
            result.RenderOrder = (TiledRenderOrder)reader.ReadInt32();
            result.Orientation = (TiledMapOrientation)reader.ReadInt32();
            this.ReadProperties(reader, result.Properties);
            var layerCount = reader.ReadInt32();
            for (var i = 0; i < layerCount; i++)
            {
                var layerType = reader.ReadInt32();
                TiledLayer layer = null;
                if (layerType == 1)
                {
                    var newLayer = new TiledImageLayer();
                    newLayer.AssetName = reader.ReadString();
                    layer = newLayer;
                }else if (layerType == 2)
                {
                    var newLayer = new TiledTileLayer();
                    newLayer.X = reader.ReadInt32();
                    newLayer.Y = reader.ReadInt32();
                    newLayer.Width = reader.ReadInt32();
                    newLayer.Height = reader.ReadInt32();
                    newLayer.Tiles = new TiledTile[reader.ReadInt32()];

                    for (var j = 0; j < newLayer.Tiles.Length; j++)
                    {
                        if (reader.ReadBoolean())
                        {
                            newLayer.Tiles[j] = new TiledTile();
                            newLayer.Tiles[j].Id = reader.ReadInt32();
                            newLayer.Tiles[j].FlippedHorizonally = reader.ReadBoolean();
                            newLayer.Tiles[j].FlippedVertically = reader.ReadBoolean();
                            newLayer.Tiles[j].FlippedDiagonally = reader.ReadBoolean();
                        }
                    }

                    newLayer.Color = reader.ReadColor();
                    layer = newLayer;
                }

                if (layer == null)
                {
                    throw new NotSupportedException();
                }

                result.Layers.Add(layer);
                layer.Offset = reader.ReadVector2();
                this.ReadProperties(reader, layer.Properties);
                layer.Name = reader.ReadString();
                layer.Visible = reader.ReadBoolean();
                layer.Opacity = reader.ReadSingle();
            }
            var objectGroupsCount = reader.ReadInt32();
            for (var i = 0; i < objectGroupsCount; i++)
            {
                var objectGroup = new TiledObjectGroup();
                result.ObjectGroups.Add(objectGroup);

                objectGroup.Name = reader.ReadString();
                objectGroup.Color = reader.ReadColor();
                objectGroup.Opacity = reader.ReadSingle();
                objectGroup.Visible = reader.ReadBoolean();
                this.ReadProperties(reader, objectGroup.Properties);
                var objectsCount = reader.ReadInt32();
                for (var j = 0; j < objectsCount; j++)
                {
                    var obj = new TiledObject();
                    objectGroup.Objects.Add(obj);

                    obj.Id = reader.ReadInt32();
                    obj.Name = reader.ReadString();
                    obj.Type = reader.ReadString();
                    obj.X = reader.ReadInt32();
                    obj.Y = reader.ReadInt32();
                    obj.Width = reader.ReadInt32();
                    obj.Height = reader.ReadInt32();
                    obj.Rotation = reader.ReadInt32();
                    obj.Gid = reader.ReadInt32();
                    obj.Visible = reader.ReadBoolean();
                    obj.TiledObjectType = (TiledObject.TiledObjectTypes)reader.ReadInt32();
                    obj.ObjectType = reader.ReadString();
                    var pointsCount = reader.ReadInt32();
                    for (var k = 0; k < pointsCount; k++)
                    {
                        obj.PolyPoints.Add(reader.ReadVector2());
                    }
                    this.ReadProperties(reader, obj.Properties);
                }
            }

            var tileSetCount = reader.ReadInt32();
            for (var i = 0; i < tileSetCount; i++)
            {
                var tileSet = new TiledTileSet();
                result.TileSets.Add(tileSet);
                tileSet.Spacing = reader.ReadInt32();
                tileSet.Margin = reader.ReadInt32();
                this.ReadProperties(reader, tileSet.Properties);

                var tileCount = reader.ReadInt32();
                for (var j = 0; j < tileCount; j++)
                {
                    var tile= new TiledTileSetTile();
                    tileSet.Tiles.Add(tile);
                    tile.Id = reader.ReadInt32();
                    if (reader.ReadBoolean())
                    {
                        var animationFrameCount = reader.ReadInt32();
                        tile.AnimationFrames = new List<TiledTileSetAnimationFrame>(animationFrameCount);
                        for (var k = 0; k < animationFrameCount; k++)
                        {
                            var animationFrame = new TiledTileSetAnimationFrame();
                            tile.AnimationFrames.Add(animationFrame);

                            animationFrame.TileId = reader.ReadInt32();
                            animationFrame.Duration = reader.ReadSingle();
                        }
                    }

                    this.ReadProperties(reader, tile.Properties);
                    var x = reader.ReadInt32();
                    var y = reader.ReadInt32();
                    var width = reader.ReadInt32();
                    var height = reader.ReadInt32();
                    tile.SourceRect = new Rectangle(x, y, width, height);
                }

                tileSet.FirstGid = reader.ReadInt32();
                tileSet.Image = reader.ReadString();
                tileSet.ImageTexture = reader.ContentManager.Load<Texture2D>(tileSet.Image);
            }

            return result;
        }

        private void ReadProperties(ContentReader reader, Dictionary<string, string> dataProperties)
        {
            dataProperties.Clear();
            var count = reader.ReadInt32();
            for (var i = 0; i < count; i++)
            {
                var key = reader.ReadString();
                var value = reader.ReadString();
                dataProperties[key] = value;
            }
        }
    }
}