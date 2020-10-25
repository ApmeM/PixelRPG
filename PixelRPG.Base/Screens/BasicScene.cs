namespace PixelRPG.Base.Screens
{
    #region Using Directives

    using System;
    using System.Collections.Generic;
    using System.Linq;

    using LocomotorECS;
    using LocomotorECS.Matching;

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

    using PixelRPG.Base.Assets;
    using PixelRPG.Base.Assets.UnitAnimations;

    using Random = MyONez.Maths.Random;

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

            var sprites = new List<CharSprite>
            {
                new AcidicSprite(this.Content),
                new AlbinoSprite(this.Content),
                new BanditSprite(this.Content),
                new BatSprite(this.Content),
                new BeeSprite(this.Content),
                new BlacksmithSprite(this.Content),
                new BruteSprite(this.Content),
                new BurningFistSprite(this.Content),
                new CrabSprite(this.Content),
                new DM300Sprite(this.Content),
                new ElementalSprite(this.Content),
                new EyeSprite(this.Content),
                new GhostSprite(this.Content),
                new GnollSprite(this.Content),
                new GolemSprite(this.Content),
                new GooSprite(this.Content),
                new HeroSprite(this.Content, ContentPaths.Assets.Characters.rogue, 6),
                new HeroSprite(this.Content, ContentPaths.Assets.Characters.warrior, 6),
                new HeroSprite(this.Content, ContentPaths.Assets.Characters.mage, 6),
                new HeroSprite(this.Content, ContentPaths.Assets.Characters.ranger, 6),
                new ImpSprite(this.Content),
                new KingSprite(this.Content),
                new LarvaSprite(this.Content),
                new MimicSprite(this.Content),
                new MonkSprite(this.Content),
                new PiranhaSprite(this.Content),
                new RatKingSprite(this.Content),
                new RatSprite(this.Content),
                new RottingFistSprite(this.Content),
                new ScorpioSprite(this.Content),
                new SeniorSprite(this.Content),
                new ShamanSprite(this.Content),
                new SheepSprite(this.Content),
                new ShieldedSprite(this.Content),
                new ShopkeeperSprite(this.Content),
                new SkeletonSprite(this.Content),
                new SpinnerSprite(this.Content),
                new StatueSprite(this.Content),
                new SuccubusSprite(this.Content),
                new SwarmSprite(this.Content),
                new TenguSprite(this.Content),
                new ThiefSprite(this.Content),
                new UndeadSprite(this.Content),
                new WandmakerSprite(this.Content),
                new WarlockSprite(this.Content),
                new WraithSprite(this.Content),
                new YogSprite(this.Content),
            };

            for (var index = 0; index < sprites.Count; index++)
            {
                var sprite = sprites[index];
                var entity = this.CreateEntity();
                entity.AddComponent<PositionComponent>().Position = new Vector2((index % 20) * 25 + 25, (index / 20) * 25 + 25);
                entity.AddComponent<CharSpritesComponent>().CharSprites = sprite;
            }


            var items = Enum
                .GetValues(typeof(ItemSpriteSheet))
                .Cast<ItemSpriteSheet>()
                .Select(a => new ItemSprite(this.Content, a))
                .ToList();

            for (var index = 0; index < items.Count; index++)
            {
                var sprite = items[index];
                var entity = this.CreateEntity();
                entity.AddComponent<PositionComponent>().Position = new Vector2((index % 20) * 25 + 25, (index / 20) * 25 + 100);
                entity.AddComponent<SpriteComponent>().Drawable = sprite.sprite;
            }


            var map = this.CreateEntity("map");
            var tiledMap = this.Content.Load<TiledMap>(ContentPaths.Assets.test);
            map.AddComponent(new TiledMapComponent(tiledMap));
            map.AddComponent<PositionComponent>().Position = new Vector2(21 * 25, 25);

            tiledMap.TileSets.First(a => a.FirstGid == 65).ImageTexture = this.Content.Load<Texture2D>(ContentPaths.Assets.water4);
            tiledMap.TileSets.First(a => a.FirstGid == 1).ImageTexture = this.Content.Load<Texture2D>(ContentPaths.Assets.tiles4);

            this.AddEntitySystem(new TiledMapUpdateSystem());
            this.AddEntitySystem(new TiledMapMeshGeneratorSystem(this));
        }
    }
    
    public class CharSpriteUpdateSystem : EntityProcessingSystem
    {
        public CharSpriteUpdateSystem()
            : base(new Matcher().All(typeof(CharSpritesComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var animation = entity.GetOrCreateComponent<AnimationSpriteComponent>();
            var charSprites = entity.GetComponent<CharSpritesComponent>();
            
            if (animation.IsPlaying)
            {
                return;
            }

            switch (Random.NextInt(5))
            {
                case 0:
                    animation.Animation = charSprites.CharSprites.idle;
                    break;
                case 1:
                    animation.Animation = charSprites.CharSprites.die;
                    break;
                case 2:
                    animation.Animation = charSprites.CharSprites.run;
                    break;
                case 3:
                    animation.Animation = charSprites.CharSprites.attack;
                    break;
                case 4:
                    animation.Animation = charSprites.CharSprites.idle;
                    break;

            }
            animation.IsPlaying = true;
        }

        protected override void OnMatchedEntityAdded(Entity entity)
        {
            base.OnMatchedEntityAdded(entity);
            var charSprites = entity.GetComponent<CharSpritesComponent>();
            var animation = entity.GetOrCreateComponent<AnimationSpriteComponent>();
            var sprite = entity.GetOrCreateComponent<SpriteComponent>();
            animation.Animation = charSprites.CharSprites.idle;
            animation.IsPlaying = true;
            sprite.Drawable = animation.Animation.Frames[animation.StartFrame];
        }
    }

    public class CharSpritesComponent: Component
    {
        public CharSprite CharSprites { get; set; }
    }
}