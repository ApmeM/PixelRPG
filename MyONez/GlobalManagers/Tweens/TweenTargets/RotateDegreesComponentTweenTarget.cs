namespace MyONez.GlobalManagers.Tweens.TweenTargets
{
    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens.Interfaces;

    public class RotateDegreesComponentTweenTarget : ITweenTarget<float>
    {
        private readonly RotateComponent target;

        public RotateDegreesComponentTweenTarget(RotateComponent target)
        {
            this.target = target;
        }

        public float TweenedValue
        {
            get => this.target.RotationDegrees;
            set => this.target.RotationDegrees = value;
        }

        public object Target => this.target;
    }
}