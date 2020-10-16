namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    public class RotateComponent : Component
    {
        private float rotation;

        public RotateComponent()
        {
        }

        public RotateComponent(float rotation)
        {
            this.rotation = rotation;
        }

        public float Rotation
        {
            get => this.rotation;
            set
            {
                if (this.rotation == value)
                {
                    return;
                }

                this.rotation = value;
                this.OnChange?.Invoke();
            }
        }

        public float RotationDegrees
        {
            get => MathHelper.ToDegrees(this.Rotation);
            set => this.Rotation = MathHelper.ToRadians(value);
        }

        public event Action OnChange;
    }
}