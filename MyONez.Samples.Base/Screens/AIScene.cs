namespace MyONez.Samples.Base.Screens
{
    #region Using Directives

    using System;
    using System.Collections.Generic;

    using BrainAI.AI.FSM;
    using BrainAI.Pathfinding.AStar;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.AdditionalContent.BrainAI.Components;
    using MyONez.AdditionalContent.BrainAI.EntitySystems;
    using MyONez.AdditionalContent.SceneTransitions;
    using MyONez.ECS.Components;
    using MyONez.ECS.EntitySystems;
    using MyONez.ECS.EntitySystems.VirtualInput;
    using MyONez.Graphics;
    using MyONez.Graphics.Drawable;
    using MyONez.Graphics.Renderers;
    using MyONez.Graphics.ResolutionPolicy;
    using MyONez.Maths;
    using MyONez.Samples.Base.Utils;

    using Point = BrainAI.Pathfinding.Point;
    using Random = MyONez.Maths.Random;

    #endregion

    [SampleScene("AI Scene", "Snake game that handles by AI.")]
    public class AIScene : BaseScene
    {
        public AIScene()
        {
            this.SetDesignResolution(1280, 720, SceneResolutionPolicy.BestFit);
            Core.Instance.Screen.SetSize(1280, 720);

            this.AddRenderer(new RenderLayerExcludeRenderer(ScreenSpaceRenderLayer));
            this.AddRenderer(new ScreenSpaceRenderer(ScreenSpaceRenderLayer));

            this.Camera.RawZoom = 25;

            var globalEntity = this.CreateEntity("global");
            var map = globalEntity.AddComponent<MapComponent>();
            map.Texture = this.Content.Load<Texture2D>(ContentPaths.Basic.moon);

            for (var x = 0; x < map.Map.Width; x++)
            {
                map.Map.Walls.Add(new Point(x, 0));
                map.Map.Walls.Add(new Point(x, map.Map.Height - 1));
            }
            for (var y = 0; y < map.Map.Height; y++)
            {
                map.Map.Walls.Add(new Point(0, y));
                map.Map.Walls.Add(new Point(map.Map.Width - 1, y));
            }

            for (var i = 0; i < 100; i++)
            {
                this.AddWall(map);
            }

            var food = this.CreateEntity("Food");
            food.AddComponent<PositionComponent>().Position = new Vector2(50, 50);
            food.AddComponent<ColorComponent>().Color = Color.Green;
            food.AddComponent<SpriteComponent>().Drawable = new SubtextureDrawable(Graphic.PixelTexture, 0, 0, 1, 1);

            var snake = this.CreateEntity("Snake");
            snake.AddComponent<PositionComponent>().Position = new Vector2(10, 10);
            snake.AddComponent<ColorComponent>().Color = Color.Blue;
            snake.AddComponent<SpriteComponent>().Drawable = new SubtextureDrawable(Graphic.PixelTexture, 0, 0, 1, 1);
            snake.AddComponent<SnakeComponent>();
            snake.AddComponent<InputKeyboardComponent>();
            var botJoystick = new VirtualJoystick.SettableValue();
            snake.AddComponent<InputVirtualComponent>().InputConfiguration.Add(
                new VirtualJoystick(
                    VirtualInput.OverlapBehavior.TakeNewer,
                    false,
                    botJoystick
                    ));
            snake.AddComponent<AIComponent>().AIBot = new StateMachine<MapComponent>(map, new SnakeBotState(snake, this, botJoystick));
            snake.AddComponent(new FollowCameraComponent(this.Camera));

            var arrow = this.CreateEntity("arrow");
            arrow.AddComponent(new ParentComponent(snake));
            arrow.AddComponent<SpriteComponent>().Drawable = new PrimitiveDrawable(Color.Yellow) { Origin = new Vector2(1, 0) };
            arrow.AddComponent<ScaleComponent>().Scale = new Vector2(2, 0.1f);
            arrow.AddComponent<RotateComponent>();
            arrow.AddComponent<ArrowComponent>();

            this.ReLocateFood(map, food);

            this.AddEntitySystem(new MapGeneratorSystem());
            this.AddEntitySystem(new AIUpdateSystem());
            this.AddEntitySystem(new SnakeControlSystem());
            this.AddEntitySystem(new SnakeMoveSystem());
            this.AddEntitySystem(new SnakeGameOverSystem(map));
            this.AddEntitySystem(new SnakeArrowUpdateSystem(food));
            this.AddEntitySystem(new SnakeFoodUpdateSystem(this, food, map));

            this.AddEntitySystemExecutionOrder<AIUpdateSystem, InputVirtualUpdateSystem>();
            this.AddEntitySystemExecutionOrder<InputVirtualUpdateSystem, SnakeControlSystem>();
            this.AddEntitySystemExecutionOrder<SnakeControlSystem, SnakeMoveSystem>();
            this.AddEntitySystemExecutionOrder<SnakeMoveSystem, SnakeGameOverSystem>();
            this.AddEntitySystemExecutionOrder<SnakeMoveSystem, SnakeFoodUpdateSystem>();
            this.AddEntitySystemExecutionOrder<SnakeMoveSystem, SnakeArrowUpdateSystem>();
        }

        public class SnakeBotState : State<MapComponent>
        {
            private readonly Entity self;

            private readonly AIScene scene;

            private readonly Entity food;

            private readonly VirtualJoystick.SettableValue control;

            private Vector2 knownFoodPosition;

            private List<Point> knownPath;

            public SnakeBotState(Entity self, AIScene scene, VirtualJoystick.SettableValue control)
            {
                this.self = self;
                this.scene = scene;
                this.food = scene.FindEntity("Food");
                this.control = control;
            }

            public override void Update()
            {
                var position = this.self.GetComponent<PositionComponent>().Position;
                var foodPosition = this.food.GetComponent<PositionComponent>().Position;

                if (foodPosition != this.knownFoodPosition)
                {
                    this.knownFoodPosition = foodPosition;
                    this.knownPath = AStarPathfinder.Search(
                        this.Context.Map,
                        new Point((int)position.X, (int)position.Y),
                        new Point((int)foodPosition.X, (int)foodPosition.Y));
                }

                if (this.knownPath == null)
                {
                    this.self.RemoveComponent<AIComponent>();
                    this.self.RemoveComponent<SnakeComponent>();
                    this.scene.Camera.RawZoom = 6;
                    this.control.JoysticValue = Vector2.Zero;
                    return;
                }

                if (position.X == this.knownPath[0].X && position.Y == this.knownPath[0].Y)
                {
                    this.knownPath.RemoveAt(0);
                }

                this.control.JoysticValue = new Vector2(this.knownPath[0].X - position.X, this.knownPath[0].Y - position.Y);
            }
        }

        public void ReLocateFood(MapComponent map, Entity food)
        {
            var x = Random.NextInt(map.Map.Width - 2) + 1;
            var y = Random.NextInt(map.Map.Height - 2) + 1;
            while (map.Map.Walls.Contains(new Point(x, y)))
            {
                x = Random.NextInt(map.Map.Width - 2) + 1;
                y = Random.NextInt(map.Map.Height - 2) + 1;
            }

            food.GetComponent<PositionComponent>().Position = new Vector2(x, y);
        }

        public void AddWall(MapComponent map)
        {
            var x = Random.NextInt(map.Map.Width - 2) + 1;
            var y = Random.NextInt(map.Map.Height - 2) + 1;
            while (map.Map.Walls.Contains(new Point(x, y)))
            {
                x = Random.NextInt(map.Map.Width - 2) + 1;
                y = Random.NextInt(map.Map.Height - 2) + 1;
            }
            map.Map.Walls.Add(new Point(x, y));
        }
    }

    public class ArrowComponent : Component
    {
    }

    public class SnakeComponent : Component
    {
        public Vector2 Direction = new Vector2(0, 1);
    }

    public class SnakeArrowUpdateSystem : EntityProcessingSystem
    {
        private readonly Entity food;

        public SnakeArrowUpdateSystem(Entity food)
            : base(new Matcher().All(typeof(ArrowComponent)))
        {
            this.food = food;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var arrow = entity.GetComponent<RotateComponent>();
            var snake = entity.GetComponent<ParentComponent>().Parent;
            var snakePosition = TransformationUtils.GetTransformation(snake);
            var foodPosition = TransformationUtils.GetTransformation(food);

            var angleToFood = Mathf.Atan2(
                1 - (foodPosition.Position.Y - snakePosition.Position.Y),
                0 - (foodPosition.Position.X - snakePosition.Position.X));

            arrow.Rotation = angleToFood - snakePosition.Rotate;
        }
    }
    
    public class SnakeFoodUpdateSystem : EntityProcessingSystem
    {
        private readonly AIScene scene;

        private readonly Entity food;

        private readonly MapComponent map;

        public SnakeFoodUpdateSystem(AIScene scene, Entity food, MapComponent map)
            : base(new Matcher().All(typeof(SnakeComponent), typeof(PositionComponent)))
        {
            this.scene = scene;
            this.food = food;
            this.map = map;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var snakePosition = entity.GetComponent<PositionComponent>();
            var foodPosition = food.GetComponent<PositionComponent>();

            if (snakePosition.Position == foodPosition.Position)
            {
                this.scene.Camera.RawZoom -= 0.1f;
                this.scene.ReLocateFood(this.map, this.food);
                for (var i = 0; i < 50; i++)
                {
                    this.scene.AddWall(map);
                }
            }
        }
    }
    
    public class SnakeMoveSystem : EntityProcessingSystem
    {
        private TimeSpan elapsed = TimeSpan.Zero;
        private int elapsedSeconds;

        private const int Speed = 100;

        public SnakeMoveSystem()
            : base(new Matcher().All(typeof(SnakeComponent), typeof(PositionComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var snake = entity.GetOrCreateComponent<SnakeComponent>();
            var position = entity.GetOrCreateComponent<PositionComponent>();

            this.elapsed += gameTime;

            if ((int)(this.elapsed.TotalSeconds * Speed) > this.elapsedSeconds)
            {
                this.elapsedSeconds = (int)(this.elapsed.TotalSeconds * Speed);
                position.Position += snake.Direction;
            }
        }
    }

    public class SnakeGameOverSystem : EntityProcessingSystem
    {
        private readonly MapComponent map;

        public SnakeGameOverSystem(MapComponent map)
            : base(new Matcher().All(typeof(SnakeComponent), typeof(PositionComponent)))
        {
            this.map = map;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var position = entity.GetOrCreateComponent<PositionComponent>();

            if (this.map.Map.Walls.Contains(new Point((int)position.Position.X, (int)position.Position.Y)))
            {
                Core.Instance.SwitchScene(new FadeTransition { SceneLoadAction = () => new BasicScene() });
                entity.RemoveComponent<SnakeComponent>();
            }
        }
    }

    public class SnakeControlSystem : EntityProcessingSystem
    {
        public SnakeControlSystem()
            : base(new Matcher().All(typeof(SnakeComponent), typeof(InputVirtualComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var input = entity.GetOrCreateComponent<InputVirtualComponent>();
            var snake = entity.GetOrCreateComponent<SnakeComponent>();
            var joystick = ((VirtualJoystick)input.InputConfiguration[0]).Value;
            
            snake.Direction = joystick;
        }
    }

    public class MapGeneratorSystem : EntityProcessingSystem
    {
        public MapGeneratorSystem()
            : base(new Matcher().All(typeof(MapComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var map = entity.GetComponent<MapComponent>();
            var finalRender = entity.GetOrCreateComponent<FinalRenderComponent>();

            finalRender.Batch.Clear();

            var texture = map.Texture ?? Graphic.PixelTexture;
            var subtextureWidth = (float)texture.Width / (float)map.Map.Width;
            var subtextureHeight = (float)texture.Height / (float)map.Map.Height;

            for (var x = 0; x < map.Map.Width; x++)
            {
                for (var y = 0; y < map.Map.Height; y++)
                {
                    var block = map.Map.Walls.Contains(new Point(x, y));
                    if (!block)
                    {
                        continue;
                    }

                    finalRender.Batch.Draw(
                        texture,
                        new RectangleF(x - 0.5f, y - 0.5f, 1, 1),
                        new RectangleF(subtextureWidth * x, subtextureHeight * y, subtextureWidth, subtextureHeight),
                        Color.White);
                }
            }
        }
    }

    public class MapComponent: Component
    {
        public Texture2D Texture { get; set; }
        public AstarGridGraph Map = new AstarGridGraph(100, 100);
    }
}