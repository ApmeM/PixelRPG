namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    public class PositionComponent : Component
    {
        private Vector2 position;

        public PositionComponent()
        {
        }

        public PositionComponent(float x, float y)
        {
            this.position = new Vector2(x, y);
        }

        public PositionComponent(Vector2 position)
        {
            this.position = position;
        }

        public Vector2 Position
        {
            get => this.position;
            set
            {
                if (this.position == value)
                {
                    return;
                }

                this.position = value;
                this.OnChange?.Invoke();
            }
        }

        public event Action OnChange;
    }
}