namespace MyONez.Debug
{
    using System;
    using System.Diagnostics;

    public static class Logger
    {
        private enum LogType
        {
            Error,

            Warn,

            Log,

            Info,

            Trace
        }

        #region Logging

        [DebuggerHidden]
        private static void Log(LogType type, string format, params object[] args)
        {
            switch (type)
            {
                case LogType.Error:
                    Debug.WriteLine(type + ": " + format, args);
                    break;
                case LogType.Warn:
                    Debug.WriteLine(type + ": " + format, args);
                    break;
                case LogType.Log:
                    Debug.WriteLine(type + ": " + format, args);
                    break;
                case LogType.Info:
                    Debug.WriteLine(type + ": " + format, args);
                    break;
                case LogType.Trace:
                    Debug.WriteLine(type + ": " + format, args);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        [DebuggerHidden]
        public static void Error(string format, params object[] args)
        {
            Log(LogType.Error, format, args);
        }

        [DebuggerHidden]
        public static void ErrorIf(bool condition, string format, params object[] args)
        {
            if (condition)
                Log(LogType.Error, format, args);
        }

        [DebuggerHidden]
        public static void Warn(string format, params object[] args)
        {
            Log(LogType.Warn, format, args);
        }

        [DebuggerHidden]
        public static void WarnIf(bool condition, string format, params object[] args)
        {
            if (condition)
                Log(LogType.Warn, format, args);
        }

        [Conditional("DEBUG")]
        [DebuggerHidden]
        public static void Log(object obj)
        {
            Log(LogType.Log, "{0}", obj);
        }

        [Conditional("DEBUG")]
        [DebuggerHidden]
        public static void Log(string format, params object[] args)
        {
            Log(LogType.Log, format, args);
        }

        [Conditional("DEBUG")]
        [DebuggerHidden]
        public static void LogIf(bool condition, string format, params object[] args)
        {
            if (condition)
                Log(LogType.Log, format, args);
        }

        [Conditional("DEBUG")]
        [DebuggerHidden]
        public static void Info(string format, params object[] args)
        {
            Log(LogType.Info, format, args);
        }

        [Conditional("DEBUG")]
        [DebuggerHidden]
        public static void Trace(string format, params object[] args)
        {
            Log(LogType.Trace, format, args);
        }

        #endregion
    }
}