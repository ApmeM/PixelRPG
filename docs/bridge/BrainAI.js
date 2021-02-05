/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("BrainAI", function ($asm, globals) {
    "use strict";

    /** @namespace BrainAI.AI.BehaviorTrees */

    /**
     * root class for all nodes
     *
     * @abstract
     * @public
     * @class BrainAI.AI.BehaviorTrees.Behavior$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Behavior$1", function (T) { return {
        fields: {
            Status: 0
        },
        ctors: {
            init: function () {
                this.Status = BrainAI.AI.BehaviorTrees.TaskStatus.Invalid;
            }
        },
        methods: {
            /**
             * invalidate the status of the node. Composites can override this and invalidate all of their children.
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.Behavior$1
             * @memberof BrainAI.AI.BehaviorTrees.Behavior$1
             * @return  {void}
             */
            Invalidate: function () {
                this.Status = BrainAI.AI.BehaviorTrees.TaskStatus.Invalid;
            },
            /**
             * called immediately before execution. It is used to setup any variables that need to be reset from the previous run
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.Behavior$1
             * @memberof BrainAI.AI.BehaviorTrees.Behavior$1
             * @return  {void}
             */
            OnStart: function () { },
            /**
             * called when a task changes state to something other than running
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.Behavior$1
             * @memberof BrainAI.AI.BehaviorTrees.Behavior$1
             * @return  {void}
             */
            OnEnd: function () { },
            /**
             * tick handles calling through to update where the actual work is done. It exists so that it can call onStart/onEnd when necessary.
             *
             * @instance
             * @this BrainAI.AI.BehaviorTrees.Behavior$1
             * @memberof BrainAI.AI.BehaviorTrees.Behavior$1
             * @param   {T}                                      context    Context.
             * @return  {BrainAI.AI.BehaviorTrees.TaskStatus}
             */
            Tick: function (context) {
                if (this.Status === BrainAI.AI.BehaviorTrees.TaskStatus.Invalid) {
                    this.OnStart();
                }

                this.Status = this.Update(context);

                if (this.Status !== BrainAI.AI.BehaviorTrees.TaskStatus.Running) {
                    this.OnEnd();
                }

                return this.Status;
            }
        }
    }; });

    Bridge.define("BrainAI.AI.IAITurn", {
        $kind: "interface"
    });

    /** @namespace System */

    /**
     * @memberof System
     * @callback System.Func
     * @param   {T}          arg
     * @return  {boolean}
     */

    /**
     * helper for building a BehaviorTree using a fluent API. Leaf nodes need to first have a parent added. Parents can be Composites or
     Decorators. Decorators are automatically closed when a leaf node is added. Composites must have endComposite called to close them.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1", function (T) { return {
        statics: {
            methods: {
                Begin: function (context) {
                    return new (BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1(T))(context);
                }
            }
        },
        fields: {
            context: Bridge.getDefaultValue(T),
            /**
             * Last node created.
             *
             * @instance
             * @private
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @type BrainAI.AI.BehaviorTrees.Behavior$1
             */
            currentNode: null,
            /**
             * Stack nodes that we are build via the fluent API.
             *
             * @instance
             * @private
             * @readonly
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @type System.Collections.Generic.Stack$1
             */
            parentNodeStack: null
        },
        ctors: {
            init: function () {
                this.parentNodeStack = new (System.Collections.Generic.Stack$1(BrainAI.AI.BehaviorTrees.Behavior$1(T))).ctor();
            },
            ctor: function (context) {
                this.$initialize();
                this.context = context;
            }
        },
        methods: {
            AddChildBehavior: function (child) {
                if (this.parentNodeStack.Count === 0) {
                    throw new System.InvalidOperationException.$ctor1("Can't create an unnested Behavior node. It must be a leaf node.");
                }

                var parent = this.parentNodeStack.Peek();
                if (Bridge.is(parent, BrainAI.AI.BehaviorTrees.Composites.Composite$1(T))) {
                    (Bridge.as(parent, BrainAI.AI.BehaviorTrees.Composites.Composite$1(T))).AddChild(child);
                } else if (Bridge.is(parent, BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T))) {
                    // Decorators have just one child so end it automatically
                    (Bridge.as(parent, BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T))).Child = child;
                    this.EndDecorator();
                }

                return this;
            },
            /**
             * pushes a Composite or Decorator on the stack
             *
             * @instance
             * @private
             * @this BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @param   {BrainAI.AI.BehaviorTrees.Behavior$1}               composite    Composite.
             * @return  {BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1}                 The parent node.
             */
            PushParentNode: function (composite) {
                if (this.parentNodeStack.Count > 0) {
                    this.AddChildBehavior(composite);
                }

                this.parentNodeStack.Push(composite);
                return this;
            },
            EndDecorator: function () {
                this.currentNode = this.parentNodeStack.Pop();
            },
            Action: function (func) {
                return this.AddChildBehavior(new (BrainAI.AI.BehaviorTrees.Actions.ExecuteAction$1(T))(func));
            },
            /**
             * Like an action node but the function can return true/false and is mapped to success/failure.
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @param   {System.Func}                                       func
             * @return  {BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1}
             */
            Action$1: function (func) {
                return this.Action(function (t) {
                    return func(t) ? BrainAI.AI.BehaviorTrees.TaskStatus.Success : BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                });
            },
            Conditional: function (func) {
                return this.AddChildBehavior(new (BrainAI.AI.BehaviorTrees.Conditionals.ExecuteActionConditional$1(T))(func));
            },
            /**
             * Like a conditional node but the function can return true/false and is mapped to success/failure.
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @param   {System.Func}                                       func
             * @return  {BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1}
             */
            Conditional$1: function (func) {
                return this.Conditional(function (t) {
                    return func(t) ? BrainAI.AI.BehaviorTrees.TaskStatus.Success : BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                });
            },
            /**
             * Splice a sub tree into the parent tree.
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @param   {BrainAI.AI.BehaviorTrees.BehaviorTree$1}           subTree
             * @return  {BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1}
             */
            SubTree: function (subTree) {
                return this.AddChildBehavior(new (BrainAI.AI.BehaviorTrees.Actions.BehaviorTreeReference$1(T))(subTree));
            },
            ConditionalDecorator: function (func, shouldReevaluate) {
                if (shouldReevaluate === void 0) { shouldReevaluate = true; }
                var conditional = new (BrainAI.AI.BehaviorTrees.Conditionals.ExecuteActionConditional$1(T))(func);
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1(T)).$ctor1(conditional, shouldReevaluate));
            },
            /**
             * Like a conditional decorator node but the function can return true/false and is mapped to success/failure.
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1
             * @param   {System.Func}                                       func                
             * @param   {boolean}                                           shouldReevaluate
             * @return  {BrainAI.AI.BehaviorTrees.BehaviorTreeBuilder$1}
             */
            ConditionalDecorator$1: function (func, shouldReevaluate) {
                if (shouldReevaluate === void 0) { shouldReevaluate = true; }
                return this.ConditionalDecorator(function (t) {
                    return func(t) ? BrainAI.AI.BehaviorTrees.TaskStatus.Success : BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                }, shouldReevaluate);
            },
            AlwaysFail: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.AlwaysFail$1(T))());
            },
            AlwaysSucceed: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.AlwaysSucceed$1(T))());
            },
            Inverter: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.Inverter$1(T))());
            },
            Repeater: function (count) {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.Repeater$1(T)).$ctor1(count));
            },
            UntilFail: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.UntilFail$1(T))());
            },
            UntilSuccess: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Decorators.UntilSuccess$1(T))());
            },
            Parallel: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Composites.ParallelSequence$1(T))());
            },
            ParallelSelector: function () {
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Composites.ParallelSelector$1(T))());
            },
            Selector: function (abortType) {
                if (abortType === void 0) { abortType = 0; }
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Composites.Selector$1(T))(abortType));
            },
            Sequence: function (abortType) {
                if (abortType === void 0) { abortType = 0; }
                return this.PushParentNode(new (BrainAI.AI.BehaviorTrees.Composites.Sequence$1(T))(abortType));
            },
            EndComposite: function () {
                if (!(Bridge.is(this.parentNodeStack.Peek(), BrainAI.AI.BehaviorTrees.Composites.Composite$1(T)))) {
                    throw new System.InvalidOperationException.$ctor1("attempting to end a composite but the top node is not a composite");
                }

                this.currentNode = this.parentNodeStack.Pop();
                return this;
            },
            Build: function () {
                if (this.currentNode == null) {
                    throw new System.InvalidOperationException.$ctor1("Can't create a behaviour tree with zero nodes");
                }

                return new (BrainAI.AI.BehaviorTrees.BehaviorTree$1(T))(this.context, this.currentNode);
            }
        }
    }; });

    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.AbortTypes", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * no abort type. the current action will always run even if other conditionals change state
                 *
                 * @static
                 * @public
                 * @memberof BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 * @constant
                 * @default 0
                 * @type BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 */
                None: 0,
                /**
                 * If a more important conditional task changes status it can issue an abort that will stop the lower priority tasks from running
                 and shift control back to the higher priority branch. This type should be set on Composites that are children of the evaulating
                 Composite. The parent Composite will check it's children to see if they have a LowerPriority abort.
                 *
                 * @static
                 * @public
                 * @memberof BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 * @constant
                 * @default 1
                 * @type BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 */
                LowerPriority: 1,
                /**
                 * The Conditional task can only abort an Action task if they are both children of the Composite. This AbortType only affects the
                 actual Composite that it is set on unlike LowerPriority which affects its parent Composite.
                 *
                 * @static
                 * @public
                 * @memberof BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 * @constant
                 * @default 2
                 * @type BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 */
                Self: 2,
                /**
                 * both LowerPriority and Self aborts are checked
                 *
                 * @static
                 * @public
                 * @memberof BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 * @constant
                 * @default 3
                 * @type BrainAI.AI.BehaviorTrees.Composites.AbortTypes
                 */
                Both: 3
            }
        },
        $flags: true
    });

    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.AbortTypesExt", {
        statics: {
            methods: {
                Has: function (self, check) {
                    return (self & check) === check;
                }
            }
        }
    });

    /** @namespace BrainAI.AI.BehaviorTrees.Conditionals */

    /**
     * interface used just to identify if a Behavior is a conditional. it will always be applied to a Behavior which already has the update method.
     *
     * @abstract
     * @public
     * @class BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1
     */
    Bridge.definei("BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1", function (T) { return {
        $kind: "interface",
        $variance: [2]
    }; });

    Bridge.define("BrainAI.AI.BehaviorTrees.TaskStatus", {
        $kind: "enum",
        statics: {
            fields: {
                Invalid: 0,
                Success: 1,
                Failure: 2,
                Running: 3
            }
        }
    });

    Bridge.define("BrainAI.AI.FSM.State$1", function (T) { return {
        fields: {
            Machine: null,
            Context: Bridge.getDefaultValue(T)
        },
        methods: {
            SetMachineAndContext: function (machine, context) {
                this.Machine = machine;
                this.Context = context;
                this.OnInitialized();
            },
            /**
             * called directly after the machine and context are set allowing the state to do any required setup
             *
             * @instance
             * @public
             * @this BrainAI.AI.FSM.State$1
             * @memberof BrainAI.AI.FSM.State$1
             * @return  {void}
             */
            OnInitialized: function () { },
            /**
             * called when the state becomes the active state
             *
             * @instance
             * @public
             * @this BrainAI.AI.FSM.State$1
             * @memberof BrainAI.AI.FSM.State$1
             * @return  {void}
             */
            Begin: function () { },
            /**
             * called when this state is no longer the active state
             *
             * @instance
             * @public
             * @this BrainAI.AI.FSM.State$1
             * @memberof BrainAI.AI.FSM.State$1
             * @return  {void}
             */
            End: function () { }
        }
    }; });

    /** @namespace BrainAI.AI.GOAP */

    /**
     * GOAP based on https://github.com/stolk/GPGOAP
     *
     * @public
     * @class BrainAI.AI.GOAP.ActionPlanner
     */
    Bridge.define("BrainAI.AI.GOAP.ActionPlanner", {
        statics: {
            fields: {
                MaxConditions: 0
            },
            ctors: {
                init: function () {
                    this.MaxConditions = 64;
                }
            }
        },
        fields: {
            /**
             * Names associated with all world state atoms
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.ActionPlanner
             * @type Array.<string>
             */
            ConditionNames: null,
            actions: null,
            viableActions: null,
            /**
             * Preconditions for all actions
             *
             * @instance
             * @private
             * @readonly
             * @memberof BrainAI.AI.GOAP.ActionPlanner
             * @type Array.<BrainAI.AI.GOAP.WorldState>
             */
            preConditions: null,
            /**
             * Postconditions for all actions (action effects).
             *
             * @instance
             * @private
             * @readonly
             * @memberof BrainAI.AI.GOAP.ActionPlanner
             * @type Array.<BrainAI.AI.GOAP.WorldState>
             */
            postConditions: null,
            /**
             * Number of world state atoms.
             *
             * @instance
             * @private
             * @memberof BrainAI.AI.GOAP.ActionPlanner
             * @type number
             */
            numConditionNames: 0
        },
        ctors: {
            init: function () {
                this.ConditionNames = System.Array.init(BrainAI.AI.GOAP.ActionPlanner.MaxConditions, null, System.String);
                this.actions = new (System.Collections.Generic.List$1(BrainAI.AI.GOAP.GOAPAction)).ctor();
                this.viableActions = new (System.Collections.Generic.List$1(BrainAI.AI.GOAP.GOAPAction)).ctor();
                this.preConditions = System.Array.init(BrainAI.AI.GOAP.ActionPlanner.MaxConditions, function (){
                    return new BrainAI.AI.GOAP.WorldState();
                }, BrainAI.AI.GOAP.WorldState);
                this.postConditions = System.Array.init(BrainAI.AI.GOAP.ActionPlanner.MaxConditions, function (){
                    return new BrainAI.AI.GOAP.WorldState();
                }, BrainAI.AI.GOAP.WorldState);
            },
            ctor: function () {
                this.$initialize();
                this.numConditionNames = 0;
                for (var i = 0; i < BrainAI.AI.GOAP.ActionPlanner.MaxConditions; i = (i + 1) | 0) {
                    this.ConditionNames[System.Array.index(i, this.ConditionNames)] = null;
                    this.preConditions[System.Array.index(i, this.preConditions)] = BrainAI.AI.GOAP.WorldState.Create(this);
                    this.postConditions[System.Array.index(i, this.postConditions)] = BrainAI.AI.GOAP.WorldState.Create(this);
                }
            }
        },
        methods: {
            /**
             * convenince method for fetching a WorldState object
             *
             * @instance
             * @public
             * @this BrainAI.AI.GOAP.ActionPlanner
             * @memberof BrainAI.AI.GOAP.ActionPlanner
             * @return  {BrainAI.AI.GOAP.WorldState}        The world state.
             */
            CreateWorldState: function () {
                return BrainAI.AI.GOAP.WorldState.Create(this);
            },
            AddAction: function (goapAction) {
                var $t, $t1;
                var actionId = this.FindActionIndex(goapAction);
                if (actionId === -1) {
                    throw new System.Collections.Generic.KeyNotFoundException.$ctor1("could not find or create Action");
                }

                $t = Bridge.getEnumerator(goapAction.PreConditions);
                try {
                    while ($t.moveNext()) {
                        var preCondition = $t.Current;
                        var conditionId = this.FindConditionNameIndex(preCondition.Item1);
                        if (conditionId === -1) {
                            throw new System.Collections.Generic.KeyNotFoundException.$ctor1("could not find or create conditionName");
                        }

                        this.preConditions[System.Array.index(actionId, this.preConditions)].Set$1(conditionId, preCondition.Item2);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                $t1 = Bridge.getEnumerator(goapAction.PostConditions);
                try {
                    while ($t1.moveNext()) {
                        var postCondition = $t1.Current;
                        var conditionId1 = this.FindConditionNameIndex(postCondition.Item1);
                        if (conditionId1 === -1) {
                            throw new System.Collections.Generic.KeyNotFoundException.$ctor1("could not find conditionName");
                        }

                        this.postConditions[System.Array.index(actionId, this.postConditions)].Set$1(conditionId1, postCondition.Item2);
                    }
                } finally {
                    if (Bridge.is($t1, System.IDisposable)) {
                        $t1.System$IDisposable$Dispose();
                    }
                }
            },
            Plan: function (startState, goalState, selectedNodes) {
                if (selectedNodes === void 0) { selectedNodes = null; }
                this.viableActions.clear();
                for (var i = 0; i < this.actions.Count; i = (i + 1) | 0) {
                    if (this.actions.getItem(i).Validate()) {
                        this.viableActions.add(this.actions.getItem(i));
                    }
                }

                return BrainAI.AI.GOAP.GOAPWorld.Plan(this, startState.$clone(), goalState.$clone(), selectedNodes);
            },
            /**
             * Describe the action planner by listing all actions with pre and post conditions. For debugging purpose.
             *
             * @instance
             * @public
             * @this BrainAI.AI.GOAP.ActionPlanner
             * @memberof BrainAI.AI.GOAP.ActionPlanner
             * @return  {string}
             */
            Describe: function () {
                var sb = new System.Text.StringBuilder();
                for (var a = 0; a < this.actions.Count; a = (a + 1) | 0) {
                    sb.appendLine(Bridge.Reflection.getTypeName(Bridge.getType(this.actions.getItem(a))));

                    var pre = this.preConditions[System.Array.index(a, this.preConditions)].$clone();
                    var pst = this.postConditions[System.Array.index(a, this.postConditions)].$clone();
                    for (var i = 0; i < BrainAI.AI.GOAP.ActionPlanner.MaxConditions; i = (i + 1) | 0) {
                        if ((pre.DontCare.and((System.Int64(1).shl(i)))).equals(System.Int64(0))) {
                            var v = (pre.Values.and((System.Int64(1).shl(i)))).ne(System.Int64(0));
                            sb.appendFormat("  {0}=={1}\n", this.ConditionNames[System.Array.index(i, this.ConditionNames)], Bridge.box(v ? 1 : 0, System.Int32));
                        }
                    }

                    for (var i1 = 0; i1 < BrainAI.AI.GOAP.ActionPlanner.MaxConditions; i1 = (i1 + 1) | 0) {
                        if ((pst.DontCare.and((System.Int64(1).shl(i1)))).equals(System.Int64(0))) {
                            var v1 = (pst.Values.and((System.Int64(1).shl(i1)))).ne(System.Int64(0));
                            sb.appendFormat("  {0}:={1}\n", this.ConditionNames[System.Array.index(i1, this.ConditionNames)], Bridge.box(v1 ? 1 : 0, System.Int32));
                        }
                    }
                }

                return sb.toString();
            },
            FindConditionNameIndex: function (conditionName) {
                var idx;
                for (idx = 0; idx < this.numConditionNames; idx = (idx + 1) | 0) {
                    if (System.String.equals(this.ConditionNames[System.Array.index(idx, this.ConditionNames)], conditionName)) {
                        return idx;
                    }
                }

                if (idx < 63) {
                    this.ConditionNames[System.Array.index(idx, this.ConditionNames)] = conditionName;
                    this.numConditionNames = (this.numConditionNames + 1) | 0;
                    return idx;
                }

                return -1;
            },
            FindActionIndex: function (goapAction) {
                var idx = this.actions.indexOf(goapAction);
                if (idx > -1) {
                    return idx;
                }

                this.actions.add(goapAction);

                return ((this.actions.Count - 1) | 0);
            },
            GetPossibleTransitions: function (fr) {
                var $t;
                var result = new (System.Collections.Generic.List$1(BrainAI.AI.GOAP.GOAPNode)).ctor();
                for (var i = 0; i < this.viableActions.Count; i = (i + 1) | 0) {
                    // see if precondition is met
                    var pre = this.preConditions[System.Array.index(i, this.preConditions)].$clone();
                    var care = (pre.DontCare.xor(System.Int64(-1)));
                    var met = ((pre.Values.and(care)).equals((fr.Values.and(care))));
                    if (met) {
                        var node = ($t = new BrainAI.AI.GOAP.GOAPNode(), $t.Action = this.viableActions.getItem(i), $t.CostSoFar = this.viableActions.getItem(i).Cost, $t.WorldState = this.ApplyPostConditions(this, i, fr.$clone()), $t);
                        result.add(node);
                    }
                }
                return result;
            },
            ApplyPostConditions: function (ap, actionnr, fr) {
                var pst = ap.postConditions[System.Array.index(actionnr, ap.postConditions)].$clone();
                var unaffected = pst.DontCare;
                var affected = (unaffected.xor(System.Int64(-1)));

                fr.Values = (fr.Values.and(unaffected)).or((pst.Values.and(affected)));
                fr.DontCare = fr.DontCare.and(pst.DontCare);
                return fr.$clone();
            }
        }
    });

    /**
     * Agent provides a simple and concise way to use the planner. It is not necessary to use at all since it is just a convenince wrapper
     around the ActionPlanner making it easier to get plans and store the results.
     *
     * @abstract
     * @public
     * @class BrainAI.AI.GOAP.Agent
     */
    Bridge.define("BrainAI.AI.GOAP.Agent", {
        fields: {
            Actions: null,
            Planner: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.Planner = new BrainAI.AI.GOAP.ActionPlanner();
            }
        },
        methods: {
            Plan: function (debugPlan) {
                if (debugPlan === void 0) { debugPlan = false; }
                var nodes = null;
                if (debugPlan) {
                    nodes = new (System.Collections.Generic.List$1(BrainAI.AI.GOAP.GOAPNode)).ctor();
                }

                this.Actions = this.Planner.Plan(this.GetWorldState(), this.GetGoalState(), nodes);

                if (nodes == null || nodes.Count <= 0) {
                    return this.HasActionPlan();
                }

                //---- ActionPlanner plan ----
                //plan cost = {nodes[nodes.Count - 1].CostSoFar}
                //start    {this.GetWorldState().Describe(this.Planner)}
                //for ( var i = 0; i < nodes.Count; i++ )
                //{
                //{i}: {nodes[i].Action.GetType().Name}    {nodes[i].WorldState.Describe(this.Planner)}"
                //}

                return this.HasActionPlan();
            },
            HasActionPlan: function () {
                return this.Actions != null && this.Actions.Count > 0;
            }
        }
    });

    Bridge.define("BrainAI.AI.GOAP.GOAPAction", {
        fields: {
            /**
             * optional name for the Action. Used for debugging purposes
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPAction
             * @type string
             */
            Name: null,
            /**
             * The cost of performing the action.  Figure out a weight that suits the action.  Changing it will affect what actions are
             chosen during planning
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPAction
             * @default 1
             * @type number
             */
            Cost: 0,
            PreConditions: null,
            PostConditions: null
        },
        ctors: {
            init: function () {
                this.Cost = 1;
                this.PreConditions = new (System.Collections.Generic.HashSet$1(System.Tuple$2(System.String,System.Boolean))).ctor();
                this.PostConditions = new (System.Collections.Generic.HashSet$1(System.Tuple$2(System.String,System.Boolean))).ctor();
            },
            ctor: function () {
                this.$initialize();
            },
            $ctor1: function (name) {
                this.$initialize();
                this.Name = name;
            },
            $ctor2: function (name, cost) {
                BrainAI.AI.GOAP.GOAPAction.$ctor1.call(this, name);
                this.Cost = cost;
            }
        },
        methods: {
            SetPrecondition: function (conditionName, value) {
                this.PreConditions.add({ Item1: conditionName, Item2: value });
            },
            SetPostcondition: function (conditionName, value) {
                this.PostConditions.add({ Item1: conditionName, Item2: value });
            },
            /**
             * called before the Planner does its planning. Gives the Action an opportunity to set its score or to opt out if it isnt of use.
             For example, if the Action is to pick up a gun but there are no guns in the world returning false would keep the Action from being
             considered by the ActionPlanner.
             *
             * @instance
             * @public
             * @this BrainAI.AI.GOAP.GOAPAction
             * @memberof BrainAI.AI.GOAP.GOAPAction
             * @return  {boolean}
             */
            Validate: function () {
                return true;
            },
            toString: function () {
                return System.String.format("[Action] {0} - cost: {1}", this.Name, Bridge.box(this.Cost, System.Int32));
            }
        }
    });

    Bridge.define("BrainAI.AI.GOAP.GOAPNode", {
        inherits: function () { return [System.IComparable$1(BrainAI.AI.GOAP.GOAPNode),System.IEquatable$1(BrainAI.AI.GOAP.GOAPNode)]; },
        fields: {
            /**
             * The state of the world at this node.
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPNode
             * @type BrainAI.AI.GOAP.WorldState
             */
            WorldState: null,
            /**
             * The cost so far.
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPNode
             * @type number
             */
            CostSoFar: 0,
            /**
             * The heuristic for remaining cost (don't overestimate!)
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPNode
             * @type number
             */
            HeuristicCost: 0,
            /**
             * costSoFar + heuristicCost (g+h) combined.
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPNode
             * @type number
             */
            CostSoFarAndHeuristicCost: 0,
            /**
             * the Action associated with this node
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.GOAPNode
             * @type BrainAI.AI.GOAP.GOAPAction
             */
            Action: null,
            Parent: null,
            ParentWorldState: null,
            Depth: 0
        },
        alias: [
            "equalsT", "System$IEquatable$1$BrainAI$AI$GOAP$GOAPNode$equalsT",
            "compareTo", ["System$IComparable$1$BrainAI$AI$GOAP$GOAPNode$compareTo", "System$IComparable$1$compareTo"]
        ],
        ctors: {
            init: function () {
                this.WorldState = new BrainAI.AI.GOAP.WorldState();
                this.ParentWorldState = new BrainAI.AI.GOAP.WorldState();
            }
        },
        methods: {
            equalsT: function (other) {
                var care = this.WorldState.DontCare.xor(System.Int64(-1));
                return (this.WorldState.Values.and(care)).equals((other.WorldState.Values.and(care)));
            },
            compareTo: function (other) {
                return Bridge.compare(this.CostSoFarAndHeuristicCost, other.CostSoFarAndHeuristicCost);
            },
            Reset: function () {
                this.Action = null;
                this.Parent = null;
            },
            Clone: function () {
                return Bridge.cast(Bridge.clone(this), BrainAI.AI.GOAP.GOAPNode);
            },
            toString: function () {
                return System.String.format("[cost: {0} | heuristic: {1}]: {2}", Bridge.box(this.CostSoFar, System.Int32), Bridge.box(this.HeuristicCost, System.Int32), this.Action);
            }
        }
    });

    Bridge.define("BrainAI.AI.GOAP.GOAPStorage", {
        statics: {
            fields: {
                MaxNodes: 0
            },
            ctors: {
                init: function () {
                    this.MaxNodes = 128;
                }
            }
        },
        fields: {
            opened: null,
            closed: null,
            numOpened: 0,
            numClosed: 0,
            lastFoundOpened: 0,
            lastFoundClosed: 0
        },
        ctors: {
            init: function () {
                this.opened = System.Array.init(BrainAI.AI.GOAP.GOAPStorage.MaxNodes, null, BrainAI.AI.GOAP.GOAPNode);
                this.closed = System.Array.init(BrainAI.AI.GOAP.GOAPStorage.MaxNodes, null, BrainAI.AI.GOAP.GOAPNode);
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            Clear: function () {
                for (var i = 0; i < this.numOpened; i = (i + 1) | 0) {
                    this.opened[System.Array.index(i, this.opened)] = null;
                }

                for (var i1 = 0; i1 < this.numClosed; i1 = (i1 + 1) | 0) {
                    this.closed[System.Array.index(i1, this.closed)] = null;
                }

                this.numOpened = (this.numClosed = 0);
                this.lastFoundClosed = (this.lastFoundOpened = 0);
            },
            FindOpened: function (node) {
                for (var i = 0; i < this.numOpened; i = (i + 1) | 0) {
                    var care = node.WorldState.DontCare.xor(System.Int64(-1));
                    if ((node.WorldState.Values.and(care)).equals((this.opened[System.Array.index(i, this.opened)].WorldState.Values.and(care)))) {
                        this.lastFoundClosed = i;
                        return this.closed[System.Array.index(i, this.closed)];
                    }
                }
                return null;
            },
            FindClosed: function (node) {
                for (var i = 0; i < this.numClosed; i = (i + 1) | 0) {
                    var care = node.WorldState.DontCare.xor(System.Int64(-1));
                    if ((node.WorldState.Values.and(care)).equals((this.closed[System.Array.index(i, this.closed)].WorldState.Values.and(care)))) {
                        this.lastFoundClosed = i;
                        return this.closed[System.Array.index(i, this.closed)];
                    }
                }
                return null;
            },
            HasOpened: function () {
                return this.numOpened > 0;
            },
            RemoveOpened: function (node) {
                if (this.numOpened > 0) {
                    this.opened[System.Array.index(this.lastFoundOpened, this.opened)] = this.opened[System.Array.index(((this.numOpened - 1) | 0), this.opened)];
                }
                this.numOpened = (this.numOpened - 1) | 0;
            },
            RemoveClosed: function (node) {
                if (this.numClosed > 0) {
                    this.closed[System.Array.index(this.lastFoundClosed, this.closed)] = this.closed[System.Array.index(((this.numClosed - 1) | 0), this.closed)];
                }
                this.numClosed = (this.numClosed - 1) | 0;
            },
            IsOpen: function (node) {
                return System.Array.indexOfT(this.opened, node) > -1;
            },
            IsClosed: function (node) {
                return System.Array.indexOfT(this.closed, node) > -1;
            },
            AddToOpenList: function (node) {
                this.opened[System.Array.index(Bridge.identity(this.numOpened, (this.numOpened = (this.numOpened + 1) | 0)), this.opened)] = node;
            },
            AddToClosedList: function (node) {
                this.closed[System.Array.index(Bridge.identity(this.numClosed, (this.numClosed = (this.numClosed + 1) | 0)), this.closed)] = node;
            },
            RemoveCheapestOpenNode: function () {
                var lowestVal = 2147483647;
                this.lastFoundOpened = -1;
                for (var i = 0; i < this.numOpened; i = (i + 1) | 0) {
                    if (this.opened[System.Array.index(i, this.opened)].CostSoFarAndHeuristicCost < lowestVal) {
                        lowestVal = this.opened[System.Array.index(i, this.opened)].CostSoFarAndHeuristicCost;
                        this.lastFoundOpened = i;
                    }
                }
                var val = this.opened[System.Array.index(this.lastFoundOpened, this.opened)];
                this.RemoveOpened(val);

                return val;
            }
        }
    });

    Bridge.define("BrainAI.AI.GOAP.GOAPWorld", {
        statics: {
            fields: {
                Storage: null
            },
            ctors: {
                init: function () {
                    this.Storage = new BrainAI.AI.GOAP.GOAPStorage();
                }
            },
            methods: {
                /**
                 * Make a plan of actions that will reach desired world state
                 *
                 * @static
                 * @public
                 * @this BrainAI.AI.GOAP.GOAPWorld
                 * @memberof BrainAI.AI.GOAP.GOAPWorld
                 * @param   {BrainAI.AI.GOAP.ActionPlanner}         ap               Ap.
                 * @param   {BrainAI.AI.GOAP.WorldState}            start            Start.
                 * @param   {BrainAI.AI.GOAP.WorldState}            goal             Goal.
                 * @param   {System.Collections.Generic.List$1}     selectedNodes    Storage.
                 * @return  {System.Collections.Generic.Stack$1}
                 */
                Plan: function (ap, start, goal, selectedNodes) {
                    var $t;
                    if (selectedNodes === void 0) { selectedNodes = null; }
                    BrainAI.AI.GOAP.GOAPWorld.Storage.Clear();

                    var currentNode = new BrainAI.AI.GOAP.GOAPNode();
                    currentNode.WorldState = start.$clone();
                    currentNode.ParentWorldState = start.$clone();
                    currentNode.CostSoFar = 0; // g
                    currentNode.HeuristicCost = BrainAI.AI.GOAP.GOAPWorld.CalculateHeuristic(start.$clone(), goal.$clone()); // h
                    currentNode.CostSoFarAndHeuristicCost = (currentNode.CostSoFar + currentNode.HeuristicCost) | 0; // f
                    currentNode.Depth = 1;

                    BrainAI.AI.GOAP.GOAPWorld.Storage.AddToOpenList(currentNode);

                    while (true) {
                        // nothing left open so we failed to find a path
                        if (!BrainAI.AI.GOAP.GOAPWorld.Storage.HasOpened()) {
                            BrainAI.AI.GOAP.GOAPWorld.Storage.Clear();
                            return null;
                        }

                        currentNode = BrainAI.AI.GOAP.GOAPWorld.Storage.RemoveCheapestOpenNode();

                        BrainAI.AI.GOAP.GOAPWorld.Storage.AddToClosedList(currentNode);

                        // all done. we reached our goal
                        if (goal.equalsT(currentNode.WorldState.$clone())) {
                            var plan = BrainAI.AI.GOAP.GOAPWorld.ReconstructPlan(currentNode, selectedNodes);
                            BrainAI.AI.GOAP.GOAPWorld.Storage.Clear();
                            return plan;
                        }

                        var neighbors = ap.GetPossibleTransitions(currentNode.WorldState.$clone());
                        for (var i = 0; i < neighbors.Count; i = (i + 1) | 0) {
                            var cur = neighbors.getItem(i);
                            var opened = BrainAI.AI.GOAP.GOAPWorld.Storage.FindOpened(cur);
                            var closed = BrainAI.AI.GOAP.GOAPWorld.Storage.FindClosed(cur);
                            var cost = (currentNode.CostSoFar + cur.CostSoFar) | 0;

                            // if neighbor in OPEN and cost less than g(neighbor):
                            if (opened != null && cost < opened.CostSoFar) {
                                // remove neighbor from OPEN, because new path is better
                                BrainAI.AI.GOAP.GOAPWorld.Storage.RemoveOpened(opened);
                                opened = null;
                            }

                            // if neighbor in CLOSED and cost less than g(neighbor):
                            if (closed != null && cost < closed.CostSoFar) {
                                // remove neighbor from CLOSED
                                BrainAI.AI.GOAP.GOAPWorld.Storage.RemoveClosed(closed);
                            }

                            // if neighbor not in OPEN and neighbor not in CLOSED:
                            if (opened == null && closed == null) {
                                var nb = ($t = new BrainAI.AI.GOAP.GOAPNode(), $t.WorldState = cur.WorldState.$clone(), $t.CostSoFar = cost, $t.HeuristicCost = BrainAI.AI.GOAP.GOAPWorld.CalculateHeuristic(cur.WorldState.$clone(), goal.$clone()), $t.Action = cur.Action, $t.ParentWorldState = currentNode.WorldState.$clone(), $t.Parent = currentNode, $t.Depth = ((currentNode.Depth + 1) | 0), $t);
                                nb.CostSoFarAndHeuristicCost = (nb.CostSoFar + nb.HeuristicCost) | 0;
                                BrainAI.AI.GOAP.GOAPWorld.Storage.AddToOpenList(nb);
                            }
                        }
                    }
                },
                /**
                 * internal function to reconstruct the plan by tracing from last node to initial node
                 *
                 * @static
                 * @private
                 * @this BrainAI.AI.GOAP.GOAPWorld
                 * @memberof BrainAI.AI.GOAP.GOAPWorld
                 * @param   {BrainAI.AI.GOAP.GOAPNode}              goalNode         
                 * @param   {System.Collections.Generic.List$1}     selectedNodes
                 * @return  {System.Collections.Generic.Stack$1}                     The plan.
                 */
                ReconstructPlan: function (goalNode, selectedNodes) {
                    var totalActionsInPlan = (goalNode.Depth - 1) | 0;
                    var plan = new (System.Collections.Generic.Stack$1(BrainAI.AI.GOAP.GOAPAction)).$ctor2(totalActionsInPlan);

                    var curnode = goalNode;
                    for (var i = 0; i <= ((totalActionsInPlan - 1) | 0); i = (i + 1) | 0) {
                        // optionally add the node to the List if we have been passed one
                        selectedNodes != null ? selectedNodes.add(curnode.Clone()) : null;
                        plan.Push(curnode.Action);
                        curnode = curnode.Parent;
                    }

                    // our nodes went from the goal back to the start so reverse them
                    selectedNodes != null ? selectedNodes.Reverse() : null;

                    return plan;
                },
                /**
                 * This is our heuristic: estimate for remaining distance is the nr of mismatched atoms that matter.
                 *
                 * @static
                 * @private
                 * @this BrainAI.AI.GOAP.GOAPWorld
                 * @memberof BrainAI.AI.GOAP.GOAPWorld
                 * @param   {BrainAI.AI.GOAP.WorldState}    from    
                 * @param   {BrainAI.AI.GOAP.WorldState}    to
                 * @return  {number}                                The heuristic.
                 */
                CalculateHeuristic: function (from, to) {
                    var care = (to.DontCare.xor(System.Int64(-1)));
                    var diff = (from.Values.and(care)).xor((to.Values.and(care)));
                    var dist = 0;

                    for (var i = 0; i < BrainAI.AI.GOAP.ActionPlanner.MaxConditions; i = (i + 1) | 0) {
                        if ((diff.and((System.Int64(1).shl(i)))).ne(System.Int64(0))) {
                            dist = (dist + 1) | 0;
                        }
                    }
                    return dist;
                }
            }
        }
    });

    Bridge.define("BrainAI.AI.GOAP.WorldState", {
        inherits: function () { return [System.IEquatable$1(BrainAI.AI.GOAP.WorldState)]; },
        $kind: "struct",
        statics: {
            methods: {
                Create: function (planner) {
                    return new BrainAI.AI.GOAP.WorldState.$ctor1(planner, System.Int64(0), System.Int64(-1));
                },
                getDefaultValue: function () { return new BrainAI.AI.GOAP.WorldState(); }
            }
        },
        fields: {
            /**
             * we use a bitmask shifting on the condition index to flip bits
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.WorldState
             * @type System.Int64
             */
            Values: System.Int64(0),
            /**
             * bitmask used to explicitly state false. We need a separate store for negatives because the absence of a value doesnt necessarily mean
             it is false.
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.GOAP.WorldState
             * @type System.Int64
             */
            DontCare: System.Int64(0),
            /**
             * required so that we can get the condition index from the string name
             *
             * @instance
             * @memberof BrainAI.AI.GOAP.WorldState
             * @type BrainAI.AI.GOAP.ActionPlanner
             */
            Planner: null
        },
        alias: ["equalsT", "System$IEquatable$1$BrainAI$AI$GOAP$WorldState$equalsT"],
        ctors: {
            $ctor1: function (planner, values, dontcare) {
                this.$initialize();
                this.Planner = planner;
                this.Values = values;
                this.DontCare = dontcare;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            Set: function (conditionName, value) {
                return this.Set$1(this.Planner.FindConditionNameIndex(conditionName), value);
            },
            Set$1: function (conditionId, value) {
                this.Values = value ? (this.Values.or((System.Int64(1).shl(conditionId)))) : (this.Values.and((System.Int64(1).shl(conditionId)).not()));
                this.DontCare = this.DontCare.xor(System.Int64((1 << conditionId)));
                return true;
            },
            equalsT: function (other) {
                var care = this.DontCare.xor(System.Int64(-1));
                return (this.Values.and(care)).equals((other.Values.and(care)));
            },
            /**
             * for debugging purposes. Provides a human readable string of all the preconditions.
             *
             * @instance
             * @public
             * @this BrainAI.AI.GOAP.WorldState
             * @memberof BrainAI.AI.GOAP.WorldState
             * @param   {BrainAI.AI.GOAP.ActionPlanner}    planner    Planner.
             * @return  {string}
             */
            Describe: function (planner) {
                var sb = new System.Text.StringBuilder();
                for (var i = 0; i < BrainAI.AI.GOAP.ActionPlanner.MaxConditions; i = (i + 1) | 0) {
                    if ((this.DontCare.and((System.Int64(1).shl(i)))).equals(System.Int64(0))) {
                        var val = planner.ConditionNames[System.Array.index(i, planner.ConditionNames)];
                        if (val == null) {
                            continue;
                        }

                        var set = (this.Values.and((System.Int64(1).shl(i)))).ne(System.Int64(0));

                        if (sb.getLength() > 0) {
                            sb.append(", ");
                        }
                        sb.append(set ? val.toUpperCase() : val);
                    }
                }
                return sb.toString();
            },
            getHashCode: function () {
                var h = Bridge.addHash([3454478383, this.Values, this.DontCare, this.Planner]);
                return h;
            },
            $clone: function (to) {
                var s = to || new BrainAI.AI.GOAP.WorldState();
                s.Values = this.Values;
                s.DontCare = this.DontCare;
                s.Planner = this.Planner;
                return s;
            }
        }
    });

    Bridge.definei("BrainAI.AI.UtilityAI.Actions.IAction$1", function (T) { return {
        $kind: "interface"
    }; });

    /** @namespace BrainAI.AI.UtilityAI.Actions */

    /**
     * Appraisal for use with an ActionWithOptions
     *
     * @abstract
     * @public
     * @class BrainAI.AI.UtilityAI.Actions.IActionOptionAppraisal$2
     */
    Bridge.definei("BrainAI.AI.UtilityAI.Actions.IActionOptionAppraisal$2", function (TU, TV) { return {
        $kind: "interface",
        $variance: [2,2]
    }; });

    /** @namespace BrainAI.AI.UtilityAI.Considerations */

    /**
     * encapsulates an Action and generates a score that a Reasoner can use to decide which Consideration to use
     *
     * @abstract
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.IConsideration$1
     */
    Bridge.definei("BrainAI.AI.UtilityAI.Considerations.IConsideration$1", function (T) { return {
        $kind: "interface"
    }; });

    /** @namespace BrainAI.AI.UtilityAI.Considerations.Appraisals */

    /**
     * scorer for use with a Consideration
     *
     * @abstract
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1
     */
    Bridge.definei("BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1", function (T) { return {
        $kind: "interface"
    }; });

    /** @namespace BrainAI.AI.UtilityAI.Reasoners */

    /**
     * the root of UtilityAI.
     *
     * @abstract
     * @public
     * @class BrainAI.AI.UtilityAI.Reasoners.Reasoner$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Reasoners.Reasoner$1", function (T) { return {
        fields: {
            DefaultConsideration: null,
            Considerations: null
        },
        ctors: {
            init: function () {
                this.DefaultConsideration = new (BrainAI.AI.UtilityAI.Considerations.FixedScoreConsideration$1(T))();
                this.Considerations = new (System.Collections.Generic.List$1(BrainAI.AI.UtilityAI.Considerations.IConsideration$1(T))).ctor();
            }
        },
        methods: {
            Select: function (context) {
                var consideration = this.SelectBestConsideration(context);
                return consideration != null ? consideration["BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$Action"] : null;
            },
            AddConsideration: function (consideration) {
                this.Considerations.add(consideration);
                return this;
            },
            SetDefaultConsideration: function (defaultConsideration) {
                this.DefaultConsideration = defaultConsideration;
                return this;
            }
        }
    }; });

    Bridge.define("BrainAI.InfluenceMap.Fading.IFading", {
        $kind: "interface"
    });

    Bridge.define("BrainAI.InfluenceMap.Fading.DefaultFadings", {
        statics: {
            fields: {
                NoDistanceFading: null,
                LinearDistanceFading: null,
                DistanceFading: null,
                QuadDistanceFading: null,
                TripleDistanceFading: null
            },
            ctors: {
                init: function () {
                    this.NoDistanceFading = new BrainAI.InfluenceMap.Fading.NoDistanceFading();
                    this.LinearDistanceFading = new BrainAI.InfluenceMap.Fading.LinearDistanceFading(1);
                    this.DistanceFading = new BrainAI.InfluenceMap.Fading.NPowDistanceFading(1);
                    this.QuadDistanceFading = new BrainAI.InfluenceMap.Fading.NPowDistanceFading(2);
                    this.TripleDistanceFading = new BrainAI.InfluenceMap.Fading.NPowDistanceFading(3);
                }
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.MatrixInfluenceMap", {
        fields: {
            Map: null
        },
        ctors: {
            ctor: function (width, height) {
                this.$initialize();
                this.Map = System.Array.create(0, null, System.Single, width, height);
            }
        },
        methods: {
            AddCharge: function (origin, fading, value) {
                var atPosition = new BrainAI.Pathfinding.Point.ctor();
                for (var x = 0; x < System.Array.getLength(this.Map, 0); x = (x + 1) | 0) {
                    for (var y = 0; y < System.Array.getLength(this.Map, 1); y = (y + 1) | 0) {
                        atPosition.X = x;
                        atPosition.Y = y;
                        var vector = origin.BrainAI$InfluenceMap$VectorGenerator$IChargeOrigin$GetVector(atPosition.$clone());
                        this.Map.set([atPosition.X, atPosition.Y],this.Map.get([atPosition.X, atPosition.Y]) +(fading.BrainAI$InfluenceMap$Fading$IFading$GetPower(((Math.abs(vector.X) + Math.abs(vector.Y)) | 0), value)));
                    }
                }
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.VectorGenerator.IChargeOrigin", {
        $kind: "interface"
    });

    Bridge.define("BrainAI.InfluenceMap.VectorInfluenceMap", {
        fields: {
            Charges: null
        },
        ctors: {
            init: function () {
                this.Charges = new (System.Collections.Generic.List$1(BrainAI.InfluenceMap.VectorInfluenceMap.Charge)).ctor();
            }
        },
        methods: {
            FindForceDirection: function (atPosition) {
                var $t;
                var result = new BrainAI.Pathfinding.Point.ctor();
                $t = Bridge.getEnumerator(this.Charges);
                try {
                    while ($t.moveNext()) {
                        var charge = $t.Current;
                        var vector = charge.Origin.BrainAI$InfluenceMap$VectorGenerator$IChargeOrigin$GetVector(atPosition.$clone());
                        var force = charge.Fading.BrainAI$InfluenceMap$Fading$IFading$GetForce(vector.$clone(), charge.Value);
                        result.X = (result.X - force.X) | 0;
                        result.Y = (result.Y - force.Y) | 0;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return result.$clone();
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.VectorInfluenceMap.Charge", {
        $kind: "nested class",
        fields: {
            Name: null,
            Value: 0,
            Origin: null,
            Fading: null
        },
        methods: {
            toString: function () {
                var $t;
                return System.String.format("{0} at {1} with {2}", ($t = this.Name, $t != null ? $t : "Charge"), this.Origin, Bridge.box(this.Value, System.Single, System.Single.format, System.Single.getHashCode));
            }
        }
    });

    /** @namespace BrainAI.Pathfinding.BreadthFirst */

    /**
     * interface for a graph that can be fed to the BreadthFirstPathfinder.search method
     *
     * @abstract
     * @public
     * @class BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1
     */
    Bridge.definei("BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1", function (T) { return {
        $kind: "interface"
    }; });

    /** @namespace BrainAI.Pathfinding.AStar */

    /**
     * calculates paths given an IAstarGraph and start/goal positions
     *
     * @static
     * @abstract
     * @public
     * @class BrainAI.Pathfinding.AStar.AStarPathfinder
     */
    Bridge.define("BrainAI.Pathfinding.AStar.AStarPathfinder", {
        statics: {
            methods: {
                Search: function (T, graph, start, goal, cameFrom) {
                    var $t;
                    var foundPath = false;
                    cameFrom.v = function (_o1) {
                            _o1.add(start, start);
                            return _o1;
                        }(new (System.Collections.Generic.Dictionary$2(T,T))());

                    var costSoFar = new (System.Collections.Generic.Dictionary$2(T,System.Int32))();
                    var frontier = function (_o2) {
                            _o2.add({ Item1: 0, Item2: start });
                            return _o2;
                        }(new (System.Collections.Generic.List$1(System.Tuple$2(System.Int32,T))).ctor());

                    costSoFar.set(start, 0);

                    while (frontier.Count > 0) {
                        var current = frontier.getItem(0);
                        frontier.removeAt(0);

                        if (Bridge.equals(current.Item2, goal)) {
                            foundPath = true;
                            break;
                        }

                        $t = Bridge.getEnumerator(graph["BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$" + Bridge.getTypeAlias(T) + "$GetNeighbors"](current.Item2), T);
                        try {
                            while ($t.moveNext()) {
                                var next = $t.Current;
                                var newCost = (costSoFar.get(current.Item2) + graph["BrainAI$Pathfinding$Dijkstra$IWeightedGraph$1$" + Bridge.getTypeAlias(T) + "$Cost"](current.Item2, next)) | 0;
                                if (!costSoFar.containsKey(next) || newCost < costSoFar.get(next)) {
                                    costSoFar.set(next, newCost);
                                    var priority = (newCost + graph["BrainAI$Pathfinding$AStar$IAstarGraph$1$" + Bridge.getTypeAlias(T) + "$Heuristic"](next, goal)) | 0;
                                    frontier.add({ Item1: priority, Item2: next });
                                    cameFrom.v.set(next, current.Item2);
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }

                        frontier.Sort$1(new (BrainAI.Pathfinding.Utils.TupleComparer$1(T))());
                    }

                    return foundPath;
                },
                /**
                 * gets a path from start to goal if possible. If no path is found null is returned.
                 *
                 * @static
                 * @public
                 * @this BrainAI.Pathfinding.AStar.AStarPathfinder
                 * @memberof BrainAI.Pathfinding.AStar.AStarPathfinder
                 * @param   {Function}                                   T        The 1st type parameter.
                 * @param   {BrainAI.Pathfinding.AStar.IAstarGraph$1}    graph    Graph.
                 * @param   {T}                                          start    Start.
                 * @param   {T}                                          goal     Goal.
                 * @return  {System.Collections.Generic.List$1}
                 */
                Search$1: function (T, graph, start, goal) {
                    var cameFrom = { };
                    var foundPath = BrainAI.Pathfinding.AStar.AStarPathfinder.Search(T, graph, start, goal, cameFrom);
                    return foundPath ? BrainAI.Pathfinding.PathConstructor.RecontructPath(T, cameFrom.v, start, goal) : null;
                }
            }
        }
    });

    /**
     * calculates paths given an IUnweightedGraph and start/goal positions
     *
     * @static
     * @abstract
     * @public
     * @class BrainAI.Pathfinding.BreadthFirst.BreadthFirstPathfinder
     */
    Bridge.define("BrainAI.Pathfinding.BreadthFirst.BreadthFirstPathfinder", {
        statics: {
            methods: {
                Search: function (T, graph, start, goal, cameFrom) {
                    var $t;
                    var foundPath = false;
                    var frontier = new (System.Collections.Generic.Queue$1(T)).ctor();
                    frontier.Enqueue(start);

                    cameFrom.v = new (System.Collections.Generic.Dictionary$2(T,T))();
                    cameFrom.v.add(start, start);

                    while (frontier.Count > 0) {
                        var current = frontier.Dequeue();
                        if (Bridge.equals(current, goal)) {
                            foundPath = true;
                            break;
                        }

                        $t = Bridge.getEnumerator(graph["BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$" + Bridge.getTypeAlias(T) + "$GetNeighbors"](current), T);
                        try {
                            while ($t.moveNext()) {
                                var next = $t.Current;
                                if (!cameFrom.v.containsKey(next)) {
                                    frontier.Enqueue(next);
                                    cameFrom.v.add(next, current);
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                    }

                    return foundPath;
                },
                Search$2: function (T, graph, start, goal) {
                    var cameFrom = { };
                    var foundPath = BrainAI.Pathfinding.BreadthFirst.BreadthFirstPathfinder.Search(T, graph, start, goal, cameFrom);
                    return foundPath ? BrainAI.Pathfinding.PathConstructor.RecontructPath(T, cameFrom.v, start, goal) : null;
                },
                Search$1: function (T, graph, start, goals, cameFrom) {
                    var $t;
                    var foundPath = false;
                    var frontier = new (System.Collections.Generic.Queue$1(T)).ctor();
                    frontier.Enqueue(start);

                    cameFrom.v = new (System.Collections.Generic.Dictionary$2(T,T))();
                    cameFrom.v.add(start, start);

                    while (frontier.Count > 0) {
                        var current = frontier.Dequeue();
                        if (goals.contains(current)) {
                            foundPath = true;
                            break;
                        }

                        $t = Bridge.getEnumerator(graph["BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$" + Bridge.getTypeAlias(T) + "$GetNeighbors"](current), T);
                        try {
                            while ($t.moveNext()) {
                                var next = $t.Current;
                                if (!cameFrom.v.containsKey(next)) {
                                    frontier.Enqueue(next);
                                    cameFrom.v.add(next, current);
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                    }

                    return foundPath;
                },
                Search$3: function (T, graph, start, goals) {
                    var $t;
                    var cameFrom = { };
                    var foundPath = BrainAI.Pathfinding.BreadthFirst.BreadthFirstPathfinder.Search$1(T, graph, start, goals, cameFrom);
                    if (!foundPath) {
                        return null;
                    }

                    $t = Bridge.getEnumerator(goals);
                    try {
                        while ($t.moveNext()) {
                            var goal = $t.Current;
                            if (cameFrom.v.containsKey(goal)) {
                                return BrainAI.Pathfinding.PathConstructor.RecontructPath(T, cameFrom.v, start, goal);
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    return null;
                },
                Search$4: function (T, graph, start, length, cameFrom) {
                    var $t;
                    var frontier = new (System.Collections.Generic.Queue$1(T)).ctor();
                    frontier.Enqueue(start);

                    cameFrom.v = new (System.Collections.Generic.Dictionary$2(T,T))();
                    cameFrom.v.add(start, start);

                    var forNextLevel = 1;

                    while (frontier.Count > 0) {
                        var current = frontier.Dequeue();

                        $t = Bridge.getEnumerator(graph["BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$" + Bridge.getTypeAlias(T) + "$GetNeighbors"](current), T);
                        try {
                            while ($t.moveNext()) {
                                var next = $t.Current;
                                if (!cameFrom.v.containsKey(next)) {
                                    frontier.Enqueue(next);
                                    cameFrom.v.add(next, current);
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }

                        forNextLevel = (forNextLevel - 1) | 0;
                        if (forNextLevel === 0) {
                            forNextLevel = frontier.Count;
                            length = (length - 1) | 0;

                            if (length === 0) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    /** @namespace BrainAI.Pathfinding.Dijkstra */

    /**
     * calculates paths given an IWeightedGraph and start/goal positions
     *
     * @static
     * @abstract
     * @public
     * @class BrainAI.Pathfinding.Dijkstra.WeightedPathfinder
     */
    Bridge.define("BrainAI.Pathfinding.Dijkstra.WeightedPathfinder", {
        statics: {
            methods: {
                Search: function (T, graph, start, goal, cameFrom) {
                    var $t;
                    var foundPath = false;
                    cameFrom.v = new (System.Collections.Generic.Dictionary$2(T,T))();
                    cameFrom.v.add(start, start);

                    var costSoFar = new (System.Collections.Generic.Dictionary$2(T,System.Int32))();
                    var frontier = function (_o1) {
                            _o1.add({ Item1: 0, Item2: start });
                            return _o1;
                        }(new (System.Collections.Generic.List$1(System.Tuple$2(System.Int32,T))).ctor());

                    costSoFar.set(start, 0);

                    while (frontier.Count > 0) {
                        var current = frontier.getItem(0);
                        frontier.removeAt(0);

                        if (Bridge.equals(current.Item2, goal)) {
                            foundPath = true;
                            break;
                        }

                        $t = Bridge.getEnumerator(graph["BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$" + Bridge.getTypeAlias(T) + "$GetNeighbors"](current.Item2), T);
                        try {
                            while ($t.moveNext()) {
                                var next = $t.Current;
                                var newCost = (costSoFar.get(current.Item2) + graph["BrainAI$Pathfinding$Dijkstra$IWeightedGraph$1$" + Bridge.getTypeAlias(T) + "$Cost"](current.Item2, next)) | 0;
                                if (!costSoFar.containsKey(next) || newCost < costSoFar.get(next)) {
                                    costSoFar.set(next, newCost);
                                    var priority = newCost;
                                    frontier.add({ Item1: priority, Item2: next });
                                    cameFrom.v.set(next, current.Item2);
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }

                        frontier.Sort$1(new (BrainAI.Pathfinding.Utils.TupleComparer$1(T))());
                    }

                    return foundPath;
                },
                /**
                 * gets a path from start to goal if possible. If no path is found null is returned.
                 *
                 * @static
                 * @public
                 * @this BrainAI.Pathfinding.Dijkstra.WeightedPathfinder
                 * @memberof BrainAI.Pathfinding.Dijkstra.WeightedPathfinder
                 * @param   {Function}                                         T        The 1st type parameter.
                 * @param   {BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1}    graph    Graph.
                 * @param   {T}                                                start    Start.
                 * @param   {T}                                                goal     Goal.
                 * @return  {System.Collections.Generic.List$1}
                 */
                Search$1: function (T, graph, start, goal) {
                    var cameFrom = { };
                    var foundPath = BrainAI.Pathfinding.Dijkstra.WeightedPathfinder.Search(T, graph, start, goal, cameFrom);
                    return foundPath ? BrainAI.Pathfinding.PathConstructor.RecontructPath(T, cameFrom.v, start, goal) : null;
                }
            }
        }
    });

    Bridge.define("BrainAI.Pathfinding.PathConstructor", {
        statics: {
            methods: {
                RecontructPath: function (T, cameFrom, start, goal) {
                    var path = new (System.Collections.Generic.List$1(T)).ctor();
                    var current = goal;
                    path.add(goal);

                    while (!Bridge.equals(current, start)) {
                        current = cameFrom.get(current);
                        path.add(current);
                    }
                    path.Reverse();

                    return path;
                }
            }
        }
    });

    Bridge.define("BrainAI.Pathfinding.Utils.TupleComparer$1", function (T) { return {
        inherits: [System.Collections.Generic.IComparer$1(System.Tuple$2(System.Int32,T))],
        alias: ["compare", ["System$Collections$Generic$IComparer$1$System$Tuple$2$System$Int32$" + Bridge.getTypeAlias(T) + "$compare", "System$Collections$Generic$IComparer$1$compare"]],
        methods: {
            compare: function (x, y) {
                return ((x.Item1 - y.Item1) | 0);
            }
        }
    }; });

    /** @namespace BrainAI.AI.BehaviorTrees.Actions */

    /**
     * runs an entire BehaviorTree as a child and returns success
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Actions.BehaviorTreeReference$1
     * @augments BrainAI.AI.BehaviorTrees.Behavior$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Actions.BehaviorTreeReference$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Behavior$1(T)],
        fields: {
            childTree: null
        },
        ctors: {
            ctor: function (tree) {
                this.$initialize();
                BrainAI.AI.BehaviorTrees.Behavior$1(T).ctor.call(this);
                this.childTree = tree;
            }
        },
        methods: {
            Update: function (context) {
                this.childTree.Tick();
                return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
            }
        }
    }; });

    /**
     * wraps a Func so that you can avoid having to subclass to create new actions
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Actions.ExecuteAction$1
     * @augments BrainAI.AI.BehaviorTrees.Behavior$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Actions.ExecuteAction$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Behavior$1(T)],
        fields: {
            action: null
        },
        ctors: {
            ctor: function (action) {
                this.$initialize();
                BrainAI.AI.BehaviorTrees.Behavior$1(T).ctor.call(this);
                this.action = action;
            }
        },
        methods: {
            Update: function (context) {
                return this.action(context);
            }
        }
    }; });

    /**
     * root class used to control a BehaviorTree. Handles storing the context
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.BehaviorTree$1
     * @implements  BrainAI.AI.IAITurn
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.BehaviorTree$1", function (T) { return {
        inherits: [BrainAI.AI.IAITurn],
        fields: {
            /**
             * The context should contain all the data needed to run the tree
             *
             * @instance
             * @private
             * @readonly
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTree$1
             * @type T
             */
            context: Bridge.getDefaultValue(T),
            /**
             * root node of the tree
             *
             * @instance
             * @private
             * @readonly
             * @memberof BrainAI.AI.BehaviorTrees.BehaviorTree$1
             * @type BrainAI.AI.BehaviorTrees.Behavior$1
             */
            root: null
        },
        alias: ["Tick", "BrainAI$AI$IAITurn$Tick"],
        ctors: {
            ctor: function (context, rootNode) {
                this.$initialize();
                this.context = context;
                this.root = rootNode;
            }
        },
        methods: {
            Tick: function () {
                this.root.Tick(this.context);
            }
        }
    }; });

    /** @namespace BrainAI.AI.BehaviorTrees.Composites */

    /**
     * any Composite nodes must subclass this. Provides storage for children and helpers to deal with AbortTypes
     *
     * @abstract
     * @public
     * @class BrainAI.AI.BehaviorTrees.Composites.Composite$1
     * @augments BrainAI.AI.BehaviorTrees.Behavior$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.Composite$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Behavior$1(T)],
        statics: {
            methods: {
                /**
                 * helper that gets the TaskStatus of either a Conditional or a ConditionalDecorator
                 *
                 * @static
                 * @private
                 * @this BrainAI.AI.BehaviorTrees.Composites.Composite$1
                 * @memberof BrainAI.AI.BehaviorTrees.Composites.Composite$1
                 * @param   {T}                                      context    Context.
                 * @param   {BrainAI.AI.BehaviorTrees.Behavior$1}    node       Node.
                 * @return  {BrainAI.AI.BehaviorTrees.TaskStatus}               The conditional node.
                 */
                UpdateConditionalNode: function (context, node) {
                    if (Bridge.is(node, BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1(T))) {
                        return (Bridge.as(node, BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1(T))).ExecuteConditional(context, true);
                    } else {
                        return node.Update(context);
                    }
                }
            }
        },
        fields: {
            AbortType: 0,
            Children: null,
            HasLowerPriorityConditionalAbort: false,
            CurrentChildIndex: 0
        },
        ctors: {
            init: function () {
                this.AbortType = BrainAI.AI.BehaviorTrees.Composites.AbortTypes.None;
                this.Children = new (System.Collections.Generic.List$1(BrainAI.AI.BehaviorTrees.Behavior$1(T))).ctor();
            }
        },
        methods: {
            Invalidate: function () {
                BrainAI.AI.BehaviorTrees.Behavior$1(T).prototype.Invalidate.call(this);

                for (var i = 0; i < this.Children.Count; i = (i + 1) | 0) {
                    this.Children.getItem(i).Invalidate();
                }
            },
            OnStart: function () {
                // LowerPriority aborts happen one level down so we check for any here
                this.HasLowerPriorityConditionalAbort = this.HasLowerPriorityConditionalAbortInChildren();
                this.CurrentChildIndex = 0;
            },
            OnEnd: function () {
                // we are done so invalidate our children so they are ready for the next tick
                for (var i = 0; i < this.Children.Count; i = (i + 1) | 0) {
                    this.Children.getItem(i).Invalidate();
                }
            },
            /**
             * adds a child to this Composite
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @memberof BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @param   {BrainAI.AI.BehaviorTrees.Behavior$1}    child    Child.
             * @return  {void}
             */
            AddChild: function (child) {
                this.Children.add(child);
            },
            /**
             * returns true if the first child of a Composite is a Conditional. Usef for dealing with conditional aborts.
             *
             * @instance
             * @public
             * @this BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @memberof BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @return  {boolean}        <pre><code>true</code></pre>, if first child conditional was ised, <pre><code>false</code></pre> otherwise.
             */
            IsFirstChildConditional: function () {
                return Bridge.is(this.Children.getItem(0), BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1(T));
            },
            /**
             * checks the children of the Composite to see if any are a Composite with a LowerPriority AbortType
             *
             * @instance
             * @private
             * @this BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @memberof BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @return  {boolean}        <pre><code>true</code></pre>, if lower priority conditional abort in children was hased, <pre><code>false</code></pre> otherwise.
             */
            HasLowerPriorityConditionalAbortInChildren: function () {
                for (var i = 0; i < this.Children.Count; i = (i + 1) | 0) {
                    // check for a Composite with an abortType set
                    var composite = Bridge.as(this.Children.getItem(i), BrainAI.AI.BehaviorTrees.Composites.Composite$1(T));
                    if (composite != null && BrainAI.AI.BehaviorTrees.Composites.AbortTypesExt.Has(composite.AbortType, BrainAI.AI.BehaviorTrees.Composites.AbortTypes.LowerPriority)) {
                        // now make sure the first child is a Conditional
                        if (composite.IsFirstChildConditional()) {
                            return true;
                        }
                    }
                }

                return false;
            },
            /**
             * checks any child Composites that have a LowerPriority AbortType and a Conditional as the first child. If it finds one it will tick
             the Conditional and if the status is not equal to statusCheck the _currentChildIndex will be updated, ie the currently running
             Action will be aborted.
             *
             * @instance
             * @protected
             * @this BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @memberof BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @param   {T}                                      context        Context.
             * @param   {BrainAI.AI.BehaviorTrees.TaskStatus}    statusCheck    Status check.
             * @return  {void}
             */
            UpdateLowerPriorityAbortConditional: function (context, statusCheck) {
                // check any lower priority tasks to see if they changed status
                for (var i = 0; i < this.CurrentChildIndex; i = (i + 1) | 0) {
                    var composite = Bridge.as(this.Children.getItem(i), BrainAI.AI.BehaviorTrees.Composites.Composite$1(T));
                    if (composite != null && BrainAI.AI.BehaviorTrees.Composites.AbortTypesExt.Has(composite.AbortType, BrainAI.AI.BehaviorTrees.Composites.AbortTypes.LowerPriority)) {
                        // now we get the status of only the Conditional (update instead of tick) to see if it changed taking care with ConditionalDecorators
                        var child = composite.Children.getItem(0);
                        var status = BrainAI.AI.BehaviorTrees.Composites.Composite$1(T).UpdateConditionalNode(context, child);
                        if (status !== statusCheck) {
                            this.CurrentChildIndex = i;

                            // we have an abort so we invalidate the children so they get reevaluated
                            for (var j = i; j < this.Children.Count; j = (j + 1) | 0) {
                                this.Children.getItem(j).Invalidate();
                            }
                            break;
                        }
                    }
                }
            },
            /**
             * checks any IConditional children to see if they have changed state
             *
             * @instance
             * @protected
             * @this BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @memberof BrainAI.AI.BehaviorTrees.Composites.Composite$1
             * @param   {T}                                      context        Context.
             * @param   {BrainAI.AI.BehaviorTrees.TaskStatus}    statusCheck    Status check.
             * @return  {void}
             */
            UpdateSelfAbortConditional: function (context, statusCheck) {
                // check any IConditional child tasks to see if they changed status
                for (var i = 0; i < this.CurrentChildIndex; i = (i + 1) | 0) {
                    var child = this.Children.getItem(i);
                    if (!(Bridge.is(child, BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1(T)))) {
                        continue;
                    }

                    var status = BrainAI.AI.BehaviorTrees.Composites.Composite$1(T).UpdateConditionalNode(context, child);
                    if (status !== statusCheck) {
                        this.CurrentChildIndex = i;

                        // we have an abort so we invalidate the children so they get reevaluated
                        for (var j = i; j < this.Children.Count; j = (j + 1) | 0) {
                            this.Children.getItem(j).Invalidate();
                        }
                        break;
                    }
                }
            }
        }
    }; });

    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.Decorator$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Behavior$1(T)],
        fields: {
            Child: null
        },
        methods: {
            Invalidate: function () {
                BrainAI.AI.BehaviorTrees.Behavior$1(T).prototype.Invalidate.call(this);
                this.Child.Invalidate();
            }
        }
    }; });

    Bridge.define("BrainAI.AI.FSM.StateMachine$1", function (T) { return {
        inherits: [BrainAI.AI.IAITurn],
        fields: {
            Context: Bridge.getDefaultValue(T),
            states: null
        },
        events: {
            OnStateChanged: null
        },
        props: {
            PreviousState: null,
            CurrentState: null,
            NextState: null
        },
        alias: ["Tick", "BrainAI$AI$IAITurn$Tick"],
        ctors: {
            init: function () {
                this.states = new (System.Collections.Generic.Dictionary$2(Function,BrainAI.AI.FSM.State$1(T)))();
            },
            ctor: function (context, initialState) {
                this.$initialize();
                this.Context = context;

                // setup our initial state
                this.AddState(initialState);
                this.NextState = initialState;
            }
        },
        methods: {
            /**
             * adds the state to the machine
             *
             * @instance
             * @public
             * @this BrainAI.AI.FSM.StateMachine$1
             * @memberof BrainAI.AI.FSM.StateMachine$1
             * @param   {BrainAI.AI.FSM.State$1}    state
             * @return  {void}
             */
            AddState: function (state) {
                state.SetMachineAndContext(this, this.Context);
                this.states.set(Bridge.getType(state), state);
            },
            /**
             * ticks the state machine with the provided delta time
             *
             * @instance
             * @public
             * @this BrainAI.AI.FSM.StateMachine$1
             * @memberof BrainAI.AI.FSM.StateMachine$1
             * @return  {void}
             */
            Tick: function () {
                var $t;
                if (this.NextState != null) {
                    // only call end if we have a currentState
                    ($t = this.CurrentState) != null ? $t.End() : null;

                    // swap states and call begin
                    this.PreviousState = this.CurrentState;
                    this.CurrentState = this.NextState;
                    this.NextState = null;
                    this.CurrentState.Begin();

                    // fire the changed event if we have a listener
                    !Bridge.staticEquals(this.OnStateChanged, null) ? this.OnStateChanged() : null;
                }

                this.CurrentState.Update();
            },
            /**
             * changes the current state
             *
             * @instance
             * @public
             * @this BrainAI.AI.FSM.StateMachine$1
             * @memberof BrainAI.AI.FSM.StateMachine$1
             * @param   {Function}    TR
             * @return  {void}
             */
            ChangeState: function (TR) {
                // avoid changing to the same state
                var newType = TR;
                if (Bridge.referenceEquals(Bridge.getType(this.CurrentState), newType)) {
                    return;
                }

                this.NextState = this.states.get(newType);
            }
        }
    }; });

    /**
     * convenince Action subclass with a typed context. This is useful when an Action requires validation so that it has some way to get
     the data it needs to do the validation.
     *
     * @public
     * @class BrainAI.AI.GOAP.GOAPAction$1
     * @augments BrainAI.AI.GOAP.GOAPAction
     */
    Bridge.define("BrainAI.AI.GOAP.GOAPAction$1", function (T) { return {
        inherits: [BrainAI.AI.GOAP.GOAPAction],
        fields: {
            Context: Bridge.getDefaultValue(T)
        },
        ctors: {
            ctor: function (context, name) {
                this.$initialize();
                BrainAI.AI.GOAP.GOAPAction.$ctor1.call(this, name);
                this.Context = context;
                this.Name = name;
            },
            $ctor1: function (context, name, cost) {
                BrainAI.AI.GOAP.GOAPAction$1(T).ctor.call(this, context, name);
                this.Cost = cost;
            }
        },
        methods: {
            Execute: function () { }
        }
    }; });

    /**
     * wraps an Action for use as an IAction without having to create a new class
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Actions.ActionExecutor$1
     * @implements  BrainAI.AI.UtilityAI.Actions.IAction$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Actions.ActionExecutor$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Actions.IAction$1(T)],
        fields: {
            action: null
        },
        alias: ["Execute", "BrainAI$AI$UtilityAI$Actions$IAction$1$" + Bridge.getTypeAlias(T) + "$Execute"],
        ctors: {
            ctor: function (action) {
                this.$initialize();
                this.action = action;
            }
        },
        methods: {
            Execute: function (context) {
                this.action(context);
            }
        }
    }; });

    /**
     * Action that contains a List of Actions that it will execute sequentially
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Actions.CompositeAction$1
     * @implements  BrainAI.AI.UtilityAI.Actions.IAction$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Actions.CompositeAction$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Actions.IAction$1(T)],
        fields: {
            Actions: null
        },
        alias: ["Execute", "BrainAI$AI$UtilityAI$Actions$IAction$1$" + Bridge.getTypeAlias(T) + "$Execute"],
        ctors: {
            init: function () {
                this.Actions = new (System.Collections.Generic.List$1(BrainAI.AI.UtilityAI.Actions.IAction$1(T))).ctor();
            }
        },
        methods: {
            Execute: function (context) {
                for (var i = 0; i < this.Actions.Count; i = (i + 1) | 0) {
                    this.Actions.getItem(i)["BrainAI$AI$UtilityAI$Actions$IAction$1$" + Bridge.getTypeAlias(T) + "$Execute"](context);
                }
            }
        }
    }; });

    /**
     * Action that calls through to another Reasoner
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Actions.ReasonerAction$1
     * @implements  BrainAI.AI.UtilityAI.Actions.IAction$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Actions.ReasonerAction$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Actions.IAction$1(T)],
        fields: {
            reasoner: null
        },
        alias: ["BrainAI$AI$UtilityAI$Actions$IAction$1$Execute", "BrainAI$AI$UtilityAI$Actions$IAction$1$" + Bridge.getTypeAlias(T) + "$Execute"],
        ctors: {
            ctor: function (reasoner) {
                this.$initialize();
                this.reasoner = reasoner;
            }
        },
        methods: {
            BrainAI$AI$UtilityAI$Actions$IAction$1$Execute: function (context) {
                var action = this.reasoner.Select(context);
                action != null ? action["BrainAI$AI$UtilityAI$Actions$IAction$1$" + Bridge.getTypeAlias(T) + "$Execute"](context) : null;
            }
        }
    }; });

    /** @namespace BrainAI.AI.UtilityAI */

    /**
     * Action that encompasses a List of options. The options are passed to Appraisals which score and locate the best option.
     *
     * @abstract
     * @public
     * @class BrainAI.AI.UtilityAI.ActionWithOptions$2
     * @implements  BrainAI.AI.UtilityAI.Actions.IAction$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.ActionWithOptions$2", function (TU, TV) { return {
        inherits: [BrainAI.AI.UtilityAI.Actions.IAction$1(TU)],
        fields: {
            Appraisals: null
        },
        ctors: {
            init: function () {
                this.Appraisals = new (System.Collections.Generic.List$1(BrainAI.AI.UtilityAI.Actions.IActionOptionAppraisal$2(TU,TV))).ctor();
            }
        },
        methods: {
            GetBestOption: function (context, options) {
                var result = Bridge.getDefaultValue(TV);
                var bestScore = -3.40282347E+38;

                for (var i = 0; i < options.Count; i = (i + 1) | 0) {
                    var option = options.getItem(i);
                    var current = 0.0;
                    for (var j = 0; j < this.Appraisals.Count; j = (j + 1) | 0) {
                        current += this.Appraisals.getItem(j)[Bridge.geti(this.Appraisals.getItem(j), "BrainAI$AI$UtilityAI$Actions$IActionOptionAppraisal$2$" + Bridge.getTypeAlias(TU) + "$" + Bridge.getTypeAlias(TV) + "$GetScore", "BrainAI$AI$UtilityAI$Actions$IActionOptionAppraisal$2$GetScore")](context, option);
                    }

                    if (current > bestScore) {
                        bestScore = current;
                        result = option;
                    }
                }

                return result;
            }
        }
    }; });

    /**
     * Only scores if all child Appraisals score above the threshold
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.AllOrNothingConsideration$1
     * @implements  BrainAI.AI.UtilityAI.Considerations.IConsideration$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Considerations.AllOrNothingConsideration$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Considerations.IConsideration$1(T)],
        fields: {
            Threshold: 0,
            Appraisals: null
        },
        props: {
            Action: null
        },
        alias: [
            "Action", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$Action",
            "GetScore", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"
        ],
        ctors: {
            init: function () {
                this.Appraisals = new (System.Collections.Generic.List$1(BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1(T))).ctor();
            },
            ctor: function (threshold) {
                if (threshold === void 0) { threshold = 0.0; }

                this.$initialize();
                this.Threshold = threshold;
            }
        },
        methods: {
            GetScore: function (context) {
                var sum = 0.0;
                for (var i = 0; i < this.Appraisals.Count; i = (i + 1) | 0) {
                    var score = this.Appraisals.getItem(i)["BrainAI$AI$UtilityAI$Considerations$Appraisals$IAppraisal$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context);
                    if (score < this.Threshold) {
                        return 0;
                    }
                    sum += score;
                }

                return sum;
            }
        }
    }; });

    /**
     * wraps a Func for use as an Appraisal without having to create a subclass
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.Appraisals.ActionAppraisal$1
     * @implements  BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Considerations.Appraisals.ActionAppraisal$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1(T)],
        fields: {
            appraisalAction: null
        },
        alias: ["GetScore", "BrainAI$AI$UtilityAI$Considerations$Appraisals$IAppraisal$1$" + Bridge.getTypeAlias(T) + "$GetScore"],
        ctors: {
            ctor: function (appraisalAction) {
                this.$initialize();
                this.appraisalAction = appraisalAction;
            }
        },
        methods: {
            GetScore: function (context) {
                return this.appraisalAction(context);
            }
        }
    }; });

    /**
     * always returns a fixed score. Serves double duty as a default Consideration.
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.FixedScoreConsideration$1
     * @implements  BrainAI.AI.UtilityAI.Considerations.IConsideration$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Considerations.FixedScoreConsideration$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Considerations.IConsideration$1(T)],
        fields: {
            Score: 0
        },
        props: {
            Action: null
        },
        alias: [
            "Action", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$Action",
            "GetScore", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"
        ],
        ctors: {
            ctor: function (score) {
                if (score === void 0) { score = 1.0; }

                this.$initialize();
                this.Score = score;
            }
        },
        methods: {
            GetScore: function (context) {
                return this.Score;
            }
        }
    }; });

    /**
     * Scores by summing the score of all child Appraisals
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.SumOfChildrenConsideration$1
     * @implements  BrainAI.AI.UtilityAI.Considerations.IConsideration$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Considerations.SumOfChildrenConsideration$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Considerations.IConsideration$1(T)],
        fields: {
            Appraisals: null
        },
        props: {
            Action: null
        },
        alias: [
            "Action", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$Action",
            "GetScore", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"
        ],
        ctors: {
            init: function () {
                this.Appraisals = new (System.Collections.Generic.List$1(BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1(T))).ctor();
            }
        },
        methods: {
            GetScore: function (context) {
                return System.Linq.Enumerable.from(this.Appraisals).sum(function (t) {
                        return t["BrainAI$AI$UtilityAI$Considerations$Appraisals$IAppraisal$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context);
                    });
            }
        }
    }; });

    /**
     * Scores by summing child Appraisals until a child scores below the threshold
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Considerations.ThresholdConsideration$1
     * @implements  BrainAI.AI.UtilityAI.Considerations.IConsideration$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Considerations.ThresholdConsideration$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Considerations.IConsideration$1(T)],
        fields: {
            Threshold: 0,
            Appraisals: null
        },
        props: {
            Action: null
        },
        alias: [
            "Action", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$Action",
            "GetScore", "BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"
        ],
        ctors: {
            init: function () {
                this.Appraisals = new (System.Collections.Generic.List$1(BrainAI.AI.UtilityAI.Considerations.Appraisals.IAppraisal$1(T))).ctor();
            },
            ctor: function (threshold) {
                this.$initialize();
                this.Threshold = threshold;
            }
        },
        methods: {
            GetScore: function (context) {
                var sum = 0.0;
                for (var i = 0; i < this.Appraisals.Count; i = (i + 1) | 0) {
                    var score = this.Appraisals.getItem(i)["BrainAI$AI$UtilityAI$Considerations$Appraisals$IAppraisal$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context);
                    if (score < this.Threshold) {
                        return sum;
                    }
                    sum += score;
                }

                return sum;
            }
        }
    }; });

    /**
     * The first Consideration to score above the score of the Default Consideration is selected
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Reasoners.FirstScoreReasoner$1
     * @augments BrainAI.AI.UtilityAI.Reasoners.Reasoner$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Reasoners.FirstScoreReasoner$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Reasoners.Reasoner$1(T)],
        methods: {
            SelectBestConsideration: function (context) {
                var defaultScore = this.DefaultConsideration["BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context);
                for (var i = 0; i < this.Considerations.Count; i = (i + 1) | 0) {
                    if (this.Considerations.getItem(i)["BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context) >= defaultScore) {
                        return this.Considerations.getItem(i);
                    }
                }

                return this.DefaultConsideration;
            }
        }
    }; });

    /**
     * The Consideration with the highest score is selected
     *
     * @public
     * @class BrainAI.AI.UtilityAI.Reasoners.HighestScoreReasoner$1
     * @augments BrainAI.AI.UtilityAI.Reasoners.Reasoner$1
     */
    Bridge.define("BrainAI.AI.UtilityAI.Reasoners.HighestScoreReasoner$1", function (T) { return {
        inherits: [BrainAI.AI.UtilityAI.Reasoners.Reasoner$1(T)],
        methods: {
            SelectBestConsideration: function (context) {
                var highestScore = this.DefaultConsideration["BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context);
                var consideration = null;
                for (var i = 0; i < this.Considerations.Count; i = (i + 1) | 0) {
                    var score = this.Considerations.getItem(i)["BrainAI$AI$UtilityAI$Considerations$IConsideration$1$" + Bridge.getTypeAlias(T) + "$GetScore"](context);
                    if (score > highestScore) {
                        highestScore = score;
                        consideration = this.Considerations.getItem(i);
                    }
                }

                if (consideration == null) {
                    return this.DefaultConsideration;
                }

                return consideration;
            }
        }
    }; });

    Bridge.define("BrainAI.AI.UtilityAI.UtilityAI$1", function (T) { return {
        inherits: [BrainAI.AI.IAITurn],
        fields: {
            /**
             * The context should contain all the data needed to run the tree
             *
             * @instance
             * @private
             * @readonly
             * @memberof BrainAI.AI.UtilityAI.UtilityAI$1
             * @type T
             */
            context: Bridge.getDefaultValue(T),
            rootReasoner: null
        },
        alias: ["Tick", "BrainAI$AI$IAITurn$Tick"],
        ctors: {
            ctor: function (context, rootSelector) {
                this.$initialize();
                this.rootReasoner = rootSelector;
                this.context = context;
            }
        },
        methods: {
            Tick: function () {
                var action = this.rootReasoner.Select(this.context);
                action != null ? action["BrainAI$AI$UtilityAI$Actions$IAction$1$" + Bridge.getTypeAlias(T) + "$Execute"](this.context) : null;
            }
        }
    }; });

    Bridge.define("BrainAI.InfluenceMap.Fading.ConstantInRadiusFading", {
        inherits: [BrainAI.InfluenceMap.Fading.IFading],
        fields: {
            radius: 0
        },
        alias: [
            "GetForce", "BrainAI$InfluenceMap$Fading$IFading$GetForce",
            "GetPower", "BrainAI$InfluenceMap$Fading$IFading$GetPower"
        ],
        ctors: {
            ctor: function (radius) {
                this.$initialize();
                this.radius = radius;
            }
        },
        methods: {
            GetForce: function (vector, chargeValue) {
                var vectorX = vector.X;
                var vectorY = vector.Y;

                var quadDist = (Bridge.Int.mul(vectorX, vectorX) + Bridge.Int.mul(vectorY, vectorY)) | 0;
                var dist = Math.sqrt(quadDist);
                var affectPower = this.GetPower(dist, chargeValue);

                return new BrainAI.Pathfinding.Point.$ctor1(Bridge.Int.clip32(vector.X / dist * affectPower), Bridge.Int.clip32(vector.Y / dist * affectPower));
            },
            GetPower: function (distance, chargeValue) {
                return distance > this.radius ? 0 : chargeValue;
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.Fading.LinearDistanceFading", {
        inherits: [BrainAI.InfluenceMap.Fading.IFading],
        fields: {
            distanceEffectValue: 0
        },
        alias: [
            "GetForce", "BrainAI$InfluenceMap$Fading$IFading$GetForce",
            "GetPower", "BrainAI$InfluenceMap$Fading$IFading$GetPower"
        ],
        ctors: {
            ctor: function (distanceEffectValue) {
                this.$initialize();
                this.distanceEffectValue = distanceEffectValue;
            }
        },
        methods: {
            GetForce: function (vector, chargeValue) {
                var vectorX = vector.X;
                var vectorY = vector.Y;

                var quadDist = (Bridge.Int.mul(vectorX, vectorX) + Bridge.Int.mul(vectorY, vectorY)) | 0;
                var dist = Math.sqrt(quadDist);
                var affectPower = this.GetPower(dist, chargeValue);

                return new BrainAI.Pathfinding.Point.$ctor1(Bridge.Int.clip32(vectorX / dist * affectPower), Bridge.Int.clip32(vectorY / dist * affectPower));
            },
            GetPower: function (distance, chargeValue) {
                var affectPower;
                if (chargeValue > 0) {
                    affectPower = chargeValue - Math.min(chargeValue, distance * this.distanceEffectValue);
                } else {
                    affectPower = chargeValue + Math.min(-chargeValue, distance * this.distanceEffectValue);
                }

                return affectPower;
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.Fading.NoDistanceFading", {
        inherits: [BrainAI.InfluenceMap.Fading.IFading],
        alias: [
            "GetForce", "BrainAI$InfluenceMap$Fading$IFading$GetForce",
            "GetPower", "BrainAI$InfluenceMap$Fading$IFading$GetPower"
        ],
        methods: {
            GetForce: function (vector, chargeValue) {
                var vectorX = vector.X;
                var vectorY = vector.Y;

                var quadDist = (Bridge.Int.mul(vectorX, vectorX) + Bridge.Int.mul(vectorY, vectorY)) | 0;
                var dist = Math.sqrt(quadDist);
                var affectPower = this.GetPower(dist, chargeValue);

                return new BrainAI.Pathfinding.Point.$ctor1(Bridge.Int.clip32(vectorX / dist * affectPower), Bridge.Int.clip32(vectorY / dist * affectPower));
            },
            GetPower: function (distance, chargeValue) {
                return chargeValue;
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.Fading.NPowDistanceFading", {
        inherits: [BrainAI.InfluenceMap.Fading.IFading],
        fields: {
            pow: 0
        },
        alias: [
            "GetForce", "BrainAI$InfluenceMap$Fading$IFading$GetForce",
            "GetPower", "BrainAI$InfluenceMap$Fading$IFading$GetPower"
        ],
        ctors: {
            ctor: function (pow) {
                this.$initialize();
                this.pow = pow;
            }
        },
        methods: {
            GetForce: function (vector, chargeValue) {
                var vectorX = vector.X;
                var vectorY = vector.Y;

                var quadDist = (Bridge.Int.mul(vectorX, vectorX) + Bridge.Int.mul(vectorY, vectorY)) | 0;
                var dist = Math.sqrt(quadDist);
                var affectPower = this.GetPower(dist, chargeValue);

                return new BrainAI.Pathfinding.Point.$ctor1(Bridge.Int.clip32(vectorX / dist * affectPower), Bridge.Int.clip32(vectorY / dist * affectPower));
            },
            GetPower: function (distance, chargeValue) {
                return chargeValue / Math.pow(distance, this.pow);
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.VectorGenerator.LineChargeOrigin", {
        inherits: [BrainAI.InfluenceMap.VectorGenerator.IChargeOrigin],
        fields: {
            V: null,
            VP: null
        },
        props: {
            P1: null,
            P2: null
        },
        alias: ["GetVector", "BrainAI$InfluenceMap$VectorGenerator$IChargeOrigin$GetVector"],
        ctors: {
            init: function () {
                this.V = new BrainAI.Pathfinding.Point();
                this.VP = new BrainAI.Pathfinding.Point();
                this.P1 = new BrainAI.Pathfinding.Point();
                this.P2 = new BrainAI.Pathfinding.Point();
            },
            ctor: function (p1, p2) {
                this.$initialize();
                this.P1 = p1.$clone();
                this.P2 = p2.$clone();
                this.V = new BrainAI.Pathfinding.Point.$ctor1(((p2.X - p1.X) | 0), ((p2.Y - p1.Y) | 0));
                this.VP = new BrainAI.Pathfinding.Point.$ctor1(this.V.$clone().Y, ((-this.V.$clone().X) | 0));
            }
        },
        methods: {
            GetVector: function (toPoint) {
                var x1 = this.P1.X;
                var y1 = this.P1.Y;
                var x2 = this.P2.X;
                var y2 = this.P2.Y;
                var x3 = toPoint.X;
                var y3 = toPoint.Y;
                var x4 = (toPoint.X + this.VP.$clone().X) | 0;
                var y4 = (toPoint.Y + this.VP.$clone().Y) | 0;

                var length = (((Bridge.Int.mul((((x1 - x2) | 0)), (((y3 - y4) | 0))) - Bridge.Int.mul((((y1 - y2) | 0)), (((x3 - x4) | 0)))) | 0));
                var x, y;
                if (Math.abs(length) < 1E-06) {
                    x = this.P1.X;
                    y = this.P1.Y;
                } else {
                    x = (Bridge.Int.div((((Bridge.Int.mul((((Bridge.Int.mul(x1, y2) - Bridge.Int.mul(y1, x2)) | 0)), (((x3 - x4) | 0))) - Bridge.Int.mul((((x1 - x2) | 0)), (((Bridge.Int.mul(x3, y4) - Bridge.Int.mul(y3, x4)) | 0)))) | 0)), length)) | 0;
                    y = (Bridge.Int.div((((Bridge.Int.mul((((Bridge.Int.mul(x1, y2) - Bridge.Int.mul(y1, x2)) | 0)), (((y3 - y4) | 0))) - Bridge.Int.mul((((y1 - y2) | 0)), (((Bridge.Int.mul(x3, y4) - Bridge.Int.mul(y3, x4)) | 0)))) | 0)), length)) | 0;
                }

                return new BrainAI.Pathfinding.Point.$ctor1(((toPoint.X - Bridge.Int.clip32(x)) | 0), ((toPoint.Y - Bridge.Int.clip32(y)) | 0));
            },
            toString: function () {
                return System.String.format("Line ({0} - {1})", this.P1.$clone(), this.P2.$clone());
            }
        }
    });

    Bridge.define("BrainAI.InfluenceMap.VectorGenerator.PointChargeOrigin", {
        inherits: [BrainAI.InfluenceMap.VectorGenerator.IChargeOrigin],
        props: {
            FromPoint: null
        },
        alias: ["GetVector", "BrainAI$InfluenceMap$VectorGenerator$IChargeOrigin$GetVector"],
        ctors: {
            init: function () {
                this.FromPoint = new BrainAI.Pathfinding.Point();
            },
            ctor: function (fromPoint) {
                this.$initialize();
                this.FromPoint = fromPoint.$clone();
            }
        },
        methods: {
            GetVector: function (toPoint) {
                var vectorX = (toPoint.X - this.FromPoint.X) | 0;
                var vectorY = (toPoint.Y - this.FromPoint.Y) | 0;
                return new BrainAI.Pathfinding.Point.$ctor1(vectorX, vectorY);
            },
            toString: function () {
                return System.String.format("Point {0}", [this.FromPoint.$clone()]);
            }
        }
    });

    /**
     * interface for a graph that can be fed to the DijkstraPathfinder.search method
     *
     * @abstract
     * @public
     * @class BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1
     * @implements  BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1
     */
    Bridge.definei("BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1", function (T) { return {
        inherits: [BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1(T)],
        $kind: "interface"
    }; });

    Bridge.define("BrainAI.Pathfinding.Point", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new BrainAI.Pathfinding.Point(); }
            }
        },
        props: {
            X: 0,
            Y: 0
        },
        ctors: {
            $ctor1: function (x, y) {
                this.$initialize();
                this.X = x;
                this.Y = y;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            toString: function () {
                return System.String.format("{0}: {1}, {2}: {3}", "X", Bridge.box(this.X, System.Int32), "Y", Bridge.box(this.Y, System.Int32));
            },
            getHashCode: function () {
                var h = Bridge.addHash([1852403652, this.X, this.Y]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, BrainAI.Pathfinding.Point)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y);
            },
            $clone: function (to) {
                var s = to || new BrainAI.Pathfinding.Point();
                s.X = this.X;
                s.Y = this.Y;
                return s;
            }
        }
    });

    /**
     * basic implementation of an UnweightedGraph. All edges are cached. This type of graph is best suited for non-grid based graphs.
     Any nodes added as edges must also have an entry as the key in the edges Dictionary.
     *
     * @public
     * @class BrainAI.Pathfinding.BreadthFirst.UnweightedGraph$1
     * @implements  BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1
     */
    Bridge.define("BrainAI.Pathfinding.BreadthFirst.UnweightedGraph$1", function (T) { return {
        inherits: [BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1(T)],
        fields: {
            Edges: null
        },
        alias: ["GetNeighbors", "BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$" + Bridge.getTypeAlias(T) + "$GetNeighbors"],
        ctors: {
            init: function () {
                this.Edges = new (System.Collections.Generic.Dictionary$2(T,System.Array.type(T)))();
            }
        },
        methods: {
            GetNeighbors: function (node) {
                return this.Edges.get(node);
            }
        }
    }; });

    /**
     * Similar to the selector task, the ParallelSelector task will return success as soon as a child task returns success. The difference
     is that the parallel task will run all of its children tasks simultaneously versus running each task one at a time. If one tasks returns
     success the parallel selector task will end all of the child tasks and return success. If every child task returns failure then the
     ParallelSelector task will return failure.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Composites.ParallelSelector$1
     * @augments BrainAI.AI.BehaviorTrees.Composites.Composite$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.ParallelSelector$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Composites.Composite$1(T)],
        methods: {
            Update: function (context) {
                var didAllFail = true;
                for (var i = 0; i < this.Children.Count; i = (i + 1) | 0) {
                    var child = this.Children.getItem(i);
                    child.Tick(context);

                    // if any child succeeds we return success
                    if (child.Status === BrainAI.AI.BehaviorTrees.TaskStatus.Success) {
                        return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                    }

                    // if all children didn't fail, we're not done yet
                    if (child.Status !== BrainAI.AI.BehaviorTrees.TaskStatus.Failure) {
                        didAllFail = false;
                    }
                }

                if (didAllFail) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
            }
        }
    }; });

    /**
     * the parallel task will run each child task until a child task returns failure. The difference is that the parallel task will run all of
     its children tasks simultaneously versus running each task one at a time. Like the sequence class, the parallel task will return
     success once all of its children tasks have returned success. If one tasks returns failure the parallel task will end all of the child
     tasks and return failure.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Composites.ParallelSequence$1
     * @augments BrainAI.AI.BehaviorTrees.Composites.Composite$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.ParallelSequence$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Composites.Composite$1(T)],
        methods: {
            Update: function (context) {
                var didAllSucceed = true;
                for (var i = 0; i < this.Children.Count; i = (i + 1) | 0) {
                    var child = this.Children.getItem(i);
                    child.Tick(context);

                    // if any child fails the whole branch fails
                    if (child.Status === BrainAI.AI.BehaviorTrees.TaskStatus.Failure) {
                        return BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                    } else {
                        if (child.Status !== BrainAI.AI.BehaviorTrees.TaskStatus.Success) {
                            didAllSucceed = false;
                        }
                    }
                }

                if (didAllSucceed) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
            }
        }
    }; });

    /**
     * The selector task is similar to an "or" operation. It will return success as soon as one of its child tasks return success. If a
     child task returns failure then it will sequentially run the next task. If no child task returns success then it will return failure.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Composites.Selector$1
     * @augments BrainAI.AI.BehaviorTrees.Composites.Composite$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.Selector$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Composites.Composite$1(T)],
        ctors: {
            ctor: function (abortType) {
                if (abortType === void 0) { abortType = 0; }

                this.$initialize();
                BrainAI.AI.BehaviorTrees.Composites.Composite$1(T).ctor.call(this);
                this.AbortType = abortType;
            }
        },
        methods: {
            Update: function (context) {
                // first, we handle conditional aborts if we are not already on the first child
                if (this.CurrentChildIndex !== 0) {
                    this.HandleConditionalAborts(context);
                }

                var current = this.Children.getItem(this.CurrentChildIndex);
                var status = current.Tick(context);

                // if the child succeeds or is still running, early return.
                if (status !== BrainAI.AI.BehaviorTrees.TaskStatus.Failure) {
                    return status;
                }

                this.CurrentChildIndex = (this.CurrentChildIndex + 1) | 0;

                // if the end of the children is hit, that means the whole thing fails.
                if (this.CurrentChildIndex === this.Children.Count) {
                    // reset index otherwise it will crash on next run through
                    this.CurrentChildIndex = 0;
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
            },
            HandleConditionalAborts: function (context) {
                // check any lower priority tasks to see if they changed to a success
                if (this.HasLowerPriorityConditionalAbort) {
                    this.UpdateLowerPriorityAbortConditional(context, BrainAI.AI.BehaviorTrees.TaskStatus.Failure);
                }

                if (BrainAI.AI.BehaviorTrees.Composites.AbortTypesExt.Has(this.AbortType, BrainAI.AI.BehaviorTrees.Composites.AbortTypes.Self)) {
                    this.UpdateSelfAbortConditional(context, BrainAI.AI.BehaviorTrees.TaskStatus.Failure);
                }
            }
        }
    }; });

    /**
     * The sequence task is similar to an "and" operation. It will return failure as soon as one of its child tasks return failure. If a
     child task returns success then it will sequentially run the next task. If all child tasks return success then it will return success.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Composites.Sequence$1
     * @augments BrainAI.AI.BehaviorTrees.Composites.Composite$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Composites.Sequence$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Composites.Composite$1(T)],
        ctors: {
            ctor: function (abortType) {
                if (abortType === void 0) { abortType = 0; }

                this.$initialize();
                BrainAI.AI.BehaviorTrees.Composites.Composite$1(T).ctor.call(this);
                this.AbortType = abortType;
            }
        },
        methods: {
            Update: function (context) {
                // first, we handle conditional aborts if we are not already on the first child
                if (this.CurrentChildIndex !== 0) {
                    this.HandleConditionalAborts(context);
                }

                var current = this.Children.getItem(this.CurrentChildIndex);
                var status = current.Tick(context);

                // if the child failed or is still running, early return
                if (status !== BrainAI.AI.BehaviorTrees.TaskStatus.Success) {
                    return status;
                }

                this.CurrentChildIndex = (this.CurrentChildIndex + 1) | 0;

                // if the end of the children is hit the whole sequence succeeded
                if (this.CurrentChildIndex === this.Children.Count) {
                    // reset index for next run
                    this.CurrentChildIndex = 0;
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
            },
            HandleConditionalAborts: function (context) {
                if (this.HasLowerPriorityConditionalAbort) {
                    this.UpdateLowerPriorityAbortConditional(context, BrainAI.AI.BehaviorTrees.TaskStatus.Success);
                }

                if (BrainAI.AI.BehaviorTrees.Composites.AbortTypesExt.Has(this.AbortType, BrainAI.AI.BehaviorTrees.Composites.AbortTypes.Self)) {
                    this.UpdateSelfAbortConditional(context, BrainAI.AI.BehaviorTrees.TaskStatus.Success);
                }
            }
        }
    }; });

    /**
     * wraps an ExecuteAction so that it can be used as a Conditional
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Conditionals.ExecuteActionConditional$1
     * @augments BrainAI.AI.BehaviorTrees.Actions.ExecuteAction$1
     * @implements  BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Conditionals.ExecuteActionConditional$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Actions.ExecuteAction$1(T),BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1(T)],
        alias: ["Update", ["BrainAI$AI$BehaviorTrees$Conditionals$IConditional$1$" + Bridge.getTypeAlias(T) + "$Update", "BrainAI$AI$BehaviorTrees$Conditionals$IConditional$1$Update"]],
        ctors: {
            ctor: function (action) {
                this.$initialize();
                BrainAI.AI.BehaviorTrees.Actions.ExecuteAction$1(T).ctor.call(this, action);
            }
        }
    }; });

    /** @namespace BrainAI.AI.BehaviorTrees.Decorators */

    /**
     * will always return failure except when the child task is running
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.AlwaysFail$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.AlwaysFail$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T)],
        methods: {
            Update: function (context) {
                var status = this.Child.Update(context);

                if (status === BrainAI.AI.BehaviorTrees.TaskStatus.Running) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
            }
        }
    }; });

    /**
     * will always return success except when the child task is running
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.AlwaysSucceed$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.AlwaysSucceed$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T)],
        methods: {
            Update: function (context) {
                var status = this.Child.Update(context);

                if (status === BrainAI.AI.BehaviorTrees.TaskStatus.Running) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
            }
        }
    }; });

    /**
     * decorator that will only run its child if a condition is met. By default, the condition will be reevaluated every tick.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     * @implements  BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T),BrainAI.AI.BehaviorTrees.Conditionals.IConditional$1(T)],
        fields: {
            conditional: null,
            shouldReevaluate: false,
            conditionalStatus: 0
        },
        alias: ["Update", ["BrainAI$AI$BehaviorTrees$Conditionals$IConditional$1$" + Bridge.getTypeAlias(T) + "$Update", "BrainAI$AI$BehaviorTrees$Conditionals$IConditional$1$Update"]],
        ctors: {
            $ctor1: function (conditional, shouldReevalute) {
                this.$initialize();
                BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T).ctor.call(this);
                this.conditional = conditional;
                this.shouldReevaluate = shouldReevalute;
            },
            ctor: function (conditional) {
                BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1(T).$ctor1.call(this, conditional, true);
            }
        },
        methods: {
            Invalidate: function () {
                BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T).prototype.Invalidate.call(this);
                this.conditionalStatus = BrainAI.AI.BehaviorTrees.TaskStatus.Invalid;
            },
            OnStart: function () {
                this.conditionalStatus = BrainAI.AI.BehaviorTrees.TaskStatus.Invalid;
            },
            Update: function (context) {
                // evalute the condition if we need to
                this.conditionalStatus = this.ExecuteConditional(context);

                if (this.conditionalStatus === BrainAI.AI.BehaviorTrees.TaskStatus.Success) {
                    return this.Child.Tick(context);
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
            },
            /**
             * executes the conditional either following the shouldReevaluate flag or with an option to force an update. Aborts will force the
             update to make sure they get the proper data if a Conditional changes.
             *
             * @instance
             * @this BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1
             * @memberof BrainAI.AI.BehaviorTrees.Decorators.ConditionalDecorator$1
             * @param   {T}                                      context        Context.
             * @param   {boolean}                                forceUpdate    If set to <pre><code>true</code></pre> force update.
             * @return  {BrainAI.AI.BehaviorTrees.TaskStatus}                   The conditional.
             */
            ExecuteConditional: function (context, forceUpdate) {
                if (forceUpdate === void 0) { forceUpdate = false; }
                if (forceUpdate || this.shouldReevaluate || this.conditionalStatus === BrainAI.AI.BehaviorTrees.TaskStatus.Invalid) {
                    this.conditionalStatus = this.conditional[Bridge.geti(this.conditional, "BrainAI$AI$BehaviorTrees$Conditionals$IConditional$1$" + Bridge.getTypeAlias(T) + "$Update", "BrainAI$AI$BehaviorTrees$Conditionals$IConditional$1$Update")](context);
                }
                return this.conditionalStatus;
            }
        }
    }; });

    /**
     * inverts the result of the child node
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.Inverter$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.Inverter$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T)],
        methods: {
            Update: function (context) {
                var status = this.Child.Tick(context);

                if (status === BrainAI.AI.BehaviorTrees.TaskStatus.Success) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Failure;
                }

                if (status === BrainAI.AI.BehaviorTrees.TaskStatus.Failure) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
            }
        }
    }; });

    /**
     * will repeat execution of its child task until the child task has been run a specified number of times. It has the option of
     continuing to execute the child task even if the child task returns a failure.
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.Repeater$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.Repeater$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T)],
        fields: {
            /**
             * The number of times to repeat the execution of its child task
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.BehaviorTrees.Decorators.Repeater$1
             * @type number
             */
            Count: 0,
            /**
             * Allows the repeater to repeat forever
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.BehaviorTrees.Decorators.Repeater$1
             * @type boolean
             */
            RepeatForever: false,
            /**
             * Should the task return if the child task returns a failure
             *
             * @instance
             * @public
             * @memberof BrainAI.AI.BehaviorTrees.Decorators.Repeater$1
             * @type boolean
             */
            EndOnFailure: false,
            iterationCount: 0
        },
        ctors: {
            $ctor1: function (count, endOnFailure) {
                if (endOnFailure === void 0) { endOnFailure = false; }

                this.$initialize();
                BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T).ctor.call(this);
                this.Count = count;
                this.EndOnFailure = endOnFailure;
            },
            ctor: function (repeatForever, endOnFailure) {
                if (endOnFailure === void 0) { endOnFailure = false; }

                this.$initialize();
                BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T).ctor.call(this);
                this.RepeatForever = repeatForever;
                this.EndOnFailure = endOnFailure;
            }
        },
        methods: {
            OnStart: function () {
                this.iterationCount = 0;
            },
            Update: function (context) {
                // early out if we are done. we check here and after running just in case the count is 0
                if (!this.RepeatForever && this.iterationCount === this.Count) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                }

                var status = this.Child.Tick(context);
                this.iterationCount = (this.iterationCount + 1) | 0;

                if (this.EndOnFailure && status === BrainAI.AI.BehaviorTrees.TaskStatus.Failure) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                }

                if (!this.RepeatForever && this.iterationCount === this.Count) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
            }
        }
    }; });

    /**
     * will keep executing its child task until the child task returns failure
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.UntilFail$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.UntilFail$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T)],
        methods: {
            Update: function (context) {
                var status = this.Child.Update(context);

                if (status !== BrainAI.AI.BehaviorTrees.TaskStatus.Failure) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
            }
        }
    }; });

    /**
     * will keep executing its child task until the child task returns success
     *
     * @public
     * @class BrainAI.AI.BehaviorTrees.Decorators.UntilSuccess$1
     * @augments BrainAI.AI.BehaviorTrees.Decorators.Decorator$1
     */
    Bridge.define("BrainAI.AI.BehaviorTrees.Decorators.UntilSuccess$1", function (T) { return {
        inherits: [BrainAI.AI.BehaviorTrees.Decorators.Decorator$1(T)],
        methods: {
            Update: function (context) {
                var status = this.Child.Tick(context);

                if (status !== BrainAI.AI.BehaviorTrees.TaskStatus.Success) {
                    return BrainAI.AI.BehaviorTrees.TaskStatus.Running;
                }

                return BrainAI.AI.BehaviorTrees.TaskStatus.Success;
            }
        }
    }; });

    /**
     * interface for a graph that can be fed to the AStarPathfinder.search method
     *
     * @abstract
     * @public
     * @class BrainAI.Pathfinding.AStar.IAstarGraph$1
     * @implements  BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1
     */
    Bridge.definei("BrainAI.Pathfinding.AStar.IAstarGraph$1", function (T) { return {
        inherits: [BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1(T)],
        $kind: "interface"
    }; });

    /**
     * basic unweighted grid graph for use with the BreadthFirstPathfinder
     *
     * @public
     * @class BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph
     * @implements  BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1
     */
    Bridge.define("BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph", {
        inherits: [BrainAI.Pathfinding.BreadthFirst.IUnweightedGraph$1(BrainAI.Pathfinding.Point)],
        statics: {
            fields: {
                CardinalDirs: null,
                CompassDirs: null
            },
            ctors: {
                init: function () {
                    this.CardinalDirs = System.Array.init([
                        new BrainAI.Pathfinding.Point.$ctor1(1, 0), 
                        new BrainAI.Pathfinding.Point.$ctor1(0, -1), 
                        new BrainAI.Pathfinding.Point.$ctor1(-1, 0), 
                        new BrainAI.Pathfinding.Point.$ctor1(0, 1)
                    ], BrainAI.Pathfinding.Point);
                    this.CompassDirs = System.Array.init([
                        new BrainAI.Pathfinding.Point.$ctor1(1, 0), 
                        new BrainAI.Pathfinding.Point.$ctor1(1, -1), 
                        new BrainAI.Pathfinding.Point.$ctor1(0, -1), 
                        new BrainAI.Pathfinding.Point.$ctor1(-1, -1), 
                        new BrainAI.Pathfinding.Point.$ctor1(-1, 0), 
                        new BrainAI.Pathfinding.Point.$ctor1(-1, 1), 
                        new BrainAI.Pathfinding.Point.$ctor1(0, 1), 
                        new BrainAI.Pathfinding.Point.$ctor1(1, 1)
                    ], BrainAI.Pathfinding.Point);
                }
            }
        },
        fields: {
            Walls: null,
            Width: 0,
            Height: 0,
            dirs: null,
            neighbors: null
        },
        ctors: {
            init: function () {
                this.Walls = new (System.Collections.Generic.HashSet$1(BrainAI.Pathfinding.Point)).ctor();
                this.neighbors = new (System.Collections.Generic.List$1(BrainAI.Pathfinding.Point)).$ctor2(4);
            },
            ctor: function (width, height, allowDiagonalSearch) {
                if (allowDiagonalSearch === void 0) { allowDiagonalSearch = false; }

                this.$initialize();
                this.Width = width;
                this.Height = height;
                this.dirs = allowDiagonalSearch ? BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph.CompassDirs : BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph.CardinalDirs;
            }
        },
        methods: {
            IsNodeInBounds: function (node) {
                return 0 <= node.X && node.X < this.Width && 0 <= node.Y && node.Y < this.Height;
            },
            IsNodePassable: function (node) {
                return !this.Walls.contains(node.$clone());
            },
            BrainAI$Pathfinding$BreadthFirst$IUnweightedGraph$1$BrainAI$Pathfinding$Point$GetNeighbors: function (node) {
                var $t;
                this.neighbors.clear();

                $t = Bridge.getEnumerator(this.dirs);
                try {
                    while ($t.moveNext()) {
                        var dir = $t.Current.$clone();
                        var next = new BrainAI.Pathfinding.Point.$ctor1(((node.X + dir.X) | 0), ((node.Y + dir.Y) | 0));
                        if (this.IsNodeInBounds(next.$clone()) && this.IsNodePassable(next.$clone())) {
                            this.neighbors.add(next.$clone());
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                return this.neighbors;
            }
        }
    });

    /**
     * basic grid graph with support for one type of weighted node
     *
     * @public
     * @class BrainAI.Pathfinding.Dijkstra.WeightedGridGraph
     * @augments BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph
     * @implements  BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1
     */
    Bridge.define("BrainAI.Pathfinding.Dijkstra.WeightedGridGraph", {
        inherits: [BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph,BrainAI.Pathfinding.Dijkstra.IWeightedGraph$1(BrainAI.Pathfinding.Point)],
        fields: {
            WeightedNodes: null,
            DefaultWeight: 0,
            WeightedNodeWeight: 0
        },
        alias: ["Cost", "BrainAI$Pathfinding$Dijkstra$IWeightedGraph$1$BrainAI$Pathfinding$Point$Cost"],
        ctors: {
            init: function () {
                this.WeightedNodes = new (System.Collections.Generic.HashSet$1(BrainAI.Pathfinding.Point)).ctor();
                this.DefaultWeight = 1;
                this.WeightedNodeWeight = 5;
            },
            ctor: function (width, height, allowDiagonalSearch) {
                if (allowDiagonalSearch === void 0) { allowDiagonalSearch = false; }

                this.$initialize();
                BrainAI.Pathfinding.BreadthFirst.UnweightedGridGraph.ctor.call(this, width, height, allowDiagonalSearch);
            }
        },
        methods: {
            Cost: function (from, to) {
                return this.WeightedNodes.contains(to.$clone()) ? this.WeightedNodeWeight : this.DefaultWeight;
            }
        }
    });

    /**
     * basic static grid graph for use with A*. Add walls to the walls HashSet and weighted nodes to the weightedNodes HashSet. This provides
     a very simple grid graph for A* with just two weights: defaultWeight and weightedNodeWeight.
     *
     * @public
     * @class BrainAI.Pathfinding.AStar.AstarGridGraph
     * @augments BrainAI.Pathfinding.Dijkstra.WeightedGridGraph
     * @implements  BrainAI.Pathfinding.AStar.IAstarGraph$1
     */
    Bridge.define("BrainAI.Pathfinding.AStar.AstarGridGraph", {
        inherits: [BrainAI.Pathfinding.Dijkstra.WeightedGridGraph,BrainAI.Pathfinding.AStar.IAstarGraph$1(BrainAI.Pathfinding.Point)],
        alias: ["Heuristic", "BrainAI$Pathfinding$AStar$IAstarGraph$1$BrainAI$Pathfinding$Point$Heuristic"],
        ctors: {
            ctor: function (width, height, allowDiagonalSearch) {
                if (allowDiagonalSearch === void 0) { allowDiagonalSearch = false; }

                this.$initialize();
                BrainAI.Pathfinding.Dijkstra.WeightedGridGraph.ctor.call(this, width, height, allowDiagonalSearch);
            }
        },
        methods: {
            Heuristic: function (node, goal) {
                return ((Math.abs(((node.X - goal.X) | 0)) + Math.abs(((node.Y - goal.Y) | 0))) | 0);
            }
        }
    });
});
