namespace MyONez.AdditionalContent.FaceUI.ECS.EntitySystems
{
    using System;

    using global::FaceUI.Entities;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;

    using MyONez.AdditionalContent.FaceUI.ECS.Components;
    using MyONez.ECS.Components;

    using Entity = LocomotorECS.Entity;

    public class TextUIUpdateSystem : EntityProcessingSystem
    {
        public TextUIUpdateSystem()
            : base(new Matcher().All(typeof(TextComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var ui = entity.GetOrCreateComponent<UIComponent>();
            var text = entity.GetComponent<TextComponent>();
            var scale = entity.GetComponent<ScaleComponent>()?.Scale ?? Vector2.One;
            var color = entity.GetComponent<ColorComponent>()?.Color ?? Color.White;

            ui.UserInterface.ShowCursor = false;

            if (text.Label == null)
            {
                text.Label = new Label(text.Text);
                ui.UserInterface.AddEntity(text.Label);
            }

            text.Label.FillColor = color;
            text.Label.Text = text.Text;
            text.Label.Scale = scale.X;
        }
    }
}