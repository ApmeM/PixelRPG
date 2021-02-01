namespace PixelRPG.Base.AdditionalStuff.FaceUI.Utils
{
    using global::FaceUI.Utils;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class ScreenGraphicDeviceWrapper : GraphicDeviceWrapper
    {
        public Rectangle ViewRectangle { get; set; }

        public override Rectangle Viewport => this.ViewRectangle;

        public override GraphicsDevice GraphicsDevice { get; } = null;

        public override PresentationParametersWrapper PresentationParameters { get; } = null;

        public override void Clear(Color color)
        {
            
        }

        public override void SetRenderTarget(RenderTarget2D target)
        {
            
        }
    }
}