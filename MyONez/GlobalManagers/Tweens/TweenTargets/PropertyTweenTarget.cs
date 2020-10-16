namespace MyONez.GlobalManagers.Tweens.TweenTargets
{
    using System;
    using System.Reflection;

    using MyONez.Debug;
    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.Utils;

    /// <summary>
    ///     generic ITweenTarget used for all property tweens
    /// </summary>
    internal class PropertyTweenTarget<T> : ITweenTarget<T>
        where T : struct
    {
        private readonly FieldInfo fieldInfo;

        private readonly Func<T> getter;

        private readonly Action<T> setter;

        public PropertyTweenTarget(object target, string propertyName)
        {
            this.Target = target;

            // try to fetch the field. if we don't find it this is a property
            if ((this.fieldInfo = BuildTargetUtils.GetFieldInfo(target, propertyName)) == null)
            {
                this.setter = BuildTargetUtils.SetterForProperty<Action<T>>(target, propertyName);
                this.getter = BuildTargetUtils.GetterForProperty<Func<T>>(target, propertyName);
            }

            Assert.IsTrue(
                this.setter != null || this.fieldInfo != null,
                "either the property (" + propertyName + ") setter or getter could not be found on the object "
                + target);
        }

        public T TweenedValue
        {
            get
            {
                if (this.fieldInfo != null)
                    return (T)this.fieldInfo.GetValue(this.Target);
                return this.getter();
            }
            set
            {
                if (this.fieldInfo != null)
                    this.fieldInfo.SetValue(this.Target, value);
                else
                    this.setter(value);
            }
        }

        public object Target { get; }
    }
}