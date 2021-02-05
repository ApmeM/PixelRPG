namespace PixelRPG.Base.AdditionalStuff.SceneTransitions
{
    using System.Collections;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine;
    using SpineEngine.GlobalManagers.Coroutines;
    using SpineEngine.Graphics.Transitions;
    using SpineEngine.Maths.Easing;
    using SpineEngine.XnaManagers;

    public class SquaresTransition : SceneTransition
    {
        private readonly GlobalContentManager tmpContentManager = new GlobalContentManager();

        public float DelayBeforeSquaresInDuration = 0;

        public EaseType EaseType = EaseType.QuartOut;

        public float SquaresInDuration = 0.6f;

        public float SquaresOutDuration = 0.6f;

        public SquaresTransition()
        {
            this.Effect = this.tmpContentManager.Load<SquaresEffect>(SquaresEffect.EffectAssetName);
            this.SquareColor = Color.Black;
            this.Smoothness = 0.5f;

            var aspectRatio = (float)Core.Instance.Screen.Width / Core.Instance.Screen.Height;
            this.Size = new Vector2(30, 30 / aspectRatio);
        }

        public Color SquareColor
        {
            set => ((SquaresEffect)this.Effect).Color = value;
        }

        public float Smoothness
        {
            set => ((SquaresEffect)this.Effect).Smoothness = value;
        }

        public Vector2 Size
        {
            set => ((SquaresEffect)this.Effect).Size = value;
        }

        public override IEnumerator OnBeginTransition()
        {
            yield return this.TickEffectProgressProperty((SquaresEffect)this.Effect, this.SquaresInDuration, this.EaseType);

            this.SetNextScene();

            yield return DefaultCoroutines.Wait(this.DelayBeforeSquaresInDuration);

            yield return this.TickEffectProgressProperty(
                    (SquaresEffect)this.Effect,
                    this.SquaresOutDuration,
                    EaseHelper.OppositeEaseType(this.EaseType),
                    true);

            this.TransitionComplete();

            // cleanup
            this.Effect.Dispose();
            this.tmpContentManager.Unload();
        }
    }
}