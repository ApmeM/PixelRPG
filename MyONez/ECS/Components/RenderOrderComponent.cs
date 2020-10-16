namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    public class RenderOrderComponent : Component
    {
        private int order;

        internal event Action RenderOrderChanged;

        public RenderOrderComponent()
        {
        }

        public RenderOrderComponent(int order)
        {
            this.Order = order;
        }

        public int Order
        {
            get => this.order;
            set
            {
                if (this.order != value)
                {
                    this.RenderOrderChanged?.Invoke();
                    this.order = value;
                }
            }
        }
    }
}