namespace MyONez.CLI
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using MyONez.CLI.ConsoleActions;

    public class Program
    {
        public static List<IConsoleAction> AvailableActions = new List<IConsoleAction> { new GenerateXmlAction() };

        public static void Main(string[] args)
        {
            var actionName = args.Length > 0 ? args[0].ToLower() : string.Empty;
            var action = AvailableActions.FirstOrDefault(a => a.Name.ToLower() == actionName);
            if (action == null)
            {
                Console.WriteLine("MyONez console tool.");
                Console.WriteLine("Available commands:");
                foreach (var availableAction in AvailableActions)
                {
                    Console.WriteLine($"- {availableAction.Name} - {availableAction.Description}");
                }

                Console.WriteLine("For more info about each type <command> Help");
                return;
            }

            if (args[1].ToLower() == "help")
            {
                Console.WriteLine($"{action.Name} - {action.Description}");
                Console.WriteLine(action.Help);
                return;
            }

            action.Action(args);
        }
    }
}