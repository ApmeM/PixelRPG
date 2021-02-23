namespace PixelRPG.CLI.ConsoleActions
{
    using System;
    using System.Reflection;
    using System.Text;
    using System.Xml;
    using JustCli;
    using JustCli.Attributes;
    using Microsoft.Xna.Framework.Content.Pipeline.Serialization.Intermediate;

    [Command("GenerateXml", @"XML Template Maker Processor.
Print out a template XML file for any class. The template XML can then be used to
create custom XML-to-object importers in just a few lines of code. 

Result file can be imported using 'Xml importer - MonoGame' importer in pipeline tool

Lots of attributes are available for dealing with the XML parsing. You can find a great document on the attributes available
here: http://blogs.msdn.com/b/shawnhar/archive/2008/08/12/everything-you-ever-wanted-to-know-about-intermediateserializer.aspx")]
    public class GenerateXmlAction : ICommand
    {

        [CommandArgument("d", "dllPath", Description = "Path to dll where the class exists.")]
        public string DllPath { get; set; }

        [CommandArgument("c", "className", Description = "Class to instantiate and serialize. It should have default constructor without parameters.")]
        public string ClassName { get; set; }

        [CommandOutput]
        public IOutput Output { get; set; }

        public int Execute()
        {
            var asm = Assembly.LoadFile(DllPath);

            var inputType = asm.GetType(ClassName);

            if (inputType == null)
            {
                Output.WriteError($"Can not found type {ClassName} in assembly.");
                return ReturnCode.Failure;
            }

            var obj = Activator.CreateInstance(inputType);

            var xmlSettings = new XmlWriterSettings { Indent = true };
            var outputString = new StringBuilder();
            using (var xmlWriter = XmlWriter.Create(outputString, xmlSettings))
            {
                IntermediateSerializer.Serialize(xmlWriter, obj, null);
            }

            Output.WriteSuccess(outputString.ToString());
            return ReturnCode.Success;
        }
    }
}