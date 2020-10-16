namespace MyONez.Samples.Base.Utils
{
    using System;

    [AttributeUsage(AttributeTargets.Class)]
    public class SampleSceneAttribute : Attribute
    {
        public string ButtonName;

        public string InstructionText;

        public SampleSceneAttribute(string buttonName, string instructionText)
        {
            this.ButtonName = buttonName;
            this.InstructionText = instructionText;
        }
    }
}