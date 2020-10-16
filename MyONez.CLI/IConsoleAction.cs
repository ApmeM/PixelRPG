namespace MyONez.CLI
{
    public interface IConsoleAction
    {
        string Description { get; }

        string Name { get; }

        string Help { get; }

        void Action(string[] args);
    }
}