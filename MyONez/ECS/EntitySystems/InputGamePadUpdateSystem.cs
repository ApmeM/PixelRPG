namespace MyONez.ECS.EntitySystems
{
    using System;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Input;
    using Microsoft.Xna.Framework.Input.Touch;

    using MyONez.ECS.Components;

    public class InputGamePadUpdateSystem : EntityProcessingSystem, IScreenResolutionChangedListener
    {
        public InputGamePadUpdateSystem()
            : base(new Matcher().All(typeof(InputGamePadComponent)))
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

            var gamePad = entity.GetComponent<InputGamePadComponent>();

            gamePad.PreviousState = gamePad.CurrentState;
            gamePad.CurrentState = GamePad.GetState(gamePad.PlayerIndex);

            // check for controller connects/disconnects
            gamePad.ThisTickConnected = !gamePad.PreviousState.IsConnected && gamePad.CurrentState.IsConnected;
            gamePad.ThisTickDisconnected = gamePad.PreviousState.IsConnected && !gamePad.CurrentState.IsConnected;

            if (gamePad.RumbleTime > 0f)
            {
                gamePad.RumbleTime -= (float)gameTime.TotalSeconds;
                if (gamePad.RumbleTime <= 0f)
                    GamePad.SetVibration(gamePad.PlayerIndex, 0, 0);
            }
        }
    }
}