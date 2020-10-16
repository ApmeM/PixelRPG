namespace MyONez.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Reflection;

    /// <summary>
    ///     helper class to fetch property delegates
    /// </summary>
    public class BuildTargetUtils
    {
        public static bool TryParseFloat(string str, out float newValue)
        {
#if Bridge
            return float.TryParse( str, CultureInfo.InvariantCulture, out newValue );
#else
            return float.TryParse(str, NumberStyles.Float, CultureInfo.InvariantCulture, out newValue);
#endif
        }

        public static object InvokeMethod(MethodInfo materialMethod, object target)
        {
#if Bridge
            return materialMethod.Invoke( target );
#else
            return materialMethod.Invoke(target, new object[] { });
#endif
        }

        public static Assembly GetAssembly(Type type)
        {
#if Bridge
            return type.Assembly;
#else
            return type.GetTypeInfo().Assembly;
#endif
        }

        public static FieldInfo GetFieldInfo(object targetObject, string fieldName) =>
            GetFieldInfo(targetObject.GetType(), fieldName);

        public static FieldInfo GetFieldInfo(Type type, string fieldName)
        {
            FieldInfo fieldInfo = null;
#if Bridge
            do
            {
                fieldInfo =
 type.GetField(fieldName, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
                type = type.BaseType;
            } while (fieldInfo == null && type != null);
#else
            foreach (var fi in type.GetRuntimeFields())
            {
                if (fi.Name == fieldName)
                {
                    fieldInfo = fi;
                    break;
                }
            }
#endif

            return fieldInfo;
        }

        public static IEnumerable<FieldInfo> GetFields(Type type)
        {
#if Bridge
            return type.GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
#else
            return type.GetRuntimeFields();
#endif
        }

        public static object GetFieldValue(object targetObject, string fieldName)
        {
            var fieldInfo = GetFieldInfo(targetObject, fieldName);
            return fieldInfo.GetValue(targetObject);
        }

        public static PropertyInfo GetPropertyInfo(object targetObject, string propertyName)
        {
#if Bridge
            return targetObject.GetType().GetProperty(propertyName, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);
#else
            return targetObject.GetType().GetRuntimeProperty(propertyName);
#endif
        }

        public static IEnumerable<PropertyInfo> GetProperties(Type type)
        {
#if Bridge
            return type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
#else
            return type.GetRuntimeProperties();
#endif
        }

        public static MethodInfo GetPropertyGetter(PropertyInfo prop)
        {
#if Bridge
            return prop.GetMethod;
#else
            return prop.GetMethod;
#endif
        }

        public static MethodInfo GetPropertySetter(PropertyInfo prop)
        {
#if Bridge
            return prop.SetMethod;
#else
            return prop.SetMethod;
#endif
        }

        public static object GetPropertyValue(object targetObject, string propertyName)
        {
            var propInfo = GetPropertyInfo(targetObject, propertyName);
            var methodInfo = GetPropertyGetter(propInfo);
            return methodInfo.Invoke(targetObject, new object[] { });
        }

        public static IEnumerable<MethodInfo> GetMethods(Type type)
        {
#if Bridge
            return type.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
#else
            return type.GetRuntimeMethods();
#endif
        }

        public static MethodInfo GetMethodInfo(object targetObject, string methodName)
        {
            return GetMethodInfo(targetObject.GetType(), methodName);
        }

        public static MethodInfo GetMethodInfo(object targetObject, string methodName, Type[] parameters)
        {
            return GetMethodInfo(targetObject.GetType(), methodName, parameters);
        }

        public static MethodInfo GetMethodInfo(Type type, string methodName, Type[] parameters = null)
        {
#if Bridge
            if (parameters == null)
                return type.GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);
            return type.GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public, parameters);
#else
            if (parameters != null)
                return type.GetRuntimeMethod(methodName, parameters);

            foreach (var method in type.GetRuntimeMethods())
                if (method.Name == methodName)
                    return method;
            return null;
#endif
        }

        public static T CreateDelegate<T>(object targetObject, MethodInfo methodInfo)
        {
            return (T)(object)methodInfo.CreateDelegate(typeof(T), targetObject);
        }

        /// <summary>
        ///     either returns a super fast Delegate to set the given property or null if it couldn't be found
        ///     via reflection
        /// </summary>
        public static T SetterForProperty<T>(object targetObject, string propertyName)
        {
            // first get the property
            var propInfo = GetPropertyInfo(targetObject, propertyName);
            if (propInfo == null)
                return default(T);

            return CreateDelegate<T>(targetObject, propInfo.SetMethod);
        }

        /// <summary>
        ///     either returns a super fast Delegate to get the given property or null if it couldn't be found
        ///     via reflection
        /// </summary>
        public static T GetterForProperty<T>(object targetObject, string propertyName)
        {
            // first get the property
            var propInfo = GetPropertyInfo(targetObject, propertyName);
            if (propInfo == null)
                return default(T);

            return CreateDelegate<T>(targetObject, propInfo.GetMethod);
        }

        public static T[] GetCustomAttributes<T>(MemberInfo prop)
        {
            return prop.GetCustomAttributes(typeof(T)).Cast<T>().ToArray();
        }

        public static T GetCustomAttribute<T>(MemberInfo prop)
        {
            return prop.GetCustomAttributes(typeof(T)).Cast<T>().FirstOrDefault();
        }

        public static T GetCustomAttribute<T>(Type type)
        {
            return type.GetCustomAttributes(typeof(T), true).Cast<T>().FirstOrDefault();
        }

        public static bool IsEnum(Type valueType)
        {
            return valueType.IsEnum;
        }

        public static bool IsValueType(Type valueType)
        {
            return valueType.IsValueType;
        }
    }
}