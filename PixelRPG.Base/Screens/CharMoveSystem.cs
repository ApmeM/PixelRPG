namespace PixelRPG.Base.Screens
{
    using System;
    using System.Collections.Generic;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.TiledMap.ECS.Components;
    using MyONez.AdditionalContent.TiledMap.Models;
    using MyONez.ECS;
    using MyONez.ECS.Components;

    using Random = MyONez.Maths.Random;

    public class CharMoveSystem : EntityProcessingSystem
    {
        private readonly Scene scene;

        public CharMoveSystem(Scene scene)
            : base(new Matcher().All(typeof(CharSpritesComponent)))
        {
            this.scene = scene;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var charSprites = entity.GetComponent<CharSpritesComponent>();
            var position = entity.GetComponent<PositionComponent>();

            if (charSprites.State == CharState.Run && charSprites.Destination == position.Position)
            {
                charSprites.State = CharState.Idle;
                return;
            }

            if (charSprites.State == CharState.Run)
            {
                var direction = charSprites.Destination - position.Position;
                position.Position += new Vector2(Math.Sign(direction.X), Math.Sign(direction.Y));
                return;
            }

            if (Random.NextInt(5) != 1)
            {
                return;
            }

            var map = (TiledTileLayer)this.scene.FindEntity("map").GetComponent<TiledMapComponent>().TiledMap.GetLayer("Maze");
            var mapX = ((int)position.Position.X - 8) / 16;
            var mapY = ((int)position.Position.Y - 8) / 16;

            var unmadeCells = new List<Vector2>();

            var directions = new List<Vector2>
            {
                new Vector2(1, 0), new Vector2(-1, 0), new Vector2(0, 1), new Vector2(0, -1),
            };

            for (var i = 0; i < directions.Count; i++)
            {
                var tile = map.GetTile(mapX + (int)directions[i].X, mapY + (int)directions[i].Y);
                if (tile != null && (tile.Id == 2 || tile.Id == 6))
                    unmadeCells.Add(directions[i]);
            }

            Vector2 dir;
            if (charSprites.lastDir != null && unmadeCells.Contains(charSprites.lastDir.Value) && Random.NextInt(100) > 20)
            {
                dir = charSprites.lastDir.Value;
            }
            else
            {
                dir = unmadeCells[Random.NextInt(unmadeCells.Count)];
            }

            charSprites.Destination = position.Position + dir * 16;
            charSprites.State = CharState.Run;
            charSprites.lastDir = dir;
        }
    }
}