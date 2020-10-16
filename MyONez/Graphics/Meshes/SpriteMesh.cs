namespace MyONez.Graphics.Meshes
{
    using System;

    using Microsoft.Xna.Framework;
    using Microsoft.Xna.Framework.Graphics;

    using MyONez.Maths;

    public class SpriteMesh : IMesh
    {
        public Texture2D Texture { get; set; }

        public SpriteEffects Effect { get; set; }

        public float Depth { get; set; }

        public Color Color { get; set; }

        public RectangleF SrcRect { get; set; }

        public RectangleF DestRect { get; set; }

        public float Rotation { get; set; }

        public override void Build(Texture2D texture, RectangleF destRect, RectangleF srcRect, Color color, float depth)
        {
            this.Texture = texture;
            this.DestRect = destRect;
            this.SrcRect = srcRect;
            this.Color = color;
            this.Depth = depth;
            this.Rotation = 0;
        }

        public override void Draw(SpriteBatch spriteBatch)
        {
            spriteBatch.Draw(this.Texture, this.DestRect, this.SrcRect, this.Color, this.Rotation, Vector2.Zero, this.Effect, this.Depth);
        }

        public override void ApplyEffectToMesh(SpriteEffects effect)
        {
            this.Effect = effect;
        }
        
        public override void ApplyTransformMesh(Matrix transform)
        {
            var leftTop = Vector3.Transform(
                new Vector3 { X = this.DestRect.Left, Y = this.DestRect.Top, Z = 0 },
                transform);
            var leftBottom = Vector3.Transform(
                new Vector3 { X = this.DestRect.Left, Y = this.DestRect.Bottom, Z = 0 },
                transform);
            var rightTop = Vector3.Transform(
                new Vector3 { X = this.DestRect.Right, Y = this.DestRect.Top, Z = 0 },
                transform);
            var rightBottom = Vector3.Transform(
                new Vector3 { X = this.DestRect.Right, Y = this.DestRect.Bottom, Z = 0 },
                transform);

            var rotation = 0f;
            var position = new Vector2(leftTop.X, leftTop.Y);
            var size = new Vector2(rightBottom.X - leftTop.X, rightBottom.Y - leftTop.Y);
            
            if (leftTop.Y != rightTop.Y)
            {
                rotation = (float)Math.Atan((leftTop.X - rightTop.X) / (leftTop.Y - rightTop.Y));
                var squareCenter = (leftTop + rightBottom) / 2;
                size = new Vector2((leftTop - rightTop).Length(), (leftTop - leftBottom).Length());
                position = new Vector2(squareCenter.X, squareCenter.Y);
            }

            this.DestRect = new RectangleF(position, size);
            this.Rotation += rotation;
        }

        public override void SetColor(Color value)
        {
            this.Color = value;
        }

        protected override Vector3 GetCenter()
        {
            return new Vector3(
                this.DestRect.X + this.DestRect.Width / 2,
                this.DestRect.Y + this.DestRect.Height / 2,
                0);
        }
    }
}