namespace PixelRPG.Base.AdditionalStuff.FaceUI.ECS.EntitySystems
{
    using System;
    using System.Linq;

    using global::FaceUI;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Content;
    using Microsoft.Xna.Framework.Input;

    using PixelRPG.Base.AdditionalStuff.FaceUI.ECS.Components;
    using PixelRPG.Base.AdditionalStuff.FaceUI.Utils;
    using SpineEngine.ECS;
    using SpineEngine.ECS.Components;

    public class UIUpdateSystem : EntityProcessingSystem, IScreenResolutionChangedListener
    {
        private readonly MeshBatchWrapper spriteBatchWrapper = new MeshBatchWrapper();

        private TimeSpan totalTime = TimeSpan.Zero;

        public UIUpdateSystem()
            : base(new Matcher().All(typeof(UIComponent)))
        {
        }

        protected override void DoAction(Entity entity, TimeSpan gameTime)
        {
            base.DoAction(entity, gameTime);
            var ui = entity.GetComponent<UIComponent>();
            var scale = entity.GetComponent<ScaleComponent>()?.Scale ?? Vector2.One;
            var mouse = entity.GetOrCreateComponent<InputMouseComponent>();
            var touch = entity.GetOrCreateComponent<InputTouchComponent>();
            var finalRender = entity.GetOrCreateComponent<FinalRenderComponent>();

            this.totalTime += gameTime;

            UserInterface.Active = ui.UserInterface;
            ui.UserInterface.MouseInputProvider = ui.MouseProvider;

            ui.MouseProvider._oldMouseState = ui.MouseProvider._newMouseState;
            if (touch.IsConnected)
            {
                if (touch.CurrentTouches.Any())
                {
                    var touchPosition = touch.GetScaledPosition(touch.CurrentTouches[0].Position);
                    ui.MouseProvider._newMouseState.X = touchPosition.X;
                    ui.MouseProvider._newMouseState.Y = touchPosition.Y;
                    ui.MouseProvider._newMouseState.LeftButton = ButtonState.Pressed;
                }
                else
                {
                    ui.MouseProvider._newMouseState.X = ui.MouseProvider._oldMouseState.X;
                    ui.MouseProvider._newMouseState.Y = ui.MouseProvider._oldMouseState.Y;
                    ui.MouseProvider._newMouseState.LeftButton = ButtonState.Released;
                }

                ui.MouseProvider._newMouseState.RightButton = ButtonState.Released;
                ui.MouseProvider._newMouseState.MiddleButton = ButtonState.Released;
                ui.MouseProvider._newMouseState.ScrollWheelValue = 0;
            }
            else
            {
                ui.MouseProvider._newMouseState.X = mouse.ScaledMousePosition.X;
                ui.MouseProvider._newMouseState.Y = mouse.ScaledMousePosition.Y;
                ui.MouseProvider._newMouseState.LeftButton = mouse.CurrentMouseState.LeftButton;
                ui.MouseProvider._newMouseState.RightButton = mouse.CurrentMouseState.RightButton;
                ui.MouseProvider._newMouseState.MiddleButton = mouse.CurrentMouseState.MiddleButton;
                ui.MouseProvider._newMouseState.ScrollWheelValue = mouse.CurrentMouseState.ScrollWheelValue;
            }

            ui.UserInterface.GlobalScale = scale.X;
            ui.GameTime.TotalGameTime = this.totalTime;
            ui.GameTime.ElapsedGameTime = gameTime;
            ui.UserInterface.Update(ui.GameTime);
            this.spriteBatchWrapper.MeshBatch = finalRender.Batch;
            this.spriteBatchWrapper.MeshBatch.Clear();
            ui.UserInterface.Draw(this.spriteBatchWrapper);
        }

        public void SceneBackBufferSizeChanged(Rectangle realRenderTarget, Rectangle sceneRenderTarget)
        {
            ((ScreenGraphicDeviceWrapper)this.spriteBatchWrapper.GraphicsDevice).ViewRectangle = sceneRenderTarget;
        }
    }
}