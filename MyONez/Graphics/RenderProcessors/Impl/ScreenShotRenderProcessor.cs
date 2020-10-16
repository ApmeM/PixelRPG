namespace MyONez.Graphics.RenderProcessors.Impl
{
    using System;

    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.RenderProcessors;

    internal class ScreenShotRenderProcessor : RenderProcessor
    {
        public ScreenShotRenderProcessor(int executionOrder)
            : base(executionOrder)
        {
        }

        public Action<Texture2D> Action { get; set; }

        public override void Render(RenderTarget2D source, RenderTarget2D destination)
        {
            base.Render(source, destination);
            if (this.Action == null)
            {
                return;
            }

            var tex = new Texture2D(Core.Instance.GraphicsDevice, source.Width, source.Height);
            var data = new int[tex.Bounds.Width * tex.Bounds.Height];
            source.GetData(data);
            tex.SetData(data);
            this.Action(tex);
        }
    }
}