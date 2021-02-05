namespace PixelRPG.Base.AdditionalStuff.SceneTransitions
{
    using System.Collections;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine.Graphics.Transitions;
    using SpineEngine.Maths.Easing;
    using SpineEngine.XnaManagers;

    /// <summary>
    ///     Uses a texture (TransitionTexture) to control a wipe animation. The blue channel of the texture determines if color
    ///     is shown or the previous scenes render. Sample textures are based on: https://www.youtube.com/watch?v=LnAoD7hgDxw
    /// </summary>
    public class TextureWipeTransition : SceneTransition
    {
        private readonly GlobalContentManager tmpContentManager = new GlobalContentManager();

        public float Duration = 1f;

        public EaseType EaseType = EaseType.Linear;

        /// <summary>
        ///     Examples for textures can be found here:
        ///     ContentPaths.Textures.TextureWipeTransition.*
        /// </summary>
        public TextureWipeTransition(Texture2D transitionTexture)
        {
            this.Effect = this.tmpContentManager.Load<TextureWipeEffect>(TextureWipeEffect.EffectAssetName);
            this.Opacity = 1f;
            this.WipeColor = Color.Black;
            this.TransitionTexture = transitionTexture;
        }

        public float Opacity
        {
            set => ((TextureWipeEffect)this.Effect).Opacity = value;
        }

        public Color WipeColor
        {
            set => ((TextureWipeEffect)this.Effect).Color = value;
        }

        public Texture2D TransitionTexture
        {
            set => ((TextureWipeEffect)this.Effect).Texture = value;
        }

        public bool UseRedGreenChannelsForDistortion
        {
            set =>
                this.Effect.CurrentTechnique =
                    this.Effect.Techniques[value ? "TextureWipeWithDistort" : "TextureWipe"];
        }

        public override IEnumerator OnBeginTransition()
        {
            yield return this.TickEffectProgressProperty((TextureWipeEffect)this.Effect, this.Duration, this.EaseType);

            this.SetNextScene();
            
            this.TransitionComplete();

            this.tmpContentManager.Unload();
        }
    }
}