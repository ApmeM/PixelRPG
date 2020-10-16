namespace MyONez.ECS.Components
{
    using LocomotorECS;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics;
    using MyONez.Graphics.Drawable;

    using IDrawable = MyONez.Graphics.Drawable.IDrawable;

    public class SpriteComponent : Component
    {
        public IDrawable Drawable;

        public SpriteComponent()
        {
        }

        public SpriteComponent(IDrawable drawable)
        {
            this.Drawable = drawable;
        }

        public SpriteComponent(Texture2D texture)
            : this(new SubtextureDrawable(texture))
        {
        }

        public SpriteComponent(RenderTexture texture)
            : this(new SubtextureDrawable(texture))
        {
        }

        public SpriteComponent(Color color)
            : this(new PrimitiveDrawable(color))
        {
        }
    }
}