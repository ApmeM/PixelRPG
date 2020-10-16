namespace MyONez.Graphics.Materials
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Graphics.Cameras;

    public class Material
    {
        public BlendState BlendState = BlendState.AlphaBlend;

        public DepthStencilState DepthStencilState = DepthStencilState.None;

        public Effect Effect;

        public SamplerState SamplerState = Graphic.DefaultSamplerState;

        public virtual void OnPreRender(Camera camera, Entity entity)
        {
        }

        public virtual void Update(TimeSpan gameTime)
        {
        }
    }
}