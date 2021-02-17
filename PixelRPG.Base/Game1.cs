namespace PixelRPG.Base
{
    #region Using Directives

    using System.Collections;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Graphics;
    using PixelRPG.Base.AdditionalStuff.FaceUI.Utils;
    using PixelRPG.Base.AdditionalStuff.Scenes;
    using PixelRPG.Base.AdditionalStuff.TiledMap.Models;

    using PixelRPG.Base.Screens;
    using SpineEngine;

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
                    Count = 15,
                    Enumerator = GetEnumerator(this.Content)
                },
                new LoadingData
                {
                    Count = 47,
                    Enumerator = GeonBitUIResources.GetEnumerator(this.Content, "hd")
                },

            }, 1200, 600));
        }

        private IEnumerator GetEnumerator(ContentManager content)
        {
            content.Load<TiledMap>(ContentPaths.Assets.template);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.Characters.warrior);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.Characters.mage);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.Characters.ranger);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.Characters.rogue);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.tiles0);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.tiles1);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.tiles2);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.tiles3);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.tiles4);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.water0);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.water1);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.water2);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.water3);
            yield return 0;
            content.Load<Texture2D>(ContentPaths.Assets.water4);
            yield return 0;

        }
    }
}