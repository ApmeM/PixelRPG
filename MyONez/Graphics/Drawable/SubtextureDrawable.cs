namespace MyONez.Graphics.Drawable
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Meshes;
    using MyONez.Maths;

    public class SubtextureDrawable : IDrawable
    {
        public SubtextureDrawable(Texture2D texture, Rectangle? sourceRect, Vector2? origin)
        {
            this.texture = texture;
            this.sourceRect = sourceRect;
            this.Origin = origin;
        }

        public SubtextureDrawable(Texture2D texture, Rectangle sourceRect)
            : this(texture, sourceRect, null)
        {
        }

        public SubtextureDrawable(Texture2D texture)
            : this(texture, null, null)
        {
        }

        public SubtextureDrawable(Texture2D texture, int x, int y, int width, int height)
            : this(texture, new Rectangle(x, y, width, height))
        {
        }

        public SubtextureDrawable(Texture2D texture, float x, float y, float width, float height)
            : this(texture, (int)x, (int)y, (int)width, (int)height)
        {
        }

        public SubtextureDrawable(RenderTexture texture, Rectangle? sourceRect, Vector2? origin)
        {
            this.renderTexture = texture;
            this.sourceRect = sourceRect;
            this.Origin = origin;
        }

        public SubtextureDrawable(RenderTexture texture)
            : this(texture, null, null)
        {
        }

        public SubtextureDrawable(RenderTexture texture, Rectangle sourceRect)
            : this(texture, sourceRect, null)
        {
        }

        public SubtextureDrawable(RenderTexture texture, int x, int y, int width, int height)
            : this(texture, new Rectangle(x, y, width, height))
        {
        }

        public SubtextureDrawable(RenderTexture texture, float x, float y, float width, float height)
            : this(texture, (int)x, (int)y, (int)width, (int)height)
        {
        }


        private readonly RenderTexture renderTexture;

        private readonly Texture2D texture;

        private readonly Rectangle? sourceRect;
        
        protected readonly Vector2? Origin;

        public Texture2D Texture2D => this.renderTexture ?? this.texture;

        public Rectangle SourceRect => this.sourceRect ?? this.Texture2D.Bounds;

        public RectangleF Bounds => this.SourceRect;

        public void DrawInto(Color color, float depth, MeshBatch target)
        {
            this.DrawInto(this.SourceRect.Width, this.SourceRect.Height, color, depth, target);
        }

        public virtual void DrawInto(float width, float height, Color color, float depth, MeshBatch target)
        {
            var source = this.SourceRect;
            var destination = new RectangleF(
                -(this.Origin?.X ?? this.SourceRect.Width / 2f),
                -(this.Origin?.Y ?? this.SourceRect.Height / 2f),
                width,
                height);
            target.Draw(this.Texture2D, destination, source, color, depth);
        }

        public static List<SubtextureDrawable> SubtexturesFromAtlas(
            Texture2D texture,
            int cellWidth,
            int cellHeight,
            int cellOffset = 0,
            int maxCellsToInclude = int.MaxValue)
        {
            var subtextures = new List<SubtextureDrawable>();

            var cols = texture.Width / cellWidth;
            var rows = texture.Height / cellHeight;
            var i = 0;

            for (var y = 0; y < rows; y++)
            {
                for (var x = 0; x < cols; x++)
                {
                    // skip everything before the first cellOffset
                    if (i++ < cellOffset)
                        continue;

                    subtextures.Add(
                        new SubtextureDrawable(
                            texture,
                            new Rectangle(x * cellWidth, y * cellHeight, cellWidth, cellHeight)));

                    // once we hit the max number of cells to include bail out. were done.
                    if (subtextures.Count == maxCellsToInclude)
                        break;
                }
            }

            return subtextures;
        }

        public override string ToString()
        {
            return $"{this.SourceRect}";
        }
    }
}