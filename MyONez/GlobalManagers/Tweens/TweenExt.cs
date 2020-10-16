namespace MyONez.GlobalManagers.Tweens
{
    using System.Runtime.CompilerServices;

    using Microsoft.Xna.Framework;

    using MyONez.ECS.Components;
    using MyONez.GlobalManagers.Tweens.Interfaces;
    using MyONez.GlobalManagers.Tweens.PrimitiveTweens;
    using MyONez.GlobalManagers.Tweens.TweenTargets;

    public static class TweenExt
    {
        #region Transform tweens

        /// <summary>
        ///     transform.position tween
        /// </summary>
        /// <returns>The position to.</returns>
        public static ITween<Vector2> TweenTo(this PositionComponent self, Vector2 to, float duration = 0.3f)
        {
            return new Vector2Tween(new PositionComponentTweenTarget(self), to, duration);
        }

        /// <summary>
        ///     transform.scale tween
        /// </summary>
        /// <returns>The scale to.</returns>
        public static ITween<Vector2> TweenTo(this ScaleComponent self, float to, float duration = 0.3f)
        {
            return self.TweenTo(new Vector2(to), duration);
        }

        /// <summary>
        ///     transform.scale tween
        /// </summary>
        /// <returns>The scale to.</returns>
        public static ITween<Vector2> TweenTo(this ScaleComponent self, Vector2 to, float duration = 0.3f)
        {
            return new Vector2Tween(new ScaleComponentTweenTarget(self), to, duration);
        }

        /// <summary>
        ///     transform.rotation tween
        /// </summary>
        /// <returns>The rotation to.</returns>
        /// <param name="self">Self.</param>
        /// <param name="to">To.</param>
        /// <param name="duration">Duration.</param>
        public static ITween<float> TweenRadiansTo(this RotateComponent self, float to, float duration = 0.3f)
        {
            return new FloatTween(new RotateComponentTweenTarget(self), to, duration);
        }

        /// <summary>
        ///     transform.localEulers tween
        /// </summary>
        /// <returns>The klocal eulers to.</returns>
        /// <param name="self">Self.</param>
        /// <param name="to">To.</param>
        /// <param name="duration">Duration.</param>
        public static ITween<float> TweenDegreesTo(this RotateComponent self, float to, float duration = 0.3f)
        {
            return new FloatTween(new RotateDegreesComponentTweenTarget(self), to, duration);
        }

        /// <summary>
        ///     RenderableComponent.color tween
        /// </summary>
        /// <returns>The color to.</returns>
        /// <param name="self">Self.</param>
        /// <param name="to">To.</param>
        /// <param name="duration">Duration.</param>
        public static ITween<Color> TweenTo(this ColorComponent self, Color to, float duration = 0.3f)
        {
            return new ColorTween(new ColorComponentTweenTarget(self), to, duration);
        }

        /// <summary>
        ///     tweens an int field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<int> TweenTo(this object self, string memberName, int to, float duration)
        {
            return new IntTween(new PropertyTweenTarget<int>(self, memberName), to, duration);
        }

        /// <summary>
        ///     tweens a float field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<float> TweenTo(this object self, string memberName, float to, float duration)
        {
            return new FloatTween(new PropertyTweenTarget<float>(self, memberName), to, duration);
        }

        /// <summary>
        ///     tweens a Color field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<Color> TweenTo(this object self, string memberName, Color to, float duration)
        {
            return new ColorTween(new PropertyTweenTarget<Color>(self, memberName), to, duration);
        }

        /// <summary>
        ///     tweens a Vector2 field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<Vector2> TweenTo(this object self, string memberName, Vector2 to, float duration)
        {
            return new Vector2Tween(new PropertyTweenTarget<Vector2>(self, memberName), to, duration);
        }

        /// <summary>
        ///     tweens a Vector3 field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<Vector3> TweenTo(this object self, string memberName, Vector3 to, float duration)
        {
            return new Vector3Tween(new PropertyTweenTarget<Vector3>(self, memberName), to, duration);
        }

        /// <summary>
        ///     tweens a Vector3 field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<Vector4> TweenTo(this object self, string memberName, Vector4 to, float duration)
        {
            return new Vector4Tween(new PropertyTweenTarget<Vector4>(self, memberName), to, duration);
        }

        /// <summary>
        ///     tweens a Vector3 field or property
        /// </summary>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static ITween<Quaternion> TweenTo(this object self, string memberName, Quaternion to, float duration)
        {
            return new QuaternionTween(new PropertyTweenTarget<Quaternion>(self, memberName), to, duration);
        }

        #endregion
    }
}