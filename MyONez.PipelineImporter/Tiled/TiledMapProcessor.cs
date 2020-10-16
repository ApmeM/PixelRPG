namespace MyONez.PipelineImporter.Tiled
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.Globalization;
    using System.IO;
    using System.Linq;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Content.Pipeline;
    using Microsoft.Xna.Framework.Content.Pipeline.Graphics;
    using Microsoft.Xna.Framework.Content.Pipeline.Processors;

    using MyONez.AdditionalContent.TiledMap.Models;
    using MyONez.PipelineImporter.Tiled.ImportModels;
    using MyONez.PipelineImporter.Utils;

    using Color = Microsoft.Xna.Framework.Color;
    using Rectangle = Microsoft.Xna.Framework.Rectangle;

    [ContentProcessor(DisplayName = "Tiled Map Processor - MyONez")]
    public class TiledMapProcessor : ContentProcessor<TmxMap, TiledMap>
    {
        private const uint FlippedVerticallyFlag = 0x40000000;
        private const uint FlippedHorizontallyFlag = 0x80000000;
        private const uint FlippedDiagonallyFlag = 0x20000000;

        public override TiledMap Process(TmxMap input, ContentProcessorContext context)
        {
            foreach (var tileSet in input.TileSets)
            {
                if (tileSet.Image == null)
                {
                    var images = new HashSet<string>();
                    foreach (var tile in tileSet.Tiles)
                    {
                        if (tile.Image != null)
                        {
                            images.Add(tile.Image.Source);
                        }
                    }

                    context.Logger.LogMessage("Packing {0} images\n", images.Count);

                    var bitmaps = new Dictionary<string, Bitmap>();
                    foreach (var image in images)
                    {
                        bitmaps.Add(image, new Bitmap(image));
                    }

                    var packedSprites = TextureAtlasPacker.PackSprites(bitmaps.Values.ToList());

                    var atlasPath = input.OriginalFileName + "-atlas.png";

                    packedSprites.OutputBitmap.Save(atlasPath, System.Drawing.Imaging.ImageFormat.Png);

                    var assetFileName = context.BuildAsset<string, Texture2DContent>(
                        new ExternalReference<string>(atlasPath),
                        nameof(TextureProcessor)).Filename;

                    tileSet.Image = new TmxImage
                    {
                        Source = ImportPathHelper.GetAssetName(context.OutputDirectory, assetFileName)
                    };

                    File.Delete(atlasPath);

                    foreach (var tile in tileSet.Tiles)
                    {
                        if (tile.Image == null)
                        {
                            continue;
                        }

                        var rect = packedSprites.SpritePositions[bitmaps[tile.Image.Source]];
                        tile.SourceRect = new Rectangle(rect.X, rect.Y, rect.Width, rect.Height);
                    }
                }
                else
                {
                    var assetFileName = context.BuildAsset<string, Texture2DContent>(
                        new ExternalReference<string>(tileSet.Image.Source),
                        nameof(TextureProcessor)).Filename;

                    tileSet.Image.Source = ImportPathHelper.GetAssetName(context.OutputDirectory, assetFileName);
                }
            }

            foreach (var layer in input.Layers.OfType<TmxImageLayer>())
            {
                if (layer.Image != null)
                {
                    var assetFileName = context.BuildAsset<string, Texture2DContent>(
                        new ExternalReference<string>(layer.Image.Source),
                        nameof(TextureProcessor)).Filename;
                    layer.Image.Source = ImportPathHelper.GetAssetName(context.OutputDirectory, assetFileName);
                }
            }

            var output = new TiledMap
            {
                FirstGid = input.FirstGid,
                Width = input.Width,
                Height = input.Height,
                TileWidth = input.TileWidth,
                TileHeight = input.TileHeight,
                Orientation = (TiledMapOrientation)input.Orientation,
                BackgroundColor = HexToColor(input.BackgroundColor),
                RenderOrder = (TiledRenderOrder)input.RenderOrder,
                Properties = input.Properties?.ToDictionary(a => a.Name, a => a.Value),
                ObjectGroups = input.ObjectGroups?.Select(
                    a => new TiledObjectGroup
                    {
                        Name = a.Name,
                        Color = HexToColor(a.Color),
                        Opacity = a.Opacity,
                        Visible = a.Visible,
                        Properties = a.Properties?.ToDictionary(b => b.Name, b => b.Value),
                        Objects = a.Objects?.Select(
                            b =>
                            {
                                var tiledObject = new TiledObject
                                {
                                    Id = b.Id,
                                    Name = b.Name,
                                    Type = b.Type,
                                    X = (int)b.X,
                                    Y = (int)b.Y,
                                    Width = (int)b.Width,
                                    Height = (int)b.Height,
                                    Rotation = b.Rotation,
                                    Gid = b.Gid,
                                    Visible = b.Visible,
                                    Properties = b.Properties?.ToDictionary(c => c.Name, c => c.Value),
                                    ObjectType = b.Type,
                                };

                                if (b.Ellipse != null)
                                {
                                    tiledObject.TiledObjectType = TiledObject.TiledObjectTypes.Ellipse;
                                }
                                else if (b.Image != null)
                                {
                                    tiledObject.TiledObjectType = TiledObject.TiledObjectTypes.Image;
                                }
                                else if (b.Polygon != null)
                                {
                                    tiledObject.TiledObjectType = TiledObject.TiledObjectTypes.Polygon;
                                    tiledObject.PolyPoints = GetPoints(b.Polygon.Points);
                                }
                                else if (b.PolyLine != null)
                                {
                                    tiledObject.TiledObjectType = TiledObject.TiledObjectTypes.Polyline;
                                    tiledObject.PolyPoints = GetPoints(b.PolyLine.Points);
                                }
                                else
                                {
                                    tiledObject.TiledObjectType = TiledObject.TiledObjectTypes.None;
                                }
                                
                                return tiledObject;
                            }).ToList()
                    }).ToList(),
               
                TileSets = input.TileSets?.Select(
                    a =>
                    {
                        var tileSet = TiledTileSet.Build(a.Image.Width, a.Image.Height, a.TileWidth, a.TileHeight, a.Spacing, a.Margin, a.Columns);
                        tileSet.FirstGid = a.FirstGid;
                        tileSet.Image = a.Image.Source;
                        tileSet.Properties = a.Properties.ToDictionary(b => b.Name, b => b.Value);
                        foreach (var tile in a.Tiles)
                        {
                            var tiledTile = tileSet.Tiles.FirstOrDefault(b => b.Id == tile.Id);
                            if (tiledTile == null)
                            {
                                tiledTile = new TiledTileSetTile
                                {
                                    Id = tile.Id
                                };
                                tileSet.Tiles.Add(tiledTile);
                            }

                            tiledTile.SourceRect = tile.SourceRect != Rectangle.Empty ? tile.SourceRect : tiledTile.SourceRect;
                            tiledTile.AnimationFrames = tile.AnimationFrames == null || tile.AnimationFrames.Count == 0 ? null : tile.AnimationFrames.Select(b => new TiledTileSetAnimationFrame
                            {
                                TileId = b.TileId,
                                Duration = b.Duration
                            }).ToList();
                            tile.Properties.ForEach(b => tiledTile.Properties[b.Name] = b.Value);
                        }
                        return tileSet;
                    }).ToList()
            };
            
            var existingIds = output.TileSets.SelectMany(a => a.Tiles.Select(b => (uint)(b.Id + a.FirstGid))).ToHashSet();
            
            output.Layers = input.Layers?.Select(
                a =>
                {
                    var imageLayer = a as TmxImageLayer;
                    var tiledLayer = a as TmxTileLayer;
                    TiledLayer result;
                    if (imageLayer != null)
                    {
                        result = new TiledImageLayer { AssetName = imageLayer.Image.Source };
                    }
                    else if (tiledLayer != null)
                    {
                        result = new TiledTileLayer
                        {
                            Width = tiledLayer.Width,
                            Height = tiledLayer.Height,
                            X = tiledLayer.X,
                            Y = tiledLayer.Y,
                            Tiles = tiledLayer.Data.Tiles.Select(
                                b =>
                                {
                                    var flippedHorizontally = (b.Gid & FlippedHorizontallyFlag) != 0;
                                    var flippedVertically = (b.Gid & FlippedVerticallyFlag) != 0;
                                    var flippedDiagonally = (b.Gid & FlippedDiagonallyFlag) != 0;

                                    if (flippedHorizontally || flippedVertically || flippedDiagonally)
                                    {
                                        b.Gid &= ~(FlippedHorizontallyFlag | FlippedVerticallyFlag
                                                                           | FlippedDiagonallyFlag);
                                        b.FlippedHorizontally = flippedHorizontally;
                                        b.FlippedVertically = flippedVertically;
                                        b.FlippedDiagonally = flippedDiagonally;
                                    }

                                    if (!existingIds.Contains(b.Gid))
                                    {
                                        return null;
                                    }

                                    return new TiledTile
                                    {
                                        Id = (int)b.Gid,
                                        FlippedDiagonally = b.FlippedDiagonally,
                                        FlippedHorizonally = b.FlippedHorizontally,
                                        FlippedVertically = b.FlippedVertically,
                                    };
                                }).ToArray()
                        };
                    }
                    else
                    {
                        throw new Exception($"Unknown layer type {a.GetType()}");
                    }

                    result.Name = a.Name;
                    result.Offset = new Vector2(a.OffsetX, a.OffsetY);
                    result.Opacity = a.Opacity;
                    result.Visible = a.Visible;
                    result.Properties = a.Properties.ToDictionary(b => b.Name, b => b.Value);
                    return result;
                }).ToList();
            return output;
        }

        private static Color HexToColor(string hexValue)
        {
            if (string.IsNullOrEmpty(hexValue))
                return new Color(128, 128, 128);

            hexValue = hexValue.TrimStart('#');
            var r = int.Parse(hexValue.Substring(0, 2), NumberStyles.HexNumber);
            var g = int.Parse(hexValue.Substring(2, 2), NumberStyles.HexNumber);
            var b = int.Parse(hexValue.Substring(4, 2), NumberStyles.HexNumber);
            return new Color(r, g, b);
        }

        public static List<Vector2> GetPoints(string value)
        {
            var parts = value.Split(' ');
            var points = new List<Vector2>();
            foreach (var p in parts)
            {
                var pair = p.Split(',');
                points.Add(
                    new Vector2(
                        float.Parse(pair[0], CultureInfo.InvariantCulture),
                        float.Parse(pair[1], CultureInfo.InvariantCulture)));
            }

            return points;
        }

    }
}