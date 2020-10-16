namespace MyONez.PipelineImporter.Utils
{
    using System;
    using System.IO;

    public static class ImportPathHelper
    {
        public static string GetReferencedFilePath(string inputFileName, string referenceAsset)
        {
            var fileDirectory = Path.GetDirectoryName(inputFileName);
            return Path.Combine(fileDirectory, referenceAsset);
        }

        public static string GetAssetName(string outputDirectory, string assetFileName)
        {
            var fromUri = new Uri(outputDirectory);
            var toUri = new Uri(assetFileName);

            if (fromUri.Scheme != toUri.Scheme)
            {
                throw new Exception($"Path can't be made relative: directory '{outputDirectory}' asset '{assetFileName}'. ");
            }

            var relativeUri = fromUri.MakeRelativeUri(toUri);
            var relativePath = Uri.UnescapeDataString(relativeUri.ToString());

            if (toUri.Scheme.Equals("file", StringComparison.InvariantCultureIgnoreCase))
                relativePath = relativePath.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);

            return relativePath.Substring(0, relativePath.Length - 4);
        }
    }
}
