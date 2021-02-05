namespace PixelRPG.Base.AdditionalStuff.Effects
{
    using Microsoft.Xna.Framework.Graphics;

    using SpineEngine.Graphics.Transitions;

    public class WindEffect : Effect, IProgressEffect
    {
        public const string EffectAssetName = ContentPaths.Effects.wind;

        public float Segments
        {
            get => this.Parameters["_windSegments"].GetValueSingle();
            set => this.Parameters["_windSegments"].SetValue(value);
        }

        public float Size
        {
            get => this.Parameters["_size"].GetValueSingle();
            set => this.Parameters["_size"].SetValue(value);
        }

        public float Progress
        {
            get => this.Parameters["_progress"].GetValueSingle();
            set => this.Parameters["_progress"].SetValue(value);
        }

        public WindEffect(Effect effect)
            : base(effect)
        {
        }
    }
}