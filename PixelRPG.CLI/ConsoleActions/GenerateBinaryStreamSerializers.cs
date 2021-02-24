namespace PixelRPG.CLI.ConsoleActions
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using JustCli;
    using JustCli.Attributes;

    [Command("GenerateSerializers", @"Generate binary stream serializers.")]
    public class GenerateBinaryStreamSerializers : ICommand
    {
        [CommandArgument("d", "dllPath", Description = "Path to dll where classes exists.")]
        public string DllPath { get; set; }

        [CommandArgument("c", "classSuffix", Description = "Part of a class name that should be suffixed all classes to be serialized.", DefaultValue = "TransferMessage")]
        public string ClassName { get; set; }

        [CommandOutput]
        public IOutput Output { get; set; }
        
        public int Execute()
        {
            var asm = Assembly.LoadFile(DllPath);

            if (asm == null)
            {
                Output.WriteError($"Can not load assembly from {DllPath}");
                return ReturnCode.Failure;
            }

            List<Type> types;
            try
            {
                types = asm.GetTypes()
                    .Where(t => t.Name.EndsWith(ClassName))
                    .OrderBy(t => t.FullName)
                    .ToList();
            }
            catch (ReflectionTypeLoadException e)
            {
                types = e.Types.Where(t => t != null)
                    .Where(t => t.Name.EndsWith(ClassName))
                    .OrderBy(t => t.FullName)
                    .ToList();
            }

            var sb = new StringBuilder();
            sb.AppendLine($"using System;");
            sb.AppendLine($"using System.IO;");
            sb.AppendLine($"using System.Collections.Generic;");
            sb.AppendLine($"namespace PixelRPG.Base.AdditionalStuff.ClientServer");
            sb.AppendLine("{");
            for (var i = 0; i < types.Count; i++)
            {
                var t = types[i];

                sb.AppendLine($"public class {t.Name}Parser : BinaryTransferMessageParser<{t.FullName.Replace("+", ".")}>");
                sb.AppendLine("{");
                sb.AppendLine($"protected override int Identifier => {i + 1};");
                sb.AppendLine($"protected override void InternalWrite({t.FullName.Replace("+", ".")} transferModel, BinaryWriter writer)");
                sb.AppendLine("{");
                HandleTypeWrite(t, sb, "transferModel");
                sb.AppendLine("}");
                sb.AppendLine($"protected override {t.FullName.Replace("+", ".")} InternalRead(BinaryReader reader)");
                sb.AppendLine("{");
                sb.AppendLine($"{t.FullName.Replace("+", ".")} transferModel = null;");
                HandleTypeRead(t, sb, "transferModel");
                sb.AppendLine($"return transferModel;");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }

            sb.AppendLine("public static partial class TransferMessageParserUtils");
            sb.AppendLine("{");
            sb.AppendLine("static TransferMessageParserUtils()");
            sb.AppendLine("{");
            sb.AppendLine("AvailableParsers = new ITransferMessageParser[]");
            sb.AppendLine("{");
            for (var i = 0; i < types.Count; i++)
            {
                var t = types[i];
                sb.AppendLine($"new {t.Name}Parser(),");
            }
            sb.AppendLine("};");
            sb.AppendLine("}");
            sb.AppendLine("}");
            sb.AppendLine("}");

            Output.WriteSuccess(sb.ToString());

            return ReturnCode.Success;
        }

        private void HandleTypeWrite(Type t, StringBuilder sb, string baseName)
        {
            var idxPrefix = baseName.Replace("[", "").Replace("]", "").Replace(".", "");

            if (typeof(string).IsAssignableFrom(t))
            {
                sb.AppendLine($"writer.Write({baseName} != null);");
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                sb.AppendLine($"writer.Write({baseName});");
                sb.AppendLine("}");
            }
            else if (typeof(int).IsAssignableFrom(t))
            {
                sb.AppendLine($"writer.Write({baseName});");
            }
            else if (typeof(bool).IsAssignableFrom(t))
            {
                sb.AppendLine($"writer.Write({baseName});");
            }
            else if (t.IsEnum)
            {
                sb.AppendLine($"writer.Write((int){baseName});");
            }
            else if (t.IsGenericType && t.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                sb.AppendLine($"writer.Write({baseName} != null);");
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                HandleTypeWrite(Nullable.GetUnderlyingType(t), sb, $"{baseName}.Value");
                sb.AppendLine("}");
            }
            else if (typeof(Array).IsAssignableFrom(t))
            {
                var rank = t.GetArrayRank();
                sb.AppendLine($"writer.Write({baseName} != null);");
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                for (var i = 0; i < rank; i++)
                {
                    sb.AppendLine($"var {idxPrefix}Length{i} = {baseName}.GetLength({i});");
                    sb.AppendLine($"writer.Write({idxPrefix}Length{i});");
                }
                
                var indexingStringList = new List<string>();
                for (var i = 0; i < rank; i++)
                {
                    sb.AppendLine($"for (var {idxPrefix}Index{i} = 0; {idxPrefix}Index{i} < {idxPrefix}Length{i}; {idxPrefix}Index{i}++)");
                    indexingStringList.Add($"{idxPrefix}Index{i}");
                }
                var indexingString = string.Join(",", indexingStringList);
                sb.AppendLine("{");
                HandleTypeWrite(t.GetElementType(), sb, $"{baseName}[{indexingString}]");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }
            else if (typeof(IDictionary).IsAssignableFrom(t))
            {
                sb.AppendLine($"writer.Write({baseName} != null);");
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                sb.AppendLine($"writer.Write({baseName}.Count);");
                sb.AppendLine($"foreach (var {idxPrefix}KVP in {baseName})");
                sb.AppendLine("{");
                HandleTypeWrite(t.GenericTypeArguments[0], sb, $"{idxPrefix}KVP.Key");
                HandleTypeWrite(t.GenericTypeArguments[1], sb, $"{idxPrefix}KVP.Value");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }
            else if (typeof(IList).IsAssignableFrom(t))
            {
                sb.AppendLine($"writer.Write({baseName} != null);");
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                sb.AppendLine($"writer.Write({baseName}.Count);");
                sb.AppendLine($"for (var {idxPrefix}Index = 0; {idxPrefix}Index < {baseName}.Count; {idxPrefix}Index++)");
                sb.AppendLine("{");
                HandleTypeWrite(t.GenericTypeArguments[0], sb, $"{baseName}[{idxPrefix}Index]");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }
            else
            {
                sb.AppendLine($"writer.Write({baseName} != null);");
                sb.AppendLine($"if ({baseName} != null)");
                sb.AppendLine("{");
                var fields = t.GetFields().OrderBy(a => a.Name).ToList();
                foreach (var field in fields)
                {
                    HandleTypeWrite(field.FieldType, sb, $"{baseName}.{field.Name}");
                }
                sb.AppendLine("}");
            }
        }

        private void HandleTypeRead(Type t, StringBuilder sb, string baseName)
        {
            var idxPrefix = baseName.Replace("[", "").Replace("]", "").Replace(".", "");

            if (typeof(string).IsAssignableFrom(t))
            {
                sb.AppendLine($"if (reader.ReadBoolean())");
                sb.AppendLine("{");
                sb.AppendLine($"{baseName} = reader.ReadString();");
                sb.AppendLine("}");
            }
            else if (typeof(int).IsAssignableFrom(t))
            {
                sb.AppendLine($"{baseName} = reader.ReadInt32();");
            }
            else if (typeof(bool).IsAssignableFrom(t))
            {
                sb.AppendLine($"{baseName} = reader.ReadBoolean();");
            }
            else if (t.IsEnum)
            {
                sb.AppendLine($"{baseName} = ({t.FullName.Replace("+", ".")})reader.ReadInt32();");
            }
            else if (t.IsGenericType && t.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                sb.AppendLine($"if (reader.ReadBoolean())");
                sb.AppendLine("{");
                HandleTypeRead(Nullable.GetUnderlyingType(t), sb, $"{baseName}");
                sb.AppendLine("}");
            }
            else if (typeof(Array).IsAssignableFrom(t))
            {
                var rank = t.GetArrayRank();
                sb.AppendLine($"if (reader.ReadBoolean())");
                sb.AppendLine("{");
                var lengthIndexingStringList = new List<string>();
                for (var i = 0; i < rank; i++)
                {
                    sb.AppendLine($"var {idxPrefix}Length{i} = reader.ReadInt32();");
                    lengthIndexingStringList.Add($"{idxPrefix}Length{i}");
                }
                var lengthIndexingString = string.Join(",", lengthIndexingStringList);
                
                sb.AppendLine($"{baseName} = new {CSharpName(t.GetElementType())}[{lengthIndexingString}];");

                var indexingStringList = new List<string>();
                for (var i = 0; i < rank; i++)
                {
                    sb.AppendLine($"for (var {idxPrefix}Index{i} = 0; {idxPrefix}Index{i} < {idxPrefix}Length{i}; {idxPrefix}Index{i}++)");
                    indexingStringList.Add($"{idxPrefix}Index{i}");
                }
                var indexingString = string.Join(",", indexingStringList);
                sb.AppendLine("{");
                HandleTypeRead(t.GetElementType(), sb, $"{baseName}[{indexingString}]");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }
            else if (typeof(IDictionary).IsAssignableFrom(t))
            {
                sb.AppendLine($"if (reader.ReadBoolean())");
                sb.AppendLine("{");
                sb.AppendLine($"var {idxPrefix}Count = reader.ReadInt32();");
                sb.AppendLine($"{baseName} = new Dictionary<{t.GenericTypeArguments[0].FullName.Replace("+", ".")}, {t.GenericTypeArguments[1].FullName.Replace("+", ".")}>();");
                sb.AppendLine($"for (var {idxPrefix}Index = 0; {idxPrefix}Index < {idxPrefix}Count; {idxPrefix}Index++)");
                sb.AppendLine("{");
                sb.AppendLine($"{t.GenericTypeArguments[0].FullName.Replace("+", ".")} {idxPrefix}Key = default({t.GenericTypeArguments[0].FullName.Replace("+", ".")});");
                sb.AppendLine($"{t.GenericTypeArguments[1].FullName.Replace("+", ".")} {idxPrefix}Value = default({t.GenericTypeArguments[1].FullName.Replace("+", ".")});");
                HandleTypeRead(t.GenericTypeArguments[0], sb, $"{idxPrefix}Key");
                HandleTypeRead(t.GenericTypeArguments[1], sb, $"{idxPrefix}Value");
                sb.AppendLine($"{baseName}[{idxPrefix}Key] = {idxPrefix}Value;");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }
            else if (typeof(IList).IsAssignableFrom(t))
            {
                sb.AppendLine($"if (reader.ReadBoolean())");
                sb.AppendLine("{");
                sb.AppendLine($"var {idxPrefix}Count = reader.ReadInt32();");
                sb.AppendLine($"{baseName} = new List<{t.GenericTypeArguments[0].FullName.Replace("+", ".")}>();");
                sb.AppendLine($"for (var {idxPrefix}Index = 0; {idxPrefix}Index < {idxPrefix}Count; {idxPrefix}Index++)");
                sb.AppendLine("{");
                sb.AppendLine($"{t.GenericTypeArguments[0].FullName.Replace("+", ".")} {idxPrefix}Value = default({t.GenericTypeArguments[0].FullName.Replace("+", ".")});");
                HandleTypeRead(t.GenericTypeArguments[0], sb, $"{idxPrefix}Value");
                sb.AppendLine($"{baseName}.Add({idxPrefix}Value);");
                sb.AppendLine("}");
                sb.AppendLine("}");
            }
            else
            {
                sb.AppendLine($"if (reader.ReadBoolean())");
                sb.AppendLine("{");
                sb.AppendLine($"{baseName} = new {t.FullName.Replace("+", ".")}();");

                var fields = t.GetFields().OrderBy(a => a.Name).ToList();
                foreach (var field in fields)
                {
                    HandleTypeRead(field.FieldType, sb, $"{baseName}.{field.Name}");
                }
                sb.AppendLine("}");
            }
        }

        public static string CSharpName(Type type)
        {
            var sb = new StringBuilder();
            var name = type.Name;
            if (!type.IsGenericType) return name;
            sb.Append(name.Substring(0, name.IndexOf('`')));
            sb.Append("<");
            sb.Append(string.Join(", ", type.GetGenericArguments().Select(t => CSharpName(t))));
            sb.Append(">");
            return sb.ToString();
        }
    }
}