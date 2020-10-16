namespace MyONez.Graphics.Renderers
{
    using System.Collections.Generic;

    public class RendererList
    {
        private readonly List<Renderer> renderers = new List<Renderer>();

        public int Count => this.renderers.Count;

        public void NotifyEnd()
        {
            for (var i = 0; i < this.renderers.Count; i++)
            {
                this.renderers[i].End();
            }
        }

        public void Add(Renderer renderer)
        {
            this.renderers.Add(renderer);
            this.renderers.Sort();
        }

        public T Get<T>()
            where T : Renderer
        {
            for (var i = 0; i < this.renderers.Count; i++)
            {
                if (this.renderers[i] is T)
                {
                    return (T)this.renderers[i];
                }
            }

            return null;
        }

        public List<Renderer> GetAll()
        {
            return this.renderers;
        }

        public void Remove(Renderer renderer)
        {
            this.renderers.Remove(renderer);
        }
    }
}