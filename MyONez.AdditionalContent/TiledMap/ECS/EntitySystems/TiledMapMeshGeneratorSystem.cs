namespace MyONez.AdditionalContent.TiledMap.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.TiledMap.ECS.Components;
    using MyONez.AdditionalContent.TiledMap.Models;
    using MyONez.ECS;
    using MyONez.ECS.Components;
    using MyONez.Graphics.Meshes;
    using MyONez.Maths;

    public class TiledMapMeshGeneratorSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public TiledMapMeshGeneratorSystem(Scene scene)
            : base(new Matcher().All(typeof(TiledMapComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var map = entity.GetComponent<TiledMapComponent>();
            var depth = entity.GetComponent<DepthLayerComponent>()?.Depth ?? 0;

            var finalRender = entity.GetComponent<FinalRenderComponent>();
            if (finalRender == null)
            {
                finalRender = entity.AddComponent<FinalRenderComponent>();
            }
            finalRender.Batch.Clear();

            var transformMatrix = TransformationUtils.GetTransformation(entity).LocalTransformMatrix;
            this.Draw(map, depth, finalRender.Batch, transformMatrix);
        }

        public void Draw(TiledMapComponent map, float layerDepth, MeshBatch batch, Matrix transformMatrix)
        {
            if (map.TiledMap.Orientation != TiledMapOrientation.Orthogonal)
            {
                throw new NotImplementedException();
            }

            for (var i = 0; i < map.TiledMap.Layers.Count; i++)
            {
                if (!map.TiledMap.Layers[i].Visible
                    || (map.LayerIndicesToRender != null && !map.LayerIndicesToRender.Contains(i)))
                {
                    continue;
                }

                var layer = (TiledTileLayer)map.TiledMap.Layers[i];
                for (var y = 0; y < layer.Height; y++)
                {
                    for (var x = 0; x < layer.Width; x++)
                    {
                        var tile = layer.GetTile(x, y);
                        if (tile == null)
                        {
                            continue;
                        }

                        if (tile.TileSet == null || tile.TileSetTile == null || tile.OldId != tile.Id)
                        {
                            tile.OldId = tile.Id;
                            tile.TileSet = map.TiledMap.TileSets.First(a => a.Tiles.Any(b => b.Id + a.FirstGid == tile.Id));
                            tile.TileSetTile = tile.TileSet.Tiles.First(b => b.Id + tile.TileSet.FirstGid == tile.Id);
                            tile.RenderTileSetTile = tile.TileSetTile;
                            tile.CurrentFrame = 0;
                            tile.ElapsedTime = 0;
                        }
                        
                        // for the y position, we need to take into account if the tile is larger than the tileHeight and shift. Tiled uses
                        // a bottom-left coordinate system and MonoGame a top-left
                        var tx = x * map.TiledMap.TileWidth;
                        var ty = y * map.TiledMap.TileHeight;
                        var rotation = 0f;

                        var spriteEffects = SpriteEffects.None;
                        if (tile.FlippedHorizonally)
                            spriteEffects |= SpriteEffects.FlipHorizontally;
                        if (tile.FlippedVertically)
                            spriteEffects |= SpriteEffects.FlipVertically;
                        if (tile.FlippedDiagonally)
                        {
                            if (tile.FlippedHorizonally && tile.FlippedVertically)
                            {
                                spriteEffects ^= SpriteEffects.FlipVertically;
                                rotation = MathHelper.PiOver2;
                                tx += map.TiledMap.TileHeight + (tile.RenderTileSetTile.SourceRect.Height - map.TiledMap.TileHeight);
                                ty -= (tile.RenderTileSetTile.SourceRect.Width - map.TiledMap.TileWidth);
                            }
                            else if (tile.FlippedHorizonally)
                            {
                                spriteEffects ^= SpriteEffects.FlipVertically;
                                rotation = -MathHelper.PiOver2;
                                ty += map.TiledMap.TileHeight;
                            }
                            else if (tile.FlippedVertically)
                            {
                                spriteEffects ^= SpriteEffects.FlipHorizontally;
                                rotation = MathHelper.PiOver2;
                                tx += map.TiledMap.TileWidth + (tile.RenderTileSetTile.SourceRect.Height - map.TiledMap.TileHeight);
                                ty += (map.TiledMap.TileWidth - tile.RenderTileSetTile.SourceRect.Width);
                            }
                            else
                            {
                                spriteEffects ^= SpriteEffects.FlipHorizontally;
                                rotation = -MathHelper.PiOver2;
                                ty += map.TiledMap.TileHeight;
                            }
                        }

                        // if we had no rotations (diagonal flipping) shift our y-coord to account for any non-tileSized tiles to account for
                        // Tiled being bottom-left origin
                        if (rotation == 0)
                            ty += map.TiledMap.TileHeight - tile.RenderTileSetTile.SourceRect.Height;

                        var destRect = tile.RenderTileSetTile.SourceRect;
                        destRect.Location = new Point(0, 0);

                        var meshItem = batch.Draw(tile.TileSet.ImageTexture, destRect, tile.RenderTileSetTile.SourceRect, Color.White, layerDepth);
                        meshItem.RotateMesh(rotation);
                        meshItem.ApplyEffectToMesh(spriteEffects);
                        meshItem.MoveMesh(new Vector3(tx + layer.Offset.X, ty + layer.Offset.Y, 0));
                        meshItem.ApplyTransformMesh(transformMatrix);
                    }
                }
            }
        }
    }
}