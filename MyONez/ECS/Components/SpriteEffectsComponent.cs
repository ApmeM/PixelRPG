namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework.Graphics;

    public class SpriteEffectsComponent : Component
    {
        public SpriteEffects SpriteEffects = SpriteEffects.None;

        public SpriteEffectsComponent()
        {
        }

        public SpriteEffectsComponent(SpriteEffects spriteEffects)
        {
            this.SpriteEffects = spriteEffects;
        }
    }
}