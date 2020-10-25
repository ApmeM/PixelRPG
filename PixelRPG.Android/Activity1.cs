namespace PixelRPG.Android
{
    #region Using Directives

    using global::Android.App;
    using global::Android.Content.PM;
    using global::Android.OS;
    using global::Android.Views;

    using Microsoft.Xna.Framework;

    using PixelRPG.Base;

    #endregion

    [Activity(
        Label = "@string/Label",
        MainLauncher = true,
        Icon = "@drawable/icon",
        Theme = "@style/Theme.Splash",
        AlwaysRetainTaskState = true,
        LaunchMode = LaunchMode.SingleInstance,
        ScreenOrientation =
            ScreenOrientation
                .Landscape, // Warning: Portrait not working well due to bug in MonoGame: https://github.com/MonoGame/MonoGame/issues/5935
        ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.Keyboard | ConfigChanges.KeyboardHidden
                               | ConfigChanges.ScreenSize)]
    public class Activity1 : AndroidGameActivity
    {
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            var g = new Game1();
            this.SetContentView((View)g.Services.GetService(typeof(View)));
            g.Run();
        }
    }
}