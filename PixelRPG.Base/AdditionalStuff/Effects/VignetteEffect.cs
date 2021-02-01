namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    public class VignetteEffect : Effect
    {
        public const string EffectAssetName = ContentPaths.Effects.vignette;

        public float Power
        {
            get => this.Parameters["_power"].GetValueSingle();
            set => this.Parameters["_power"].SetValue(value);
        }

        public float Radius
        {
            get => this.Parameters["_radius"].GetValueSingle();
            set => this.Parameters["_radius"].SetValue(value);
        }

        public VignetteEffect(Effect effect)
            : base(effect)
        {
        }
    }
}