namespace PixelRPG.Base.AdditionalStuff.Materials
{
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.Graphics.Materials;

    public class MaterialDefaults
    {
        public static Material StencilWrite(int stencilRef = 1)
        {
            return new Material
            {
                DepthStencilState = new DepthStencilState
                {
                    StencilEnable = true,
                    StencilFunction = CompareFunction.Always,
                    StencilPass = StencilOperation.Replace,
                    ReferenceStencil = stencilRef,
                    DepthBufferEnable = false
                }
            };
        }

        public static Material StencilRead(int stencilRef = 1)
        {
            return new Material
            {
                DepthStencilState = new DepthStencilState
                {
                    StencilEnable = true,
                    StencilFunction = CompareFunction.Equal,
                    StencilPass = StencilOperation.Keep,
                    ReferenceStencil = stencilRef,
                    DepthBufferEnable = false
                }
            };
        }

        public static Material BlendDarken()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.One,
                    ColorDestinationBlend = Blend.One,
                    ColorBlendFunction = BlendFunction.Min,
                    AlphaSourceBlend = Blend.One,
                    AlphaDestinationBlend = Blend.One,
                    AlphaBlendFunction = BlendFunction.Min
                }
            };
        }

        public static Material BlendLighten()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.One,
                    ColorDestinationBlend = Blend.One,
                    ColorBlendFunction = BlendFunction.Max,
                    AlphaSourceBlend = Blend.One,
                    AlphaDestinationBlend = Blend.One,
                    AlphaBlendFunction = BlendFunction.Max
                }
            };
        }

        public static Material BlendScreen()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.InverseDestinationColor,
                    ColorDestinationBlend = Blend.One,
                    ColorBlendFunction = BlendFunction.Add
                }
            };
        }

        public static Material BlendMultiply()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.DestinationColor,
                    ColorDestinationBlend = Blend.Zero,
                    ColorBlendFunction = BlendFunction.Add,
                    AlphaSourceBlend = Blend.DestinationAlpha,
                    AlphaDestinationBlend = Blend.Zero,
                    AlphaBlendFunction = BlendFunction.Add
                }
            };
        }

        public static Material BlendMultiply2X()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.DestinationColor,
                    ColorDestinationBlend = Blend.SourceColor,
                    ColorBlendFunction = BlendFunction.Add
                }
            };
        }

        public static Material BlendLinearDodge()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.One,
                    ColorDestinationBlend = Blend.One,
                    ColorBlendFunction = BlendFunction.Add
                }
            };
        }

        public static Material BlendLinearBurn()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.One,
                    ColorDestinationBlend = Blend.One,
                    ColorBlendFunction = BlendFunction.ReverseSubtract
                }
            };
        }

        public static Material BlendDifference()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.InverseDestinationColor,
                    ColorDestinationBlend = Blend.InverseSourceColor,
                    ColorBlendFunction = BlendFunction.Add
                }
            };
        }

        public static Material BlendSubtractive()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.SourceAlpha,
                    ColorDestinationBlend = Blend.One,
                    ColorBlendFunction = BlendFunction.ReverseSubtract,
                    AlphaSourceBlend = Blend.SourceAlpha,
                    AlphaDestinationBlend = Blend.One,
                    AlphaBlendFunction = BlendFunction.ReverseSubtract
                }
            };
        }

        public static Material BlendAdditive()
        {
            return new Material
            {
                BlendState = new BlendState
                {
                    ColorSourceBlend = Blend.SourceAlpha,
                    ColorDestinationBlend = Blend.One,
                    AlphaSourceBlend = Blend.SourceAlpha,
                    AlphaDestinationBlend = Blend.One
                }
            };
        }
    }
}