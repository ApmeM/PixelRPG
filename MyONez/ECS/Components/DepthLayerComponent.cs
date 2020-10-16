namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    public class DepthLayerComponent : Component
    {
        private float depth;

        public DepthLayerComponent()
        {
        }

        public DepthLayerComponent(float depth)
        {
            this.depth = depth;
        }

        public float Depth
        {
            get => this.depth;
            set
            {
                if (this.depth == value)
                {
                    return;
                }

                this.depth = value;
                this.OnChange?.Invoke();
            }
        }

        public event Action OnChange;
    }
}