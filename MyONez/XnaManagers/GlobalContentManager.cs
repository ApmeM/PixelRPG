namespace MyONez.XnaManagers
{
    using System;
    using System.Collections.Generic;

    using Microsoft.Xna.Framework.Content;

    using MyONez.Utils;

    public class GlobalContentManager : ContentManager
    {
        public List<IPostLoadAction> PostLoadActions = new List<IPostLoadAction>();

        public GlobalContentManager()
            : base(Core.Instance.Services, Core.Instance.Content.RootDirectory)
        {
        }

        public override T Load<T>(string assetName)
        {
            var result = base.Load<object>(assetName);
            if (result == null)
            {
                return default(T);
            }

            foreach (var action in this.PostLoadActions)
            {
                if (action.ActionType.IsAssignableFrom(typeof(T)))
                {
                    action.Apply(result, this);
                }
            }

            if (typeof(T) == result.GetType())
            {
                return (T)result;
            }

            // If it is not the exact type we are looking for.
            // Try to create a wrapper of a type with this class in constructor parameters.
            // See NoiseEffect (or any other effect for example).
            result = (T)Activator.CreateInstance(typeof(T), result);
            this.LoadedAssets[assetName] = result;
            return (T)result;
        }
    }
}