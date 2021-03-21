namespace PixelRPG.CLI.ConsoleActions
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using JustCli;
    using JustCli.Attributes;

    [Command("GeneratePoolable", @"Generate poolable transfer messages.")]
    public class GeneratePoolableTransferMessageParsers: ICommand
    {
        [CommandArgument("d", "dllPath", Description = "Path to dll where classes exists.")]
        public string DllPath { get; set; }

        [CommandOutput]
        public IOutput Output { get; set; }
        
        public int Execute()
        {
            var asm = Assembly.LoadFile(Path.GetFullPath(DllPath));

            if (asm == null)
            {
                Output.WriteError($"Can not load assembly from {Path.GetFullPath(DllPath)}");
                return ReturnCode.Failure;
            }

            List<Type> types;
            try
            {
                types = asm.GetTypes()
                    .Where(t => IsTransferMessage(t))
                    .Where(t => !t.IsNested)
                    .OrderBy(t => t.FullName)
                    .ToList();
            }
            catch (ReflectionTypeLoadException e)
            {
                types = e.Types.Where(t => t != null)
                    .Where(t => IsTransferMessage(t))
                    .Where(t => !t.IsNested)
                    .OrderBy(t => t.FullName)
                    .ToList();
            }

            var sb = new StringBuilder();
            sb.AppendLine($"using SpineEngine.Utils.Collections;");
            sb.AppendLine($"using PixelRPG.Base.AdditionalStuff.ClientServer;");
            for (var i = 0; i < types.Count; i++)
            {
                var t = types[i];

                sb.AppendLine($"namespace {t.Namespace}");
                sb.AppendLine("{");
                HandleClass(sb, t);
                sb.AppendLine("}");
            }

            Output.WriteSuccess(sb.ToString());

            return ReturnCode.Success;
        }

        private void HandleClass(StringBuilder sb, Type t)
        {
            bool isTransferMessage = IsTransferMessage(t);
            sb.AppendLine($"public partial class {t.Name} : {(isTransferMessage ? "IPoolableTransferMessage" : "IPoolable")}");
            sb.AppendLine("{");

            foreach (var nestedType in t.GetNestedTypes())
            {
                HandleClass(sb, nestedType);
            }

            sb.AppendLine("public void Free()");
            sb.AppendLine("{");
            sb.AppendLine($"Pool<{t.Name}>.Free(this);");
            sb.AppendLine("}");
            sb.AppendLine("public void Reset()");
            sb.AppendLine("{");
            HandleReset(t, sb, "this");
            sb.AppendLine("}");
            sb.AppendLine("}");
        }

        private bool IsTransferMessage(Type t)
        {
            return t.GetInterface("ITransferMessage") != null;
        }

        private void HandleReset(Type t, StringBuilder sb, string baseName)
        {
            var idxPrefix = baseName.Replace("[", "").Replace("]", "").Replace(".", "");

            if (typeof(string).IsAssignableFrom(t))
            {
                sb.AppendLine($"{baseName} = null;");
            }
            else if (typeof(int).IsAssignableFrom(t))
            {
                sb.AppendLine($"{baseName} = 0;");
            }
            else if (typeof(bool).IsAssignableFrom(t))
            {
                sb.AppendLine($"{baseName} = false;");
            }
            else if (t.IsEnum)
            {
                sb.AppendLine($"{baseName} = 0;");
            }
            else if (t.IsGenericType && t.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                sb.AppendLine($"{baseName} = null;");
            }
            else if (typeof(Array).IsAssignableFrom(t))
            {
                sb.AppendLine($"{baseName} = null;");
            }
            else if (typeof(IDictionary).IsAssignableFrom(t))
            {
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                sb.AppendLine($"foreach (var {idxPrefix}KVP in {baseName})");
                sb.AppendLine("{");
                sb.AppendLine($"var {idxPrefix}KVPKey = {idxPrefix}KVP.Key;");
                sb.AppendLine($"var {idxPrefix}KVPValue = {idxPrefix}KVP.Value;");
                HandleNestedClass(t.GenericTypeArguments[0], sb, $"{idxPrefix}KVPKey");
                HandleNestedClass(t.GenericTypeArguments[1], sb, $"{idxPrefix}KVPValue");
                sb.AppendLine("}");
                sb.AppendLine("}");
                sb.AppendLine($"{baseName}.Clear();");
            }
            else if (typeof(IList).IsAssignableFrom(t))
            {
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                sb.AppendLine($"for (var {idxPrefix}Index = 0; {idxPrefix}Index < {baseName}.Count; {idxPrefix}Index++)");
                sb.AppendLine("{");
                sb.AppendLine($"var {idxPrefix}ListValue = {baseName}[{idxPrefix}Index];");
                HandleNestedClass(t.GenericTypeArguments[0], sb, $"{idxPrefix}ListValue");
                sb.AppendLine("}");
                sb.AppendLine("}");
                sb.AppendLine($"{baseName}.Clear();");
            }
            else
            {
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                var fields = t.GetFields().OrderBy(a => a.Name).ToList();
                foreach (var field in fields)
                {
                    HandleNestedClass(field.FieldType, sb, $"{baseName}.{field.Name}");
                }
                sb.AppendLine("}");
            }
        }

        private void HandleNestedClass(Type t, StringBuilder sb, string baseName)
        {
            if (t.IsNested && !t.IsEnum)
            {
                sb.AppendLine($"{baseName}?.Free();");
                sb.AppendLine($"{baseName} = null;");
            }
            else
            {
                HandleReset(t, sb, $"{baseName}");
            }
        }

        public static string CSharpName(Type type)
        {
            var sb = new StringBuilder();
            var name = type.FullName.Replace("+", ".");
            if (!type.IsGenericType) return name;
            sb.Append(name.Substring(0, name.IndexOf('`')));
            sb.Append("<");
            sb.Append(string.Join(", ", type.GetGenericArguments().Select(t => CSharpName(t))));
            sb.Append(">");
            return sb.ToString();
        }
    }
}