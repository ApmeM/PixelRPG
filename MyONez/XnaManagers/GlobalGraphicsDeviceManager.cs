namespace MyONez.XnaManagers
{
    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    public class GlobalGraphicsDeviceManager : GraphicsDeviceManager
    {
        public GlobalGraphicsDeviceManager(Game game)
            : base(game)
        {
        }

        public Rectangle Bounds
        {
            get => new Rectangle(0, 0, this.Width, this.Height);
            set
            {
                this.Width = value.Width;
                this.Height = value.Height;
            }
        }

        public int Width
        {
            get => this.GraphicsDevice.PresentationParameters.BackBufferWidth;
            set => this.GraphicsDevice.PresentationParameters.BackBufferWidth = value;
        }

        public int Height
        {
            get => this.GraphicsDevice.PresentationParameters.BackBufferHeight;
            set => this.GraphicsDevice.PresentationParameters.BackBufferHeight = value;
        }

        public Vector2 Center => new Vector2(this.Width / 2f, this.Height / 2f);

        public int MonitorWidth => GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width;

        public int MonitorHeight => GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height;

        public SurfaceFormat BackBufferFormat => this.GraphicsDevice.PresentationParameters.BackBufferFormat;

        public void SetSize(int width, int height)
        {
            this.PreferredBackBufferWidth = width;
            this.PreferredBackBufferHeight = height;
            this.ApplyChanges();
        }
    }
}