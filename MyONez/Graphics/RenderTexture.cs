namespace MyONez.Graphics
{
    using System;

    using Microsoft.Xna.Framework.Graphics;

    public class RenderTexture : IDisposable
    {
        public enum RenderTextureResizeBehavior
        {
            None,

            SizeToSceneRenderTarget,

            SizeToScreen
        }

        public RenderTarget2D RenderTarget;

        public RenderTextureResizeBehavior ResizeBehavior = RenderTextureResizeBehavior.SizeToSceneRenderTarget;

        public void Dispose()
        {
            if (this.RenderTarget != null && !this.RenderTarget.IsDisposed)
            {
                this.RenderTarget.Dispose();
                this.RenderTarget = null;
            }
        }

        public void OnSceneBackBufferSizeChanged(int newWidth, int newHeight)
        {
            switch (this.ResizeBehavior)
            {
                case RenderTextureResizeBehavior.None:
                    break;
                case RenderTextureResizeBehavior.SizeToSceneRenderTarget:
                    this.Resize(newWidth, newHeight);
                    break;
                case RenderTextureResizeBehavior.SizeToScreen:
                    this.Resize(Core.Instance.Screen.Width, Core.Instance.Screen.Height);
                    break;
            }
        }

        public void Resize(int width, int height)
        {
            if (this.RenderTarget.Width == width && this.RenderTarget.Height == height && !this.RenderTarget.IsDisposed)
                return;

            var depthFormat = this.RenderTarget.DepthStencilFormat;

            // unload if necessary
            this.Dispose();

            this.RenderTarget = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                width,
                height,
                false,
                Core.Instance.Screen.BackBufferFormat,
                depthFormat,
                0,
                RenderTargetUsage.PreserveContents);
        }

        public static implicit operator RenderTarget2D(RenderTexture tex)
        {
            return tex?.RenderTarget;
        }

        #region constructors

        public RenderTexture()
            : this(
                Core.Instance.Screen.Width,
                Core.Instance.Screen.Height,
                Core.Instance.Screen.BackBufferFormat,
                Core.Instance.Screen.PreferredDepthStencilFormat)
        {
        }

        public RenderTexture(DepthFormat preferredDepthFormat)
            : this(
                Core.Instance.Screen.Width,
                Core.Instance.Screen.Height,
                Core.Instance.Screen.BackBufferFormat,
                preferredDepthFormat)
        {
        }

        public RenderTexture(int width, int height)
            : this(
                width,
                height,
                Core.Instance.Screen.BackBufferFormat,
                Core.Instance.Screen.PreferredDepthStencilFormat)
        {
        }

        public RenderTexture(int width, int height, DepthFormat preferredDepthFormat)
            : this(width, height, Core.Instance.Screen.BackBufferFormat, preferredDepthFormat)
        {
        }

        public RenderTexture(int width, int height, SurfaceFormat preferredFormat, DepthFormat preferredDepthFormat)
        {
            this.RenderTarget = new RenderTarget2D(
                Core.Instance.GraphicsDevice,
                width,
                height,
                false,
                preferredFormat,
                preferredDepthFormat,
                0,
                RenderTargetUsage.PreserveContents);
        }

        #endregion
    }
}