namespace MyONez.AdditionalContent.FaceUI.ECS.Components
{
    using global::FaceUI.Entities;

    using LocomotorECS;

    public class TextComponent : Component
    {
        public string Text { get; set; }

        internal Label Label { get; set; }
    }
}