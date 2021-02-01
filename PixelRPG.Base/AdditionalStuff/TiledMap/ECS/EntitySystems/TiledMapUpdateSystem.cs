namespace PixelRPG.Base.AdditionalStuff.TiledMap.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using SpineEngine.Maths;

    public class TiledMapUpdateSystem : EntityProcessingSystem
    {
        public TiledMapUpdateSystem()
            : base(new Matcher().All(typeof(TiledMapComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var map = entity.GetComponent<TiledMapComponent>();

            for (var i = 0; i < map.TiledMap.Layers.Count; i++)
            {
                var layer = (TiledTileLayer)map.TiledMap.Layers[i];
                for (var j = 0; j < layer.Tiles.Length; j++)
                {
                    var tile = layer.Tiles[j];

                    if (tile?.TileSetTile?.AnimationFrames == null || tile.TileSet == null)
                    {
                        continue;
                    }

                    tile.ElapsedTime += gameTime.Milliseconds;

                    if (!(tile.ElapsedTime > tile.TileSetTile.AnimationFrames[tile.CurrentFrame].Duration))
                    {
                        continue;
                    }

                    tile.CurrentFrame = Mathf.IncrementWithWrap(tile.CurrentFrame, tile.TileSetTile.AnimationFrames.Count);
                    tile.ElapsedTime = 0;
                    var tileId = tile.TileSetTile.AnimationFrames[tile.CurrentFrame].TileId;

                    tile.RenderTileSetTile = tile.TileSet.Tiles.First(a => a.Id == tileId);
                }
            }
        }
    }
}