namespace MyONez.Graphics.Transitions
{
    using System.Collections;

    public class QuickTransition : SceneTransition
    {
        public override IEnumerator OnBeginTransition()
        {
            yield return null;

            this.SetNextScene();

            this.TransitionComplete();
        }
    }
}