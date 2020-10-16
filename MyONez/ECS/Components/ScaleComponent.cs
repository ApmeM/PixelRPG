namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    public class ScaleComponent : Component
    {
        private Vector2 scale;

        public ScaleComponent()
        {
        }

        public ScaleComponent(float x, float y)
        {
            this.scale = new Vector2(x, y);
        }

        public ScaleComponent(Vector2 position)
        {
            this.scale = position;
        }

        public Vector2 Scale
        {
            get => this.scale;
            set
            {
                if (this.scale == value)
                {
                    return;
                }

                this.scale = value;
                this.OnChange?.Invoke();
            }
        }

        public event Action OnChange;
    }
}