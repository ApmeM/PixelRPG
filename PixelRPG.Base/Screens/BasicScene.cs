namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System.Collections.Generic;
    using System.Linq;

    using BrainAI.Pathfinding.AStar;

    using LocomotorECS;

    using MazeGenerators;

    using Microsoft.Xna.Framework;

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
    using PixelRPG.Base.ECS.Components;
    using PixelRPG.Base.ECS.EntitySystems;

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
            this.AddEntitySystem(new CharMoveUpdateSystem(this));
            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
            this.AddEntitySystem(new CharMouseControlUpdateSystem());
            this.AddEntitySystem(new LevelCompleteUpdateSystem(this));

            var map = this.CreateEntity("map");
            var tiledMap = Core.Instance.Content.Load<TiledMap>(ContentPaths.Assets.template);
            map.AddComponent(new TiledMapComponent(tiledMap));
            GenerateMap(tiledMap);
            GeneratePathFinding(map);
            var startPoint = tiledMap.GetObjectGroup("StartPoint").Objects.First(a => a.Name == "Player1StartPoint");
            var endPoint = tiledMap.GetObjectGroup("EndPoint").Objects.First(a => a.Name == "EndPoint");

            var entity = this.CreateEntity();
            entity.AddComponent<PositionComponent>().Position = new Vector2(startPoint.X + 8, startPoint.Y + 8);
            entity.AddComponent<UnitMoveComponent>().Destination = new Point(endPoint.X + 8, endPoint.Y + 8);
            entity.AddComponent<UnitComponent>().UnitAnimations = new HeroSprite(Core.Instance.Content, ContentPaths.Assets.Characters.warrior, 6);
            entity.AddComponent<InputMouseComponent>();
        }

        public static void GeneratePathFinding(Entity mapEntity)
        {
            var map = mapEntity.GetComponent<TiledMapComponent>().TiledMap;

            var graph = new AstarGridGraph(map.Width, map.Height);

            var maze = (TiledTileLayer)map.GetLayer("Maze");
            for (var x = 0; x < maze.Width; x++)
            for (var y = 0; y < maze.Height; y++)
            {
                if (
                    maze.GetTile(x, y).Id != 2 &&
                    maze.GetTile(x, y).Id != 8 &&
                    maze.GetTile(x, y).Id != 9 &&
                    maze.GetTile(x, y).Id != 6)
                {
                    graph.Walls.Add(new BrainAI.Pathfinding.Point(x, y));
                }
            }

            mapEntity.Cache.PutData("PathFinding", graph);
        }

        public static void GenerateMap(TiledMap tiledMap)
        {
            var maze = (TiledTileLayer)tiledMap.GetLayer("Maze");
            var water = (TiledTileLayer)tiledMap.GetLayer("Water");

            tiledMap.Width = maze.Width = 31;
            tiledMap.Height = maze.Height = 21;
            
            maze.Tiles = new TiledTile[maze.Width * maze.Height];
            tiledMap.ObjectGroups.Clear();

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
            tiledMap.ObjectGroups.Add(
                new TiledObjectGroup
                {
                    Name = "EndPoint",
                    Objects = new List<TiledObject>
                    {
                        new TiledObject
                        {
                            X = endRoomCenter.X * tiledMap.TileWidth,
                            Y = endRoomCenter.Y * tiledMap.TileHeight,
                            Name = "EndPoint"
                        }
                    }
                });
            maze.GetTile(endRoomCenter.X, endRoomCenter.Y).Id = 9;
        }
    }
}