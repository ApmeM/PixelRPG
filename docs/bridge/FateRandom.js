/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("FateRandom", function ($asm, globals) {
    "use strict";

    Bridge.define("FateRandom.IBoolRandom", {
        $kind: "interface"
    });

    Bridge.define("FateRandom.Fate", {
        statics: {
            fields: {
                GlobalFate: null
            },
            ctors: {
                init: function () {
                    this.GlobalFate = new FateRandom.Fate(new FateRandom.RandomGenerator.DefaultRandomGenerator());
                }
            }
        },
        fields: {
            Random: null
        },
        ctors: {
            ctor: function (random) {
                this.$initialize();
                this.Random = random;
            }
        },
        methods: {
            NextFloat: function () {
                return this.Random.FateRandom$IRandomGenerator$NextDouble();
            },
            NextFloat$1: function (max) {
                return this.Random.FateRandom$IRandomGenerator$NextDouble() * max;
            },
            NextInt: function (max) {
                return Bridge.Int.clip32(this.Random.FateRandom$IRandomGenerator$NextDouble() * max);
            },
            NextAngle: function () {
                return this.Random.FateRandom$IRandomGenerator$NextDouble() * Math.PI * 2;
            },
            Range$1: function (min, max) {
                return Bridge.Int.clip32(this.Random.FateRandom$IRandomGenerator$NextDouble() * (((max - min) | 0)) + min);
            },
            Range$2: function (min, max) {
                return this.Random.FateRandom$IRandomGenerator$NextDouble() * (max - min) + min;
            },
            Range: function (min, max) {
                return this.Random.FateRandom$IRandomGenerator$NextDouble() * (max - min) + min;
            },
            Chance$1: function (percent) {
                return this.NextFloat() < percent;
            },
            Chance: function (value) {
                return this.NextInt(100) < value;
            },
            Choose: function (T, first, second) {
                if (this.NextInt(2) === 0) {
                    return first;
                }
                return second;
            },
            Choose$1: function (T, first, second, third) {
                switch (this.NextInt(3)) {
                    case 0: 
                        return first;
                    case 1: 
                        return second;
                    default: 
                        return third;
                }
            },
            Choose$2: function (T, first, second, third, fourth) {
                switch (this.NextInt(4)) {
                    case 0: 
                        return first;
                    case 1: 
                        return second;
                    case 2: 
                        return third;
                    default: 
                        return fourth;
                }
            },
            Choose$4: function (T, list) {
                if (list === void 0) { list = []; }
                return list[System.Array.index(this.NextInt(list.length), list)];
            },
            Choose$3: function (T, list) {
                return System.Array.getItem(list, this.NextInt(System.Array.getCount(list, T)), T);
            },
            GenerateString: function (size) {
                if (size === void 0) { size = 38; }
                var builder = new System.Text.StringBuilder();
                var ch;
                for (var i = 0; i < size; i = (i + 1) | 0) {
                    ch = System.Convert.toChar(this.Range$1(65, 91), null, 9);
                    builder.append(String.fromCharCode(ch));
                }
                return builder.toString();
            },
            Shuffle: function (T, list) {
                var n = System.Array.getCount(list, T);
                while (n > 1) {
                    n = (n - 1) | 0;
                    var k = this.Range$1(0, ((n + 1) | 0));
                    var value = System.Array.getItem(list, k, T);
                    System.Array.setItem(list, k, System.Array.getItem(list, n, T), T);
                    System.Array.setItem(list, n, value, T);
                }
            },
            RandomItems: function (T, source, destination, itemCount) {
                if (itemCount >= System.Array.getCount(source, T)) {
                    destination.AddRange(source);
                    return;
                }

                var set = new (System.Collections.Generic.HashSet$1(T)).ctor();
                while (set.Count !== itemCount) {
                    var item = this.Choose$3(T, source);
                    set.add(item);
                }

                destination.AddRange(set);
            }
        }
    });

    Bridge.define("FateRandom.IRandomGenerator", {
        $kind: "interface"
    });

    Bridge.define("FateRandom.BoolRandomGenerator.DefaultBoolRandom", {
        inherits: [FateRandom.IBoolRandom],
        fields: {
            random: null,
            probability: 0
        },
        alias: ["Chance", "FateRandom$IBoolRandom$Chance"],
        ctors: {
            ctor: function (random, probability) {
                this.$initialize();
                this.random = random;
                this.probability = probability;
            }
        },
        methods: {
            Chance: function () {
                return this.random.FateRandom$IRandomGenerator$NextDouble() < this.probability;
            }
        }
    });

    Bridge.define("FateRandom.BoolRandomGenerator.PredefinedBoolRandom", {
        inherits: [FateRandom.IBoolRandom],
        fields: {
            random: null,
            probabilities: null,
            currentFailLength: 0
        },
        alias: ["Chance", "FateRandom$IBoolRandom$Chance"],
        ctors: {
            init: function () {
                this.currentFailLength = 0;
            },
            ctor: function (random, probabilities) {
                if (probabilities === void 0) { probabilities = []; }

                this.$initialize();
                this.random = random;
                this.probabilities = probabilities;
            }
        },
        methods: {
            Chance: function () {
                var result = this.random.FateRandom$IRandomGenerator$NextDouble() <= this.probabilities[System.Array.index(this.currentFailLength, this.probabilities)];
                this.currentFailLength = (((this.currentFailLength + 1) | 0)) % this.probabilities.length;
                return result;
            }
        }
    });

    Bridge.define("FateRandom.BoolRandomGenerator.PredictedBoolRandom", {
        inherits: [FateRandom.IBoolRandom],
        statics: {
            fields: {
                factorials: null,
                pows: null
            },
            ctors: {
                init: function () {
                    this.factorials = System.Array.init([System.Int64(1), System.Int64(1), System.Int64(2), System.Int64(6), System.Int64(24), System.Int64(120), System.Int64(720), System.Int64(5040), System.Int64(40320), System.Int64(362880), System.Int64(3628800)], System.Int64);
                    this.pows = System.Array.create(System.Int64(0), [[
                        System.Int64(1), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0), 
                        System.Int64(0)
                    ], [
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1), 
                        System.Int64(1)
                    ], [
                        System.Int64(1), 
                        System.Int64(2), 
                        System.Int64(4), 
                        System.Int64(8), 
                        System.Int64(16), 
                        System.Int64(32), 
                        System.Int64(64), 
                        System.Int64(128), 
                        System.Int64(256), 
                        System.Int64(512), 
                        System.Int64(1024)
                    ], [
                        System.Int64(1), 
                        System.Int64(3), 
                        System.Int64(9), 
                        System.Int64(27), 
                        System.Int64(81), 
                        System.Int64(243), 
                        System.Int64(729), 
                        System.Int64(2187), 
                        System.Int64(6561), 
                        System.Int64(19683), 
                        System.Int64(59049)
                    ], [
                        System.Int64(1), 
                        System.Int64(4), 
                        System.Int64(16), 
                        System.Int64(64), 
                        System.Int64(256), 
                        System.Int64(1024), 
                        System.Int64(4096), 
                        System.Int64(16384), 
                        System.Int64(65536), 
                        System.Int64(262144), 
                        System.Int64(1048576)
                    ], [
                        System.Int64(1), 
                        System.Int64(5), 
                        System.Int64(25), 
                        System.Int64(125), 
                        System.Int64(625), 
                        System.Int64(3125), 
                        System.Int64(15625), 
                        System.Int64(78125), 
                        System.Int64(390625), 
                        System.Int64(1953125), 
                        System.Int64(9765625)
                    ], [
                        System.Int64(1), 
                        System.Int64(6), 
                        System.Int64(36), 
                        System.Int64(216), 
                        System.Int64(1296), 
                        System.Int64(7776), 
                        System.Int64(46656), 
                        System.Int64(279936), 
                        System.Int64(1679616), 
                        System.Int64(10077696), 
                        System.Int64(60466176)
                    ], [
                        System.Int64(1), 
                        System.Int64(7), 
                        System.Int64(49), 
                        System.Int64(343), 
                        System.Int64(2401), 
                        System.Int64(16807), 
                        System.Int64(117649), 
                        System.Int64(823543), 
                        System.Int64(5764801), 
                        System.Int64(40353607), 
                        System.Int64(282475249)
                    ], [
                        System.Int64(1), 
                        System.Int64(8), 
                        System.Int64(64), 
                        System.Int64(512), 
                        System.Int64(4096), 
                        System.Int64(32768), 
                        System.Int64(262144), 
                        System.Int64(2097152), 
                        System.Int64(16777216), 
                        System.Int64(134217728), 
                        System.Int64(1073741824)
                    ], [
                        System.Int64(1), 
                        System.Int64(9), 
                        System.Int64(81), 
                        System.Int64(729), 
                        System.Int64(6561), 
                        System.Int64(59049), 
                        System.Int64(531441), 
                        System.Int64(4782969), 
                        System.Int64(43046721), 
                        System.Int64(387420489), 
                        System.Int64(3486784401)
                    ], [
                        System.Int64(1), 
                        System.Int64(10), 
                        System.Int64(100), 
                        System.Int64(1000), 
                        System.Int64(10000), 
                        System.Int64(100000), 
                        System.Int64(1000000), 
                        System.Int64(10000000), 
                        System.Int64(100000000), 
                        System.Int64(1000000000), 
                        System.Int64([1410065408,2])
                    ]], System.Int64, 11, 11);
                }
            }
        },
        fields: {
            random: null,
            probabilities: null,
            currentFailLength: 0
        },
        alias: ["Chance", "FateRandom$IBoolRandom$Chance"],
        ctors: {
            init: function () {
                this.currentFailLength = 0;
            },
            /**
             * @instance
             * @public
             * @this FateRandom.BoolRandomGenerator.PredictedBoolRandom
             * @memberof FateRandom.BoolRandomGenerator.PredictedBoolRandom
             * @param   {FateRandom.IRandomGenerator}    random                 
             * @param   {number}                         maxFailLength          must be between 1 and 10
             * @param   {number}                         expectedProbability    must be between 0 and 1
             * @return  {void}
             */
            ctor: function (random, maxFailLength, expectedProbability) {
                this.$initialize();
                this.random = random;
                this.probabilities = System.Array.init(((maxFailLength + 2) | 0), 0, System.Single);
                var pz = 1 - expectedProbability;
                var l = maxFailLength;
                var koefs = System.Array.init(((l + 1) | 0), 0, System.Single);

                koefs[System.Array.index(0, koefs)] = -pz / ((1 - pz) * System.Int64.toNumber(FateRandom.BoolRandomGenerator.PredictedBoolRandom.factorials[System.Array.index(l, FateRandom.BoolRandomGenerator.PredictedBoolRandom.factorials)]));
                for (var i = 1; i <= l; i = (i + 1) | 0) {
                    koefs[System.Array.index(i, koefs)] = 1.0 / System.Int64.toNumber((FateRandom.BoolRandomGenerator.PredictedBoolRandom.factorials[System.Array.index(((l - i) | 0), FateRandom.BoolRandomGenerator.PredictedBoolRandom.factorials)].mul(FateRandom.BoolRandomGenerator.PredictedBoolRandom.pows.get([l, i]))));
                }

                var p = 1 - this.CalculateProbability(koefs);

                for (var i1 = 0; i1 < ((maxFailLength + 2) | 0); i1 = (i1 + 1) | 0) {
                    this.probabilities[System.Array.index(i1, this.probabilities)] = p + i1 * (1 - p) / maxFailLength;
                }
            }
        },
        methods: {
            CalculateProbability: function (koefs) {
                var left = 0.0;
                var right = 1.0;
                if (Bridge.Int.sign(this.Calculate(koefs, 0)) === Bridge.Int.sign(this.Calculate(koefs, 1))) {
                    throw new System.ArgumentException.$ctor1("Cant find solution for specified arguments.");
                }

                while (left <= right) {
                    var mid = (left + right) / 2.0;
                    var midValue = this.Calculate(koefs, mid);
                    if (Math.abs(midValue) < 0.0001) {
                        return mid;
                    } else if (midValue < 0) {
                        left = mid;
                    } else {
                        right = mid;
                    }
                }

                throw new System.ArgumentException.$ctor1("Cant find solution for specified arguments.");
            },
            Calculate: function (koefs, p) {
                var result = 0.0;
                for (var i = 0; i < koefs.length; i = (i + 1) | 0) {
                    result += koefs[System.Array.index(i, koefs)] * Math.pow(p, i);
                }

                return result;
            },
            Chance: function () {
                var result = this.random.FateRandom$IRandomGenerator$NextDouble() <= this.probabilities[System.Array.index(this.currentFailLength, this.probabilities)];
                this.currentFailLength = (this.currentFailLength + 1) | 0;
                if (result) {
                    this.currentFailLength = 0;
                }

                return result;
            }
        }
    });

    Bridge.define("FateRandom.RandomGenerator.DefaultRandomGenerator", {
        inherits: [FateRandom.IRandomGenerator],
        fields: {
            r: null,
            seed: 0
        },
        props: {
            Seed: {
                get: function () {
                    return this.seed;
                },
                set: function (value) {
                    this.seed = value;
                    this.r = new System.Random.$ctor1(this.seed);
                }
            }
        },
        alias: ["NextDouble", "FateRandom$IRandomGenerator$NextDouble"],
        ctors: {
            ctor: function (seed) {
                if (seed === void 0) { seed = null; }
                var $t;

                this.$initialize();
                this.Seed = ($t = seed, $t != null ? $t : Date.now());
            }
        },
        methods: {
            NextDouble: function () {
                return this.r.NextDouble();
            }
        }
    });

    Bridge.define("FateRandom.RandomGenerator.KnownDataRandomGenerator", {
        inherits: [FateRandom.IRandomGenerator],
        fields: {
            data: null,
            currentData: 0
        },
        alias: ["NextDouble", "FateRandom$IRandomGenerator$NextDouble"],
        ctors: {
            ctor: function (data) {
                if (data === void 0) { data = []; }

                this.$initialize();
                this.data = data;
            }
        },
        methods: {
            NextDouble: function () {
                var result = this.data[System.Array.index(this.currentData, this.data)];
                this.currentData = (((this.currentData + 1) | 0)) % this.data.length;
                return result;
            }
        }
    });

    Bridge.define("FateRandom.RandomGenerator.PregeneratedRandomGenerator", {
        inherits: [FateRandom.IRandomGenerator],
        fields: {
            data: null,
            currentData: 0
        },
        alias: ["NextDouble", "FateRandom$IRandomGenerator$NextDouble"],
        ctors: {
            ctor: function (pregeneratedCount, seed) {
                if (seed === void 0) { seed = null; }
                var $t;

                this.$initialize();
                var r = new System.Random.$ctor1(($t = seed, $t != null ? $t : Date.now()));

                this.data = System.Array.init(pregeneratedCount, 0, System.Double);
                for (var i = 0; i < this.data.length; i = (i + 1) | 0) {
                    this.data[System.Array.index(i, this.data)] = r.NextDouble();
                }
            }
        },
        methods: {
            NextDouble: function () {
                var result = this.data[System.Array.index(this.currentData, this.data)];
                this.currentData = (((this.currentData + 1) | 0)) % this.data.length;
                return result;
            }
        }
    });
});
