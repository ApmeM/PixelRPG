namespace MyONez.Graphics.Meshes
{
    using System.Linq;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Maths;

    public class VertexMesh : IMesh
    {
        private PrimitiveType PrimitiveType { get; set; } = PrimitiveType.TriangleList;

        private int PrimitiveCount { get; set; }

        private int[] Triangles { get; set; } = new int[0];

        private VertexPositionColorTexture[] Verts { get; set; } = new VertexPositionColorTexture[0];

        private Texture2D Texture { get; set; }

        private RasterizerState RasterizerState { get; set; }

        public override void Draw(SpriteBatch spriteBatch)
        {
            var graphicsDevice = spriteBatch.GraphicsDevice;

            if (this.PrimitiveCount == 0)
            {
                return;
            }

            graphicsDevice.Textures[0] = this.Texture;
            graphicsDevice.RasterizerState = this.RasterizerState ?? RasterizerState.CullNone;
            if (this.Triangles == null || this.Triangles.Length == 0)
            {
                graphicsDevice.DrawUserPrimitives(this.PrimitiveType, this.Verts, 0, this.PrimitiveCount);
            }
            else
            {
                graphicsDevice.DrawUserIndexedPrimitives(
                    this.PrimitiveType,
                    this.Verts,
                    0,
                    this.Verts.Length,
                    this.Triangles,
                    0,
                    this.PrimitiveCount);
            }
        }

        public override void ApplyEffectToMesh(SpriteEffects effect)
        {
            var mesh = this;
            if (effect == SpriteEffects.None)
            {
                return;
            }

            var minX = mesh.Verts.Min(a => a.TextureCoordinate.X);
            var maxX = mesh.Verts.Max(a => a.TextureCoordinate.X);
            var minY = mesh.Verts.Min(a => a.TextureCoordinate.Y);
            var maxY = mesh.Verts.Max(a => a.TextureCoordinate.Y);
            var maxMinX = maxX + minX;
            var maxMinY = maxY + minY;

            for (var index = 0; index < mesh.Verts.Length; index++)
            {
                if ((effect & SpriteEffects.FlipHorizontally) == SpriteEffects.FlipHorizontally)
                {
                    mesh.Verts[index].TextureCoordinate.X = maxMinX - mesh.Verts[index].TextureCoordinate.X;
                }

                if ((effect & SpriteEffects.FlipVertically) == SpriteEffects.FlipVertically)
                {
                    mesh.Verts[index].TextureCoordinate.Y = maxMinY - mesh.Verts[index].TextureCoordinate.Y;
                }
            }
        }

        public override void ApplyTransformMesh(Matrix transform)
        {
            var mesh = this;
            for (var index = 0; index < mesh.Verts.Length; index++)
            {
                mesh.Verts[index].Position = Vector3.Transform(mesh.Verts[index].Position, transform);
            }
        }

        public override void SetColor(Color value)
        {
            var mesh = this;
            for (var index = 0; index < mesh.Verts.Length; index++)
            {
                mesh.Verts[index].Color = value;
            }
        }

        protected override Vector3 GetCenter()
        {
            var count = this.Verts.Length;
            return new Vector3(
                this.Verts.Sum(a => a.Position.X),
                this.Verts.Sum(a => a.Position.Y),
                this.Verts.Sum(a => a.Position.Z)) / count;
        }

        public override void Build(Texture2D texture, RectangleF destRect, RectangleF srcRect, Color color, float depth)
        {
            var mesh = this;
            if (mesh.Verts.Length != 4)
            {
                mesh.Verts = new VertexPositionColorTexture[4];
            }

            if (mesh.Triangles.Length != 6)
            {
                mesh.Triangles = new int[6];
            }

            mesh.Texture = texture;
            mesh.PrimitiveType = PrimitiveType.TriangleList;
            mesh.PrimitiveCount = 2;
            mesh.Triangles[0] = 0;
            mesh.Triangles[1] = 1;
            mesh.Triangles[2] = 2;
            mesh.Triangles[3] = 2;
            mesh.Triangles[4] = 3;
            mesh.Triangles[5] = 0;
            mesh.Verts[0] = new VertexPositionColorTexture(
                new Vector3(destRect.Left, destRect.Top, depth),
                color,
                new Vector2(srcRect.Left / texture.Bounds.Width, srcRect.Top / texture.Bounds.Height));
            mesh.Verts[1] = new VertexPositionColorTexture(
                new Vector3(destRect.Right, destRect.Top, depth),
                color,
                new Vector2(srcRect.Right / texture.Bounds.Width, srcRect.Top / texture.Bounds.Height));
            mesh.Verts[2] = new VertexPositionColorTexture(
                new Vector3(destRect.Right, destRect.Bottom, depth),
                color,
                new Vector2(srcRect.Right / texture.Bounds.Width, srcRect.Bottom / texture.Bounds.Height));
            mesh.Verts[3] = new VertexPositionColorTexture(
                new Vector3(destRect.Left, destRect.Bottom, depth),
                color,
                new Vector2(srcRect.Left / texture.Bounds.Width, srcRect.Bottom / texture.Bounds.Height));
        }
    }
}