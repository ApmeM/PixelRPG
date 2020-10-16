namespace MyONez.ECS.Components
{
    using System;

    using LocomotorECS;

    public class ParentComponent : Component
    {
        private Entity parent;

        public ParentComponent()
        {
        }

        public ParentComponent(Entity parent)
        {
            this.parent = parent;
        }

        public Entity Parent
        {
            get => this.parent;
            set
            {
                if (this.parent == value)
                {
                    return;
                }

                this.parent = value;
                this.OnChange?.Invoke();
            }
        }

        public event Action OnChange;
    }
}