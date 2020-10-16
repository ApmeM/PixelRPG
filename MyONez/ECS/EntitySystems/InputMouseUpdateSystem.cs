namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;

    using MyONez.ECS.Components;

    public class InputMouseUpdateSystem : EntityProcessingSystem, IScreenResolutionChangedListener
    {
        public InputMouseUpdateSystem()
            : base(new Matcher().All(typeof(InputMouseComponent)))
        {
        }

        public Point ResolutionOffset { get; set; }

        public Vector2 ResolutionScale { get; set; }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            var scaleX = sceneRenderTarget.Width / (float)realRenderTarget.Width;
            var scaleY = sceneRenderTarget.Height / (float)realRenderTarget.Height;

            this.ResolutionScale = new Vector2(scaleX, scaleY);
            this.ResolutionOffset = realRenderTarget.Location;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var mouse = entity.GetComponent<InputMouseComponent>();

            mouse.ResolutionScale = this.ResolutionScale;
            mouse.ResolutionOffset = this.ResolutionOffset;

            mouse.PreviousMouseState = mouse.CurrentMouseState;
            mouse.CurrentMouseState = Mouse.GetState();
        }
    }
}