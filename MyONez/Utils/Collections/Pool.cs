namespace MyONez.Utils.Collections
{
    using System.Collections.Generic;

    /// <summary>
    ///     simple static class that can be used to pool any object
    /// </summary>
    public static class Pool<T>
        where T : new()
    {
        private static readonly Queue<T> objectQueue = new Queue<T>(10);

        /// <summary>
        ///     warms up the cache filling it with a max of cacheCount objects
        /// </summary>
        /// <param name="cacheCount">new cache count</param>
        public static void WarmCache(int cacheCount)
        {
            cacheCount -= objectQueue.Count;
            if (cacheCount > 0)
            {
                for (var i = 0; i < cacheCount; i++)
                    objectQueue.Enqueue(new T());
            }
        }

        /// <summary>
        ///     trims the cache down to cacheCount items
        /// </summary>
        /// <param name="cacheCount">Cache count.</param>
        public static void TrimCache(int cacheCount)
        {
            while (cacheCount > objectQueue.Count)
                objectQueue.Dequeue();
        }

        /// <summary>
        ///     clears out the cache
        /// </summary>
        public static void ClearCache()
        {
            objectQueue.Clear();
        }

        /// <summary>
        ///     pops an item off the stack if available creating a new item as necessary
        /// </summary>
        public static T Obtain()
        {
            if (objectQueue.Count > 0)
                return objectQueue.Dequeue();

            return new T();
        }

        /// <summary>
        ///     pushes an item back on the stack
        /// </summary>
        /// <param name="obj">Object.</param>
        public static void Free(T obj)
        {
            objectQueue.Enqueue(obj);

            (obj as IPoolable)?.Reset();
        }
    }
}