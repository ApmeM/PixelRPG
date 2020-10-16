namespace MyONez.Graphics.Drawable
{
    using Microsoft.Xna.Framework;

    using MyONez.Graphics.Meshes;
    using MyONez.Maths;

    public class PrimitiveDrawable : IDrawable
    {
        public Color? Color;

        public PrimitiveDrawable(Color? color = null)
        {
            this.Color = color;
        }

        public Vector2 Origin { get; set; } = Vector2.One / 2;

        public RectangleF Bounds => new RectangleF(0, 0, 1, 1);

        public void DrawInto(Color color, float depth, MeshBatch target)
        {
            this.DrawInto(1, 1, color, depth, target);
        }

        public void DrawInto(float width, float height, Color color, float depth, MeshBatch target)
        {
            var destination = new RectangleF(0, 0, width, height);
            destination.Location -= this.Origin;
            target.Draw(Graphic.PixelTexture, destination, Graphic.PixelTexture.Bounds, this.Color ?? color, depth);
        }
    }
}