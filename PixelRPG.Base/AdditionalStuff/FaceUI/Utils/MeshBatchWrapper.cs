namespace PixelRPG.Base.AdditionalStuff.FaceUI.Utils
{
    using System;
    using System.Collections.Generic;

    using global::FaceUI.Utils;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.Graphics.Meshes;
    using SpineEngine.Maths;

    public class MeshBatchWrapper : ISpriteBatchWrapper
    {
        public MeshBatch MeshBatch { get; set; }

        public void Begin(
            SpriteSortMode sortMode = SpriteSortMode.Deferred,
            BlendState blendState = null,
            SamplerState samplerState = null,
            DepthStencilState depthStencilState = null,
            RasterizerState rasterizerState = null,
            Effect effect = null,
            Matrix? transformMatrix = null)
        {
        }

        public void End()
        {
        }

        public void Draw(Texture2D texture, Rectangle destRect, Color color)
        {
            this.MeshBatch.Draw(texture, destRect, texture.Bounds, color);
        }

        public void Draw(Texture2D texture, Rectangle destRect, Rectangle srcRect, Color color)
        {
            this.MeshBatch.Draw(texture, destRect, srcRect, color);
        }

        private Dictionary<SpriteFont, Dictionary<char, SpriteFont.Glyph>> glyphsCache = new Dictionary<SpriteFont, Dictionary<char, SpriteFont.Glyph>>();

        public void DrawString(
            SpriteFont spriteFont,
            string text,
            Vector2 position,
            Color color,
            float rotation,
            Vector2 origin,
            float scalef,
            SpriteEffects effects,
            float layerDepth)
        {
            var scale = new Vector2(scalef);
            
            var flipAdjustment = Vector2.Zero;

            var flippedVert = (effects & SpriteEffects.FlipVertically) == SpriteEffects.FlipVertically;
            var flippedHorz = (effects & SpriteEffects.FlipHorizontally) == SpriteEffects.FlipHorizontally;

            if (flippedVert || flippedHorz)
            {
                var size = spriteFont.MeasureString(text);

                if (flippedHorz)
                {
                    origin.X *= -1;
                    flipAdjustment.X = -size.X;
                }

                if (flippedVert)
                {
                    origin.Y *= -1;
                    flipAdjustment.Y = spriteFont.LineSpacing - size.Y;
                }
            }

            Matrix transformation = Matrix.Identity;
            float cos = 0, sin = 0;
            if (rotation == 0)
            {
                transformation.M11 = (flippedHorz ? -scale.X : scale.X);
                transformation.M22 = (flippedVert ? -scale.Y : scale.Y);
                transformation.M41 = ((flipAdjustment.X - origin.X) * transformation.M11) + position.X;
                transformation.M42 = ((flipAdjustment.Y - origin.Y) * transformation.M22) + position.Y;
            }
            else
            {
                cos = (float)Math.Cos(rotation);
                sin = (float)Math.Sin(rotation);
                transformation.M11 = (flippedHorz ? -scale.X : scale.X) * cos;
                transformation.M12 = (flippedHorz ? -scale.X : scale.X) * sin;
                transformation.M21 = (flippedVert ? -scale.Y : scale.Y) * (-sin);
                transformation.M22 = (flippedVert ? -scale.Y : scale.Y) * cos;
                transformation.M41 = (((flipAdjustment.X - origin.X) * transformation.M11) + (flipAdjustment.Y - origin.Y) * transformation.M21) + position.X;
                transformation.M42 = (((flipAdjustment.X - origin.X) * transformation.M12) + (flipAdjustment.Y - origin.Y) * transformation.M22) + position.Y;
            }

            var offset = Vector2.Zero;
            var firstGlyphOfLine = true;

            if (!this.glyphsCache.ContainsKey(spriteFont))
            {
                this.glyphsCache[spriteFont] = spriteFont.GetGlyphs();
            }

            var pGlyphs = this.glyphsCache[spriteFont];
            
            for (var i = 0; i < text.Length; ++i)
            {
                var c = text[i];

                if (c == '\r')
                    continue;

                if (c == '\n')
                {
                    offset.X = 0;
                    offset.Y += spriteFont.LineSpacing;
                    firstGlyphOfLine = true;
                    continue;
                }

                var pCurrentGlyph = pGlyphs[c];

                // The first character on a line might have a negative left side bearing.
                // In this scenario, SpriteBatch/SpriteFont normally offset the text to the right,
                //  so that text does not hang off the left side of its rectangle.
                if (firstGlyphOfLine)
                {
                    offset.X = Math.Max(pCurrentGlyph.LeftSideBearing, 0);
                    firstGlyphOfLine = false;
                }
                else
                {
                    offset.X += spriteFont.Spacing + pCurrentGlyph.LeftSideBearing;
                }

                var p = offset;

                if (flippedHorz)
                    p.X += pCurrentGlyph.BoundsInTexture.Width;
                p.X += pCurrentGlyph.Cropping.X;

                if (flippedVert)
                    p.Y += pCurrentGlyph.BoundsInTexture.Height - spriteFont.LineSpacing;
                p.Y += pCurrentGlyph.Cropping.Y;

                Vector2.Transform(ref p, ref transformation, out p);

                //if ((effects & SpriteEffects.FlipVertically) != 0)
                //{
                //    var temp = _texCoordBR.Y;
                //    _texCoordBR.Y = _texCoordTL.Y;
                //    _texCoordTL.Y = temp;
                //}
                //if ((effects & SpriteEffects.FlipHorizontally) != 0)
                //{
                //    var temp = _texCoordBR.X;
                //    _texCoordBR.X = _texCoordTL.X;
                //    _texCoordTL.X = temp;
                //}

                this.Draw(
                    spriteFont.Texture,
                    new RectangleF(p.X, p.Y, pCurrentGlyph.BoundsInTexture.Width * scale.X, pCurrentGlyph.BoundsInTexture.Height * scale.Y),
                    new RectangleF(
                        pCurrentGlyph.BoundsInTexture.X,
                        pCurrentGlyph.BoundsInTexture.Y,
                        (pCurrentGlyph.BoundsInTexture.X + pCurrentGlyph.BoundsInTexture.Width) - pCurrentGlyph.BoundsInTexture.X,
                        (pCurrentGlyph.BoundsInTexture.Y + pCurrentGlyph.BoundsInTexture.Height) - pCurrentGlyph.BoundsInTexture.Y),
                    color);

                offset.X += pCurrentGlyph.Width + pCurrentGlyph.RightSideBearing;
            }
        }

        public GraphicDeviceWrapper GraphicsDevice { get; set; } = new ScreenGraphicDeviceWrapper();
    }
}