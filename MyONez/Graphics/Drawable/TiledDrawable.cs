namespace MyONez.Graphics.Drawable
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Meshes;
    using MyONez.Maths;

    /// <summary>
    ///     Draws a {@link SubtextureDrawable} repeatedly to fill the area, instead of stretching it
    /// </summary>
    public class TiledDrawable : SubtextureDrawable
    {
        public TiledDrawable(SubtextureDrawable subtexture)
            : base(subtexture.Texture2D)
        {
        }

        public TiledDrawable(Texture2D texture)
            : base(texture)
        {
        }

        public override void DrawInto(float width, float height, Color color, float depth, MeshBatch target)
        {
            var source = this.SourceRect;
            var destination = new RectangleF(
                -(this.Origin?.X ?? source.Width / 2),
                -(this.Origin?.Y ?? source.Height / 2),
                source.Width,
                source.Height);

            var repeatX = width / this.SourceRect.Width;
            var repeatY = height / this.SourceRect.Height;

            for (var x = 0; x < repeatX; x++)
            {
                for (var y = 0; y < repeatY; y++)
                {
                    var destination1 = destination;
                    destination1.Location += new Vector2(x * this.SourceRect.Width, y * this.SourceRect.Height);
                    target.Draw(this.Texture2D, destination1, source, color, depth);
                }
            }
        }
    }
}