namespace PixelRPG.Base
{
    #region Using Directives

    using System.Collections.Generic;

    using MyONez;
    using MyONez.AdditionalContent.FaceUI.Utils;
    using MyONez.AdditionalContent.Scenes;

    using PixelRPG.Base.Screens;

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
            this.IsMouseVisible = true;
        }

        protected override void Initialize()
        {
            base.Initialize();
            Instance.SwitchScene(new LoadingScene<BasicScene>(new List<LoadingData>
            {
                new LoadingData
                {
                    Count = 47,
                    Enumerator = GeonBitUIResources.GetEnumerator(this.Content, "hd")
                },
            }, 1200, 600));
        }
    }
}