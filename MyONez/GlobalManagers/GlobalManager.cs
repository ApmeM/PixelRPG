namespace MyONez.GlobalManagers
{
    using Microsoft.Xna.Framework;

    /// <summary>
    ///     global manager that can be added to Core
    /// </summary>
    public class GlobalManager
    {
        private bool enabled;

        /// <summary>
        ///     true if the GlobalManager is enabled. Changes in state result in onEnabled/onDisable being called.
        /// </summary>
        /// <value><c>true</c> if enabled; otherwise, <c>false</c>.</value>
        public bool Enabled
        {
            get => this.enabled;
            set => this.SetEnabled(value);
        }

        /// <summary>
        ///     enables/disables this GlobalManager
        /// </summary>
        /// <returns>The enabled.</returns>
        /// <param name="isEnabled">If set to <c>true</c> is enabled.</param>
        public void SetEnabled(bool isEnabled)
        {
            if (this.enabled == isEnabled)
            {
                return;
            }

            this.enabled = isEnabled;

            if (this.enabled)
                this.OnEnabled();
            else
                this.OnDisabled();
        }

        #region GlobalManager Lifecycle

        /// <summary>
        ///     called when this GlobalManager is enabled
        /// </summary>
        public virtual void OnEnabled()
        {
        }

        /// <summary>
        ///     called when the this GlobalManager is disabled
        /// </summary>
        public virtual void OnDisabled()
        {
        }

        /// <summary>
        ///     called each frame before Scene.update
        /// </summary>
        /// <param name="gameTime"></param>
        public virtual void Update(GameTime gameTime)
        {
        }

        #endregion
    }
}