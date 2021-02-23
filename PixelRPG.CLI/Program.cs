namespace PixelRPG.CLI
{
    using JustCli;

    public class Program
    {
        public static int Main(string[] args)
        {
            return CommandLineParser.Default.ParseAndExecuteCommand(args);
        }
    }
}