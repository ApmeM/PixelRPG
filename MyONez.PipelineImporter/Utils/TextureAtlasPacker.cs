namespace MyONez.PipelineImporter.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.Linq;

    public static class TextureAtlasPacker
    {
        public class PackedSprites
        {
            public Bitmap OutputBitmap;

            public Dictionary<Bitmap, Rectangle> SpritePositions;
        }

        public static PackedSprites PackSprites(IList<Bitmap> sourceSprites)
        {
            if( sourceSprites.Count == 0 )
                throw new ArgumentException(nameof(sourceSprites));

            var sprites = sourceSprites
                .Select((a, i) => new PackedSprite { Width = a.Width + 2, Height = a.Height + 2, Bitmap = a, Index = i })
                .OrderBy(a => a.Height * 1024 + a.Width)
                .ToList();

            var outputWidth = CalculateOutputWidth(sprites);
            var outputHeight = 0;

            for( var i = 0; i < sprites.Count; i++ )
            {
                PositionSprite( sprites, i, outputWidth );
                outputHeight = Math.Max( outputHeight, sprites[i].Y + sprites[i].Height );
            }

            sprites = sprites.OrderBy(a => a.Index).ToList();

            var output = new PackedSprites
            {
                OutputBitmap = new Bitmap(outputWidth, outputHeight),
                SpritePositions = new Dictionary<Bitmap, Rectangle>()
            };

            foreach( var sprite in sprites )
            {
                var source = sprite.Bitmap;

                var x = sprite.X;
                var y = sprite.Y;

                var w = source.Width;
                var h = source.Height;

                for (var i = 0; i < w; i++)
                {
                    for (var j = 0; j < h; j++)
                    {
                        output.OutputBitmap.SetPixel(x + 1 + i, y + 1 + j, source.GetPixel(i, j));
                    }
                }

                output.SpritePositions[source] = new Rectangle(x + 1, y + 1, w, h);
            }

            return output;
        }


        private class PackedSprite
        {
            public int Index;

            public int X;
            public int Y;

            public int Width;
            public int Height;

            public Bitmap Bitmap;
        }


        private static void PositionSprite( List<PackedSprite> sprites, int index, int outputWidth )
        {
            var x = 0;
            var y = 0;

            while( true )
            {
                var intersects = FindIntersectingSprite( sprites, index, x, y );
                if( intersects < 0 )
                {
                    sprites[index].X = x;
                    sprites[index].Y = y;

                    return;
                }

                x = sprites[intersects].X + sprites[intersects].Width;

                if( x + sprites[index].Width > outputWidth )
                {
                    x = 0;
                    y++;
                }
            }
        }


        private static int FindIntersectingSprite( List<PackedSprite> sprites, int index, int x, int y )
        {
            var w = sprites[index].Width;
            var h = sprites[index].Height;

            for( var i = 0; i < index; i++ )
            {
                if( sprites[i].X >= x + w )
                    continue;

                if( sprites[i].X + sprites[i].Width <= x )
                    continue;

                if( sprites[i].Y >= y + h )
                    continue;

                if( sprites[i].Y + sprites[i].Height <= y )
                    continue;

                return i;
            }

            return -1;
        }

        private static int CalculateOutputWidth( List<PackedSprite> sprites )
        {
            // Gather the widths of all our sprites into a temporary list.
            var widths = sprites.Select(a => a.Width).OrderByDescending(a => a).ToList();

            // Heuristic assumes an NxN grid of median sized sprites.
            var medianWidth = widths[widths.Count / 2];
            var width = medianWidth * (int)Math.Round( Math.Sqrt( sprites.Count ) );

            // Make sure we never choose anything smaller than our largest sprite.
            return Math.Max( width, widths[0]);
        }
    }
}
