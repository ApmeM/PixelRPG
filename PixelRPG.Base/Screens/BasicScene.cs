namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;
    using System.Linq;
    using System.Xml;

    using MazeGenerators;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez;
    using MyONez.AdditionalContent.TiledMap.ECS.Components;
    using MyONez.AdditionalContent.TiledMap.ECS.EntitySystems;
    using MyONez.AdditionalContent.TiledMap.Models;
    using MyONez.ECS;
    using MyONez.ECS.Components;
    using MyONez.ECS.EntitySystems;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.ResolutionPolicy;

    using PixelRPG.Base.Assets.UnitAnimations;

    #endregion

    public class BasicScene : Scene
    {
        public BasicScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.None);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new DefaultRenderer());

            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
            this.AddEntitySystem(new AnimationSpriteUpdateSystem());
            this.AddEntitySystem(new CharSpriteUpdateSystem());
            this.AddEntitySystem(new CharMoveSystem(this));
            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));

            var entity = this.CreateEntity();
            entity.AddComponent<CharSpritesComponent>().CharSprites = new HeroSprite(this.Content, ContentPaths.Assets.Characters.warrior, 6);

            var map = this.CreateEntity("map");
            var tiledMap = this.Content.Load<TiledMap>(ContentPaths.Assets.template);
            map.AddComponent(new TiledMapComponent(tiledMap));

            GenerateMap(tiledMap);

            var startPoint = tiledMap.ObjectGroups.First(a => a.Name == "StartPoint").Objects.First(a => a.Name == "Player1StartPoint");
            entity.GetOrCreateComponent<PositionComponent>().Position = new Vector2(startPoint.X + 8, startPoint.Y + 8);
        }

        private static void GenerateMap(TiledMap tiledMap)
        {
            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");
            var water = (TiledTileLayer)tiledMap.GetLayer("Water");

            maze.Width = 71;
            maze.Height = 41;
            maze.Tiles = new TiledTile[maze.Width * maze.Height];

            var generatedMaze = (new RoomMazeGenerator()).Generate(
                new RoomMazeGenerator.Settings(maze.Width, maze.Height) { ExtraConnectorChance = 5, WindingPercent = 50 });

            for (var x = 0; x < generatedMaze.Regions.GetLength(0); x++)
            for (var y = 0; y < generatedMaze.Regions.GetLength(1); y++)
            {
                var tile = new TiledTile();
                if (generatedMaze.Regions[x, y].HasValue)
                {
                    tile.Id = 2;
                }
                else
                {
                    tile.Id = 17;
                }

                maze.SetTile(x, y, tile);
            }

            for (var i = 0; i < generatedMaze.Junctions.Count; i++)
            {
                var junction = generatedMaze.Junctions[i];
                var tile = maze.GetTile((int)junction.X, (int)junction.Y);
                tile.Id = 6;
            }

            var startRoom = generatedMaze.Rooms[0];
            var startRoomCenter = new Point(startRoom.X + startRoom.Width / 2, startRoom.Y + startRoom.Height / 2);
            tiledMap.ObjectGroups.Add(
                new TiledObjectGroup
                {
                    Name = "StartPoint",
                    Objects = new List<TiledObject>
                    {
                        new TiledObject
                        {
                            X = startRoomCenter.X * tiledMap.TileWidth,
                            Y = startRoomCenter.Y * tiledMap.TileHeight,
                            Name = "Player1StartPoint"
                        }
                    }
                });

            maze.GetTile(startRoomCenter.X, startRoomCenter.Y).Id = 8;
            
            var endRoom = generatedMaze.Rooms[generatedMaze.Rooms.Count - 1];
            var endRoomCenter = new Point(endRoom.X + endRoom.Width / 2, endRoom.Y + endRoom.Height / 2);
            maze.GetTile(endRoomCenter.X, endRoomCenter.Y).Id = 9;
        }
    }
}