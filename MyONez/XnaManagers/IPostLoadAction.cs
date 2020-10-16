namespace MyONez.XnaManagers
{
    using System;

    public interface IPostLoadAction
    {
        Type ActionType { get; }

        void Apply(object loadResult, GlobalContentManager contentManager);
    }
}