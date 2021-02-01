namespace PixelRPG.Base.AdditionalStuff.RenderProcessors
{
    using PixelRPG.Base.AdditionalStuff.Effects;
    using SpineEngine;
    using SpineEngine.Graphics.RenderProcessors;

    public class ScanlinesRenderProcessor : RenderProcessor<ScanlinesEffect>
    {
        public ScanlinesRenderProcessor(int executionOrder)
            : base(executionOrder, Core.Instance.Content.Load<ScanlinesEffect>(ScanlinesEffect.EffectAssetName))
        {
        }
    }
}