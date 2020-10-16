namespace MyONez.Graphics.Drawable
{
    using System;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Debug;
    using MyONez.Graphics.Meshes;

    /// <summary>
    ///     The drawable sizes are set when the ninepatch is set, but they are separate values. Eg, {@link
    ///     Drawable#getLeftWidth()} could
    ///     be set to more than {@link NinePatch#getLeftWidth()} in order to provide more space on the left than actually
    ///     exists in the
    ///     ninepatch.
    ///     The min size is set to the ninepatch total size by default. It could be set to the left+right and top+bottom,
    ///     excluding the
    ///     middle size, to allow the drawable to be sized down as small as possible.
    /// </summary>
    public class NinePatchDrawable : SubtextureDrawable
    {
        public const int TopLeft = 0;

        public const int TopCenter = 1;

        public const int TopRight = 2;

        public const int MiddleLeft = 3;

        public const int MiddleCenter = 4;

        public const int MiddleRight = 5;

        public const int BottomLeft = 6;

        public const int BottomCenter = 7;

        public const int BottomRight = 8;

        public readonly int Bottom;

        private readonly Rectangle[] destinationRects = new Rectangle[9];

        public readonly int Left;

        public readonly Rectangle[] NinePatchRects = new Rectangle[9];

        public readonly int Right;

        public readonly int Top;

        public NinePatchDrawable(Texture2D texture, Rectangle sourceRect, int left, int right, int top, int bottom)
            : this(new SubtextureDrawable(texture, sourceRect), left, right, top, bottom)
        {
        }

        public NinePatchDrawable(Texture2D texture, int left, int right, int top, int bottom)
            : this(new SubtextureDrawable(texture), left, right, top, bottom)
        {
        }

        public NinePatchDrawable(SubtextureDrawable subtexture, int left, int right, int top, int bottom)
            : base(subtexture.Texture2D)
        {
            this.Left = left;
            this.Right = right;
            this.Top = top;
            this.Bottom = bottom;

            GenerateNinePatchRects(subtexture.SourceRect, this.NinePatchRects, left, right, top, bottom);
        }

        public override void DrawInto(float width, float height, Color color, float depth, MeshBatch target)
        {
            var scale = new Vector2(width / this.SourceRect.Width, height / this.SourceRect.Height);

            var rects = new List<Tuple<Rectangle, Rectangle>>();
            var sourceRects = this.NinePatchRects;

            GenerateNinePatchRects(
                this.SourceRect,
                this.destinationRects,
                (int)(this.Left / scale.X),
                (int)(this.Right / scale.X),
                (int)(this.Top / scale.Y),
                (int)(this.Bottom / scale.Y));

            for (var i = 0; i < 9; i++)
            {
                var source = sourceRects[i];
                var destination = this.destinationRects[i];
                destination.Location -= this.SourceRect.Location + (this.Origin?.ToPoint() ?? this.SourceRect.Center);
                destination.Width = (int)(destination.Width * width / this.SourceRect.Width);
                destination.Height = (int)(destination.Height * height / this.SourceRect.Height);
                rects.Add(new Tuple<Rectangle, Rectangle>(source, destination));
            }

            for (var i = 0; i < rects.Count; i++)
            {
                var rect = rects[i];
                var source = rect.Item1;
                var destination = rect.Item2;

                target.Draw(this.Texture2D, destination, source, color, depth);
            }
        }

        /// <summary>
        ///     generates nine patch Rectangles. destArray should have 9 elements. renderRect is the final area in which the nine
        ///     patch will be rendered.
        ///     To just get the source rects for rendering pass in the SubtextureDrawable.sourceRect. Pass in a larger Rectangle to
        ///     get final destination
        ///     rendering Rectangles.
        /// </summary>
        /// <param name="renderRect">Render rect.</param>
        /// <param name="destArray">Destination array.</param>
        /// <param name="marginTop">Margin top.</param>
        /// <param name="marginBottom">Margin bottom.</param>
        /// <param name="marginLeft">Margin left.</param>
        /// <param name="marginRight">Margin right.</param>
        public static void GenerateNinePatchRects(
            Rectangle renderRect,
            Rectangle[] destArray,
            int marginLeft,
            int marginRight,
            int marginTop,
            int marginBottom)
        {
            Assert.IsTrue(destArray.Length == 9, "destArray does not have a length of 9");

            var stretchedCenterWidth = renderRect.Width - marginLeft - marginRight;
            var stretchedCenterHeight = renderRect.Height - marginTop - marginBottom;
            var bottomY = renderRect.Y + renderRect.Height - marginBottom;
            var rightX = renderRect.X + renderRect.Width - marginRight;
            var leftX = renderRect.X + marginLeft;
            var topY = renderRect.Y + marginTop;

            destArray[0] = new Rectangle(renderRect.X, renderRect.Y, marginLeft, marginTop); // top-left
            destArray[1] = new Rectangle(leftX, renderRect.Y, stretchedCenterWidth, marginTop); // top-center
            destArray[2] = new Rectangle(rightX, renderRect.Y, marginRight, marginTop); // top-right

            destArray[3] = new Rectangle(renderRect.X, topY, marginLeft, stretchedCenterHeight); // middle-left
            destArray[4] = new Rectangle(leftX, topY, stretchedCenterWidth, stretchedCenterHeight); // middle-center
            destArray[5] = new Rectangle(rightX, topY, marginRight, stretchedCenterHeight); // middle-right

            destArray[6] = new Rectangle(renderRect.X, bottomY, marginLeft, marginBottom); // bottom-left
            destArray[7] = new Rectangle(leftX, bottomY, stretchedCenterWidth, marginBottom); // bottom-center
            destArray[8] = new Rectangle(rightX, bottomY, marginRight, marginBottom); // bottom-right
        }
    }
}