namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input.Touch;

    using MyONez.ECS.Components;

    public class InputTouchUpdateSystem : EntityProcessingSystem, IScreenResolutionChangedListener
    {
        public InputTouchUpdateSystem()
            : base(new Matcher().All(typeof(InputTouchComponent)))
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

            TouchPanel.DisplayWidth = Core.Instance.GraphicsDevice.Viewport.Width;
            TouchPanel.DisplayHeight = Core.Instance.GraphicsDevice.Viewport.Height;
            TouchPanel.DisplayOrientation = Core.Instance.GraphicsDevice.PresentationParameters.DisplayOrientation;
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);

            var touch = entity.GetComponent<InputTouchComponent>();

            touch.IsConnected = TouchPanel.GetCapabilities().IsConnected;

            touch.ResolutionScale = this.ResolutionScale;
            touch.ResolutionOffset = this.ResolutionOffset;

            touch.PreviousTouches = touch.CurrentTouches;
            touch.CurrentTouches = TouchPanel.GetState();

            touch.PreviousGestures = touch.CurrentGestures;
            touch.CurrentGestures.Clear();
            while (TouchPanel.IsGestureAvailable)
            {
                touch.CurrentGestures.Add(TouchPanel.ReadGesture());
            }
        }
    }
}