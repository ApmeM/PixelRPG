namespace MyONez.ECS.EntitySystems
{
    using System;
    using System.Collections.Generic;

    using LocomotorECS;
    using LocomotorECS.Matching;

    using MyONez.ECS.Components;
    using MyONez.Utils.Collections;

    internal class RenderCollectionUpdateSystem : MatcherEntitySystem
    {
        private static readonly FunctionComparer<Entity> comparer =
            new FunctionComparer<Entity>(a => a.GetComponent<RenderOrderComponent>()?.Order ?? 0);

        private Dictionary<Entity, RenderOrderComponent> knownComponents = new Dictionary<Entity, RenderOrderComponent>();

        public RenderCollectionUpdateSystem()
            : base(new Matcher().All(typeof(FinalRenderComponent)))
        {
        }

        public List<Entity> Entities => this.MatchedEntities;

        private bool needSort = true;

        protected override void OnMatchedEntityAdded(Entity entity)
        {
            base.OnMatchedEntityAdded(entity);
            var orderComponent = entity.GetComponent<RenderOrderComponent>();
            if (orderComponent != null)
            {
                this.knownComponents[entity] = orderComponent;
                this.knownComponents[entity].RenderOrderChanged += this.SortRequired;
            }

            this.SortRequired();
        }

        protected override void OnMatchedEntityChanged(Entity entity)
        {
            base.OnMatchedEntityChanged(entity);
            var orderComponent = entity.GetComponent<RenderOrderComponent>();
            if (orderComponent == null && this.knownComponents.ContainsKey(entity))
            {
                this.knownComponents[entity].RenderOrderChanged -= this.SortRequired;
                this.knownComponents.Remove(entity);
            }
            else if (orderComponent != null && !this.knownComponents.ContainsKey(entity))
            {
                this.knownComponents[entity] = orderComponent;
                this.knownComponents[entity].RenderOrderChanged += this.SortRequired;
            }
            else if (orderComponent != null && this.knownComponents[entity] != orderComponent)
            {
                this.knownComponents[entity].RenderOrderChanged -= this.SortRequired;
                this.knownComponents[entity] = orderComponent;
                this.knownComponents[entity].RenderOrderChanged += this.SortRequired;
            }

            this.SortRequired();
        }

        protected override void OnMatchedEntityRemoved(Entity entity)
        {
            base.OnMatchedEntityRemoved(entity);
            var orderComponent = entity.GetComponent<RenderOrderComponent>();
            if (orderComponent != null)
            {
                this.knownComponents[entity].RenderOrderChanged -= this.SortRequired;
                this.knownComponents.Remove(entity);
            }
        }

        public override void DoAction(TimeSpan gameTime)
        {
            base.DoAction(gameTime);

            if (this.needSort)
            {
                this.MatchedEntities.Sort(comparer);
            }
        }

        private void SortRequired()
        {
            this.needSort = true;
        }
    }
}