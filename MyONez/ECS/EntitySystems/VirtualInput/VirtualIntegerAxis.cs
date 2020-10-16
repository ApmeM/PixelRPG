namespace MyONez.ECS.EntitySystems.VirtualInput
{
    using System;

    /// <summary>
    ///     A virtual input that is represented as a int that is either -1, 0, or 1. It corresponds to input that can range
    ///     from on to neutral to off
    ///     such as GamePad DPad left/right. Can also use two keyboard Keys as the positive/negative checks.
    /// </summary>
    public class VirtualIntegerAxis : VirtualAxis
    {
        public VirtualIntegerAxis(OverlapBehavior overlap)
            : base(overlap)
        {
        }

        public VirtualIntegerAxis(OverlapBehavior overlap, params Node[] nodes)
            : base(overlap)
        {
            this.Nodes.AddRange(nodes);
        }

        public int IntegerValue => Math.Sign(this.Value);
    }
}