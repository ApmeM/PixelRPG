/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("MazeGenerators", function ($asm, globals) {
    "use strict";

    Bridge.define("MazeGenerators.Directions", {
        statics: {
            fields: {
                CardinalDirs: null,
                CompassDirs: null
            },
            ctors: {
                init: function () {
                    this.CardinalDirs = System.Array.init([
                        new MazeGenerators.Utils.Vector2.$ctor1(1, 0), 
                        new MazeGenerators.Utils.Vector2.$ctor1(0, -1), 
                        new MazeGenerators.Utils.Vector2.$ctor1(-1, 0), 
                        new MazeGenerators.Utils.Vector2.$ctor1(0, 1)
                    ], MazeGenerators.Utils.Vector2);
                    this.CompassDirs = System.Array.init([
                        new MazeGenerators.Utils.Vector2.$ctor1(1, 0), 
                        new MazeGenerators.Utils.Vector2.$ctor1(1, -1), 
                        new MazeGenerators.Utils.Vector2.$ctor1(0, -1), 
                        new MazeGenerators.Utils.Vector2.$ctor1(-1, -1), 
                        new MazeGenerators.Utils.Vector2.$ctor1(-1, 0), 
                        new MazeGenerators.Utils.Vector2.$ctor1(-1, 1), 
                        new MazeGenerators.Utils.Vector2.$ctor1(0, 1), 
                        new MazeGenerators.Utils.Vector2.$ctor1(1, 1)
                    ], MazeGenerators.Utils.Vector2);
                }
            }
        }
    });

    /** @namespace MazeGenerators */

    /**
     * @public
     * @class MazeGenerators.RoomMazeGenerator
     */
    Bridge.define("MazeGenerators.RoomMazeGenerator", {
        methods: {
            Generate: function (settings) {
                var $t;
                if (settings.Width % 2 === 0 || settings.Height % 2 === 0) {
                    throw new System.Exception("The stage must be odd-sized.");
                }

                var result = ($t = new MazeGenerators.RoomMazeGenerator.Result(), $t.Junctions = new (System.Collections.Generic.List$1(MazeGenerators.Utils.Vector2)).ctor(), $t.Rooms = new (System.Collections.Generic.List$1(MazeGenerators.Utils.Rectangle)).ctor(), $t.Regions = System.Array.create(null, null, System.Nullable$1(System.Int32), settings.Width, settings.Height), $t);

                var regionId = -1;
                for (var i = 0; i < settings.NumRoomTries; i = (i + 1) | 0) {
                    regionId = (regionId + 1) | 0;
                    if (!this.TryAddRooms(result, settings, regionId)) {
                        regionId = (regionId - 1) | 0;
                    }
                }

                // Fill in all of the empty space with mazes.
                for (var y = 1; y < settings.Height; y = (y + 2) | 0) {
                    for (var x = 1; x < settings.Width; x = (x + 2) | 0) {
                        var pos = new MazeGenerators.Utils.Vector2.$ctor1(x, y);
                        if (System.Nullable.hasValue(result.GetTile(pos.$clone()))) {
                            continue;
                        }
                        regionId = (regionId + 1) | 0;
                        this.GrowMaze(result, settings, pos.$clone(), regionId);
                    }
                }

                regionId = (regionId + 1) | 0;
                this.ConnectRegions(result, settings, regionId);
                this.RemoveDeadEnds(result, settings);

                return result;
            },
            /**
             * @instance
             * @private
             * @this MazeGenerators.RoomMazeGenerator
             * @memberof MazeGenerators.RoomMazeGenerator
             * @param   {MazeGenerators.RoomMazeGenerator.Result}      result      
             * @param   {MazeGenerators.RoomMazeGenerator.Settings}    settings    
             * @param   {MazeGenerators.Utils.Vector2}                 start       
             * @param   {number}                                       regionId
             * @return  {void}
             */
            GrowMaze: function (result, settings, start, regionId) {
                var $t;
                var cells = new (System.Collections.Generic.List$1(MazeGenerators.Utils.Vector2)).ctor();

                result.SetTile(start.$clone(), regionId);

                cells.add(start.$clone());

                var lastDir = null;

                while (cells.Count > 0) {
                    var cell = cells.getItem(((cells.Count - 1) | 0)).$clone();

                    // See which adjacent cells are open.
                    var unmadeCells = new (System.Collections.Generic.List$1(MazeGenerators.Utils.Vector2)).ctor();

                    $t = Bridge.getEnumerator(settings.Directions);
                    try {
                        while ($t.moveNext()) {
                            var dir = $t.Current.$clone();
                            if (this.CanCarve(result, cell.$clone(), dir.$clone())) {
                                unmadeCells.add(dir.$clone());
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    if (unmadeCells.Count !== 0) {
                        // Based on how "windy" passages are, try to prefer carving in the
                        // same direction.
                        var dir1 = new MazeGenerators.Utils.Vector2();
                        if (lastDir != null && unmadeCells.contains(System.Nullable.getValue(lastDir).$clone()) && settings.Random.Next$1(100) > settings.WindingPercent) {
                            dir1 = System.Nullable.getValue(lastDir).$clone();
                        } else {
                            dir1 = unmadeCells.getItem(settings.Random.Next$1(unmadeCells.Count)).$clone();
                        }

                        result.SetTile(MazeGenerators.Utils.Vector2.op_Addition(cell.$clone(), dir1.$clone()), regionId);
                        result.SetTile(MazeGenerators.Utils.Vector2.op_Addition(cell.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(dir1.$clone(), 2)), regionId);

                        cells.add(MazeGenerators.Utils.Vector2.op_Addition(cell.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(dir1.$clone(), 2)));
                        lastDir = dir1.$clone();
                    } else {
                        // No adjacent un carved cells.
                        cells.removeAt(((cells.Count - 1) | 0));

                        // This path has ended.
                        lastDir = null;
                    }
                }
            },
            /**
             * @instance
             * @private
             * @this MazeGenerators.RoomMazeGenerator
             * @memberof MazeGenerators.RoomMazeGenerator
             * @param   {MazeGenerators.RoomMazeGenerator.Result}      result      
             * @param   {MazeGenerators.RoomMazeGenerator.Settings}    settings    
             * @param   {number}                                       regionId
             * @return  {boolean}
             */
            TryAddRooms: function (result, settings, regionId) {
                var $t;
                // Pick a random room size. The funny math here does two things:
                // - It makes sure rooms are odd-sized to line up with maze.
                // - It avoids creating rooms that are too rectangular: too tall and
                //   narrow or too wide and flat.
                // TODO: This isn't very flexible or tunable. Do something better here.
                var size = (Bridge.Int.mul((((settings.Random.Next$1(((2 + settings.RoomExtraSize) | 0)) + 1) | 0)), 2) + 1) | 0;
                var rectangularity = Bridge.Int.mul(settings.Random.Next$1(((1 + ((Bridge.Int.div(size, 2)) | 0)) | 0)), 2);
                var width = size;
                var height = size;
                if (settings.Random.Next$1(100) < 50) {
                    width = (width + rectangularity) | 0;
                } else {
                    height = (height + rectangularity) | 0;
                }

                var x = (Bridge.Int.mul(settings.Random.Next$1(((Bridge.Int.div((((System.Array.getLength(result.Regions, 0) - width) | 0)), 2)) | 0)), 2) + 1) | 0;
                var y = (Bridge.Int.mul(settings.Random.Next$1(((Bridge.Int.div((((System.Array.getLength(result.Regions, 1) - height) | 0)), 2)) | 0)), 2) + 1) | 0;

                var room = new MazeGenerators.Utils.Rectangle.$ctor1(x, y, width, height);

                var overlaps = false;
                $t = Bridge.getEnumerator(result.Rooms);
                try {
                    while ($t.moveNext()) {
                        var other = $t.Current.$clone();
                        if (room.Intersects(other.$clone())) {
                            overlaps = true;
                            break;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (overlaps) {
                    return false;
                }

                result.Rooms.add(room.$clone());

                for (var i1 = x; i1 < ((x + width) | 0); i1 = (i1 + 1) | 0) {
                    for (var j1 = y; j1 < ((y + height) | 0); j1 = (j1 + 1) | 0) {
                        result.SetTile(new MazeGenerators.Utils.Vector2.$ctor1(i1, j1), regionId);
                    }
                }

                return true;
            },
            ConnectRegions: function (result, settings, connectorId) {
                var $t, $t1;
                // Find all of the tiles that can connect two (or more) regions.
                var connectorRegions = new (System.Collections.Generic.Dictionary$2(MazeGenerators.Utils.Vector2,System.Collections.Generic.HashSet$1(System.Int32)))();
                for (var x = 0; x < System.Array.getLength(result.Regions, 0); x = (x + 1) | 0) {
                    for (var y = 0; y < System.Array.getLength(result.Regions, 1); y = (y + 1) | 0) {
                        var pos = new MazeGenerators.Utils.Vector2.$ctor1(x, y);
                        // Can't already be part of a region.
                        if (System.Nullable.hasValue(result.GetTile(pos.$clone()))) {
                            continue;
                        }

                        var tmpRegions = new (System.Collections.Generic.HashSet$1(System.Int32)).ctor();
                        $t = Bridge.getEnumerator(settings.Directions);
                        try {
                            while ($t.moveNext()) {
                                var dir = $t.Current.$clone();
                                var loc = MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), dir.$clone());
                                if (!result.IsInRegion(loc.$clone())) {
                                    continue;
                                }

                                var region = result.GetTile(loc.$clone());
                                if (region != null) {
                                    tmpRegions.add(System.Nullable.getValue(region));
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }

                        if (tmpRegions.Count < 2) {
                            continue;
                        }

                        connectorRegions.set(pos, tmpRegions);
                    }
                }

                var connectors = System.Linq.Enumerable.from(connectorRegions.getKeys()).toList(MazeGenerators.Utils.Vector2);

                // Keep track of which regions have been merged. This maps an original
                // region index to the one it has been merged to.
                var merged = System.Array.init(connectorId, 0, System.Int32);
                var openRegions = new (System.Collections.Generic.HashSet$1(System.Int32)).ctor();
                for (var i = 0; i < connectorId; i = (i + 1) | 0) {
                    merged[System.Array.index(i, merged)] = i;
                    openRegions.add(i);
                }

                // Keep connecting regions until we're down to one.
                while (openRegions.Count > 1) {
                    var connector = { v : connectors.getItem(settings.Random.Next$1(connectors.Count)).$clone() };

                    // Carve the connection.
                    result.SetTile(connector.v.$clone(), connectorId);
                    result.Junctions.add(connector.v.$clone());

                    // Merge the connected regions. We'll pick one region (arbitrarily) and
                    // map all of the other regions to its index.
                    var tmpRegions1 = System.Linq.Enumerable.from(connectorRegions.get(connector.v)).select(function (region1) {
                            return merged[System.Array.index(region1, merged)];
                        }).toList(System.Int32);
                    var dest = tmpRegions1.getItem(0);
                    var sources = System.Linq.Enumerable.from(tmpRegions1).skip(1).toList(System.Int32);

                    // Merge all of the affected regions. We have to look at *all* of the
                    // regions because other regions may have previously been merged with
                    // some of the ones we're merging now.
                    for (var i1 = 0; i1 < connectorId; i1 = (i1 + 1) | 0) {
                        if (sources.contains(merged[System.Array.index(i1, merged)])) {
                            merged[System.Array.index(i1, merged)] = dest;
                        }
                    }

                    // The sources are no longer in use.
                    $t1 = Bridge.getEnumerator(sources);
                    try {
                        while ($t1.moveNext()) {
                            var source = $t1.Current;
                            openRegions.remove(source);
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }

                    // Remove any connectors that aren't needed anymore.
                    connectors.RemoveAll((function ($me, connector) {
                        return function (pos1) {
                            // Don't allow connectors right next to each other.
                            if ((MazeGenerators.Utils.Vector2.op_Subtraction(connector.v.$clone(), pos1.$clone())).LengthSquared() < 4) {
                                return true;
                            }

                            // If the connector no long spans different regions, we don't need it.
                            var tmpRegions2 = System.Linq.Enumerable.from(System.Linq.Enumerable.from(connectorRegions.get(pos1)).select(function (region1) {
                                        return merged[System.Array.index(region1, merged)];
                                    })).toLookup($asm.$.MazeGenerators.RoomMazeGenerator.f1, $asm.$.MazeGenerators.RoomMazeGenerator.f1);

                            if (tmpRegions2.count() > 1) {
                                return false;
                            }

                            // This connecter isn't needed, but connect it occasionally so that the
                            // dungeon isn't singly-connected.
                            if (settings.Random.Next$1(100) < settings.ExtraConnectorChance) {
                                result.SetTile(pos1.$clone(), connectorId);
                                result.Junctions.add(pos1.$clone());
                            }

                            return true;
                        };
                    })(this, connector));
                }
            },
            RemoveDeadEnds: function (result, settings) {
                var $t;
                var done = false;

                while (!done) {
                    done = true;

                    for (var x = 0; x < System.Array.getLength(result.Regions, 0); x = (x + 1) | 0) {
                        for (var y = 0; y < System.Array.getLength(result.Regions, 1); y = (y + 1) | 0) {
                            var pos = new MazeGenerators.Utils.Vector2.$ctor1(x, y);
                            if (!System.Nullable.hasValue(result.GetTile(pos.$clone()))) {
                                continue;
                            }

                            // If it only has one exit, it's a dead end.
                            var exits = 0;
                            $t = Bridge.getEnumerator(settings.Directions);
                            try {
                                while ($t.moveNext()) {
                                    var dir = $t.Current.$clone();
                                    if (!result.IsInRegion(MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), dir.$clone()))) {
                                        continue;
                                    }

                                    if (!System.Nullable.hasValue(result.GetTile(MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), dir.$clone())))) {
                                        continue;
                                    }

                                    exits = (exits + 1) | 0;
                                }
                            } finally {
                                if (Bridge.is($t, System.IDisposable)) {
                                    $t.System$IDisposable$Dispose();
                                }
                            }

                            if (exits !== 1) {
                                continue;
                            }

                            done = false;
                            result.RemoveTile(pos.$clone());
                        }
                    }
                }
            },
            /**
             * @instance
             * @private
             * @this MazeGenerators.RoomMazeGenerator
             * @memberof MazeGenerators.RoomMazeGenerator
             * @param   {MazeGenerators.RoomMazeGenerator.Result}    result       
             * @param   {MazeGenerators.Utils.Vector2}               pos          
             * @param   {MazeGenerators.Utils.Vector2}               direction
             * @return  {boolean}
             */
            CanCarve: function (result, pos, direction) {
                // Must end in bounds.
                var block = MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(direction.$clone(), 3));
                if (!result.IsInRegion(block.$clone())) {
                    return false;
                }

                // Destination must not be open.
                var end = MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(direction.$clone(), 2));
                return !System.Nullable.hasValue(result.GetTile(end.$clone()));
            }
        }
    });

    Bridge.ns("MazeGenerators.RoomMazeGenerator", $asm.$);

    Bridge.apply($asm.$.MazeGenerators.RoomMazeGenerator, {
        f1: function (a) {
            return a;
        }
    });

    Bridge.define("MazeGenerators.RoomMazeGenerator.Result", {
        $kind: "nested class",
        fields: {
            Junctions: null,
            Rooms: null,
            Regions: null
        },
        methods: {
            GetTile: function (pos) {
                return this.Regions.get([pos.X, pos.Y]);
            },
            SetTile: function (pos, regionId) {
                this.Regions.set([pos.X, pos.Y], regionId);
            },
            RemoveTile: function (pos) {
                this.Regions.set([pos.X, pos.Y], null);
            },
            IsInRegion: function (loc) {
                return loc.X >= 0 && loc.Y >= 0 && loc.X < System.Array.getLength(this.Regions, 0) && loc.Y < System.Array.getLength(this.Regions, 1);
            }
        }
    });

    Bridge.define("MazeGenerators.RoomMazeGenerator.Settings", {
        $kind: "nested class",
        fields: {
            Width: 0,
            Height: 0,
            Random: null,
            Directions: null,
            NumRoomTries: 0,
            /**
             * @instance
             * @public
             * @memberof MazeGenerators.RoomMazeGenerator.Settings
             * @default 20
             * @type number
             */
            ExtraConnectorChance: 0,
            /**
             * @instance
             * @public
             * @memberof MazeGenerators.RoomMazeGenerator.Settings
             * @default 0
             * @type number
             */
            RoomExtraSize: 0,
            WindingPercent: 0
        },
        ctors: {
            init: function () {
                this.Random = new System.Random.ctor();
                this.Directions = MazeGenerators.Directions.CardinalDirs;
                this.NumRoomTries = 100;
                this.ExtraConnectorChance = 20;
                this.RoomExtraSize = 0;
                this.WindingPercent = 0;
            },
            ctor: function (width, height) {
                this.$initialize();
                this.Width = width;
                this.Height = height;
            }
        }
    });

    Bridge.define("MazeGenerators.TreeMazeGenerator", {
        methods: {
            Generate: function (settings) {
                var $t;
                if (settings.Width % 2 === 0 || settings.Height % 2 === 0) {
                    throw new System.Exception("The stage must be odd-sized.");
                }

                var result = ($t = new MazeGenerators.TreeMazeGenerator.Result(), $t.Regions = System.Array.create(null, null, System.Nullable$1(System.Int32), settings.Width, settings.Height), $t);

                this.GrowMaze(result, settings, new MazeGenerators.Utils.Vector2.$ctor1(1, 1), 1);

                return result;
            },
            GrowMaze: function (result, settings, start, regionId) {
                var $t;
                var cells = new (System.Collections.Generic.List$1(MazeGenerators.Utils.Vector2)).ctor();

                result.SetTile(start.$clone(), regionId);

                cells.add(start.$clone());

                var lastDir = null;

                while (cells.Count > 0) {
                    var cell = cells.getItem(((cells.Count - 1) | 0)).$clone();

                    var unmadeCells = new (System.Collections.Generic.List$1(MazeGenerators.Utils.Vector2)).ctor();

                    $t = Bridge.getEnumerator(settings.Directions);
                    try {
                        while ($t.moveNext()) {
                            var dir = $t.Current.$clone();
                            if (this.CanCarve(result, cell.$clone(), dir.$clone())) {
                                unmadeCells.add(dir.$clone());
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    if (unmadeCells.Count !== 0) {
                        var dir1 = new MazeGenerators.Utils.Vector2();
                        if (lastDir != null && unmadeCells.contains(System.Nullable.getValue(lastDir).$clone()) && settings.Random.Next$1(100) > settings.WindingPercent) {
                            dir1 = System.Nullable.getValue(lastDir).$clone();
                        } else {
                            dir1 = unmadeCells.getItem(settings.Random.Next$1(unmadeCells.Count)).$clone();
                        }

                        result.SetTile(MazeGenerators.Utils.Vector2.op_Addition(cell.$clone(), dir1.$clone()), regionId);
                        result.SetTile(MazeGenerators.Utils.Vector2.op_Addition(cell.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(dir1.$clone(), 2)), regionId);

                        cells.add(MazeGenerators.Utils.Vector2.op_Addition(cell.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(dir1.$clone(), 2)));
                        lastDir = dir1.$clone();
                    } else {
                        cells.removeAt(((cells.Count - 1) | 0));
                        lastDir = null;
                    }
                }
            },
            CanCarve: function (result, pos, direction) {
                // Must end in bounds.
                var block = MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(direction.$clone(), 3));
                if (!result.IsInRegion(block.$clone())) {
                    return false;
                }

                // Destination must not be open.
                var end = MazeGenerators.Utils.Vector2.op_Addition(pos.$clone(), MazeGenerators.Utils.Vector2.op_Multiply(direction.$clone(), 2));
                return !System.Nullable.hasValue(result.GetTile(end.$clone()));
            }
        }
    });

    Bridge.define("MazeGenerators.TreeMazeGenerator.Result", {
        $kind: "nested class",
        fields: {
            Regions: null
        },
        methods: {
            GetTile: function (pos) {
                return this.Regions.get([pos.X, pos.Y]);
            },
            SetTile: function (pos, regionId) {
                this.Regions.set([pos.X, pos.Y], regionId);
            },
            RemoveTile: function (pos) {
                this.Regions.set([pos.X, pos.Y], null);
            },
            IsInRegion: function (loc) {
                return loc.X >= 0 && loc.Y >= 0 && loc.X < System.Array.getLength(this.Regions, 0) && loc.Y < System.Array.getLength(this.Regions, 1);
            }
        }
    });

    Bridge.define("MazeGenerators.TreeMazeGenerator.Settings", {
        $kind: "nested class",
        fields: {
            Width: 0,
            Height: 0,
            Random: null,
            Directions: null,
            WindingPercent: 0
        },
        ctors: {
            init: function () {
                this.Random = new System.Random.ctor();
                this.Directions = MazeGenerators.Directions.CardinalDirs;
                this.WindingPercent = 100;
            },
            ctor: function (width, height) {
                this.$initialize();
                this.Width = width;
                this.Height = height;
            }
        }
    });

    Bridge.define("MazeGenerators.Utils.Rectangle", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new MazeGenerators.Utils.Rectangle(); }
            }
        },
        fields: {
            X: 0,
            Y: 0,
            Width: 0,
            Height: 0
        },
        ctors: {
            $ctor1: function (x, y, width, height) {
                this.$initialize();
                this.X = x;
                this.Y = y;
                this.Width = width;
                this.Height = height;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            Intersects: function (value) {
                return value.X < ((this.X + this.Width) | 0) && this.X < ((value.X + value.Width) | 0) && value.Y < ((this.Y + this.Height) | 0) && this.Y < ((value.Y + value.Height) | 0);
            },
            getHashCode: function () {
                var h = Bridge.addHash([3771388952, this.X, this.Y, this.Width, this.Height]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, MazeGenerators.Utils.Rectangle)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y) && Bridge.equals(this.Width, o.Width) && Bridge.equals(this.Height, o.Height);
            },
            $clone: function (to) {
                var s = to || new MazeGenerators.Utils.Rectangle();
                s.X = this.X;
                s.Y = this.Y;
                s.Width = this.Width;
                s.Height = this.Height;
                return s;
            }
        }
    });

    Bridge.define("MazeGenerators.Utils.Vector2", {
        $kind: "struct",
        statics: {
            methods: {
                op_Addition: function (a, b) {
                    return new MazeGenerators.Utils.Vector2.$ctor1(((a.X + b.X) | 0), ((a.Y + b.Y) | 0));
                },
                op_Subtraction: function (a, b) {
                    return new MazeGenerators.Utils.Vector2.$ctor1(((a.X - b.X) | 0), ((a.Y - b.Y) | 0));
                },
                op_Multiply: function (a, b) {
                    return new MazeGenerators.Utils.Vector2.$ctor1(Bridge.Int.mul(a.X, b), Bridge.Int.mul(a.Y, b));
                },
                getDefaultValue: function () { return new MazeGenerators.Utils.Vector2(); }
            }
        },
        fields: {
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
            LengthSquared: function () {
                return ((Bridge.Int.mul(this.X, this.X) + Bridge.Int.mul(this.Y, this.Y)) | 0);
            },
            getHashCode: function () {
                var h = Bridge.addHash([1955977157, this.X, this.Y]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, MazeGenerators.Utils.Vector2)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y);
            },
            $clone: function (to) {
                var s = to || new MazeGenerators.Utils.Vector2();
                s.X = this.X;
                s.Y = this.Y;
                return s;
            }
        }
    });
});
