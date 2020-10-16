namespace MyONez.CLI.ConsoleActions
{
    using System;
    using System.Reflection;
    using System.Text;
    using System.Xml;

    using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Intermediate;

    public class GenerateXmlAction : IConsoleAction
    {
        public string Description => "XML Template Maker Processor";

        public string Name => "GenerateXml";

        public string Help =>
@"Print out a template XML file for any class. The template XML can then be used to
create custom XML-to-object importers in just a few lines of code. 

Result file can be imported using 'Xml importer - MonoGame' importer in pipeline tool

Lots of attributes are available for dealing with the XML parsing. You can find a great document on the attributes available
here: http://blogs.msdn.com/b/shawnhar/archive/2008/08/12/everything-you-ever-wanted-to-know-about-intermediateserializer.aspx


Usage: 
    MyONez.CLI.exe GenerateXml <dllPath> <className>

    dllPath - path to dll where the class exists.
    className - class to instantiate and serialize. It should have default constructor without parameters.
";

        public void Action(string[] args)
        {
            var dllPath = args[1];
            var className = args[2];

            var asm = Assembly.LoadFile(dllPath);

            var inputType = asm.GetType(className);

            if (inputType == null)
            {
                Console.Error.WriteLine($"Can not found type {className} in assembly.");
                return;
            }

            var obj = Activator.CreateInstance(inputType);

            var xmlSettings = new XmlWriterSettings { Indent = true };
            var outputString = new StringBuilder();
            using (var xmlWriter = XmlWriter.Create(outputString, xmlSettings))
            {
                IntermediateSerializer.Serialize(xmlWriter, obj, null);
            }

            Console.WriteLine(outputString.ToString());
        }
    }
}