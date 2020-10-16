namespace MyONez.GlobalManagers
{
    using System.Collections.Generic;
    using System.Runtime.CompilerServices;

    using Microsoft.Xna.Framework;

    public class GlobalManagerList
    {
        private readonly List<GlobalManager> globalManagers = new List<GlobalManager>();

        public void Add(GlobalManager manager)
        {
            this.globalManagers.Add(manager);
            manager.Enabled = true;
        }

        public void Remove(GlobalManager manager)
        {
            this.globalManagers.Remove(manager);
            manager.Enabled = false;
        }

        public void NotifyUpdate(GameTime gameTime)
        {
            for (var i = this.globalManagers.Count - 1; i >= 0; i--)
            {
                if (this.globalManagers[i].Enabled)
                {
                    this.globalManagers[i].Update(gameTime);
                }
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public T GetGlobalManager<T>()
            where T : GlobalManager
        {
            for (var i = 0; i < this.globalManagers.Count; i++)
            {
                var component = this.globalManagers[i];
                if (component is T manager)
                {
                    return manager;
                }
            }

            return null;
        }

        #region array access

        public int Count => this.globalManagers.Count;

        public GlobalManager this[int index] => this.globalManagers[index];

        #endregion
    }
}