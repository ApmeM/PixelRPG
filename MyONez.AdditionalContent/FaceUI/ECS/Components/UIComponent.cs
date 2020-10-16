namespace MyONez.AdditionalContent.FaceUI.ECS.Components
{
    using global::FaceUI;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.FaceUI.Utils;

    public class UIComponent : Component
    {
        internal GameTime GameTime = new GameTime();
        internal ResolutionMouseProvider MouseProvider = new ResolutionMouseProvider();
        public UserInterface UserInterface { get; set; } = new UserInterface();
    }
}