namespace MyONez.Samples.Base
{
    #region Using Directives

    using MyONez.Samples.Base.Screens;

    #endregion

    /// <summary>
    ///     This is the main type for your game.
    /// </summary>
    public class Game1 : Core
    {
        public Game1()
            : base(650, 800)
        {
            this.Window.AllowUserResizing = true;
            this.IsMouseVisible = false;
        }

        protected override void Initialize()
        {
            base.Initialize();
            Instance.SwitchScene(new BasicScene());
        }
    }
}