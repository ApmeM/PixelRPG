namespace MyONez.GlobalManagers.Tweens.TweenTargets
{
    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens.Interfaces;

    public class PositionComponentTweenTarget : ITweenTarget<Vector2>
    {
        private readonly PositionComponent target;

        public PositionComponentTweenTarget(PositionComponent target)
        {
            this.target = target;
        }

        public Vector2 TweenedValue
        {
            get => this.target.Position;
            set => this.target.Position = value;
        }

        public object Target => this.target;
    }
}