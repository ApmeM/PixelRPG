namespace MyONez.Samples.Desktop
{
    #region Using Directives

    using System;

    using MyONez.Samples.Base;

    #endregion

    /// <summary>
    ///     The main class.
    /// </summary>
    public static class Program
    {
        /// <summary>
        ///     The main entry point for the application.
        /// </summary>
        [STAThread]
        private static void Main()
        {
            using (var game = new Game1())
            {
                game.Run();
            }
        }
    }
}