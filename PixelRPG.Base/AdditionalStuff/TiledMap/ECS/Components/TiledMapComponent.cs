namespace PixelRPG.Base.AdditionalStuff.TiledMap.ECS.Components
{
    using LocomotorECS;

    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;
    using SpineEngine.Debug;

    public class TiledMapComponent : Component
    {
        public TiledMap TiledMap { get; }

        internal int[] LayerIndicesToRender;

        public TiledMapComponent(TiledMap tiledMap)
        {
            Assert.IsTrue(tiledMap != null, "Tiled map should not be null");
            this.TiledMap = tiledMap;
        }

        public void SetLayerToRender( string layerName )
        {
            this.LayerIndicesToRender = new int[1];
            this.LayerIndicesToRender[0] = this.TiledMap.GetLayerIndex( layerName );
        }
        
        public void SetLayersToRender( params string[] layerNames )
        {
            this.LayerIndicesToRender = new int[layerNames.Length];

            for (var i = 0; i < layerNames.Length; i++)
            {
                this.LayerIndicesToRender[i] = this.TiledMap.GetLayerIndex( layerNames[i] );
            }
        }
    }
}

