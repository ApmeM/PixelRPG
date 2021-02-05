/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("LocomotorECS", function ($asm, globals) {
    "use strict";

    Bridge.define("LocomotorECS.Component", {
        fields: {
            enabled: false
        },
        events: {
            ComponentEnabled: null,
            ComponentDisabled: null
        },
        props: {
            Entity: null,
            Enabled: {
                get: function () {
                    return this.enabled;
                },
                set: function (value) {
                    if (this.enabled === value) {
                        return;
                    }

                    this.enabled = value;
                    if (this.enabled) {
                        !Bridge.staticEquals(this.ComponentEnabled, null) ? this.ComponentEnabled(this) : null;
                    } else {
                        !Bridge.staticEquals(this.ComponentDisabled, null) ? this.ComponentDisabled(this) : null;
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.enabled = true;
            }
        }
    });

    Bridge.define("LocomotorECS.ComponentList", {
        fields: {
            entity: null,
            components: null,
            componentsToAdd: null,
            componentIdxToRemove: null,
            componentIdxToDisable: null,
            componentIdxToEnable: null,
            Bits: null
        },
        ctors: {
            init: function () {
                this.components = new (System.Collections.Generic.Dictionary$2(System.Int32,LocomotorECS.Component))();
                this.componentsToAdd = new (System.Collections.Generic.Dictionary$2(System.Int32,LocomotorECS.Component))();
                this.componentIdxToRemove = new (System.Collections.Generic.HashSet$1(System.Int32)).ctor();
                this.componentIdxToDisable = new (System.Collections.Generic.HashSet$1(System.Int32)).ctor();
                this.componentIdxToEnable = new (System.Collections.Generic.HashSet$1(System.Int32)).ctor();
                this.Bits = new LocomotorECS.Matching.BitSet.ctor();
            },
            ctor: function (entity) {
                this.$initialize();
                this.entity = entity;
            }
        },
        methods: {
            Add: function (T) {
                return this.Add$1(T, Bridge.createInstance(T));
            },
            Add$1: function (T, component) {
                var idx = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(Bridge.getType(component, T));
                this.componentsToAdd.add(idx, component);
                return component;
            },
            Remove$1: function (T) {
                var idx = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(T);
                this.componentsToAdd.remove(idx);
                this.componentIdxToRemove.add(idx);
            },
            Remove: function (component) {
                var idx = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(Bridge.getType(component));
                this.componentsToAdd.remove(idx);
                this.componentIdxToRemove.add(idx);
            },
            Get: function (T, withPending) {
                if (withPending === void 0) { withPending = true; }
                var idx = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(T);
                if (this.components.containsKey(idx)) {
                    return Bridge.cast(this.components.get(idx), T);
                }

                if (withPending && this.componentsToAdd.containsKey(idx)) {
                    return Bridge.cast(this.componentsToAdd.get(idx), T);
                }

                return null;
            },
            GetOrCreate: function (T) {
                var comp = this.Get(T);
                if (comp == null) {
                    comp = this.Add(T);
                }

                return comp;
            },
            CommitChanges: function () {
                var $t, $t1, $t2, $t3;
                if (this.componentIdxToDisable.Count > 0) {
                    $t = Bridge.getEnumerator(this.componentIdxToDisable);
                    try {
                        while ($t.moveNext()) {
                            var idx = $t.Current;
                            this.Bits.Set$1(idx, false);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }

                if (this.componentIdxToEnable.Count > 0) {
                    if (!this.entity.Enabled) {
                        this.componentIdxToEnable.clear();
                    }

                    $t1 = Bridge.getEnumerator(this.componentIdxToEnable);
                    try {
                        while ($t1.moveNext()) {
                            var idx1 = $t1.Current;
                            this.Bits.Set$1(idx1, true);
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
                }

                if (this.componentIdxToRemove.Count > 0) {
                    $t2 = Bridge.getEnumerator(this.componentIdxToRemove);
                    try {
                        while ($t2.moveNext()) {
                            var idx2 = $t2.Current;
                            this.Bits.Set$1(idx2, false);

                            if (this.components.containsKey(idx2)) {
                                var component = this.components.get(idx2);
                                component.Entity = null;
                                component.removeComponentEnabled(Bridge.fn.cacheBind(this, this.ComponentEnabled));
                                component.removeComponentDisabled(Bridge.fn.cacheBind(this, this.ComponentDisabled));
                                this.components.remove(idx2);
                            }
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }
                }

                if (this.componentsToAdd.count > 0) {
                    $t3 = Bridge.getEnumerator(this.componentsToAdd);
                    try {
                        while ($t3.moveNext()) {
                            var component1 = $t3.Current;
                            var idx3 = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(Bridge.getType(component1.value));
                            this.Bits.Set$1(idx3, this.entity.Enabled && component1.value.Enabled);

                            component1.value.Entity = this.entity;
                            component1.value.addComponentEnabled(Bridge.fn.cacheBind(this, this.ComponentEnabled));
                            component1.value.addComponentDisabled(Bridge.fn.cacheBind(this, this.ComponentDisabled));
                            this.components.add(idx3, component1.value);
                        }
                    } finally {
                        if (Bridge.is($t3, System.IDisposable)) {
                            $t3.System$IDisposable$Dispose();
                        }
                    }
                }

                var isSomethingChanged = this.componentIdxToRemove.Count > 0 || this.componentsToAdd.count > 0 || this.componentIdxToDisable.Count > 0 || this.componentIdxToEnable.Count > 0;

                this.componentIdxToRemove.clear();
                this.componentsToAdd.clear();
                this.componentIdxToDisable.clear();
                this.componentIdxToEnable.clear();

                return isSomethingChanged;
            },
            DisableEntity: function () {
                var $t;
                this.componentIdxToEnable.clear();

                $t = Bridge.getEnumerator(this.components);
                try {
                    while ($t.moveNext()) {
                        var component = $t.Current;
                        this.componentIdxToDisable.add(component.key);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            EnableEntity: function () {
                var $t;
                $t = Bridge.getEnumerator(this.components);
                try {
                    while ($t.moveNext()) {
                        var component = $t.Current;
                        if (component.value.Enabled) {
                            this.componentIdxToEnable.add(component.key);
                            this.componentIdxToDisable.remove(component.key);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            ComponentDisabled: function (component) {
                var idx = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(Bridge.getType(component));
                this.componentIdxToEnable.remove(idx);
                this.componentIdxToDisable.add(idx);
            },
            ComponentEnabled: function (component) {
                var idx = LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(Bridge.getType(component));
                this.componentIdxToDisable.remove(idx);
                this.componentIdxToEnable.add(idx);
            }
        }
    });

    Bridge.define("LocomotorECS.Entity", {
        fields: {
            Name: null,
            tag: 0,
            enabled: false
        },
        events: {
            BeforeTagChanged: null,
            AfterTagChanged: null
        },
        props: {
            Tag: {
                get: function () {
                    return this.tag;
                },
                set: function (value) {
                    if (this.tag === value) {
                        return;
                    }

                    !Bridge.staticEquals(this.BeforeTagChanged, null) ? this.BeforeTagChanged(this) : null;
                    this.tag = value;
                    !Bridge.staticEquals(this.AfterTagChanged, null) ? this.AfterTagChanged(this) : null;
                }
            },
            Enabled: {
                get: function () {
                    return this.enabled;
                },
                set: function (value) {
                    if (this.enabled === value) {
                        return;
                    }

                    this.enabled = value;
                    if (this.enabled) {
                        this.Components.EnableEntity();
                    } else {
                        this.Components.DisableEntity();
                    }
                }
            },
            Cache: null,
            Components: null
        },
        ctors: {
            init: function () {
                this.enabled = true;
                this.Cache = new LocomotorECS.Entity.CacheData();
            },
            ctor: function (name) {
                if (name === void 0) { name = null; }

                this.$initialize();
                this.Name = name;
                this.Components = new LocomotorECS.ComponentList(this);
            }
        },
        methods: {
            AddComponent$1: function (T, component) {
                return this.Components.Add$1(T, component);
            },
            AddComponent: function (T) {
                return this.Components.Add(T);
            },
            GetComponent: function (T, withPending) {
                if (withPending === void 0) { withPending = true; }
                return this.Components.Get(T, withPending);
            },
            GetOrCreateComponent: function (T) {
                return this.Components.GetOrCreate(T);
            },
            RemoveComponent$1: function (T) {
                this.Components.Remove$1(T);
            },
            RemoveComponent: function (component) {
                this.Components.Remove(component);
            }
        }
    });

    Bridge.define("LocomotorECS.Entity.CacheData", {
        $kind: "nested class",
        fields: {
            data: null
        },
        ctors: {
            init: function () {
                this.data = new (System.Collections.Generic.Dictionary$2(System.String,System.Object))();
            }
        },
        methods: {
            PutData: function (T, key, value) {
                this.data.set(key, value);
            },
            GetData: function (T, key, defaultValue) {
                if (defaultValue === void 0) { defaultValue = Bridge.getDefaultValue(T); }
                return this.data.containsKey(key) ? Bridge.cast(Bridge.unbox(this.data.get(key), T), T) : defaultValue;
            },
            ReplaceData: function (T, key, value, defaultValue) {
                if (defaultValue === void 0) { defaultValue = Bridge.getDefaultValue(T); }
                var oldData = this.GetData(T, key, defaultValue);
                this.PutData(T, key, value);
                return oldData;
            },
            GetOrAddData: function (T, key, builder) {
                if (this.data.containsKey(key)) {
                    return Bridge.cast(Bridge.unbox(this.data.get(key), T), T);
                }

                var value = builder();
                this.data.set(key, value);
                return value;
            }
        }
    });

    Bridge.define("LocomotorECS.EntityList", {
        fields: {
            entities: null,
            entitiesToAdd: null,
            entitiesToRemove: null,
            entityTagsDict: null,
            entityNamesDict: null
        },
        events: {
            EntityRemoved: null,
            EntityAdded: null,
            EntityChanged: null
        },
        ctors: {
            init: function () {
                this.entities = new (System.Collections.Generic.List$1(LocomotorECS.Entity)).ctor();
                this.entitiesToAdd = new (System.Collections.Generic.HashSet$1(LocomotorECS.Entity)).ctor();
                this.entitiesToRemove = new (System.Collections.Generic.HashSet$1(LocomotorECS.Entity)).ctor();
                this.entityTagsDict = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Collections.Generic.List$1(LocomotorECS.Entity)))();
                this.entityNamesDict = new (System.Collections.Generic.Dictionary$2(System.String,LocomotorECS.Entity))();
            }
        },
        methods: {
            Add: function (entity) {
                this.entitiesToAdd.add(entity);
                if (entity.Name != null) {
                    this.entityNamesDict.add(entity.Name, entity);
                }

                this.AddToTagList(entity);
            },
            Remove: function (entity) {
                this.entitiesToAdd.remove(entity);
                this.entitiesToRemove.add(entity);
                this.RemoveFromTagList(entity);
            },
            CommitChanges: function () {
                var $t, $t1;
                if (this.entitiesToRemove.Count > 0) {
                    $t = Bridge.getEnumerator(this.entitiesToRemove);
                    try {
                        while ($t.moveNext()) {
                            var entity = $t.Current;
                            this.RemoveFromTagList(entity);
                            this.entities.remove(entity);
                            if (entity.Name != null) {
                                this.entityNamesDict.remove(entity.Name);
                            }
                            entity.removeBeforeTagChanged(Bridge.fn.cacheBind(this, this.RemoveFromTagList));
                            entity.removeAfterTagChanged(Bridge.fn.cacheBind(this, this.AddToTagList));
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }

                if (this.entitiesToAdd.Count > 0) {
                    $t1 = Bridge.getEnumerator(this.entitiesToAdd);
                    try {
                        while ($t1.moveNext()) {
                            var entity1 = $t1.Current;
                            this.AddToTagList(entity1);
                            this.entities.add(entity1);
                            entity1.addBeforeTagChanged(Bridge.fn.cacheBind(this, this.RemoveFromTagList));
                            entity1.addAfterTagChanged(Bridge.fn.cacheBind(this, this.AddToTagList));
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
                }

                for (var i = 0; i < this.entities.Count; i = (i + 1) | 0) {
                    var entity2 = this.entities.getItem(i);
                    var isSomethingChanged = entity2.Components.CommitChanges();
                    if (this.entitiesToAdd.contains(entity2)) {
                        this.NotifyProcessorsEntityAdded(entity2);
                    } else if (this.entitiesToRemove.contains(entity2)) {
                        this.NotifyProcessorsEntityRemoved(entity2);
                    } else if (isSomethingChanged) {
                        this.NotifyProcessorsEntityChanged(entity2);
                    }
                }

                this.entitiesToRemove.clear();
                this.entitiesToAdd.clear();
            },
            FindEntityByName: function (name) {
                if (name == null) {
                    return null;
                }

                if (!this.entityNamesDict.containsKey(name)) {
                    return null;
                }

                return this.entityNamesDict.get(name);
            },
            FindEntitiesByTag: function (tag) {
                var list = { };
                if (!this.entityTagsDict.tryGetValue(tag, list)) {
                    list.v = new (System.Collections.Generic.List$1(LocomotorECS.Entity)).ctor();
                    this.entityTagsDict.set(tag, list.v);
                }

                return this.entityTagsDict.get(tag);
            },
            AddToTagList: function (entity) {
                if (entity.Tag === 0) {
                    return;
                }

                var list = this.FindEntitiesByTag(entity.Tag);
                if (!list.contains(entity)) {
                    list.add(entity);
                }
            },
            RemoveFromTagList: function (entity) {
                if (entity.Tag === 0) {
                    return;
                }

                var list = { };
                if (this.entityTagsDict.tryGetValue(entity.Tag, list)) {
                    list.v.remove(entity);
                }
            },
            NotifyProcessorsEntityRemoved: function (obj) {
                !Bridge.staticEquals(this.EntityRemoved, null) ? this.EntityRemoved(obj) : null;
            },
            NotifyProcessorsEntityAdded: function (obj) {
                !Bridge.staticEquals(this.EntityAdded, null) ? this.EntityAdded(obj) : null;
            },
            NotifyProcessorsEntityChanged: function (obj) {
                !Bridge.staticEquals(this.EntityChanged, null) ? this.EntityChanged(obj) : null;
            }
        }
    });

    Bridge.define("LocomotorECS.EntitySystem", {
        methods: {
            OnEntityChanged: function (entity) { },
            OnEntityAdded: function (entity) { },
            OnEntityRemoved: function (entity) { },
            NotifyEntityChanged: function (entity) {
                this.OnEntityChanged(entity);
            },
            NotifyEntityAdded: function (entity) {
                this.OnEntityAdded(entity);
            },
            NotifyEntityRemoved: function (entity) {
                this.OnEntityRemoved(entity);
            },
            Begin: function () { },
            DoAction: function (gameTime) { },
            End: function () { }
        }
    });

    Bridge.define("LocomotorECS.EntitySystemList", {
        fields: {
            processors: null,
            sortedProcessors: null,
            dependencies: null,
            needSorting: false,
            UseParallelism: false
        },
        ctors: {
            init: function () {
                this.processors = new (System.Collections.Generic.List$1(LocomotorECS.EntitySystem)).ctor();
                this.dependencies = new (System.Collections.Generic.Dictionary$2(LocomotorECS.EntitySystem,System.Collections.Generic.List$1(LocomotorECS.EntitySystem)))();
                this.needSorting = true;
                this.UseParallelism = false;
            },
            ctor: function (entityList) {
                this.$initialize();
                entityList.addEntityRemoved(Bridge.fn.cacheBind(this, this.NotifyEntityRemoved));
                entityList.addEntityAdded(Bridge.fn.cacheBind(this, this.NotifyEntityAdded));
                entityList.addEntityChanged(Bridge.fn.cacheBind(this, this.NotifyEntityChanged));
            }
        },
        methods: {
            AddExecutionOrder: function (TBefore, TAfter) {
                var executedBefore = this.Get(TBefore);
                var executedAfter = this.Get(TAfter);

                if (!this.dependencies.containsKey(executedBefore)) {
                    this.dependencies.set(executedBefore, new (System.Collections.Generic.List$1(LocomotorECS.EntitySystem)).ctor());
                }

                this.dependencies.get(executedBefore).add(executedAfter);
                this.needSorting = true;
            },
            RemoveExecutionOrder: function (TBefore, TAfter) {
                var executedBefore = this.Get(TBefore);
                var executedAfter = this.Get(TAfter);

                if (!this.dependencies.containsKey(executedBefore)) {
                    return;
                }

                this.dependencies.get(executedBefore).remove(executedAfter);
            },
            Add: function (processor) {
                this.processors.add(processor);
            },
            Remove: function (processor) {
                var $t;
                this.processors.remove(processor);
                this.dependencies.remove(processor);
                $t = Bridge.getEnumerator(this.dependencies);
                try {
                    while ($t.moveNext()) {
                        var data = $t.Current;
                        data.value.remove(processor);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                this.needSorting = true;
            },
            Get: function (T) {
                for (var i = 0; i < this.processors.Count; i = (i + 1) | 0) {
                    var processor = this.processors.getItem(i);
                    if (Bridge.is(processor, T)) {
                        return Bridge.as(processor, T);
                    }
                }

                return null;
            },
            NotifyBegin: function () {
                var $t, $t1;
                this.EnsureSorted();
                $t = Bridge.getEnumerator(this.sortedProcessors, System.Linq.Grouping$2);
                try {
                    while ($t.moveNext()) {
                        var sortedGroup = $t.Current;
                        $t1 = Bridge.getEnumerator(sortedGroup);
                        try {
                            while ($t1.moveNext()) {
                                var processor = $t1.Current;
                                processor.Begin();
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            NotifyDoAction: function (gameTime) {
                var $t, $t1;
                this.EnsureSorted();
                $t = Bridge.getEnumerator(this.sortedProcessors, System.Linq.Grouping$2);
                try {
                    while ($t.moveNext()) {
                        var sortedGroup = $t.Current;
                        {
                            $t1 = Bridge.getEnumerator(sortedGroup);
                            try {
                                while ($t1.moveNext()) {
                                    var processor = $t1.Current;
                                    processor.DoAction(gameTime);
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            NotifyEnd: function () {
                var $t, $t1;
                this.EnsureSorted();
                $t = Bridge.getEnumerator(this.sortedProcessors, System.Linq.Grouping$2);
                try {
                    while ($t.moveNext()) {
                        var sortedGroup = $t.Current;
                        {
                            $t1 = Bridge.getEnumerator(sortedGroup);
                            try {
                                while ($t1.moveNext()) {
                                    var processor = $t1.Current;
                                    processor.End();
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            EnsureSorted: function () {
                if (!this.needSorting) {
                    return;
                }

                this.needSorting = false;
                this.sortedProcessors = LocomotorECS.Utils.DfsSort.Sort(LocomotorECS.EntitySystem, this.processors, this.dependencies);
            },
            NotifyEntityChanged: function (entity) {
                for (var i = 0; i < this.processors.Count; i = (i + 1) | 0) {
                    this.processors.getItem(i).NotifyEntityChanged(entity);
                }
            },
            NotifyEntityAdded: function (entity) {
                for (var i = 0; i < this.processors.Count; i = (i + 1) | 0) {
                    this.processors.getItem(i).NotifyEntityAdded(entity);
                }
            },
            NotifyEntityRemoved: function (entity) {
                for (var i = 0; i < this.processors.Count; i = (i + 1) | 0) {
                    this.processors.getItem(i).NotifyEntityRemoved(entity);
                }
            }
        }
    });

    /** @namespace LocomotorECS.Matching */

    /**
     * This class can be thought of in two ways.  You can see it as a vector of bits or as a set of non-negative integers. The name
     <pre><code>BitSet</code></pre> is a bit misleading.
     It is implemented by a bit vector, but its equally possible to see it as set of non-negative integer; each integer in the set is
     represented by a set bit at the corresponding index. The size of this structure is determined by the highest integer in the set.
     You can union, intersect and build (symmetric) remainders, by invoking the logical operations and, or, andNot, resp. xor.
     This implementation is NOT synchronized against concurrent access from multiple threads. Specifically, if one thread is reading from a bitset
     while another thread is simultaneously modifying it, the results are undefined.
     author Jochen Hoenicke
     author Tom Tromey (tromey@cygnus.com)
     author Eric Blake (ebb9@email.byu.edu)
     status updated to 1.4
     *
     * @class LocomotorECS.Matching.BitSet
     */
    Bridge.define("LocomotorECS.Matching.BitSet", {
        statics: {
            fields: {
                /**
                 * A common mask.
                 *
                 * @static
                 * @private
                 * @memberof LocomotorECS.Matching.BitSet
                 * @constant
                 * @default 63
                 * @type number
                 */
                LongMask: 0
            },
            ctors: {
                init: function () {
                    this.LongMask = 63;
                }
            }
        },
        fields: {
            /**
             * The actual bits.
             @serial the i'th bit is in bits[i/64] at position i%64 (where position
             0 is the least significant).
             *
             * @instance
             * @private
             * @memberof LocomotorECS.Matching.BitSet
             * @type Array.<System.Int64>
             */
            bits: null
        },
        props: {
            /**
             * Gets the logical number of bits actually used by this bit
             set.  It returns the index of the highest set bit plus one.
             Note that this method doesn't return the number of set bits.
             Returns the index of the highest set bit plus one.
             *
             * @instance
             * @public
             * @readonly
             * @memberof LocomotorECS.Matching.BitSet
             * @function Length
             * @type number
             */
            Length: {
                get: function () {
                    // Set i to highest index that contains a non-zero value.
                    var i;
                    for (i = (this.bits.length - 1) | 0; i >= 0 && this.bits[System.Array.index(i, this.bits)].equals(System.Int64(0)); i = (i - 1) | 0) {
                    }

                    // if i < 0 all bits are cleared.
                    if (i < 0) {
                        return 0;
                    }

                    // Now determine the exact length.
                    var b = this.bits[System.Array.index(i, this.bits)];
                    var len = Bridge.Int.mul((((i + 1) | 0)), 64);

                    // b >= 0 checks if the highest bit is zero.
                    while (b.gte(System.Int64(0))) {
                        len = (len - 1) | 0;
                        b = b.shl(1);
                    }

                    return len;
                }
            },
            /**
             * Returns the number of bits actually used by this bit set. Note that this method doesn't return the number of set bits, and that
             future requests for larger bits will make this automatically grow.
             Returns the number of bits currently used.
             *
             * @instance
             * @public
             * @readonly
             * @memberof LocomotorECS.Matching.BitSet
             * @function Size
             * @type number
             */
            Size: {
                get: function () {
                    return Bridge.Int.mul(this.bits.length, 64);
                }
            }
        },
        ctors: {
            /**
             * Create a new empty bit set. All bits are initially false.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @return  {void}
             */
            ctor: function () {
                LocomotorECS.Matching.BitSet.$ctor1.call(this, 64);
            },
            /**
             * Create a new empty bit set, with a given size.  This
             constructor reserves enough space to represent the integers
             from <pre><code>0</code></pre> to <pre><code>nbits-1</code></pre>.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    nbits    nbits the initial size of the bit set
             * @return  {void}
             */
            $ctor1: function (nbits) {
                this.$initialize();
                var nbitslen = (nbits >>> 0) >>> 6;
                if ((nbits & LocomotorECS.Matching.BitSet.LongMask) !== 0) {
                    nbitslen = (nbitslen + 1) >>> 0;
                }
                this.bits = System.Array.init(nbitslen, System.Int64(0), System.Int64);
            }
        },
        methods: {
            /**
             * Performs the logical AND operation on this bit set and the
             given <pre><code>set</code></pre>.  This means it builds the intersection
             of the two sets.  The result is stored into this bit set.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {LocomotorECS.Matching.BitSet}    bs    the second bit set
             * @return  {void}
             */
            And: function (bs) {
                var max = Math.min(this.bits.length, bs.bits.length);
                var i;
                for (i = 0; i < max; i = (i + 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = this.bits[System.Array.index(i, this.bits)].and(bs.bits[System.Array.index(i, bs.bits)]);
                }

                while (i < this.bits.length) {
                    this.bits[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), this.bits)] = System.Int64(0);
                }
            },
            /**
             * Performs the logical AND operation on this bit set and the
             complement of the given <pre><code>bs</code></pre>.  This means it
             selects every element in the first set, that isn't in the
             second set.  The result is stored into this bit set and is
             effectively the set difference of the two.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {LocomotorECS.Matching.BitSet}    bs    the second bit set
             * @return  {void}
             */
            AndNot: function (bs) {
                var i = Math.min(this.bits.length, bs.bits.length);
                while (((i = (i - 1) | 0)) >= 0) {
                    this.bits[System.Array.index(i, this.bits)] = this.bits[System.Array.index(i, this.bits)].and((bs.bits[System.Array.index(i, bs.bits)].not()));
                }
            },
            /**
             * Returns the number of bits set to true.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @return  {number}
             */
            Cardinality: function () {
                var card = 0;
                for (var i = (this.bits.length - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    var a = this.bits[System.Array.index(i, this.bits)];
                    // Take care of common cases.
                    if (a.equals(System.Int64(0))) {
                        continue;
                    }

                    if (a.equals(System.Int64(-1))) {
                        card = (card + 64) >>> 0;
                        continue;
                    }

                    // Successively collapse alternating bit groups into a sum.
                    a = ((a.shr(1)).and(System.Int64([1431655765,1431655765]))).add((a.and(System.Int64([1431655765,1431655765]))));
                    a = ((a.shr(2)).and(System.Int64([858993459,858993459]))).add((a.and(System.Int64([858993459,858993459]))));
                    var b = System.Int64.clipu32((a.shr(32)).add(a));
                    b = (((((b >>> 4) & 252645135) >>> 0)) + (((b & 252645135) >>> 0))) >>> 0;
                    b = (((((b >>> 8) & 16711935) >>> 0)) + (((b & 16711935) >>> 0))) >>> 0;
                    card = (card + (((((((b >>> 16) & 65535) >>> 0)) + (((b & 65535) >>> 0))) >>> 0))) >>> 0;
                }
                return (card | 0);
            },
            /**
             * Sets all bits in the set to false.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @return  {void}
             */
            Clear: function () {
                for (var i = 0; i < this.bits.length; i = (i + 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = System.Int64(0);
                }
            },
            /**
             * Removes the integer <pre><code>pos</code></pre> from this set. That is
             the corresponding bit is cleared.  If the index is not in the set,
             this method does nothing.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    pos    a non-negative integer
             * @return  {void}
             */
            Clear$1: function (pos) {
                var offset = pos >> 6;
                this.Ensure(offset);
                this.bits[System.Array.index(offset, this.bits)] = this.bits[System.Array.index(offset, this.bits)].and(((System.Int64(1).shl(pos)).not()));
            },
            /**
             * Sets the bits between from (inclusive) and to (exclusive) to false.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    from    the start range (inclusive)
             * @param   {number}    to      the end range (exclusive)
             * @return  {void}
             */
            Clear$2: function (from, to) {
                if (from < 0 || from > to) {
                    throw new System.ArgumentOutOfRangeException.ctor();
                }

                if (from === to) {
                    return;
                }

                var loOffset = (from >>> 0) >>> 6;
                var hiOffset = (to >>> 0) >>> 6;
                this.Ensure((hiOffset | 0));
                if (loOffset === hiOffset) {
                    this.bits[System.Array.index(hiOffset, this.bits)] = this.bits[System.Array.index(hiOffset, this.bits)].and((((System.Int64(1).shl(from)).sub(System.Int64(1))).or((System.Int64(-1).shl(to)))));
                    return;
                }

                this.bits[System.Array.index(loOffset, this.bits)] = this.bits[System.Array.index(loOffset, this.bits)].and(((System.Int64(1).shl(from)).sub(System.Int64(1))));
                this.bits[System.Array.index(hiOffset, this.bits)] = this.bits[System.Array.index(hiOffset, this.bits)].and((System.Int64(-1).shl(to)));
                for (var i = ((loOffset | 0) + 1) | 0; System.Int64(i).lt(System.Int64(hiOffset)); i = (i + 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = System.Int64(0);
                }
            },
            /**
             * Create a clone of this bit set, that is an instance of the same
             class and contains the same elements.  But it doesn't change when
             this bit set changes.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @return  {System.Object}        the clone of this object.
             */
            Clone: function () {
                try {
                    var bs = new LocomotorECS.Matching.BitSet.ctor();
                    bs.bits = Bridge.cast(System.Array.clone(this.bits), System.Array.type(System.Int64));
                    return bs;
                } catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    // Impossible to get here.
                    return null;
                }
            },
            /**
             * Sets the bit at the index to the opposite value.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    index    the index of the bit
             * @return  {void}
             */
            Flip: function (index) {
                var offset = index >> 6;
                this.Ensure(offset);
                this.bits[System.Array.index(offset, this.bits)] = this.bits[System.Array.index(offset, this.bits)].xor((System.Int64(1).shl(index)));
            },
            /**
             * Sets a range of bits to the opposite value.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    from    the low index (inclusive)
             * @param   {number}    to      the high index (exclusive)
             * @return  {void}
             */
            Flip$1: function (from, to) {
                if (from < 0 || from > to) {
                    throw new System.ArgumentOutOfRangeException.ctor();
                }

                if (from === to) {
                    return;
                }

                var loOffset = (from >>> 0) >>> 6;
                var hiOffset = (to >>> 0) >>> 6;
                this.Ensure((hiOffset | 0));
                if (loOffset === hiOffset) {
                    this.bits[System.Array.index(hiOffset, this.bits)] = this.bits[System.Array.index(hiOffset, this.bits)].xor(((System.Int64(-1).shl(from)).and(((System.Int64(1).shl(to)).sub(System.Int64(1))))));
                    return;
                }

                this.bits[System.Array.index(loOffset, this.bits)] = this.bits[System.Array.index(loOffset, this.bits)].xor((System.Int64(-1).shl(from)));
                this.bits[System.Array.index(hiOffset, this.bits)] = this.bits[System.Array.index(hiOffset, this.bits)].xor(((System.Int64(1).shl(to)).sub(System.Int64(1))));
                for (var i = ((loOffset | 0) + 1) | 0; System.Int64(i).lt(System.Int64(hiOffset)); i = (i + 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = this.bits[System.Array.index(i, this.bits)].xor(System.Int64((-1)));
                }
            },
            /**
             * Returns true if the integer <pre><code>bitIndex</code></pre> is in this bit
             set, otherwise false.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}     pos    a non-negative integer
             * @return  {boolean}           the value of the bit at the specified position
             */
            Get$1: function (pos) {
                var offset = pos >> 6;
                if (offset >= this.bits.length) {
                    return false;
                }

                return (this.bits[System.Array.index(offset, this.bits)].and((System.Int64(1).shl(pos)))).ne(System.Int64(0));
            },
            /**
             * Returns a new <pre><code>BitSet</code></pre> composed of a range of bits from
             this one.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}                          from    the low index (inclusive)
             * @param   {number}                          to      the high index (exclusive)
             * @return  {LocomotorECS.Matching.BitSet}
             */
            Get: function (from, to) {
                var $t, $t1;
                if (from < 0 || from > to) {
                    throw new System.ArgumentOutOfRangeException.ctor();
                }

                var bs = new LocomotorECS.Matching.BitSet.$ctor1(((to - from) | 0));
                var loOffset = (from >>> 0) >>> 6;
                if (System.Int64(loOffset).gte(System.Int64(this.bits.length)) || to === from) {
                    return bs;
                }

                var loBit = from & LocomotorECS.Matching.BitSet.LongMask;
                var hiOffset = (to >>> 0) >>> 6;
                if (loBit === 0) {
                    var len = Math.min(((((hiOffset - loOffset) >>> 0) + 1) >>> 0), ((((this.bits.length) >>> 0) - loOffset) >>> 0));
                    System.Array.copy(this.bits, (loOffset | 0), bs.bits, 0, (len | 0));
                    if (System.Int64(hiOffset).lt(System.Int64(this.bits.length))) {
                        bs.bits[System.Array.index(($t = ((hiOffset - loOffset) >>> 0)), bs.bits)] = bs.bits[System.Array.index($t, bs.bits)].and(((System.Int64(1).shl(to)).sub(System.Int64(1))));
                    }
                    return bs;
                }

                var len2 = Math.min(hiOffset, ((((this.bits.length) >>> 0) - 1) >>> 0));
                var reverse = (64 - loBit) | 0;
                var i;
                for (i = 0; loOffset < len2; loOffset = (loOffset + 1) >>> 0, i = (i + 1) | 0) {
                    bs.bits[System.Array.index(i, bs.bits)] = ((this.bits[System.Array.index(loOffset, this.bits)].shr(loBit)).or((this.bits[System.Array.index(((loOffset + 1) >>> 0), this.bits)].shl(reverse))));
                }

                if ((to & LocomotorECS.Matching.BitSet.LongMask) > loBit) {
                    bs.bits[System.Array.index(Bridge.identity(i, (i = (i + 1) | 0)), bs.bits)] = this.bits[System.Array.index(loOffset, this.bits)].shr(loBit);
                }

                if (System.Int64(hiOffset).lt(System.Int64(this.bits.length))) {
                    bs.bits[System.Array.index(($t1 = ((i - 1) | 0)), bs.bits)] = bs.bits[System.Array.index($t1, bs.bits)].and(((System.Int64(1).shl((((to - from) | 0)))).sub(System.Int64(1))));
                }

                return bs;
            },
            /**
             * Returns true if the specified BitSet and this one share at least one
             common true bit.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {LocomotorECS.Matching.BitSet}    set    the set to check for intersection
             * @return  {boolean}                                true if the sets intersect
             */
            Intersects: function (set) {
                var i = Math.min(this.bits.length, set.bits.length);
                while (((i = (i - 1) | 0)) >= 0) {
                    if ((this.bits[System.Array.index(i, this.bits)].and(set.bits[System.Array.index(i, set.bits)])).ne(System.Int64(0))) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Returns true if this set contains no true bits.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @return  {boolean}        true if all bits are false
             */
            IsEmpty: function () {
                for (var i = (this.bits.length - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    if (this.bits[System.Array.index(i, this.bits)].ne(System.Int64(0))) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * Returns the index of the next false bit, from the specified bit
             (inclusive).
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    from    the start location
             * @return  {number}            the first false bit
             */
            NextClearBit: function (from) {
                var offset = from >> 6;
                var mask = System.Int64(1).shl(from);
                while (offset < this.bits.length) {
                    var h = this.bits[System.Array.index(offset, this.bits)];
                    do {
                        if ((h.and(mask)).equals(System.Int64(0))) {
                            return from;
                        }
                        mask = mask.shl(1);
                        from = (from + 1) | 0;
                    } while (mask.ne(System.Int64(0)));

                    mask = System.Int64(1);
                    offset = (offset + 1) | 0;
                }

                return from;
            },
            /**
             * Returns the index of the next true bit, from the specified bit
             (inclusive). If there is none, -1 is returned. You can iterate over
             all true bits with this loop:<br /><pre>for (int i = bs.nextSetBit(0); i &gt;= 0; i = bs.nextSetBit(i + 1))
             {
               // operate on i here
             }
             </pre>
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    from    the start location
             * @return  {number}            the first true bit, or -1
             */
            NextSetBit: function (from) {
                var offset = from >> 6;
                var mask = System.Int64(1).shl(from);
                while (offset < this.bits.length) {
                    var h = this.bits[System.Array.index(offset, this.bits)];
                    do {
                        if ((h.and(mask)).ne(System.Int64(0))) {
                            return from;
                        }
                        mask = mask.shl(1);
                        from = (from + 1) | 0;
                    } while (mask.ne(System.Int64(0)));

                    mask = System.Int64(1);
                    offset = (offset + 1) | 0;
                }

                return -1;
            },
            /**
             * Add the integer <pre><code>bitIndex</code></pre> to this set.  That is
             the corresponding bit is set to true.  If the index was already in
             the set, this method does nothing.  The size of this structure
             is automatically increased as necessary.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    pos    a non-negative integer.
             * @return  {void}
             */
            Set: function (pos) {
                var offset = pos >> 6;
                this.Ensure(offset);
                this.bits[System.Array.index(offset, this.bits)] = this.bits[System.Array.index(offset, this.bits)].or((System.Int64(1).shl(pos)));
            },
            /**
             * Sets the bit at the given index to the specified value. The size of
             this structure is automatically increased as necessary.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}     index    the position to set
             * @param   {boolean}    value    the value to set it to
             * @return  {void}
             */
            Set$1: function (index, value) {
                if (value) {
                    this.Set(index);
                } else {
                    this.Clear$1(index);
                }
            },
            /**
             * Sets the bits between from (inclusive) and to (exclusive) to true.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    from    the start range (inclusive)
             * @param   {number}    to      the end range (exclusive)
             * @return  {void}
             */
            Set$2: function (from, to) {
                if (from < 0 || from > to) {
                    throw new System.ArgumentOutOfRangeException.ctor();
                }

                if (from === to) {
                    return;
                }

                var loOffset = (from >>> 0) >>> 6;
                var hiOffset = (to >>> 0) >>> 6;
                this.Ensure((hiOffset | 0));
                if (loOffset === hiOffset) {
                    this.bits[System.Array.index(hiOffset, this.bits)] = this.bits[System.Array.index(hiOffset, this.bits)].or(((System.Int64(-1).shl(from)).and(((System.Int64(1).shl(to)).sub(System.Int64(1))))));
                    return;
                }

                this.bits[System.Array.index(loOffset, this.bits)] = this.bits[System.Array.index(loOffset, this.bits)].or((System.Int64(-1).shl(from)));
                this.bits[System.Array.index(hiOffset, this.bits)] = this.bits[System.Array.index(hiOffset, this.bits)].or(((System.Int64(1).shl(to)).sub(System.Int64(1))));

                for (var i = ((loOffset | 0) + 1) | 0; System.Int64(i).lt(System.Int64(hiOffset)); i = (i + 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = System.Int64(-1);
                }
            },
            /**
             * Sets the bits between from (inclusive) and to (exclusive) to the
             specified value.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}     from     the start range (inclusive)
             * @param   {number}     to       the end range (exclusive)
             * @param   {boolean}    value    the value to set it to
             * @return  {void}
             */
            Set$3: function (from, to, value) {
                if (value) {
                    this.Set$2(from, to);
                } else {
                    this.Clear$2(from, to);
                }
            },
            /**
             * Performs the logical XOR operation on this bit set and the
             given <pre><code>set</code></pre>.  This means it builds the symmetric
             remainder of the two sets (the elements that are in one set,
             but not in the other).  The result is stored into this bit set,
             which grows as necessary.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {LocomotorECS.Matching.BitSet}    bs    the second bit set
             * @return  {void}
             */
            Xor: function (bs) {
                this.Ensure(((bs.bits.length - 1) | 0));
                for (var i = (bs.bits.length - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = this.bits[System.Array.index(i, this.bits)].xor(bs.bits[System.Array.index(i, bs.bits)]);
                }
            },
            /**
             * Performs the logical OR operation on this bit set and the
             given <pre><code>set</code></pre>.  This means it builds the union
             of the two sets.  The result is stored into this bit set, which
             grows as necessary.
             *
             * @instance
             * @public
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {LocomotorECS.Matching.BitSet}    bs    the second bit set
             * @return  {void}
             */
            Or: function (bs) {
                this.Ensure(((bs.bits.length - 1) | 0));
                for (var i = (bs.bits.length - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    this.bits[System.Array.index(i, this.bits)] = this.bits[System.Array.index(i, this.bits)].or(bs.bits[System.Array.index(i, bs.bits)]);
                }
            },
            /**
             * Make sure the vector is big enough.
             *
             * @instance
             * @private
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {number}    lastElt    the size needed for the bits array
             * @return  {void}
             */
            Ensure: function (lastElt) {
                if (lastElt >= this.bits.length) {
                    var nd = System.Array.init(((lastElt + 1) | 0), System.Int64(0), System.Int64);
                    System.Array.copy(this.bits, 0, nd, 0, this.bits.length);
                    this.bits = nd;
                }
            },
            ContainsAll: function (other) {
                for (var i = (other.bits.length - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    if ((this.bits[System.Array.index(i, this.bits)].and(other.bits[System.Array.index(i, other.bits)])).ne(other.bits[System.Array.index(i, other.bits)])) {
                        return false;
                    }
                }

                return true;
            },
            
            getHashCode: function () {
                var h = System.Int64(1234);
                for (var i = this.bits.length; i > 0; ) {
                    h = h.xor((System.Int64(i).mul(this.bits[System.Array.index(((i = (i - 1) | 0)), this.bits)])));
                }
                return System.Int64.clip32((h.shr(32)).xor(h));
            },
            /**
             * Returns true if the <pre><code>obj</code></pre> is a bit set that contains
             exactly the same elements as this bit set, otherwise false.
             *
             * @instance
             * @public
             * @override
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @param   {System.Object}    obj    the object to compare to
             * @return  {boolean}                 true if obj equals this bit set
             */
            equals: function (obj) {
                if (!(Bridge.referenceEquals(Bridge.getType(obj), LocomotorECS.Matching.BitSet))) {
                    return false;
                }

                var bs = Bridge.cast(obj, LocomotorECS.Matching.BitSet);
                var max = Math.min(this.bits.length, bs.bits.length);
                var i;
                for (i = 0; i < max; i = (i + 1) | 0) {
                    if (this.bits[System.Array.index(i, this.bits)].ne(bs.bits[System.Array.index(i, bs.bits)])) {
                        return false;
                    }
                }
                // If one is larger, check to make sure all extra bits are 0.
                for (var j = i; j < this.bits.length; j = (j + 1) | 0) {
                    if (this.bits[System.Array.index(j, this.bits)].ne(System.Int64(0))) {
                        return false;
                    }
                }

                for (var j1 = i; j1 < bs.bits.length; j1 = (j1 + 1) | 0) {
                    if (bs.bits[System.Array.index(j1, bs.bits)].ne(System.Int64(0))) {
                        return false;
                    }
                }

                return true;
            },
            /**
             * Returns the string representation of this bit set.  This
             consists of a comma separated list of the integers in this set
             surrounded by curly braces.  There is a space after each comma.
             A sample string is thus "{1, 3, 53}".
             *
             * @instance
             * @public
             * @override
             * @this LocomotorECS.Matching.BitSet
             * @memberof LocomotorECS.Matching.BitSet
             * @return  {string}        the string representation.
             */
            toString: function () {
                var r = new System.Text.StringBuilder("{");
                var first = true;
                for (var i = 0; i < this.bits.length; i = (i + 1) | 0) {
                    var bit = System.Int64(1);
                    var word = this.bits[System.Array.index(i, this.bits)];
                    if (word.equals(System.Int64(0))) {
                        continue;
                    }

                    for (var j = 0; j < 64; j = (j + 1) | 0) {
                        if ((word.and(bit)).ne(System.Int64(0))) {
                            if (!first) {
                                r.append(", ");
                            }
                            r.append(((Bridge.Int.mul(64, i) + j) | 0));
                            first = false;
                        }
                        bit = bit.shl(1);
                    }
                }

                return r.append("}").toString();
            }
        }
    });

    Bridge.define("LocomotorECS.Matching.ComponentTypeManager", {
        statics: {
            fields: {
                ComponentTypesMask: null
            },
            ctors: {
                init: function () {
                    this.ComponentTypesMask = new (System.Collections.Generic.Dictionary$2(Function,System.Int32))();
                }
            },
            methods: {
                GetIndexFor: function (type) {
                    if (!LocomotorECS.Matching.ComponentTypeManager.ComponentTypesMask.containsKey(type)) {
                        LocomotorECS.Matching.ComponentTypeManager.ComponentTypesMask.set(type, LocomotorECS.Matching.ComponentTypeManager.ComponentTypesMask.count);
                    }

                    return LocomotorECS.Matching.ComponentTypeManager.ComponentTypesMask.get(type);
                },
                GetTypesFromBits: function (bits) {
                    return new (Bridge.GeneratorEnumerable$1(Function))(Bridge.fn.bind(this, function (bits) {
                        var $step = 0,
                            $jumpFromFinally,
                            $returnValue,
                            $t,
                            keyValuePair,
                            $async_e;

                        var $enumerator = new (Bridge.GeneratorEnumerator$1(Function))(Bridge.fn.bind(this, function () {
                            try {
                                for (;;) {
                                    switch ($step) {
                                        case 0: {
                                            $t = Bridge.getEnumerator(LocomotorECS.Matching.ComponentTypeManager.ComponentTypesMask);
                                                $step = 1;
                                                continue;
                                        }
                                        case 1: {
                                            if ($t.moveNext()) {
                                                    keyValuePair = $t.Current;
                                                    $step = 2;
                                                    continue;
                                                }
                                            $step = 6;
                                            continue;
                                        }
                                        case 2: {
                                            if (bits.Get$1(keyValuePair.value)) {
                                                    $step = 3;
                                                    continue;
                                                } 
                                                $step = 5;
                                                continue;
                                        }
                                        case 3: {
                                            $enumerator.current = keyValuePair.key;
                                                $step = 4;
                                                return true;
                                        }
                                        case 4: {
                                            $step = 5;
                                            continue;
                                        }
                                        case 5: {
                                            $step = 1;
                                            continue;
                                        }
                                        case 6: {

                                        }
                                        default: {
                                            return false;
                                        }
                                    }
                                }
                            } catch($async_e1) {
                                $async_e = System.Exception.create($async_e1);
                                throw $async_e;
                            }
                        }));
                        return $enumerator;
                    }, arguments));
                }
            }
        }
    });

    Bridge.define("LocomotorECS.Matching.Matcher", {
        statics: {
            methods: {
                Empty: function () {
                    return new LocomotorECS.Matching.Matcher();
                },
                AppendTypes: function (builder, headerMessage, typeBits) {
                    var $t;
                    var firstType = true;
                    builder.append(headerMessage);
                    $t = Bridge.getEnumerator(LocomotorECS.Matching.ComponentTypeManager.GetTypesFromBits(typeBits), Function);
                    try {
                        while ($t.moveNext()) {
                            var type = $t.Current;
                            if (!firstType) {
                                builder.append(", ");
                            }
                            builder.append(Bridge.Reflection.getTypeName(type));

                            firstType = false;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    builder.appendLine();
                }
            }
        },
        fields: {
            allSet: null,
            exclusionSet: null,
            oneSet: null
        },
        ctors: {
            init: function () {
                this.allSet = new LocomotorECS.Matching.BitSet.ctor();
                this.exclusionSet = new LocomotorECS.Matching.BitSet.ctor();
                this.oneSet = new LocomotorECS.Matching.BitSet.ctor();
            }
        },
        methods: {
            All: function (types) {
                var $t;
                if (types === void 0) { types = []; }
                $t = Bridge.getEnumerator(types);
                try {
                    while ($t.moveNext()) {
                        var type = $t.Current;
                        this.allSet.Set(LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(type));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                return this;
            },
            Exclude: function (types) {
                var $t;
                if (types === void 0) { types = []; }
                $t = Bridge.getEnumerator(types);
                try {
                    while ($t.moveNext()) {
                        var type = $t.Current;
                        this.exclusionSet.Set(LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(type));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                return this;
            },
            One: function (types) {
                var $t;
                if (types === void 0) { types = []; }
                $t = Bridge.getEnumerator(types);
                try {
                    while ($t.moveNext()) {
                        var type = $t.Current;
                        this.oneSet.Set(LocomotorECS.Matching.ComponentTypeManager.GetIndexFor(type));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                return this;
            },
            IsMatched: function (entity) {
                // Check if the entity possesses ALL of the components defined in the aspect.
                if (!this.allSet.IsEmpty()) {
                    for (var i = this.allSet.NextSetBit(0); i >= 0; i = this.allSet.NextSetBit(((i + 1) | 0))) {
                        if (!entity.Components.Bits.Get$1(i)) {
                            return false;
                        }
                    }
                }

                // If we are STILL interested,
                // Check if the entity possesses ANY of the exclusion components, if it does then the system is not interested.
                if (!this.exclusionSet.IsEmpty() && this.exclusionSet.Intersects(entity.Components.Bits)) {
                    return false;
                }

                // If we are STILL interested,
                // Check if the entity possesses ANY of the components in the oneSet. If so, the system is interested.
                if (!this.oneSet.IsEmpty() && !this.oneSet.Intersects(entity.Components.Bits)) {
                    return false;
                }

                return true;
            },
            toString: function () {
                var builder = new System.Text.StringBuilder("", 1024);

                builder.appendLine("Matcher:");
                LocomotorECS.Matching.Matcher.AppendTypes(builder, " -  Requires the components: ", this.allSet);
                LocomotorECS.Matching.Matcher.AppendTypes(builder, " -  Has none of the components: ", this.exclusionSet);
                LocomotorECS.Matching.Matcher.AppendTypes(builder, " -  Has at least one of the components: ", this.oneSet);

                return builder.toString();
            }
        }
    });

    Bridge.define("LocomotorECS.Utils.DfsSort", {
        statics: {
            methods: {
                Dfs: function (T, current, edges, result) {
                    var $t;
                    result.set(current, 0);

                    if (edges.containsKey(current)) {
                        $t = Bridge.getEnumerator(edges.get(current));
                        try {
                            while ($t.moveNext()) {
                                var dependent = $t.Current;
                                if (result.containsKey(dependent)) {
                                    result.set(current, Math.max(result.get(current), ((result.get(dependent) + 1) | 0)));
                                    continue;
                                }

                                result.set(current, Math.max(result.get(current), ((LocomotorECS.Utils.DfsSort.Dfs(T, dependent, edges, result) + 1) | 0)));
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                    }

                    return result.get(current);
                },
                Sort: function (T, items, edges) {
                    var $t;
                    var result = new (System.Collections.Generic.Dictionary$2(T, System.Int32))();

                    $t = Bridge.getEnumerator(items);
                    try {
                        while ($t.moveNext()) {
                            var current = $t.Current;
                            if (result.containsKey(current)) {
                                continue;
                            }

                            LocomotorECS.Utils.DfsSort.Dfs(T, current, edges, result);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    return System.Linq.Enumerable.from(System.Linq.Enumerable.from(result).orderByDescending($asm.$.LocomotorECS.Utils.DfsSort.f1)).toLookup($asm.$.LocomotorECS.Utils.DfsSort.f1, $asm.$.LocomotorECS.Utils.DfsSort.f2);
                }
            }
        }
    });

    Bridge.ns("LocomotorECS.Utils.DfsSort", $asm.$);

    Bridge.apply($asm.$.LocomotorECS.Utils.DfsSort, {
        f1: function (a) {
            return a.value;
        },
        f2: function (a) {
            return a.key;
        }
    });

    Bridge.define("LocomotorECS.MatcherEntitySystem", {
        inherits: [LocomotorECS.EntitySystem],
        props: {
            Matcher: null,
            MatchedEntities: null
        },
        ctors: {
            init: function () {
                this.MatchedEntities = new (System.Collections.Generic.List$1(LocomotorECS.Entity)).ctor();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntitySystem.ctor.call(this);
                this.Matcher = LocomotorECS.Matching.Matcher.Empty();
            },
            $ctor1: function (matcher) {
                this.$initialize();
                LocomotorECS.EntitySystem.ctor.call(this);
                this.Matcher = matcher;
            }
        },
        methods: {
            OnEntityChanged: function (entity) {
                var contains = this.MatchedEntities.contains(entity);
                var interest = this.Matcher.IsMatched(entity);

                if (interest) {
                    if (contains) {
                        this.OnMatchedEntityChanged(entity);
                    } else {
                        this.MatchedEntities.add(entity);
                        this.OnMatchedEntityAdded(entity);
                    }
                } else if (contains) {
                    this.MatchedEntities.remove(entity);
                    this.OnMatchedEntityRemoved(entity);
                }
            },
            OnEntityAdded: function (entity) {
                var interest = this.Matcher.IsMatched(entity);
                if (interest) {
                    this.MatchedEntities.add(entity);
                    this.OnMatchedEntityAdded(entity);
                }
            },
            OnEntityRemoved: function (entity) {
                var interest = this.Matcher.IsMatched(entity);
                if (interest) {
                    this.MatchedEntities.remove(entity);
                    this.OnMatchedEntityRemoved(entity);
                }
            },
            OnMatchedEntityAdded: function (entity) { },
            OnMatchedEntityChanged: function (entity) { },
            OnMatchedEntityRemoved: function (entity) { }
        }
    });

    /** @namespace LocomotorECS */

    /**
     * Basic entity processing system. Use this as the base for processing many entities with specific components
     *
     * @abstract
     * @public
     * @class LocomotorECS.EntityProcessingSystem
     * @augments LocomotorECS.MatcherEntitySystem
     */
    Bridge.define("LocomotorECS.EntityProcessingSystem", {
        inherits: [LocomotorECS.MatcherEntitySystem],
        fields: {
            UseParallelism: false
        },
        ctors: {
            init: function () {
                this.UseParallelism = false;
            },
            ctor: function (matcher) {
                this.$initialize();
                LocomotorECS.MatcherEntitySystem.$ctor1.call(this, matcher);
            }
        },
        methods: {
            DoAction: function (gameTime) {
                LocomotorECS.MatcherEntitySystem.prototype.DoAction.call(this, gameTime);

                {
                    for (var i = 0; i < this.MatchedEntities.Count; i = (i + 1) | 0) {
                        this.DoAction$1(this.MatchedEntities.getItem(i), gameTime);
                    }
                }
            },
            DoAction$1: function (entity, gameTime) {

            }
        }
    });
});
