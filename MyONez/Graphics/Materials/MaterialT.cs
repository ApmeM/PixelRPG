namespace MyONez.Graphics.Materials
{
    using Microsoft.Xna.Framework.Graphics;

    public class Material<T> : Material
        where T : Effect
    {
        public Material()
        {
        }

        public Material(T effect)
        {
            this.TypedEffect = effect;
        }

        public T TypedEffect
        {
            get => (T)base.Effect;
            set => base.Effect = value;
        }
    }
}