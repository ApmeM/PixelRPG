namespace MyONez.GlobalManagers.Tweens.TweenTargets
{
    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens.Interfaces;

    public class ColorComponentTweenTarget : ITweenTarget<Color>
    {
        private readonly ColorComponent target;

        public ColorComponentTweenTarget(ColorComponent target)
        {
            this.target = target;
        }

        public Color TweenedValue
        {
            get => this.target.Color;
            set => this.target.Color = value;
        }

        public object Target => this.target;
    }
}