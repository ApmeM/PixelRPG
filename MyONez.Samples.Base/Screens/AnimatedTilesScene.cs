namespace MyONez.Samples.Base.Screens
{
    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.TiledMap.ECS.Components;
    using MyONez.AdditionalContent.TiledMap.ECS.EntitySystems;
    using MyONez.AdditionalContent.TiledMap.Models;
    using MyONez.ECS.Components;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Samples.Base.Utils;
    using MyONez.Utils;

    /// <summary>
    /// Tiled map import that includes animated tiles from multiple different tileset images
    /// </summary>
    [SampleScene( "Animated Tiles", "Tiled map import with animated tiles" )]
    public class AnimatedTilesScene : BaseScene
    {
        public AnimatedTilesScene()
        {
            this.AddRenderer(new DefaultRenderer());
            // setup a pixel perfect screen that fits our map
            //this.SetDesignResolution( 256, 224, SceneResolutionPolicy.ShowAllPixelPerfect );
            //Core.Instance.Screen.SetSize( 256 * 4, 224 * 4 );

            // load the TiledMap and display it with a TiledMapComponent
            var tiledEntity = this.CreateEntity( "tiled-map-entity" );
            var tiledmap = this.Content.Load<TiledMap>( ContentPaths.AnimatedTiles.desertpalace );
            tiledEntity.AddComponent( new TiledMapComponent( tiledmap ) );
            tiledEntity.AddComponent( new ScaleComponent() ).Scale = new Vector2(2, 2);

            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
        }
    }
}

