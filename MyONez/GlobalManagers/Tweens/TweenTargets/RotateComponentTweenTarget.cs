namespace MyONez.GlobalManagers.Tweens.TweenTargets
{
    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens.Interfaces;

    public class RotateComponentTweenTarget : ITweenTarget<float>
    {
        private readonly RotateComponent target;

        public RotateComponentTweenTarget(RotateComponent target)
        {
            this.target = target;
        }

        public float TweenedValue
        {
            get => this.target.Rotation;
            set => this.target.Rotation = value;
        }

        public object Target => this.target;
    }
}