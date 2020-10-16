namespace MyONez.Graphics.RenderProcessors.Impl.FinalRenderer
{
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Cameras;
    using MyONez.Graphics.Materials;

    internal class LastState
    {
        public RenderTarget2D RenderTarget { get; set; }

        public RenderTarget2D RenderTarget2 { get; set; }

        public Material Material { get; set; }

        public Camera Camera { get; set; }
    }
}