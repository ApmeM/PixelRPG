namespace PixelRPG.Base.Screens
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using PixelRPG.Base.Assets;

    public class CharSpritesComponent: Component
    {
        public Vector2? lastDir;

        public CharSprite CharSprites { get; set; }

        public CharState State { get; set; }

        public Vector2 Destination { get; set; }
    }
}