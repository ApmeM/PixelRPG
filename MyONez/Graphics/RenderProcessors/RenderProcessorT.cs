namespace MyONez.Graphics.RenderProcessors
{
    using Microsoft.Xna.Framework.Graphics;

    public class RenderProcessor<T> : RenderProcessor
        where T : Effect
    {
        public T TypedEffect
        {
            get => (T)this.Effect;
            set => this.Effect = value;
        }

        public RenderProcessor(int executionOrder, T typedEffect = null)
            : base(executionOrder, typedEffect)
        {
            this.TypedEffect = typedEffect;
        }
    }
}