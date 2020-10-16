namespace MyONez.Utils.Collections
{
    using System;
    using System.Collections.Generic;

    public class FunctionComparer<T> : IComparer<T>
    {
        private readonly Comparison<T> comparison;

        public FunctionComparer(Comparison<T> comparison)
        {
            this.comparison = comparison;
        }

        public FunctionComparer(Func<T, int> func)
        {
            this.comparison = (a, b) => func(a) - func(b);
        }

        public int Compare(T x, T y)
        {
            return this.comparison.Invoke(x, y);
        }
    }
}