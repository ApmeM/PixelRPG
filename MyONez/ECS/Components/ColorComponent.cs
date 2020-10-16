namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    using Microsoft.Xna.Framework;

    public class ColorComponent : Component
    {
        private Color color;

        public ColorComponent()
        {
        }

        public ColorComponent(Color color)
        {
            this.color = color;
        }

        public Color Color
        {
            get => this.color;
            set
            {
                if (this.color == value)
                {
                    return;
                }

                this.color = value;
                this.OnChange?.Invoke();
            }
        }

        public event Action OnChange;
    }
}