namespace MyONez.Graphics.Meshes
{
    using System.Collections.Generic;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Maths;
    using MyONez.Utils.Collections;

    public class MeshBatch
    {
        public readonly List<IMesh> Meshes = new List<IMesh>();

        public IMesh Draw(Texture2D texture, RectangleF destRect, RectangleF srcRect, Color color, float depth = 0)
        {
#if SPRITE_BATCH
            var mesh = Pool<SpriteMesh>.Obtain();
#else
            var mesh = Pool<VertexMesh>.Obtain();
#endif
            mesh.Build(texture, destRect, srcRect, color, depth);
            this.Meshes.Add(mesh);
            return mesh;
        }

        public void Clear()
        {
            for (var i = 0; i < this.Meshes.Count; i++)
            {
#if SPRITE_BATCH
                Pool<SpriteMesh>.Free((SpriteMesh)this.Meshes[i]);
#else
                Pool<VertexMesh>.Free((VertexMesh)this.Meshes[i]);
#endif
            }

            this.Meshes.Clear();
        }
    }
}