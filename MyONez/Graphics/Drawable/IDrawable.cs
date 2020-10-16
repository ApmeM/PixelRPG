namespace MyONez.Graphics.Drawable
{
    using Microsoft.Xna.Framework;

    using MyONez.Graphics.Meshes;
    using MyONez.Maths;

    public interface IDrawable
    {
        RectangleF Bounds { get; }

        void DrawInto(Color color, float depth, MeshBatch target);

        void DrawInto(float width, float height, Color color, float depth, MeshBatch target);
    }
}