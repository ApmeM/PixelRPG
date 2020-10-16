namespace MyONez.Graphics.ResolutionPolicy
{
    using Microsoft.Xna.Framework;

    public abstract class SceneResolutionPolicy
    {
        /// <summary>
        ///     Default. RenderTarget matches the scene size
        /// </summary>
        public static readonly SceneResolutionPolicy None = new NoneSceneResolutionPolicy();

        /// <summary>
        ///     The entire application is visible in the specified area without trying to preserve the original aspect ratio.
        ///     Distortion can occur, and the application may appear stretched or compressed.
        /// </summary>
        public static readonly SceneResolutionPolicy ExactFit = new ExactFitSceneResolutionPolicy();

        /// <summary>
        ///     The entire application is visible in the specified area without maintaining the original
        ///     aspect ratio of the application.
        /// </summary>
        public static readonly SceneResolutionPolicy Stretch = new StretchSceneResolutionPolicy();

        /// <summary>
        ///     The entire application fills the specified area, without distortion but possibly with some cropping,
        ///     while maintaining the original aspect ratio of the application.
        /// </summary>
        public static readonly SceneResolutionPolicy NoBorder = new NoBorderSceneResolutionPolicy();

        /// <summary>
        ///     Pixel perfect version of NoBorder. Scaling is limited to integer values.
        /// </summary>
        public static readonly SceneResolutionPolicy NoBorderPixelPerfect =
            new NoBorderPixelPerfectSceneResolutionPolicy();

        /// <summary>
        ///     The entire application is visible in the specified area without distortion while maintaining the original
        ///     aspect ratio of the application. Borders can appear on two sides of the application.
        /// </summary>
        public static readonly SceneResolutionPolicy ShowAll = new ShowAllSceneResolutionPolicy();

        /// <summary>
        ///     Pixel perfect version of ShowAll. Scaling is limited to integer values.
        /// </summary>
        public static readonly SceneResolutionPolicy ShowAllPixelPerfect =
            new ShowAllPixelPerfectSceneResolutionPolicy();

        /// <summary>
        ///     The application takes the height of the design resolution size and modifies the width of the internal
        ///     canvas so that it fits the aspect ratio of the device.
        ///     no distortion will occur however you must make sure your application works on different
        ///     aspect ratios
        /// </summary>
        public static readonly SceneResolutionPolicy FixedHeight = new FixedHeightSceneResolutionPolicy();

        /// <summary>
        ///     Pixel perfect version of FixedHeight. Scaling is limited to integer values.
        /// </summary>
        public static readonly SceneResolutionPolicy FixedHeightPixelPerfect =
            new FixedHeightPixelPerfectSceneResolutionPolicy();

        /// <summary>
        ///     The application takes the width of the design resolution size and modifies the height of the internal
        ///     canvas so that it fits the aspect ratio of the device.
        ///     no distortion will occur however you must make sure your application works on different
        ///     aspect ratios
        /// </summary>
        public static readonly SceneResolutionPolicy FixedWidth = new FixedWidthSceneResolutionPolicy();

        /// <summary>
        ///     Pixel perfect version of FixedWidth. Scaling is limited to integer values.
        /// </summary>
        public static readonly SceneResolutionPolicy FixedWidthPixelPerfect =
            new FixedWidthPixelPerfectSceneResolutionPolicy();

        /// <summary>
        ///     The application takes the width and height that best fits the design resolution with optional cropping inside of
        ///     the "bleed area"
        ///     and possible letter/pillar boxing. Works just like ShowAll except with horizontal/vertical bleed (padding). Gives
        ///     you an area much
        ///     like the old TitleSafeArea. Example: if design resolution is 1348x900 and bleed is 148x140 the safe area would be
        ///     1200x760 (design
        ///     resolution - bleed).
        /// </summary>
        public static readonly SceneResolutionPolicy BestFit = new BestFitSceneResolutionPolicy();

        public abstract Rectangle GetFinalRenderDestinationRect(int screenWidth, int screenHeight, Point designSize);

        public abstract Rectangle GetRenderTargetRect(int screenWidth, int screenHeight, Point designSize);
    }
}