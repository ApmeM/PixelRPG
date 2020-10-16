namespace MyONez.ECS.EntitySystems.Animation
{
    using System.Collections.Generic;

    using MyONez.Graphics.Drawable;

    /// <summary>
    ///     houses the information that a SpriteT requires for animation
    /// </summary>
    public class SpriteAnimation
    {
        public AnimationCompletionBehavior CompletionBehavior;

        public float Delay = 0f;

        private float fps = 10;

        public List<SubtextureDrawable> Frames = new List<SubtextureDrawable>();

        private bool isDirty = true;

        private float iterationDuration;

        private bool loop = true;

        private bool pingPong;

        private float secondsPerFrame;

        private float totalDuration;

        public SpriteAnimation()
        {
        }

        public SpriteAnimation(SubtextureDrawable frame)
        {
            this.Frames.Add(frame);
        }

        public SpriteAnimation(IEnumerable<SubtextureDrawable> frames)
        {
            this.Frames.AddRange(frames);
        }

        public SpriteAnimation(params SubtextureDrawable[] frames)
        {
            this.Frames.AddRange(frames);
        }

        /// <summary>
        ///     frames per second for the animations
        /// </summary>
        /// <value>The fps.</value>
        public float FPS
        {
            get => this.fps;
            set
            {
                this.fps = value;
                this.isDirty = true;
            }
        }

        /// <summary>
        ///     controls whether the animation should loop
        /// </summary>
        /// <value>The loop.</value>
        public bool Loop
        {
            get => this.loop;
            set
            {
                this.loop = value;
                this.isDirty = true;
            }
        }

        /// <summary>
        ///     if loop is true, this controls if an animation loops sequentially or back and forth
        /// </summary>
        /// <value>The ping pong.</value>
        public bool PingPong
        {
            get => this.pingPong;
            set
            {
                this.pingPong = value;
                this.isDirty = true;
            }
        }

        public float TotalDuration
        {
            get
            {
                this.RecalculateFields();
                return this.totalDuration;
            }
        }

        public float SecondsPerFrame
        {
            get
            {
                this.RecalculateFields();
                return this.secondsPerFrame;
            }
        }

        public float IterationDuration
        {
            get
            {
                this.RecalculateFields();
                return this.iterationDuration;
            }
        }

        /// <summary>
        ///     called by AnimationSpriteUpdateSystem to calculate the secondsPerFrame and totalDuration based on the loop details
        ///     and frame count
        /// </summary>
        /// <returns>The for use.</returns>
        private void RecalculateFields()
        {
            if (!this.isDirty)
                return;

            this.secondsPerFrame = 1f / this.fps;
            this.iterationDuration = this.secondsPerFrame * this.Frames.Count;

            if (this.loop)
                this.totalDuration = float.PositiveInfinity;
            else if (this.pingPong)
                this.totalDuration = this.iterationDuration * 2f;
            else
                this.totalDuration = this.iterationDuration;

            this.isDirty = false;
        }
    }
}