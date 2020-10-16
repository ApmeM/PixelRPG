namespace MyONez.Graphics.Cameras
{
    using System;

    using Microsoft.Xna.Framework;

    using MyONez.Debug;
    using MyONez.Maths;

    public class Camera
    {
        internal void OnSceneRenderTargetSizeChanged(Rectangle sceneRenderTarget)
        {
            this.isProjectionMatrixDirty = true;
            var oldOrigin = this.origin;
            this.Origin = new Vector2(sceneRenderTarget.Width / 2f, sceneRenderTarget.Height / 2f);

            // offset our position to match the new center
            this.Position += this.origin - oldOrigin;
        }

        protected virtual void UpdateMatrices()
        {
            if (!this.areMatrixesDirty)
                return;

            Matrix tempMat;
            this.transformMatrix = Matrix.CreateTranslation(-this.Position.X, -this.Position.Y, 0); // position

            if (this.zoom != 1f)
            {
                Matrix.CreateScale(this.zoom, this.zoom, 1, out tempMat); // scale ->
                Matrix.Multiply(ref this.transformMatrix, ref tempMat, out this.transformMatrix);
            }

            if (this.Rotation != 0f)
            {
                Matrix.CreateRotationZ(this.Rotation, out tempMat); // rotation
                Matrix.Multiply(ref this.transformMatrix, ref tempMat, out this.transformMatrix);
            }

            Matrix.CreateTranslation((int)this.origin.X, (int)this.origin.Y, 0, out tempMat); // translate -origin
            Matrix.Multiply(ref this.transformMatrix, ref tempMat, out this.transformMatrix);

            // calculate our inverse as well
            Matrix.Invert(ref this.transformMatrix, out this.inverseTransformMatrix);

            // whenever the matrix changes the bounds are then invalid
            this.areBoundsDirty = true;
            this.areMatrixesDirty = false;
        }

        #region Fields and Properties

        #region 3D Camera Fields

        /// <summary>
        ///     z-position of the 3D camera projections. Affects the fov greatly. Lower values make the objects appear very long in
        ///     the z-direction.
        /// </summary>
        public float PositionZ3D { get; set; } = 2000f;

        /// <summary>
        ///     near clip plane of the 3D camera projection
        /// </summary>
        public float NearClipPlane3D { get; set; } = 0.0001f;

        /// <summary>
        ///     far clip plane of the 3D camera projection
        /// </summary>
        public float FarClipPlane3D { get; set; } = 5000f;

        #endregion

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
                this.areMatrixesDirty = true;
                this.areBoundsDirty = true;
            }
        }

        public float Rotation
        {
            get => this.rotation;
            set
            {
                if (this.rotation == value)
                {
                    return;
                }

                this.rotation = value;
                this.areMatrixesDirty = true;
                this.areBoundsDirty = true;
            }
        }

        /// <summary>
        ///     raw zoom value. This is the exact value used for the scale matrix. Default is 1.
        /// </summary>
        public float RawZoom
        {
            get => this.zoom;
            set
            {
                if (value == this.zoom)
                {
                    return;
                }

                this.zoom = value;
                this.areBoundsDirty = true;
                this.areMatrixesDirty = true;
            }
        }

        /// <summary>
        ///     the zoom value should be between -1 and 1. This value is then translated to be from minimumZoom to maximumZoom.
        ///     This lets you set
        ///     appropriate minimum/maximum values then use a more intuitive -1 to 1 mapping to change the zoom.
        /// </summary>
        public float Zoom
        {
            get
            {
                if (this.zoom == 0)
                    return 1f;

                if (this.zoom < 1)
                    return Mathf.Map(this.zoom, this.minimumZoom, 1, -1, 0);
                return Mathf.Map(this.zoom, 1, this.maximumZoom, 0, 1);
            }
            set
            {
                var newZoom = Mathf.Clamp(value, -1, 1);
                if (newZoom == 0)
                    this.zoom = 1f;
                else if (newZoom < 0)
                    this.zoom = Mathf.Map(newZoom, -1, 0, this.minimumZoom, 1);
                else
                    this.zoom = Mathf.Map(newZoom, 0, 1, 1, this.maximumZoom);

                this.areMatrixesDirty = true;
            }
        }

        public RectangleF Inset
        {
            get => this.inset;
            set
            {
                this.inset = value;
                this.areBoundsDirty = true;
            }
        }

        /// <summary>
        ///     minimum non-scaled value (0 - float.Max) that the camera zoom can be. Defaults to 0.3
        /// </summary>
        /// <value>The minimum zoom.</value>
        public float MinimumZoom
        {
            get => this.minimumZoom;
            set
            {
                Assert.IsTrue(value > 0, "minimumZoom must be greater than zero");

                if (this.zoom < value)
                    this.zoom = this.MinimumZoom;

                this.minimumZoom = value;
            }
        }

        /// <summary>
        ///     maximum non-scaled value (0 - float.Max) that the camera zoom can be. Defaults to 3
        /// </summary>
        /// <value>The maximum zoom.</value>
        public float MaximumZoom
        {
            get => this.maximumZoom;
            set
            {
                Assert.IsTrue(value > 0, "MaximumZoom must be greater than zero");

                if (this.zoom > value)
                    this.zoom = value;

                this.maximumZoom = value;
            }
        }

        /// <summary>
        ///     world-space bounds of the camera. useful for culling.
        /// </summary>
        /// <value>The bounds.</value>
        public RectangleF Bounds
        {
            get
            {
                this.UpdateMatrices();

                if (!this.areBoundsDirty)
                {
                    return this.bounds;
                }

                // top-left and bottom-right are needed by either rotated or non-rotated bounds
                var topLeft = this.ScreenToWorldPoint(
                    new Vector2(
                        Core.Instance.GraphicsDevice.Viewport.X + this.inset.Left,
                        Core.Instance.GraphicsDevice.Viewport.Y + this.inset.Top));
                var bottomRight = this.ScreenToWorldPoint(
                    new Vector2(
                        Core.Instance.GraphicsDevice.Viewport.X + Core.Instance.GraphicsDevice.Viewport.Width
                        - this.inset.Right,
                        Core.Instance.GraphicsDevice.Viewport.Y + Core.Instance.GraphicsDevice.Viewport.Height
                        - this.inset.Bottom));

                if (this.Rotation != 0)
                {
                    // special care for rotated bounds. we need to find our absolute min/max values and create the bounds from that
                    var topRight = this.ScreenToWorldPoint(
                        new Vector2(
                            Core.Instance.GraphicsDevice.Viewport.X + Core.Instance.GraphicsDevice.Viewport.Width
                            - this.inset.Right,
                            Core.Instance.GraphicsDevice.Viewport.Y + this.inset.Top));
                    var bottomLeft = this.ScreenToWorldPoint(
                        new Vector2(
                            Core.Instance.GraphicsDevice.Viewport.X + this.inset.Left,
                            Core.Instance.GraphicsDevice.Viewport.Y + Core.Instance.GraphicsDevice.Viewport.Height
                            - this.inset.Bottom));

                    var minX = Mathf.MinOf(topLeft.X, bottomRight.X, topRight.X, bottomLeft.X);
                    var maxX = Mathf.MaxOf(topLeft.X, bottomRight.X, topRight.X, bottomLeft.X);
                    var minY = Mathf.MinOf(topLeft.Y, bottomRight.Y, topRight.Y, bottomLeft.Y);
                    var maxY = Mathf.MaxOf(topLeft.Y, bottomRight.Y, topRight.Y, bottomLeft.Y);

                    this.bounds.Location = new Vector2(minX, minY);
                    this.bounds.Width = maxX - minX;
                    this.bounds.Height = maxY - minY;
                }
                else
                {
                    this.bounds.Location = topLeft;
                    this.bounds.Width = bottomRight.X - topLeft.X;
                    this.bounds.Height = bottomRight.Y - topLeft.Y;
                }

                this.areBoundsDirty = false;

                return this.bounds;
            }
        }

        /// <summary>
        ///     used to convert from world coordinates to screen
        /// </summary>
        /// <value>The transform matrix.</value>
        public Matrix TransformMatrix
        {
            get
            {
                this.UpdateMatrices();
                return this.transformMatrix;
            }
        }

        /// <summary>
        ///     used to convert from screen coordinates to world
        /// </summary>
        /// <value>The inverse transform matrix.</value>
        public Matrix InverseTransformMatrix
        {
            get
            {
                this.UpdateMatrices();
                return this.inverseTransformMatrix;
            }
        }

        /// <summary>
        ///     the 2D Cameras projection matrix
        /// </summary>
        /// <value>The projection matrix.</value>
        public Matrix ProjectionMatrix
        {
            get
            {
                if (this.isProjectionMatrixDirty)
                {
                    Matrix.CreateOrthographicOffCenter(
                        0,
                        Core.Instance.GraphicsDevice.Viewport.Width,
                        Core.Instance.GraphicsDevice.Viewport.Height,
                        0,
                        0,
                        -1,
                        out this.projectionMatrix);
                    this.isProjectionMatrixDirty = false;
                }

                return this.projectionMatrix;
            }
        }

        /// <summary>
        ///     gets the view-projection matrix which is the transformMatrix * the projection matrix
        /// </summary>
        /// <value>The view projection matrix.</value>
        public Matrix ViewProjectionMatrix => this.TransformMatrix * this.ProjectionMatrix;

        #region 3D Camera Matrixes

        /// <summary>
        ///     returns a perspective projection for this camera for use when rendering 3D objects
        /// </summary>
        /// <value>The projection matrix3 d.</value>
        public Matrix ProjectionMatrix3D
        {
            get
            {
                var targetHeight = Core.Instance.GraphicsDevice.Viewport.Height / this.zoom;
                var fov = (float)Math.Atan(targetHeight / (2f * this.PositionZ3D)) * 2f;
                return Matrix.CreatePerspectiveFieldOfView(
                    fov,
                    Core.Instance.GraphicsDevice.Viewport.AspectRatio,
                    this.NearClipPlane3D,
                    this.FarClipPlane3D);
            }
        }

        /// <summary>
        ///     returns a view Matrix via CreateLookAt for this camera for use when rendering 3D objects
        /// </summary>
        /// <value>The view matrix3 d.</value>
        public Matrix ViewMatrix3D
        {
            get
            {
                // we need to always invert the y-values to match the way Batcher/SpriteBatch does things
                var position3D = new Vector3(this.Position.X, -this.Position.Y, this.PositionZ3D);
                return Matrix.CreateLookAt(position3D, position3D + Vector3.Forward, Vector3.Up);
            }
        }

        #endregion

        public Vector2 Origin
        {
            get => this.origin;
            internal set
            {
                if (this.origin == value)
                {
                    return;
                }

                this.origin = value;
                this.areMatrixesDirty = true;
                this.areBoundsDirty = true;
            }
        }

        private Vector2 position;

        private float rotation;

        private float zoom = 1f;

        private float minimumZoom = 0.3f;

        private float maximumZoom = 3f;

        private RectangleF bounds;

        private RectangleF inset;

        private Matrix transformMatrix = Matrix.Identity;

        private Matrix inverseTransformMatrix = Matrix.Identity;

        private Matrix projectionMatrix;

        private Vector2 origin;

        private bool areMatrixesDirty = true;

        private bool areBoundsDirty = true;

        private bool isProjectionMatrixDirty = true;

        #endregion

        #region zoom helpers

        public void ZoomIn(float deltaZoom)
        {
            this.Zoom += deltaZoom;
        }

        public void ZoomOut(float deltaZoom)
        {
            this.Zoom -= deltaZoom;
        }

        #endregion

        #region transformations

        /// <summary>
        ///     converts a point from world coordinates to screen
        /// </summary>
        /// <returns>The to screen point.</returns>
        /// <param name="worldPosition">World position.</param>
        public Vector2 WorldToScreenPoint(Vector2 worldPosition)
        {
            this.UpdateMatrices();
            Vector2.Transform(ref worldPosition, ref this.transformMatrix, out worldPosition);
            return worldPosition;
        }

        /// <summary>
        ///     converts a point from screen coordinates to world
        /// </summary>
        /// <returns>The to world point.</returns>
        /// <param name="screenPosition">Screen position.</param>
        public Vector2 ScreenToWorldPoint(Vector2 screenPosition)
        {
            this.UpdateMatrices();
            Vector2.Transform(ref screenPosition, ref this.inverseTransformMatrix, out screenPosition);
            return screenPosition;
        }

        /// <summary>
        ///     converts a point from screen coordinates to world
        /// </summary>
        /// <returns>The to world point.</returns>
        /// <param name="screenPosition">Screen position.</param>
        public Vector2 ScreenToWorldPoint(Point screenPosition)
        {
            return this.ScreenToWorldPoint(screenPosition.ToVector2());
        }

        #endregion
    }
}