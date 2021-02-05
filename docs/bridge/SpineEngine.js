/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("SpineEngine", function ($asm, globals) {
    "use strict";

    Bridge.define("SpineEngine.ContentPaths", {
        statics: {
            fields: {
                spineEngineContent: null
            },
            ctors: {
                init: function () {
                    this.spineEngineContent = "SpineEngineContent";
                }
            }
        }
    });

    Bridge.define("SpineEngine.ContentPaths.SpineEngine", {
        $kind: "nested class"
    });

    Bridge.define("SpineEngine.ContentPaths.SpineEngine.Effects", {
        $kind: "nested class",
        statics: {
            fields: {
                spriteEffect: null
            },
            ctors: {
                init: function () {
                    this.spriteEffect = "SpineEngine/effects/SpriteEffect";
                }
            }
        }
    });

    Bridge.define("SpineEngine.ContentPaths.SpineEngine.Textures", {
        $kind: "nested class",
        statics: {
            fields: {
                pixel: null
            },
            ctors: {
                init: function () {
                    this.pixel = "SpineEngine/textures/pixel";
                }
            }
        }
    });

    Bridge.define("SpineEngine.Core", {
        inherits: [Microsoft.Xna.Framework.Game],
        statics: {
            fields: {
                Instance: null
            }
        },
        fields: {
            globalManagerList: null,
            graphicsDeviceChangeTimer: null,
            nextScene: null,
            scene: null,
            PauseOnFocusLost: false,
            SceneTransition: null
        },
        props: {
            Screen: null,
            Scene: {
                get: function () {
                    return this.scene;
                },
                set: function (value) {
                    this.nextScene = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.globalManagerList = new SpineEngine.GlobalManagers.GlobalManagerList();
                this.PauseOnFocusLost = true;
            },
            ctor: function (width, height, isFullScreen, windowTitle, contentDirectory) {
                if (width === void 0) { width = 1280; }
                if (height === void 0) { height = 720; }
                if (isFullScreen === void 0) { isFullScreen = false; }
                if (windowTitle === void 0) { windowTitle = "SpineEngine"; }
                if (contentDirectory === void 0) { contentDirectory = "Content"; }
                var $t;

                this.$initialize();
                Microsoft.Xna.Framework.Game.ctor.call(this);

                SpineEngine.Core.Instance = this;

                this.Screen = ($t = new SpineEngine.XnaManagers.GlobalGraphicsDeviceManager(this), $t.PreferredBackBufferWidth = width, $t.PreferredBackBufferHeight = height, $t.IsFullScreen = isFullScreen, $t.SynchronizeWithVerticalRetrace = false, $t.PreferredDepthStencilFormat = Microsoft.Xna.Framework.Graphics.DepthFormat.None, $t);
                this.Screen.addDeviceReset(Bridge.fn.cacheBind(this, this.OnGraphicsDeviceReset));
                this.Window.addClientSizeChanged(Bridge.fn.cacheBind(this, this.OnGraphicsDeviceReset));
                this.Window.addOrientationChanged(Bridge.fn.cacheBind(this, this.OnGraphicsDeviceReset));

                this.Content = ($t = new SpineEngine.XnaManagers.GlobalContentManager(), $t.RootDirectory = contentDirectory, $t);
                this.IsMouseVisible = true;
                this.IsFixedTimeStep = false;
                this.TargetElapsedTime = new System.TimeSpan(0, 0, 0, 0, 16);

                // setup systems
                this.globalManagerList.Add(new SpineEngine.GlobalManagers.Coroutines.CoroutineGlobalManager());
                this.globalManagerList.Add(new SpineEngine.GlobalManagers.Tweens.TweenGlobalManager());
                this.globalManagerList.Add(new SpineEngine.GlobalManagers.Timers.TimerGlobalManager());
            }
        },
        methods: {
            OnGraphicsDeviceReset: function (sender, e) {
                if (this.graphicsDeviceChangeTimer != null) {
                    this.graphicsDeviceChangeTimer.Reset();
                } else {
                    this.GetGlobalManager(SpineEngine.GlobalManagers.Timers.TimerGlobalManager).Schedule(0.05, false, Bridge.fn.bind(this, $asm.$.SpineEngine.Core.f1));
                }
            },
            Update: function (gameTime) {
                if (this.PauseOnFocusLost && !this.IsActive) {
                    this.SuppressDraw();
                    return;
                }

                this.globalManagerList.NotifyUpdate(gameTime);

                this.scene != null ? this.scene.Update(gameTime) : null;

                if (!Bridge.referenceEquals(this.scene, this.nextScene)) {
                    this.scene != null ? this.scene.End() : null;

                    this.scene = this.nextScene;

                    this.scene != null ? this.scene.Begin() : null;
                    this.scene != null ? this.scene.Update(gameTime) : null;
                }
            },
            Draw: function (gameTime) {
                if (this.PauseOnFocusLost && !this.IsActive) {
                    return;
                }


                this.SceneTransition != null ? this.SceneTransition.PreRender() : null;
                this.scene != null ? this.scene.Render(this.SceneTransition != null ? this.SceneTransition.PreviousSceneRender : null) : null;
                this.SceneTransition != null ? this.SceneTransition.Render() : null;
            },
            SwitchScene: function (newScene) {
                var transition = new SpineEngine.Graphics.Transitions.QuickTransition();
                this.SwitchScene$1(newScene, transition);
            },
            SwitchScene$1: function (newScene, transition) {
                transition.SceneLoadAction = function () {
                    return newScene;
                };
                this.SwitchScene$2(transition);
            },
            SwitchScene$2: function (transition) {

                if (Bridge.staticEquals(transition.SceneLoadAction, null)) {
                    transition.SceneLoadAction = Bridge.fn.bind(this, $asm.$.SpineEngine.Core.f2);
                }

                this.SceneTransition = transition;

                this.GetGlobalManager(SpineEngine.GlobalManagers.Coroutines.CoroutineGlobalManager).StartCoroutine(this.SceneTransition.OnBeginTransition());
            },
            AddGlobalManager: function (manager) {
                this.globalManagerList.Add(manager);
            },
            RemoveGlobalManager: function (manager) {
                this.globalManagerList.Remove(manager);
            },
            GetGlobalManager: function (T) {
                return this.globalManagerList.GetGlobalManager(T);
            }
        }
    });

    Bridge.ns("SpineEngine.Core", $asm.$);

    Bridge.apply($asm.$.SpineEngine.Core, {
        f1: function (t) {
            this.graphicsDeviceChangeTimer = null;
            this.scene != null ? this.scene.OnGraphicsDeviceReset() : null;
            this.nextScene != null ? this.nextScene.OnGraphicsDeviceReset() : null;
        },
        f2: function () {
            return this.scene;
        }
    });

    Bridge.define("SpineEngine.Debug.Assert", {
        statics: {
            methods: {
                BreakIf: function (condition) {
                    if (condition) {
                        debugger;
                    }
                },
                Break: function () {
                    debugger;
                },
                Fail: function () { },
                Fail$1: function (message, args) {
                    if (args === void 0) { args = []; }
                },
                IsTrue: function (condition) {
                    if (!condition) {
                    }
                },
                IsTrue$1: function (condition, message, args) {
                    if (args === void 0) { args = []; }
                    if (!condition) {
                    }
                },
                IsFalse: function (condition) { },
                IsFalse$1: function (condition, message, args) {
                    if (args === void 0) { args = []; }
                },
                /**
                 * asserts that obj is null
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Debug.Assert
                 * @memberof SpineEngine.Debug.Assert
                 * @param   {System.Object}    obj    Object.
                 * @return  {void}
                 */
                IsNull: function (obj) { },
                /**
                 * asserts that obj is null
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Debug.Assert
                 * @memberof SpineEngine.Debug.Assert
                 * @param   {System.Object}            obj        Object.
                 * @param   {string}                   message    Message.
                 * @param   {Array.<System.Object>}    args       Arguments.
                 * @return  {void}
                 */
                IsNull$1: function (obj, message, args) {
                    if (args === void 0) { args = []; }
                },
                /**
                 * asserts that obj is not null
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Debug.Assert
                 * @memberof SpineEngine.Debug.Assert
                 * @param   {System.Object}    obj    Object.
                 * @return  {void}
                 */
                IsNotNull: function (obj) { },
                /**
                 * asserts that obj is not null
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Debug.Assert
                 * @memberof SpineEngine.Debug.Assert
                 * @param   {System.Object}            obj        Object.
                 * @param   {string}                   message    Message.
                 * @param   {Array.<System.Object>}    args       Arguments.
                 * @return  {void}
                 */
                IsNotNull$1: function (obj, message, args) {
                    if (args === void 0) { args = []; }
                },
                /**
                 * asserts that first is equal to second
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Debug.Assert
                 * @memberof SpineEngine.Debug.Assert
                 * @param   {System.Object}            first      First.
                 * @param   {System.Object}            second     Second.
                 * @param   {string}                   message    Message.
                 * @param   {Array.<System.Object>}    args       Arguments.
                 * @return  {void}
                 */
                AreEqual: function (first, second, message, args) {
                    if (args === void 0) { args = []; }
                    if (!Bridge.referenceEquals(first, second)) {
                    }
                },
                /**
                 * asserts that first is not equal to second
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Debug.Assert
                 * @memberof SpineEngine.Debug.Assert
                 * @param   {System.Object}            first      First.
                 * @param   {System.Object}            second     Second.
                 * @param   {string}                   message    Message.
                 * @param   {Array.<System.Object>}    args       Arguments.
                 * @return  {void}
                 */
                AreNotEqual: function (first, second, message, args) {
                    if (args === void 0) { args = []; }
                    if (Bridge.referenceEquals(first, second)) {
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.Debug.Logger", {
        statics: {
            methods: {
                Log$2: function (type, format, args) {
                    if (args === void 0) { args = []; }
                    switch (type) {
                        case SpineEngine.Debug.Logger.LogType.Error: 
                            break;
                        case SpineEngine.Debug.Logger.LogType.Warn: 
                            break;
                        case SpineEngine.Debug.Logger.LogType.Log: 
                            break;
                        case SpineEngine.Debug.Logger.LogType.Info: 
                            break;
                        case SpineEngine.Debug.Logger.LogType.Trace: 
                            break;
                        default: 
                            throw new System.ArgumentOutOfRangeException.ctor();
                    }
                },
                Log: function (obj) {
                    SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Log, "{0}", [obj]);
                },
                Log$1: function (format, args) {
                    if (args === void 0) { args = []; }
                    SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Log, format, args);
                },
                Error: function (format, args) {
                    if (args === void 0) { args = []; }
                    SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Error, format, args);
                },
                ErrorIf: function (condition, format, args) {
                    if (args === void 0) { args = []; }
                    if (condition) {
                        SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Error, format, args);
                    }
                },
                Warn: function (format, args) {
                    if (args === void 0) { args = []; }
                    SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Warn, format, args);
                },
                WarnIf: function (condition, format, args) {
                    if (args === void 0) { args = []; }
                    if (condition) {
                        SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Warn, format, args);
                    }
                },
                LogIf: function (condition, format, args) {
                    if (args === void 0) { args = []; }
                    if (condition) {
                        SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Log, format, args);
                    }
                },
                Info: function (format, args) {
                    if (args === void 0) { args = []; }
                    SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Info, format, args);
                },
                Trace: function (format, args) {
                    if (args === void 0) { args = []; }
                    SpineEngine.Debug.Logger.Log$2(SpineEngine.Debug.Logger.LogType.Trace, format, args);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Debug.Logger.LogType", {
        $kind: "nested enum",
        statics: {
            fields: {
                Error: 0,
                Warn: 1,
                Log: 2,
                Info: 3,
                Trace: 4
            }
        }
    });

    /** @namespace SpineEngine.ECS.Components */

    /**
     * Require SpriteComponent. If it not exists - it will be created automatically by EntitySystem.
     *
     * @public
     * @class SpineEngine.ECS.Components.AnimationSpriteComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.AnimationSpriteComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Animation: null,
            CurrentFrame: 0,
            DelayComplete: false,
            ElapsedDelay: 0,
            ExecutingAnimation: null,
            isPlaying: false,
            IsReversed: false,
            StartFrame: 0
        },
        events: {
            OnAnimationCompletedEvent: null
        },
        props: {
            TotalElapsedTime: 0,
            IsLoopingBackOnPingPong: false,
            CompletedIterations: 0,
            IsPlaying: {
                get: function () {
                    return this.isPlaying;
                },
                set: function (value) {
                    if (this.isPlaying === value) {
                        return;
                    }

                    this.isPlaying = value;
                    if (this.isPlaying) {
                        this.TotalElapsedTime = 0;
                    }
                }
            }
        },
        methods: {
            NotifyAninmationCompleted: function () {
                !Bridge.staticEquals(this.OnAnimationCompletedEvent, null) ? this.OnAnimationCompletedEvent() : null;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.CameraComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            Camera: null
        }
    });

    Bridge.define("SpineEngine.ECS.Components.ColorComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            color: null
        },
        events: {
            OnChange: null
        },
        props: {
            Color: {
                get: function () {
                    return this.color.$clone();
                },
                set: function (value) {
                    if (Microsoft.Xna.Framework.Color.op_Equality(this.color.$clone(), value.$clone())) {
                        return;
                    }

                    this.color = value.$clone();
                    !Bridge.staticEquals(this.OnChange, null) ? this.OnChange() : null;
                }
            }
        },
        ctors: {
            init: function () {
                this.color = new Microsoft.Xna.Framework.Color();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (color) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.color = color.$clone();
            }
        }
    });

    /**
     * Component that check if cursor (touch or mouse) over the specified region on this entity.
         System takes in account current entity position.
     *
     * @public
     * @class SpineEngine.ECS.Components.CursorOverComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.CursorOverComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            IsMouseOver: false,
            OverRegion: null
        },
        ctors: {
            init: function () {
                this.OverRegion = new SpineEngine.Maths.RectangleF();
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.DepthLayerComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            depth: 0
        },
        events: {
            OnChange: null
        },
        props: {
            Depth: {
                get: function () {
                    return this.depth;
                },
                set: function (value) {
                    if (this.depth === value) {
                        return;
                    }

                    this.depth = value;
                    !Bridge.staticEquals(this.OnChange, null) ? this.OnChange() : null;
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (depth) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.depth = depth;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.FinalRenderComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            Batch: null
        },
        ctors: {
            init: function () {
                this.Batch = new SpineEngine.Graphics.Meshes.MeshBatch();
            }
        }
    });

    /**
     * Input component that is filled by InputGamePadUpdateSystem for game pad data
     *
     * @public
     * @class SpineEngine.ECS.Components.InputGamePadComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.InputGamePadComponent", {
        inherits: [LocomotorECS.Component],
        statics: {
            fields: {
                DEFAULT_DEADZONE: 0
            },
            ctors: {
                init: function () {
                    this.DEFAULT_DEADZONE = 0.1;
                }
            }
        },
        fields: {
            CurrentState: null,
            /**
             * toggles inverting the left sticks vertical value
             *
             * @instance
             * @public
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @default false
             * @type boolean
             */
            IsLeftStickVerticalInverted: false,
            /**
             * toggles inverting the right sticks vertical value
             *
             * @instance
             * @public
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @default false
             * @type boolean
             */
            IsRightStickVerticalInverted: false,
            PlayerIndex: 0,
            PreviousState: null,
            RumbleTime: 0,
            ThisTickConnected: false,
            ThisTickDisconnected: false
        },
        props: {
            /**
             * true the entire time the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadLeftDown
             * @type boolean
             */
            DpadLeftDown: {
                get: function () {
                    return this.CurrentState.DPad.Left === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the first frame the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadLeftPressed
             * @type boolean
             */
            DpadLeftPressed: {
                get: function () {
                    return this.CurrentState.DPad.Left === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousState.DPad.Left === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true only the frame the dpad is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadLeftReleased
             * @type boolean
             */
            DpadLeftReleased: {
                get: function () {
                    return this.CurrentState.DPad.Left === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousState.DPad.Left === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true the entire time the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadRightDown
             * @type boolean
             */
            DpadRightDown: {
                get: function () {
                    return this.CurrentState.DPad.Right === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the first frame the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadRightPressed
             * @type boolean
             */
            DpadRightPressed: {
                get: function () {
                    return this.CurrentState.DPad.Right === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousState.DPad.Right === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true only the frame the dpad is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadRightReleased
             * @type boolean
             */
            DpadRightReleased: {
                get: function () {
                    return this.CurrentState.DPad.Right === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousState.DPad.Right === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true the entire time the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadUpDown
             * @type boolean
             */
            DpadUpDown: {
                get: function () {
                    return this.CurrentState.DPad.Up === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the first frame the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadUpPressed
             * @type boolean
             */
            DpadUpPressed: {
                get: function () {
                    return this.CurrentState.DPad.Up === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousState.DPad.Up === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true only the frame the dpad is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadUpReleased
             * @type boolean
             */
            DpadUpReleased: {
                get: function () {
                    return this.CurrentState.DPad.Up === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousState.DPad.Up === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true the entire time the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadDownDown
             * @type boolean
             */
            DpadDownDown: {
                get: function () {
                    return this.CurrentState.DPad.Down === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the first frame the dpad is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadDownPressed
             * @type boolean
             */
            DpadDownPressed: {
                get: function () {
                    return this.CurrentState.DPad.Down === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousState.DPad.Down === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true only the frame the dpad is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @function DpadDownReleased
             * @type boolean
             */
            DpadDownReleased: {
                get: function () {
                    return this.CurrentState.DPad.Down === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousState.DPad.Down === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            }
        },
        ctors: {
            init: function () {
                this.CurrentState = new Microsoft.Xna.Framework.Input.GamePadState();
                this.PreviousState = new Microsoft.Xna.Framework.Input.GamePadState();
                this.IsLeftStickVerticalInverted = false;
                this.IsRightStickVerticalInverted = false;
                this.ThisTickConnected = false;
                this.ThisTickDisconnected = false;
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.PlayerIndex = 0;
                this.PreviousState = new Microsoft.Xna.Framework.Input.GamePadState.ctor();
                this.CurrentState = Microsoft.Xna.Framework.Input.GamePad.GetState(this.PlayerIndex);
            },
            $ctor1: function (playerIndex) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.PlayerIndex = playerIndex;
                this.PreviousState = new Microsoft.Xna.Framework.Input.GamePadState.ctor();
                this.CurrentState = Microsoft.Xna.Framework.Input.GamePad.GetState(this.PlayerIndex);
            }
        },
        methods: {
            SetVibration: function (left, right, duration) {
                this.RumbleTime = duration;
                Microsoft.Xna.Framework.Input.GamePad.SetVibration(this.PlayerIndex, left, right);
            },
            StopVibration: function () {
                Microsoft.Xna.Framework.Input.GamePad.SetVibration(this.PlayerIndex, 0, 0);
                this.RumbleTime = 0.0;
            },
            /**
             * returns true if this game pad is connected
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @return  {boolean}        <pre><code>true</code></pre>, if connected was ised, <pre><code>false</code></pre> otherwise.
             */
            IsConnected: function () {
                return this.CurrentState.IsConnected;
            },
            /**
             * only true if down this frame
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {Microsoft.Xna.Framework.Input.Buttons}    button    Button.
             * @return  {boolean}                                            <pre><code>true</code></pre>, if button pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsButtonPressed: function (button) {
                return this.CurrentState.IsButtonDown(button) && !this.PreviousState.IsButtonDown(button);
            },
            /**
             * true the entire time the button is down
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {Microsoft.Xna.Framework.Input.Buttons}    button    Button.
             * @return  {boolean}                                            <pre><code>true</code></pre>, if button down was ised, <pre><code>false</code></pre> otherwise.
             */
            IsButtonDown: function (button) {
                return this.CurrentState.IsButtonDown(button);
            },
            /**
             * true only the frame the button is released
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {Microsoft.Xna.Framework.Input.Buttons}    button    Button.
             * @return  {boolean}                                            <pre><code>true</code></pre>, if button released was ised, <pre><code>false</code></pre> otherwise.
             */
            IsButtonReleased: function (button) {
                return !this.CurrentState.IsButtonDown(button) && this.PreviousState.IsButtonDown(button);
            },
            GetLeftStick: function () {
                var res = this.CurrentState.ThumbSticks.Left.$clone();

                if (this.IsLeftStickVerticalInverted) {
                    res.Y = -res.Y;
                }

                return res.$clone();
            },
            GetLeftStick$1: function (deadzone) {
                var res = this.CurrentState.ThumbSticks.Left.$clone();

                if (res.LengthSquared() < deadzone * deadzone) {
                    res = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                } else {
                    if (this.IsLeftStickVerticalInverted) {
                        res.Y = -res.Y;
                    }
                }

                return res.$clone();
            },
            GetRightStick: function () {
                var res = this.CurrentState.ThumbSticks.Right.$clone();

                if (this.IsRightStickVerticalInverted) {
                    res.Y = -res.Y;
                }

                return res.$clone();
            },
            GetRightStick$1: function (deadzone) {
                var res = this.CurrentState.ThumbSticks.Right.$clone();

                if (res.LengthSquared() < deadzone * deadzone) {
                    res = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                } else {
                    if (this.IsRightStickVerticalInverted) {
                        res.Y = -res.Y;
                    }
                }

                return res.$clone();
            },
            IsLeftStickLeft: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.X < -deadzone;
            },
            /**
             * true only the frame the stick passes the deadzone in the direction
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     deadzone    Deadzone.
             * @return  {boolean}                <pre><code>true</code></pre>, if left stick left pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftStickLeftPressed: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.X < -deadzone && this.PreviousState.ThumbSticks.Left.X > -deadzone;
            },
            IsLeftStickRight: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.X > deadzone;
            },
            /**
             * true only the frame the stick passes the deadzone in the direction
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     deadzone    Deadzone.
             * @return  {boolean}                <pre><code>true</code></pre>, if left stick right pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftStickRightPressed: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.X > deadzone && this.PreviousState.ThumbSticks.Left.X < deadzone;
            },
            IsLeftStickUp: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.Y > deadzone;
            },
            /**
             * true only the frame the stick passes the deadzone in the direction
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     deadzone    Deadzone.
             * @return  {boolean}                <pre><code>true</code></pre>, if left stick up pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftStickUpPressed: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.Y > deadzone && this.PreviousState.ThumbSticks.Left.Y < deadzone;
            },
            IsLeftStickDown: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.Y < -deadzone;
            },
            /**
             * true only the frame the stick passes the deadzone in the direction
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     deadzone    Deadzone.
             * @return  {boolean}                <pre><code>true</code></pre>, if left stick down pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftStickDownPressed: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Left.Y < -deadzone && this.PreviousState.ThumbSticks.Left.Y > -deadzone;
            },
            IsRightStickLeft: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Right.X < -deadzone;
            },
            IsRightStickRight: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Right.X > deadzone;
            },
            IsRightStickUp: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Right.Y > deadzone;
            },
            IsRightStickDown: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }
                return this.CurrentState.ThumbSticks.Right.Y < -deadzone;
            },
            GetLeftTriggerRaw: function () {
                return this.CurrentState.Triggers.Left;
            },
            GetRightTriggerRaw: function () {
                return this.CurrentState.Triggers.Right;
            },
            /**
             * true whenever the trigger is down past the threshold
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     threshold    Threshold.
             * @return  {boolean}                 <pre><code>true</code></pre>, if left trigger down was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftTriggerDown: function (threshold) {
                if (threshold === void 0) { threshold = 0.2; }
                return this.CurrentState.Triggers.Left > threshold;
            },
            /**
             * true only the frame that the trigger passed the threshold
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     threshold    Threshold.
             * @return  {boolean}                 <pre><code>true</code></pre>, if left trigger pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftTriggerPressed: function (threshold) {
                if (threshold === void 0) { threshold = 0.2; }
                return this.CurrentState.Triggers.Left > threshold && this.PreviousState.Triggers.Left < threshold;
            },
            /**
             * true the frame the trigger is released
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     threshold    Threshold.
             * @return  {boolean}                 <pre><code>true</code></pre>, if left trigger released was ised, <pre><code>false</code></pre> otherwise.
             */
            IsLeftTriggerReleased: function (threshold) {
                if (threshold === void 0) { threshold = 0.2; }
                return this.CurrentState.Triggers.Left < threshold && this.PreviousState.Triggers.Left > threshold;
            },
            /**
             * true whenever the trigger is down past the threshold
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     threshold    Threshold.
             * @return  {boolean}                 <pre><code>true</code></pre>, if left trigger down was ised, <pre><code>false</code></pre> otherwise.
             */
            IsRightTriggerDown: function (threshold) {
                if (threshold === void 0) { threshold = 0.2; }
                return this.CurrentState.Triggers.Right > threshold;
            },
            /**
             * true only the frame that the trigger passed the threshold
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     threshold    Threshold.
             * @return  {boolean}                 <pre><code>true</code></pre>, if left trigger pressed was ised, <pre><code>false</code></pre> otherwise.
             */
            IsRightTriggerPressed: function (threshold) {
                if (threshold === void 0) { threshold = 0.2; }
                return this.CurrentState.Triggers.Right > threshold && this.PreviousState.Triggers.Right < threshold;
            },
            /**
             * true the frame the trigger is released
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputGamePadComponent
             * @memberof SpineEngine.ECS.Components.InputGamePadComponent
             * @param   {number}     threshold    Threshold.
             * @return  {boolean}                 <pre><code>true</code></pre>, if left trigger released was ised, <pre><code>false</code></pre> otherwise.
             */
            IsRightTriggerReleased: function (threshold) {
                if (threshold === void 0) { threshold = 0.2; }
                return this.CurrentState.Triggers.Right < threshold && this.PreviousState.Triggers.Right > threshold;
            }
        }
    });

    /**
     * Input component that is filled by InputKayboardUpdateSystem for keyboard data
     *
     * @public
     * @class SpineEngine.ECS.Components.InputKeyboardComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.InputKeyboardComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            IsShiftDown: {
                get: function () {
                    return this.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.LeftShift) || this.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.RightShift);
                }
            },
            IsAltDown: {
                get: function () {
                    return this.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.LeftAlt) || this.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.RightAlt);
                }
            },
            IsControlDown: {
                get: function () {
                    return this.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.LeftControl) || this.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.RightControl);
                }
            },
            PreviousKeyboardState: null,
            CurrentKeyboardState: null
        },
        ctors: {
            init: function () {
                this.PreviousKeyboardState = new Microsoft.Xna.Framework.Input.KeyboardState();
                this.CurrentKeyboardState = new Microsoft.Xna.Framework.Input.KeyboardState();
            }
        },
        methods: {
            /**
             * only true if down this frame
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputKeyboardComponent
             * @memberof SpineEngine.ECS.Components.InputKeyboardComponent
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key
             * @return  {boolean}                                      <pre><code>true</code></pre>, if key pressed was gotten, <pre><code>false</code></pre> otherwise.
             */
            IsKeyPressed: function (key) {
                return this.CurrentKeyboardState.IsKeyDown(key) && !this.PreviousKeyboardState.IsKeyDown(key);
            },
            /**
             * true the entire time the key is down
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputKeyboardComponent
             * @memberof SpineEngine.ECS.Components.InputKeyboardComponent
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key
             * @return  {boolean}                                      <pre><code>true</code></pre>, if key down was gotten, <pre><code>false</code></pre> otherwise.
             */
            IsKeyDown: function (key) {
                return this.CurrentKeyboardState.IsKeyDown(key);
            },
            /**
             * true only the frame the key is released
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Components.InputKeyboardComponent
             * @memberof SpineEngine.ECS.Components.InputKeyboardComponent
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key
             * @return  {boolean}                                      <pre><code>true</code></pre>, if key up was gotten, <pre><code>false</code></pre> otherwise.
             */
            IsKeyReleased: function (key) {
                return !this.CurrentKeyboardState.IsKeyDown(key) && this.PreviousKeyboardState.IsKeyDown(key);
            },
            GetDownKeys: function () {
                return this.CurrentKeyboardState.GetPressedKeys();
            }
        }
    });

    /**
     * Input component that is filled by InputMouseUpdateSystem for mouse data
     *
     * @public
     * @class SpineEngine.ECS.Components.InputMouseComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.InputMouseComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            ResolutionOffset: null,
            ResolutionScale: null
        },
        props: {
            PreviousMouseState: null,
            CurrentMouseState: null,
            /**
             * only true if down this frame
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function LeftMouseButtonPressed
             * @type boolean
             */
            LeftMouseButtonPressed: {
                get: function () {
                    return this.CurrentMouseState.LeftButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousMouseState.LeftButton === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true while the button is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function LeftMouseButtonDown
             * @type boolean
             */
            LeftMouseButtonDown: {
                get: function () {
                    return this.CurrentMouseState.LeftButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the frame the button is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function LeftMouseButtonReleased
             * @type boolean
             */
            LeftMouseButtonReleased: {
                get: function () {
                    return this.CurrentMouseState.LeftButton === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousMouseState.LeftButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * only true if pressed this frame
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function RightMouseButtonPressed
             * @type boolean
             */
            RightMouseButtonPressed: {
                get: function () {
                    return this.CurrentMouseState.RightButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousMouseState.RightButton === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true while the button is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function RightMouseButtonDown
             * @type boolean
             */
            RightMouseButtonDown: {
                get: function () {
                    return this.CurrentMouseState.RightButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the frame the button is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function RightMouseButtonReleased
             * @type boolean
             */
            RightMouseButtonReleased: {
                get: function () {
                    return this.CurrentMouseState.RightButton === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousMouseState.RightButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * only true if down this frame
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function MiddleMouseButtonPressed
             * @type boolean
             */
            MiddleMouseButtonPressed: {
                get: function () {
                    return this.CurrentMouseState.MiddleButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.PreviousMouseState.MiddleButton === Microsoft.Xna.Framework.Input.ButtonState.Released;
                }
            },
            /**
             * true while the button is down
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function MiddleMouseButtonDown
             * @type boolean
             */
            MiddleMouseButtonDown: {
                get: function () {
                    return this.CurrentMouseState.MiddleButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * true only the frame the button is released
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function MiddleMouseButtonReleased
             * @type boolean
             */
            MiddleMouseButtonReleased: {
                get: function () {
                    return this.CurrentMouseState.MiddleButton === Microsoft.Xna.Framework.Input.ButtonState.Released && this.PreviousMouseState.MiddleButton === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
                }
            },
            /**
             * gets the raw ScrollWheelValue
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function MouseWheel
             * @type number
             */
            MouseWheel: {
                get: function () {
                    return this.CurrentMouseState.ScrollWheelValue;
                }
            },
            /**
             * gets the delta ScrollWheelValue
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function MouseWheelDelta
             * @type number
             */
            MouseWheelDelta: {
                get: function () {
                    return ((this.CurrentMouseState.ScrollWheelValue - this.PreviousMouseState.ScrollWheelValue) | 0);
                }
            },
            /**
             * unscaled mouse position. This is the actual screen space value
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function RawMousePosition
             * @type Microsoft.Xna.Framework.Point
             */
            RawMousePosition: {
                get: function () {
                    return new Microsoft.Xna.Framework.Point.$ctor2(this.CurrentMouseState.X, this.CurrentMouseState.Y);
                }
            },
            /**
             * alias for scaledMousePosition
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function MousePosition
             * @type Microsoft.Xna.Framework.Vector2
             */
            MousePosition: {
                get: function () {
                    return this.ScaledMousePosition.$clone();
                }
            },
            /**
             * this takes into account the SceneResolutionPolicy and returns the value scaled to the RenderTargets coordinates
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Components.InputMouseComponent
             * @function ScaledMousePosition
             * @type Microsoft.Xna.Framework.Vector2
             */
            ScaledMousePosition: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Multiply(new Microsoft.Xna.Framework.Vector2.$ctor2(((this.CurrentMouseState.X - this.ResolutionOffset.X) | 0), ((this.CurrentMouseState.Y - this.ResolutionOffset.Y) | 0)), this.ResolutionScale.$clone());
                }
            },
            MousePositionDelta: {
                get: function () {
                    return Microsoft.Xna.Framework.Point.op_Subtraction(new Microsoft.Xna.Framework.Point.$ctor2(this.CurrentMouseState.X, this.CurrentMouseState.Y), new Microsoft.Xna.Framework.Point.$ctor2(this.PreviousMouseState.X, this.PreviousMouseState.Y));
                }
            },
            ScaledMousePositionDelta: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Subtraction(this.ScaledMousePosition.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply(new Microsoft.Xna.Framework.Vector2.$ctor2(((this.PreviousMouseState.X - this.ResolutionOffset.X) | 0), ((this.PreviousMouseState.Y - this.ResolutionOffset.Y) | 0)), this.ResolutionScale.$clone()));
                }
            }
        },
        ctors: {
            init: function () {
                this.ResolutionOffset = new Microsoft.Xna.Framework.Point();
                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2();
                this.ResolutionScale = Microsoft.Xna.Framework.Vector2.One.$clone();
                this.PreviousMouseState = new Microsoft.Xna.Framework.Input.MouseState();
                this.CurrentMouseState = new Microsoft.Xna.Framework.Input.MouseState();
            }
        }
    });

    /**
     * Require SpriteComponent. If it not exists - it will be created automatically by EntitySystem.
     *
     * @public
     * @class SpineEngine.ECS.Components.InputTouchComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.InputTouchComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            PreviousGestures: null,
            PreviousTouches: null,
            ResolutionOffset: null,
            ResolutionScale: null
        },
        props: {
            IsConnected: false,
            CurrentTouches: null,
            CurrentGestures: null
        },
        ctors: {
            init: function () {
                this.PreviousTouches = new Microsoft.Xna.Framework.Input.Touch.TouchCollection();
                this.ResolutionOffset = new Microsoft.Xna.Framework.Point();
                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2();
                this.PreviousGestures = new (System.Collections.Generic.List$1(Microsoft.Xna.Framework.Input.Touch.GestureSample)).ctor();
                this.ResolutionScale = Microsoft.Xna.Framework.Vector2.One.$clone();
                this.CurrentTouches = new Microsoft.Xna.Framework.Input.Touch.TouchCollection();
                this.CurrentGestures = new (System.Collections.Generic.List$1(Microsoft.Xna.Framework.Input.Touch.GestureSample)).ctor();
            }
        },
        methods: {
            GetScaledPosition: function (position) {
                return Microsoft.Xna.Framework.Vector2.op_Multiply(new Microsoft.Xna.Framework.Vector2.$ctor2(position.X - this.ResolutionOffset.X, position.Y - this.ResolutionOffset.Y), this.ResolutionScale.$clone());
            }
        }
    });

    /**
     * Input component that is filled by InputVirtualUpdateSystem for mapping real inputs to virtual inputs.
     *
     * @public
     * @class SpineEngine.ECS.Components.InputVirtualComponent
     * @augments LocomotorECS.Component
     */
    Bridge.define("SpineEngine.ECS.Components.InputVirtualComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            InputConfiguration: null
        },
        ctors: {
            init: function () {
                this.InputConfiguration = new (System.Collections.Generic.List$1(SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput)).ctor();
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.MaterialComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Material: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Material = new SpineEngine.Graphics.Materials.Material();
            },
            $ctor1: function (material) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Material = material;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.ParentComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            parent: null
        },
        events: {
            OnChange: null
        },
        props: {
            Parent: {
                get: function () {
                    return this.parent;
                },
                set: function (value) {
                    if (Bridge.referenceEquals(this.parent, value)) {
                        return;
                    }

                    this.parent = value;
                    !Bridge.staticEquals(this.OnChange, null) ? this.OnChange() : null;
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (parent) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.parent = parent;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.PositionComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            position: null
        },
        events: {
            OnChange: null
        },
        props: {
            Position: {
                get: function () {
                    return this.position.$clone();
                },
                set: function (value) {
                    if (Microsoft.Xna.Framework.Vector2.op_Equality(this.position.$clone(), value.$clone())) {
                        return;
                    }

                    this.position = value.$clone();
                    !Bridge.staticEquals(this.OnChange, null) ? this.OnChange() : null;
                }
            }
        },
        ctors: {
            init: function () {
                this.position = new Microsoft.Xna.Framework.Vector2();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor2: function (x, y) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.position = new Microsoft.Xna.Framework.Vector2.$ctor2(x, y);
            },
            $ctor1: function (position) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.position = position.$clone();
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.RenderLayerComponent", {
        inherits: [LocomotorECS.Component],
        props: {
            Layer: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (layer) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Layer = layer;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.RenderOrderComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            order: 0
        },
        events: {
            RenderOrderChanged: null
        },
        props: {
            Order: {
                get: function () {
                    return this.order;
                },
                set: function (value) {
                    if (this.order !== value) {
                        !Bridge.staticEquals(this.RenderOrderChanged, null) ? this.RenderOrderChanged() : null;
                        this.order = value;
                    }
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (order) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Order = order;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.RotateComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            rotation: 0
        },
        events: {
            OnChange: null
        },
        props: {
            Rotation: {
                get: function () {
                    return this.rotation;
                },
                set: function (value) {
                    if (this.rotation === value) {
                        return;
                    }

                    this.rotation = value;
                    !Bridge.staticEquals(this.OnChange, null) ? this.OnChange() : null;
                }
            },
            RotationDegrees: {
                get: function () {
                    return Microsoft.Xna.Framework.MathHelper.ToDegrees(this.Rotation);
                },
                set: function (value) {
                    this.Rotation = Microsoft.Xna.Framework.MathHelper.ToRadians(value);
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (rotation) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.rotation = rotation;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.ScaleComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            scale: null
        },
        events: {
            OnChange: null
        },
        props: {
            Scale: {
                get: function () {
                    return this.scale.$clone();
                },
                set: function (value) {
                    if (Microsoft.Xna.Framework.Vector2.op_Equality(this.scale.$clone(), value.$clone())) {
                        return;
                    }

                    this.scale = value.$clone();
                    !Bridge.staticEquals(this.OnChange, null) ? this.OnChange() : null;
                }
            }
        },
        ctors: {
            init: function () {
                this.scale = new Microsoft.Xna.Framework.Vector2();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor2: function (x, y) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.scale = new Microsoft.Xna.Framework.Vector2.$ctor2(x, y);
            },
            $ctor1: function (position) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.scale = position.$clone();
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.SpriteComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            Drawable: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor3: function (drawable) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.Drawable = drawable;
            },
            $ctor2: function (texture) {
                SpineEngine.ECS.Components.SpriteComponent.$ctor3.call(this, new SpineEngine.Graphics.Drawable.SubtextureDrawable.ctor(texture));
            },
            $ctor4: function (texture) {
                SpineEngine.ECS.Components.SpriteComponent.$ctor3.call(this, new SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor5(texture));
            },
            $ctor1: function (color) {
                SpineEngine.ECS.Components.SpriteComponent.$ctor3.call(this, new SpineEngine.Graphics.Drawable.PrimitiveDrawable(color.$clone()));
            }
        }
    });

    Bridge.define("SpineEngine.ECS.Components.SpriteEffectsComponent", {
        inherits: [LocomotorECS.Component],
        fields: {
            SpriteEffects: 0
        },
        ctors: {
            init: function () {
                this.SpriteEffects = Microsoft.Xna.Framework.Graphics.SpriteEffects.None;
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
            },
            $ctor1: function (spriteEffects) {
                this.$initialize();
                LocomotorECS.Component.ctor.call(this);
                this.SpriteEffects = spriteEffects;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.Animation.AnimationCompletionBehavior", {
        $kind: "enum",
        statics: {
            fields: {
                RemainOnFinalFrame: 0,
                RevertToFirstFrame: 1,
                HideSprite: 2
            }
        }
    });

    /** @namespace SpineEngine.ECS.EntitySystems.Animation */

    /**
     * houses the information that a SpriteT requires for animation
     *
     * @public
     * @class SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation", {
        fields: {
            CompletionBehavior: 0,
            Delay: 0,
            fps: 0,
            Frames: null,
            isDirty: false,
            iterationDuration: 0,
            loop: false,
            pingPong: false,
            secondsPerFrame: 0,
            totalDuration: 0
        },
        props: {
            /**
             * frames per second for the animations
             *
             * @instance
             * @public
             * @memberof SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation
             * @function FPS
             * @type number
             */
            FPS: {
                get: function () {
                    return this.fps;
                },
                set: function (value) {
                    this.fps = value;
                    this.isDirty = true;
                }
            },
            /**
             * controls whether the animation should loop
             *
             * @instance
             * @public
             * @memberof SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation
             * @function Loop
             * @type boolean
             */
            Loop: {
                get: function () {
                    return this.loop;
                },
                set: function (value) {
                    this.loop = value;
                    this.isDirty = true;
                }
            },
            /**
             * if loop is true, this controls if an animation loops sequentially or back and forth
             *
             * @instance
             * @public
             * @memberof SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation
             * @function PingPong
             * @type boolean
             */
            PingPong: {
                get: function () {
                    return this.pingPong;
                },
                set: function (value) {
                    this.pingPong = value;
                    this.isDirty = true;
                }
            },
            TotalDuration: {
                get: function () {
                    this.RecalculateFields();
                    return this.totalDuration;
                }
            },
            SecondsPerFrame: {
                get: function () {
                    this.RecalculateFields();
                    return this.secondsPerFrame;
                }
            },
            IterationDuration: {
                get: function () {
                    this.RecalculateFields();
                    return this.iterationDuration;
                }
            }
        },
        ctors: {
            init: function () {
                this.Delay = 0.0;
                this.fps = 10;
                this.Frames = new (System.Collections.Generic.List$1(SpineEngine.Graphics.Drawable.SubtextureDrawable)).ctor();
                this.isDirty = true;
                this.loop = true;
            },
            ctor: function () {
                this.$initialize();
            },
            $ctor1: function (frame) {
                this.$initialize();
                this.Frames.add(frame);
            },
            $ctor3: function (frames) {
                this.$initialize();
                this.Frames.AddRange(frames);
            },
            $ctor2: function (frames) {
                if (frames === void 0) { frames = []; }

                this.$initialize();
                this.Frames.AddRange(frames);
            },
            $ctor4: function (frames, idx) {
                if (idx === void 0) { idx = []; }
                var $t;

                this.$initialize();
                $t = Bridge.getEnumerator(idx);
                try {
                    while ($t.moveNext()) {
                        var id = $t.Current;
                        this.Frames.add(System.Array.getItem(frames, id, SpineEngine.Graphics.Drawable.SubtextureDrawable));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        },
        methods: {
            /**
             * called by AnimationSpriteUpdateSystem to calculate the secondsPerFrame and totalDuration based on the loop details
                 and frame count
             *
             * @instance
             * @private
             * @this SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation
             * @memberof SpineEngine.ECS.EntitySystems.Animation.SpriteAnimation
             * @return  {void}        The for use.
             */
            RecalculateFields: function () {
                if (!this.isDirty) {
                    return;
                }

                this.secondsPerFrame = 1.0 / this.fps;
                this.iterationDuration = this.secondsPerFrame * this.Frames.Count;

                if (this.loop) {
                    this.totalDuration = Number.POSITIVE_INFINITY;
                } else {
                    if (this.pingPong) {
                        this.totalDuration = this.iterationDuration * 2.0;
                    } else {
                        this.totalDuration = this.iterationDuration;
                    }
                }

                this.isDirty = false;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.AnimationSpriteUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.AnimationSpriteComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var animation = entity.GetComponent(SpineEngine.ECS.Components.AnimationSpriteComponent);

                if (!animation.IsPlaying) {
                    return;
                }

                var sprite = entity.GetOrCreateComponent(SpineEngine.ECS.Components.SpriteComponent);

                if (!Bridge.referenceEquals(animation.Animation, animation.ExecutingAnimation)) {
                    animation.ExecutingAnimation = animation.Animation;

                    animation.CurrentFrame = animation.StartFrame;
                    sprite.Drawable = animation.ExecutingAnimation.Frames.getItem(animation.CurrentFrame);

                    animation.TotalElapsedTime = animation.StartFrame * animation.ExecutingAnimation.SecondsPerFrame;
                }

                // handle delay
                if (!animation.DelayComplete && animation.ElapsedDelay < animation.ExecutingAnimation.Delay) {
                    animation.ElapsedDelay += gameTime.getTotalSeconds();
                    if (animation.ElapsedDelay >= animation.ExecutingAnimation.Delay) {
                        animation.DelayComplete = true;
                    }

                    return;
                }

                // count backwards if we are going in reverse
                if (animation.IsReversed) {
                    animation.TotalElapsedTime -= gameTime.getTotalSeconds();
                } else {
                    animation.TotalElapsedTime += gameTime.getTotalSeconds();
                }

                animation.TotalElapsedTime = SpineEngine.Maths.Mathf.Clamp$1(animation.TotalElapsedTime, 0.0, animation.ExecutingAnimation.TotalDuration);
                animation.CompletedIterations = SpineEngine.Maths.Mathf.FloorToInt(animation.TotalElapsedTime / animation.ExecutingAnimation.IterationDuration);
                animation.IsLoopingBackOnPingPong = false;

                // handle ping pong loops. if loop is false but pingPongLoop is true we allow a single forward-then-backward iteration
                if (animation.ExecutingAnimation.PingPong) {
                    if (animation.ExecutingAnimation.Loop || animation.CompletedIterations < 2) {
                        animation.IsLoopingBackOnPingPong = animation.CompletedIterations % 2 !== 0;
                    }
                }

                var elapsedTime;
                if (animation.TotalElapsedTime < animation.ExecutingAnimation.IterationDuration) {
                    elapsedTime = animation.TotalElapsedTime;
                } else {
                    elapsedTime = animation.TotalElapsedTime % animation.ExecutingAnimation.IterationDuration;

                    // if we arent looping and elapsedTime is 0 we are done. Handle it appropriately
                    if (!animation.ExecutingAnimation.Loop && elapsedTime === 0) {
                        // the animation is done so fire our event
                        animation.NotifyAninmationCompleted();

                        animation.IsPlaying = false;

                        switch (animation.ExecutingAnimation.CompletionBehavior) {
                            case SpineEngine.ECS.EntitySystems.Animation.AnimationCompletionBehavior.RemainOnFinalFrame: 
                                return;
                            case SpineEngine.ECS.EntitySystems.Animation.AnimationCompletionBehavior.RevertToFirstFrame: 
                                sprite.Drawable = animation.ExecutingAnimation.Frames.getItem(0);
                                return;
                            case SpineEngine.ECS.EntitySystems.Animation.AnimationCompletionBehavior.HideSprite: 
                                sprite.Drawable = null;
                                animation.ExecutingAnimation = null;
                                return;
                        }
                    }
                }

                // if we reversed the animation and we reached 0 total elapsed time handle un-reversing things and loop continuation
                if (animation.IsReversed && animation.TotalElapsedTime <= 0) {
                    animation.IsReversed = false;

                    if (animation.ExecutingAnimation.Loop) {
                        animation.TotalElapsedTime = 0.0;
                    } else {
                        // the animation is done so fire our event
                        animation.NotifyAninmationCompleted();

                        animation.IsPlaying = false;
                        return;
                    }
                }

                // time goes backwards when we are reversing a ping-pong loop
                if (animation.IsLoopingBackOnPingPong) {
                    elapsedTime = animation.ExecutingAnimation.IterationDuration - elapsedTime;
                }

                // fetch our desired frame
                var desiredFrame = SpineEngine.Maths.Mathf.FloorToInt(elapsedTime / animation.ExecutingAnimation.SecondsPerFrame);
                if (desiredFrame !== animation.CurrentFrame) {
                    animation.CurrentFrame = desiredFrame;
                    sprite.Drawable = animation.ExecutingAnimation.Frames.getItem(animation.CurrentFrame);

                    // ping-pong needs special care. we don't want to double the frame time when wrapping so we man-handle the totalElapsedTime
                    if (animation.ExecutingAnimation.PingPong && (animation.CurrentFrame === 0 || animation.CurrentFrame === ((animation.ExecutingAnimation.Frames.Count - 1) | 0))) {
                        if (animation.IsReversed) {
                            animation.TotalElapsedTime -= animation.ExecutingAnimation.SecondsPerFrame;
                        } else {
                            animation.TotalElapsedTime += animation.ExecutingAnimation.SecondsPerFrame;
                        }
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.CursorOverMouseSpriteUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        fields: {
            scene: null
        },
        ctors: {
            ctor: function (scene) {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputMouseComponent, SpineEngine.ECS.Components.CursorOverComponent]));
                this.scene = scene;
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var mouse = entity.GetComponent(SpineEngine.ECS.Components.InputMouseComponent);
                var clickable = entity.GetComponent(SpineEngine.ECS.Components.CursorOverComponent);

                var mousePosition = { v : this.scene.Camera.ScreenToWorldPoint$1(mouse.MousePosition.$clone()) };
                var entityPosition = SpineEngine.Maths.TransformationUtils.GetTransformation(entity);

                var matrix = { v : entityPosition.LocalTransformMatrix.$clone() };

                Microsoft.Xna.Framework.Matrix.Invert$1(matrix, matrix);
                Microsoft.Xna.Framework.Vector2.Transform$2(mousePosition, matrix, mousePosition);

                var rect = clickable.OverRegion.$clone();

                clickable.IsMouseOver = rect.Contains$1(mousePosition.v.$clone());
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.CursorOverTouchSpriteUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputTouchComponent, SpineEngine.ECS.Components.CursorOverComponent, SpineEngine.ECS.Components.SpriteComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var sprite = entity.GetComponent(SpineEngine.ECS.Components.SpriteComponent);
                var touch = entity.GetComponent(SpineEngine.ECS.Components.InputTouchComponent);
                var clickable = entity.GetComponent(SpineEngine.ECS.Components.CursorOverComponent);

                if (!touch.IsConnected) {
                    return;
                }

                clickable.IsMouseOver = System.Linq.Enumerable.from(touch.CurrentTouches).any(function (a) {
                        return sprite.Drawable.SpineEngine$Graphics$Drawable$IDrawable$Bounds.Contains$1(touch.GetScaledPosition(a.Position.$clone()));
                    });
            }
        }
    });

    Bridge.define("SpineEngine.ECS.IScreenResolutionChangedListener", {
        $kind: "interface"
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.InputKeyboardUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputKeyboardComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var text = entity.GetComponent(SpineEngine.ECS.Components.InputKeyboardComponent);

                text.PreviousKeyboardState = text.CurrentKeyboardState.$clone();
                text.CurrentKeyboardState = Microsoft.Xna.Framework.Input.Keyboard.GetState();
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.InputVirtualUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputVirtualComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var inputKeyboard = entity.GetComponent(SpineEngine.ECS.Components.InputKeyboardComponent);
                var inputMouse = entity.GetComponent(SpineEngine.ECS.Components.InputMouseComponent);
                var inputTouch = entity.GetComponent(SpineEngine.ECS.Components.InputTouchComponent);
                var inputGamePad = entity.GetComponent(SpineEngine.ECS.Components.InputGamePadComponent);
                var input = entity.GetComponent(SpineEngine.ECS.Components.InputVirtualComponent);

                $t = Bridge.getEnumerator(input.InputConfiguration);
                try {
                    while ($t.moveNext()) {
                        var inputConfig = $t.Current;
                        inputConfig.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.MaterialEffectUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.MaterialComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var material = entity.GetComponent(SpineEngine.ECS.Components.MaterialComponent);
                material.Material.Update(gameTime);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.RenderCollectionUpdateSystem", {
        inherits: [LocomotorECS.MatcherEntitySystem],
        statics: {
            fields: {
                comparer: null
            },
            ctors: {
                init: function () {
                    this.comparer = new (SpineEngine.Utils.Collections.FunctionComparer$1(LocomotorECS.Entity)).$ctor1($asm.$.SpineEngine.ECS.EntitySystems.RenderCollectionUpdateSystem.f1);
                }
            }
        },
        fields: {
            knownComponents: null,
            needSort: false
        },
        props: {
            Entities: {
                get: function () {
                    return this.MatchedEntities;
                }
            }
        },
        ctors: {
            init: function () {
                this.knownComponents = new (System.Collections.Generic.Dictionary$2(LocomotorECS.Entity,SpineEngine.ECS.Components.RenderOrderComponent))();
                this.needSort = true;
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.MatcherEntitySystem.$ctor1.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.FinalRenderComponent]));
            }
        },
        methods: {
            OnMatchedEntityAdded: function (entity) {
                LocomotorECS.MatcherEntitySystem.prototype.OnMatchedEntityAdded.call(this, entity);
                var orderComponent = entity.GetComponent(SpineEngine.ECS.Components.RenderOrderComponent);
                if (orderComponent != null) {
                    this.knownComponents.set(entity, orderComponent);
                    this.knownComponents.get(entity).addRenderOrderChanged(Bridge.fn.cacheBind(this, this.SortRequired));
                }

                this.SortRequired();
            },
            OnMatchedEntityChanged: function (entity) {
                LocomotorECS.MatcherEntitySystem.prototype.OnMatchedEntityChanged.call(this, entity);
                var orderComponent = entity.GetComponent(SpineEngine.ECS.Components.RenderOrderComponent);
                if (orderComponent == null && this.knownComponents.containsKey(entity)) {
                    this.knownComponents.get(entity).removeRenderOrderChanged(Bridge.fn.cacheBind(this, this.SortRequired));
                    this.knownComponents.remove(entity);
                } else if (orderComponent != null && !this.knownComponents.containsKey(entity)) {
                    this.knownComponents.set(entity, orderComponent);
                    this.knownComponents.get(entity).addRenderOrderChanged(Bridge.fn.cacheBind(this, this.SortRequired));
                } else if (orderComponent != null && !Bridge.referenceEquals(this.knownComponents.get(entity), orderComponent)) {
                    this.knownComponents.get(entity).removeRenderOrderChanged(Bridge.fn.cacheBind(this, this.SortRequired));
                    this.knownComponents.set(entity, orderComponent);
                    this.knownComponents.get(entity).addRenderOrderChanged(Bridge.fn.cacheBind(this, this.SortRequired));
                }

                this.SortRequired();
            },
            OnMatchedEntityRemoved: function (entity) {
                LocomotorECS.MatcherEntitySystem.prototype.OnMatchedEntityRemoved.call(this, entity);
                var orderComponent = entity.GetComponent(SpineEngine.ECS.Components.RenderOrderComponent);
                if (orderComponent != null) {
                    this.knownComponents.get(entity).removeRenderOrderChanged(Bridge.fn.cacheBind(this, this.SortRequired));
                    this.knownComponents.remove(entity);
                }
            },
            DoAction: function (gameTime) {
                LocomotorECS.MatcherEntitySystem.prototype.DoAction.call(this, gameTime);

                if (this.needSort) {
                    this.MatchedEntities.Sort$1(SpineEngine.ECS.EntitySystems.RenderCollectionUpdateSystem.comparer);
                }
            },
            SortRequired: function () {
                this.needSort = true;
            }
        }
    });

    Bridge.ns("SpineEngine.ECS.EntitySystems.RenderCollectionUpdateSystem", $asm.$);

    Bridge.apply($asm.$.SpineEngine.ECS.EntitySystems.RenderCollectionUpdateSystem, {
        f1: function (a) {
            var $t, $t1;
            return ($t = (($t1 = a.GetComponent(SpineEngine.ECS.Components.RenderOrderComponent)) != null ? $t1.Order : null), $t != null ? $t : 0);
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.SpriteMeshGeneratorSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem],
        ctors: {
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.SpriteComponent]));
            }
        },
        methods: {
            DoAction$1: function (entity, gameTime) {
                var $t, $t1, $t2, $t3, $t4, $t5, $t6;
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);
                var sprite = entity.GetComponent(SpineEngine.ECS.Components.SpriteComponent);
                var effect = ($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.SpriteEffectsComponent)) != null ? $t1.SpriteEffects : null), $t != null ? $t : Microsoft.Xna.Framework.Graphics.SpriteEffects.None);
                var color = ($t2 = (($t3 = entity.GetComponent(SpineEngine.ECS.Components.ColorComponent)) != null ? $t3.Color : null), $t2 != null ? $t2 : Microsoft.Xna.Framework.Color.White);
                var depth = ($t4 = (($t5 = entity.GetComponent(SpineEngine.ECS.Components.DepthLayerComponent)) != null ? $t5.Depth : null), $t4 != null ? $t4 : 0);

                if (sprite.Drawable == null) {
                    entity.RemoveComponent$1(SpineEngine.ECS.Components.FinalRenderComponent);
                    return;
                }

                var finalRender = entity.GetOrCreateComponent(SpineEngine.ECS.Components.FinalRenderComponent);
                finalRender.Batch.Clear();

                sprite.Drawable.SpineEngine$Graphics$Drawable$IDrawable$DrawInto(color.$clone(), depth, finalRender.Batch);
                var transformation = SpineEngine.Maths.TransformationUtils.GetTransformation(entity).LocalTransformMatrix.$clone();
                $t6 = Bridge.getEnumerator(finalRender.Batch.Meshes);
                try {
                    while ($t6.moveNext()) {
                        var mesh = $t6.Current;
                        mesh.ApplyEffectToMesh(effect);
                        mesh.ApplyTransformMesh(transformation.$clone());
                    }
                } finally {
                    if (Bridge.is($t6, System.IDisposable)) {
                        $t6.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    /** @namespace SpineEngine.ECS.EntitySystems.VirtualInput */

    /**
     * Represents a virtual button, axis or joystick whose state is determined by the state of its VirtualInputNodes
     *
     * @abstract
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput", {
        fields: {
            Nodes: null,
            Overlap: 0
        },
        ctors: {
            init: function () {
                this.Nodes = new (System.Collections.Generic.List$1(SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInputNode)).ctor();
            },
            ctor: function (overlap) {
                this.$initialize();
                this.Overlap = overlap;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                var $t;
                $t = Bridge.getEnumerator(this.Nodes);
                try {
                    while ($t.moveNext()) {
                        var node = $t.Current;
                        node.Update(inputKeyboard, inputMouse, inputTouch, inputGamePad);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    /**
     * Add these to your VirtualInput to define how it determines its current input state.
         For example, if you want to check whether a keyboard key is pressed, create a VirtualButton and add to it a
         VirtualButton.KeyboardKey
     *
     * @abstract
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInputNode
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInputNode");

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior", {
        $kind: "nested enum",
        statics: {
            fields: {
                /**
                 * duplicate input will result in canceling each other out and no input will be recorded. Example: press left arrow
                     key and while
                     holding it down press right arrow. This will result in canceling each other out.
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 0
                 * @type number
                 */
                CancelOut: 0,
                /**
                 * the first input found will be used
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 1
                 * @type number
                 */
                TakeOlder: 1,
                /**
                 * the last input found will be used
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 2
                 * @type number
                 */
                TakeNewer: 2
            }
        }
    });

    /** @namespace System */

    /**
     * @memberof System
     * @callback System.Action
     * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    arg
     * @return  {void}
     */

    Bridge.define("SpineEngine.ECS.Scene", {
        statics: {
            fields: {
                defaultDesignResolutionSize: null,
                defaultSceneResolutionPolicy: null
            },
            ctors: {
                init: function () {
                    this.defaultDesignResolutionSize = new Microsoft.Xna.Framework.Point();
                    this.defaultSceneResolutionPolicy = SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy.None;
                }
            },
            methods: {
                SetDefaultDesignResolution: function (width, height, sceneResolutionPolicy) {
                    SpineEngine.ECS.Scene.defaultDesignResolutionSize = new Microsoft.Xna.Framework.Point.$ctor2(width, height);
                    SpineEngine.ECS.Scene.defaultSceneResolutionPolicy = sceneResolutionPolicy;
                }
            }
        },
        fields: {
            /**
             * Scene-specific ContentManager. Use it to load up any resources that are needed only by this scene. If you have
                 global/multi-scene resources you can use Core.contentManager to load them.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.ECS.Scene
             * @type SpineEngine.XnaManagers.GlobalContentManager
             */
            Content: null,
            Camera: null,
            ClearColor: null,
            Renderers: null,
            entities: null,
            entitySystems: null,
            entitySystemsRender: null,
            renderProcessors: null,
            screenResolutionChangedListeners: null,
            didSceneBegin: false,
            resolutionPolicy: null
        },
        props: {
            DesignResolutionSize: null,
            FinalRenderDestinationRect: null,
            SceneRenderTarget: null
        },
        ctors: {
            init: function () {
                this.ClearColor = new Microsoft.Xna.Framework.Color();
                this.ClearColor = Microsoft.Xna.Framework.Color.CornflowerBlue.$clone();
                this.screenResolutionChangedListeners = new (System.Collections.Generic.List$1(SpineEngine.ECS.IScreenResolutionChangedListener)).ctor();
                this.DesignResolutionSize = new Microsoft.Xna.Framework.Point();
                this.FinalRenderDestinationRect = new Microsoft.Xna.Framework.Rectangle();
                this.SceneRenderTarget = new Microsoft.Xna.Framework.Rectangle();
            },
            ctor: function () {
                this.$initialize();
                this.Content = new SpineEngine.XnaManagers.GlobalContentManager();
                this.Camera = new SpineEngine.Graphics.Cameras.Camera();
                this.entities = new LocomotorECS.EntityList();
                this.entitySystems = new LocomotorECS.EntitySystemList(this.entities);
                this.Renderers = new SpineEngine.Graphics.Renderers.RendererList();
                this.renderProcessors = new SpineEngine.Graphics.RenderProcessors.RenderProcessorList(this);

                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.InputMouseUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.InputTouchUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.InputGamePadUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.InputKeyboardUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.InputVirtualUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.CursorOverMouseSpriteUpdateSystem(this));
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.CursorOverTouchSpriteUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.MaterialEffectUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.AnimationSpriteUpdateSystem());
                this.AddEntitySystem(new SpineEngine.ECS.EntitySystems.SpriteMeshGeneratorSystem());

                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.InputMouseUpdateSystem, SpineEngine.ECS.EntitySystems.InputVirtualUpdateSystem);
                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.InputTouchUpdateSystem, SpineEngine.ECS.EntitySystems.InputVirtualUpdateSystem);
                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.InputGamePadUpdateSystem, SpineEngine.ECS.EntitySystems.InputVirtualUpdateSystem);
                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.InputKeyboardUpdateSystem, SpineEngine.ECS.EntitySystems.InputVirtualUpdateSystem);
                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.InputMouseUpdateSystem, SpineEngine.ECS.EntitySystems.CursorOverMouseSpriteUpdateSystem);
                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.InputTouchUpdateSystem, SpineEngine.ECS.EntitySystems.CursorOverTouchSpriteUpdateSystem);
                this.AddEntitySystemExecutionOrder(SpineEngine.ECS.EntitySystems.AnimationSpriteUpdateSystem, SpineEngine.ECS.EntitySystems.SpriteMeshGeneratorSystem);

                var renderCollectionUpdateSystem = new SpineEngine.ECS.EntitySystems.RenderCollectionUpdateSystem();
                this.entitySystemsRender = new LocomotorECS.EntitySystemList(this.entities);
                this.entitySystemsRender.Add(renderCollectionUpdateSystem);

                this.AddRenderProcessor(SpineEngine.Graphics.RenderProcessors.Impl.EntityRendererProcessor, new SpineEngine.Graphics.RenderProcessors.Impl.EntityRendererProcessor(false, this, renderCollectionUpdateSystem.Entities, -1));
                this.AddRenderProcessor(SpineEngine.Graphics.RenderProcessors.Impl.EntityRendererProcessor, new SpineEngine.Graphics.RenderProcessors.Impl.EntityRendererProcessor(true, this, renderCollectionUpdateSystem.Entities, 2147483645));
                this.AddRenderProcessor(SpineEngine.Graphics.RenderProcessors.Impl.ScreenShotRenderProcessor, new SpineEngine.Graphics.RenderProcessors.Impl.ScreenShotRenderProcessor(2147483646));
                this.AddRenderProcessor(SpineEngine.Graphics.RenderProcessors.Impl.FinalRenderRenderProcessor, new SpineEngine.Graphics.RenderProcessors.Impl.FinalRenderRenderProcessor(SpineEngine.Graphics.Graphic.DefaultSamplerState, 2147483647));

                // setup our resolution policy. we'll commit it in begin
                this.resolutionPolicy = SpineEngine.ECS.Scene.defaultSceneResolutionPolicy;
                this.DesignResolutionSize = SpineEngine.ECS.Scene.defaultDesignResolutionSize.$clone();
            }
        },
        methods: {
            /**
             * after the next draw completes this will clone the backbuffer and call callback with the clone.
                 Note that you must dispose of the Texture2D when done with it!
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {System.Action}    callback    Callback.
             * @return  {void}
             */
            RequestScreenshot: function (callback) {
                var screenShotPostProcessor = this.renderProcessors.Get(SpineEngine.Graphics.RenderProcessors.Impl.ScreenShotRenderProcessor);
                screenShotPostProcessor.Enabled = true;
                screenShotPostProcessor.Action = function (tex) {
                    screenShotPostProcessor.Action = null;
                    screenShotPostProcessor.Enabled = false;

                    callback(tex);
                };
            },
            SetDesignResolution: function (width, height, sceneResolutionPolicy) {
                this.DesignResolutionSize = new Microsoft.Xna.Framework.Point.$ctor2(width, height);
                this.resolutionPolicy = sceneResolutionPolicy;
                this.UpdateResolutionScaler();
            },
            UpdateResolutionScaler: function () {
                var $t;
                this.FinalRenderDestinationRect = this.resolutionPolicy.GetFinalRenderDestinationRect(SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height, this.DesignResolutionSize.$clone());

                this.SceneRenderTarget = this.resolutionPolicy.GetRenderTargetRect(SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height, this.DesignResolutionSize.$clone());

                // notify the Renderers, PostProcessors and FinalRenderDelegate of the change in render texture size
                $t = Bridge.getEnumerator(this.screenResolutionChangedListeners);
                try {
                    while ($t.moveNext()) {
                        var listener = $t.Current;
                        listener.SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged(this.FinalRenderDestinationRect.$clone(), this.SceneRenderTarget.$clone());
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                this.Camera.OnSceneRenderTargetSizeChanged(this.SceneRenderTarget.$clone());
            },
            /**
             * override this in Scene subclasses. this will be called when Core sets this scene as the active scene.
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @return  {void}
             */
            OnStart: function () { },
            /**
             * override this in Scene subclasses and do any unloading necessary here. this is called when Core removes this scene
                 from the active slot.
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @return  {void}
             */
            OnEnd: function () { },
            Begin: function () {

                this.UpdateResolutionScaler();

                this.entitySystems.NotifyBegin();
                this.entitySystemsRender.NotifyBegin();

                this.entities.CommitChanges();

                this.didSceneBegin = true;
                this.OnStart();
            },
            End: function () {
                this.OnEnd();
                this.didSceneBegin = false;

                this.Renderers.NotifyEnd();
                this.renderProcessors.NotifyEnd();

                this.Camera = null;
                this.Content.Dispose();

                this.entitySystems.NotifyEnd();
                this.entitySystemsRender.NotifyEnd();
            },
            Update: function (gameTime) {
                this.entitySystems != null ? this.entitySystems.NotifyDoAction(gameTime.ElapsedGameTime) : null;
                this.renderProcessors.NotifyUpdate(gameTime.ElapsedGameTime);
                this.entities.CommitChanges();
                this.entitySystemsRender.NotifyDoAction(gameTime.ElapsedGameTime);
            },
            Render: function (finalRenderTarget) {
                this.renderProcessors.NotifyPostProcess(finalRenderTarget, this.FinalRenderDestinationRect.$clone(), this.SceneRenderTarget.$clone());
            },
            OnGraphicsDeviceReset: function () {
                this.UpdateResolutionScaler();
            },
            /**
             * adds a Renderer to the scene
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {Function}    T           
             * @param   {T}           renderer
             * @return  {T}                       The renderer.
             */
            AddRenderer: function (T, renderer) {
                this.Renderers.Add(renderer);
                var listener;
                if (((listener = Bridge.as(renderer, SpineEngine.ECS.IScreenResolutionChangedListener))) != null) {
                    this.screenResolutionChangedListeners.add(listener);
                    if (this.didSceneBegin) {
                        listener.SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged(this.FinalRenderDestinationRect.$clone(), this.SceneRenderTarget.$clone());
                    }
                }

                return renderer;
            },
            /**
             * gets the first Renderer of Type T
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {Function}    T    The 1st type parameter.
             * @return  {T}                The renderer.
             */
            GetRenderer: function (T) {
                return this.Renderers.Get(T);
            },
            /**
             * removes the Renderer from the scene
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {SpineEngine.Graphics.Renderers.Renderer}    renderer
             * @return  {void}
             */
            RemoveRenderer: function (renderer) {
                this.Renderers.Remove(renderer);
                var listener;
                if (((listener = Bridge.as(renderer, SpineEngine.ECS.IScreenResolutionChangedListener))) != null) {
                    this.screenResolutionChangedListeners.remove(listener);
                }
            },
            AddRenderProcessor: function (T, postProcessor) {
                this.renderProcessors.Add(postProcessor);
                var listener;
                if (((listener = Bridge.as(postProcessor, SpineEngine.ECS.IScreenResolutionChangedListener))) != null) {
                    this.screenResolutionChangedListeners.add(listener);
                    if (this.didSceneBegin) {
                        listener.SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged(this.FinalRenderDestinationRect.$clone(), this.SceneRenderTarget.$clone());
                    }
                }

                return postProcessor;
            },
            GetRenderProcessor: function (T) {
                return this.renderProcessors.Get(T);
            },
            GetRenderProcessors: function () {
                return this.renderProcessors.GetAll();
            },
            RemoveRenderProcessor: function (renderProcessor) {
                this.renderProcessors.Remove(renderProcessor);
                var listener;
                if (((listener = Bridge.as(renderProcessor, SpineEngine.ECS.IScreenResolutionChangedListener))) != null) {
                    this.screenResolutionChangedListeners.remove(listener);
                }
            },
            /**
             * add the Entity to this Scene, and return it
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {string}                 name
             * @return  {LocomotorECS.Entity}
             */
            CreateEntity: function (name) {
                if (name === void 0) { name = null; }
                var entity = new LocomotorECS.Entity(name);
                return this.AddEntity(entity);
            },
            /**
             * adds an Entity to the Scene's Entities list
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {LocomotorECS.Entity}    entity    The Entity to add
             * @return  {LocomotorECS.Entity}
             */
            AddEntity: function (entity) {
                this.entities.Add(entity);
                return entity;
            },
            /**
             * adds an Entity to the Scene's Entities list
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {LocomotorECS.Entity}    entity    The Entity to add
             * @return  {LocomotorECS.Entity}
             */
            RemoveEntity: function (entity) {
                this.entities.Remove(entity);
                return entity;
            },
            /**
             * searches for and returns the first Entity with name
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {string}                 name    Name.
             * @return  {LocomotorECS.Entity}            The entity.
             */
            FindEntity: function (name) {
                return this.entities.FindEntityByName(name);
            },
            /**
             * returns all entities with the given tag
             *
             * @instance
             * @public
             * @this SpineEngine.ECS.Scene
             * @memberof SpineEngine.ECS.Scene
             * @param   {number}                               tag    Tag.
             * @return  {System.Collections.Generic.List$1}           The entities by tag.
             */
            FindEntitiesWithTag: function (tag) {
                return this.entities.FindEntitiesByTag(tag);
            },
            AddEntitySystem: function (processor) {
                this.entitySystems.Add(processor);
                var listener;
                if (((listener = Bridge.as(processor, SpineEngine.ECS.IScreenResolutionChangedListener))) != null) {
                    this.screenResolutionChangedListeners.add(listener);
                    if (this.didSceneBegin) {
                        listener.SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged(this.FinalRenderDestinationRect.$clone(), this.SceneRenderTarget.$clone());
                    }
                }

                return processor;
            },
            RemoveEntityProcessor: function (processor) {
                this.entitySystems.Remove(processor);
                var listener;
                if (((listener = Bridge.as(processor, SpineEngine.ECS.IScreenResolutionChangedListener))) != null) {
                    this.screenResolutionChangedListeners.remove(listener);
                }
            },
            AddEntitySystemExecutionOrder: function (TBefore, TAfter) {
                this.entitySystems.AddExecutionOrder(TBefore, TAfter);
            },
            RemoveEntitySystemExecutionOrder: function (TBefore, TAfter) {
                this.entitySystems.RemoveExecutionOrder(TBefore, TAfter);
            },
            GetEntityProcessor: function (T) {
                return this.entitySystems.Get(T);
            }
        }
    });

    /** @namespace SpineEngine.Utils.Collections */

    /**
     * Objects implementing this interface will have {@link #reset()} called when passed to {@link #push(Object)}
     *
     * @abstract
     * @public
     * @class SpineEngine.Utils.Collections.IPoolable
     */
    Bridge.define("SpineEngine.Utils.Collections.IPoolable", {
        $kind: "interface"
    });

    /** @namespace SpineEngine.GlobalManagers */

    /**
     * global manager that can be added to Core
     *
     * @public
     * @class SpineEngine.GlobalManagers.GlobalManager
     */
    Bridge.define("SpineEngine.GlobalManagers.GlobalManager", {
        fields: {
            enabled: false
        },
        props: {
            /**
             * true if the GlobalManager is enabled. Changes in state result in onEnabled/onDisable being called.
             *
             * @instance
             * @public
             * @memberof SpineEngine.GlobalManagers.GlobalManager
             * @function Enabled
             * @type boolean
             */
            Enabled: {
                get: function () {
                    return this.enabled;
                },
                set: function (value) {
                    this.SetEnabled(value);
                }
            }
        },
        methods: {
            /**
             * enables/disables this GlobalManager
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.GlobalManager
             * @memberof SpineEngine.GlobalManagers.GlobalManager
             * @param   {boolean}    isEnabled    If set to <pre><code>true</code></pre> is enabled.
             * @return  {void}                    The enabled.
             */
            SetEnabled: function (isEnabled) {
                if (this.enabled === isEnabled) {
                    return;
                }

                this.enabled = isEnabled;

                if (this.enabled) {
                    this.OnEnabled();
                } else {
                    this.OnDisabled();
                }
            },
            /**
             * called when this GlobalManager is enabled
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.GlobalManager
             * @memberof SpineEngine.GlobalManagers.GlobalManager
             * @return  {void}
             */
            OnEnabled: function () { },
            /**
             * called when the this GlobalManager is disabled
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.GlobalManager
             * @memberof SpineEngine.GlobalManagers.GlobalManager
             * @return  {void}
             */
            OnDisabled: function () { },
            /**
             * called each frame before Scene.update
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.GlobalManager
             * @memberof SpineEngine.GlobalManagers.GlobalManager
             * @param   {Microsoft.Xna.Framework.GameTime}    gameTime
             * @return  {void}
             */
            Update: function (gameTime) { }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Coroutines.DefaultCoroutines", {
        statics: {
            methods: {
                Wait: function (seconds) {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        startAt,
                        $async_e;

                    var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        startAt = System.DateTime.getNow();
                                        $step = 1;
                                        continue;
                                    }
                                    case 1: {
                                        if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < seconds ) {
                                                $step = 2;
                                                continue;
                                            } 
                                            $step = 4;
                                            continue;
                                    }
                                    case 2: {
                                        $enumerator.current = null;
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        
                                            $step = 1;
                                            continue;
                                    }
                                    case 4: {

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
                },
                Empty: function () {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        $async_e;

                    var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        $enumerator.current = null;
                                            $step = 1;
                                            return true;
                                    }
                                    case 1: {

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
                },
                WaitForTweenCompletition: function (tween) {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        globalManager,
                        $async_e;

                    var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        globalManager = SpineEngine.Core.Instance.GetGlobalManager(SpineEngine.GlobalManagers.Tweens.TweenGlobalManager);
                                        $step = 1;
                                        continue;
                                    }
                                    case 1: {
                                        if ( globalManager.IsTweenCompleted(tween) ) {
                                                $step = 2;
                                                continue;
                                            } 
                                            $step = 4;
                                            continue;
                                    }
                                    case 2: {
                                        $enumerator.current = null;
                                            $step = 3;
                                            return true;
                                    }
                                    case 3: {
                                        
                                            $step = 1;
                                            continue;
                                    }
                                    case 4: {

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
                }
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.GlobalManagerList", {
        fields: {
            globalManagers: null
        },
        props: {
            Count: {
                get: function () {
                    return this.globalManagers.Count;
                }
            }
        },
        ctors: {
            init: function () {
                this.globalManagers = new (System.Collections.Generic.List$1(SpineEngine.GlobalManagers.GlobalManager)).ctor();
            }
        },
        methods: {
            getItem: function (index) {
                return this.globalManagers.getItem(index);
            },
            Add: function (manager) {
                this.globalManagers.add(manager);
                manager.Enabled = true;
            },
            Remove: function (manager) {
                this.globalManagers.remove(manager);
                manager.Enabled = false;
            },
            NotifyUpdate: function (gameTime) {
                for (var i = (this.globalManagers.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    if (this.globalManagers.getItem(i).Enabled) {
                        this.globalManagers.getItem(i).Update(gameTime);
                    }
                }
            },
            GetGlobalManager: function (T) {
                for (var i = 0; i < this.globalManagers.Count; i = (i + 1) | 0) {
                    var component = this.globalManagers.getItem(i);
                    var manager;
                    if (((manager = Bridge.as(component, T))) != null) {
                        return manager;
                    }
                }

                return null;
            }
        }
    });

    /** @namespace SpineEngine.GlobalManagers.Timers */

    /**
     * private class hiding the implementation of ITimer
     *
     * @public
     * @class SpineEngine.GlobalManagers.Timers.Timer
     */
    Bridge.define("SpineEngine.GlobalManagers.Timers.Timer", {
        fields: {
            elapsedTime: 0,
            isDone: false,
            onTime: null,
            repeats: false,
            timeInSeconds: 0
        },
        methods: {
            /**
             * call stop to stop this timer from being run again. This has no effect on a non-repeating timer.
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Timers.Timer
             * @memberof SpineEngine.GlobalManagers.Timers.Timer
             * @return  {void}
             */
            Stop: function () {
                this.isDone = true;
            },
            /**
             * resets the elapsed time of the timer to 0
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Timers.Timer
             * @memberof SpineEngine.GlobalManagers.Timers.Timer
             * @return  {void}
             */
            Reset: function () {
                this.elapsedTime = 0.0;
            },
            Tick: function (gameTime) {
                // if stop was called before the tick then isDone will be true and we should not tick again no matter what
                if (!this.isDone && this.elapsedTime > this.timeInSeconds) {
                    this.elapsedTime -= this.timeInSeconds;
                    this.onTime(this);

                    if (!this.isDone && !this.repeats) {
                        this.isDone = true;
                    }
                }

                this.elapsedTime += gameTime.ElapsedGameTime.getTotalSeconds();

                return this.isDone;
            },
            Initialize: function (timeInSeconds, repeats, onTime) {
                this.timeInSeconds = timeInSeconds;
                this.repeats = repeats;
                this.onTime = onTime;
                this.isDone = false;
            },
            /**
             * nulls out the object references so the GC can pick them up if needed
             *
             * @instance
             * @this SpineEngine.GlobalManagers.Timers.Timer
             * @memberof SpineEngine.GlobalManagers.Timers.Timer
             * @return  {void}
             */
            Unload: function () {
                this.onTime = null;
            }
        }
    });

    /** @namespace SpineEngine.GlobalManagers.Tweens.Interfaces */

    /**
     * a series of strongly typed, chainable methods to setup various tween properties
     *
     * @abstract
     * @public
     * @class SpineEngine.GlobalManagers.Tweens.Interfaces.ITween
     */
    Bridge.define("SpineEngine.GlobalManagers.Tweens.Interfaces.ITween", {
        $kind: "interface"
    });

    /**
     * any object that wants to be tweened needs to implement this. TweenManager internally likes to make a simple object
         that implements this interface and stores a reference to the object being tweened. That makes for tiny, simple,
         lightweight implementations that can be handed off to any TweenT
     *
     * @abstract
     * @public
     * @class SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1
     */
    Bridge.definei("SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1", function (T) { return {
        $kind: "interface"
    }; });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.LoopType", {
        $kind: "enum",
        statics: {
            fields: {
                None: 0,
                RestartFromBeginning: 1,
                PingPong: 2
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.Tweenable", {
        fields: {
            ElapsedTime: 0,
            globalManager: null,
            isRunningInReverse: false,
            TweenState: 0
        },
        props: {
            CurrentTween: null
        },
        ctors: {
            init: function () {
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete;
            }
        },
        methods: {
            Initialize: function (globalManager, tween) {
                this.globalManager = globalManager;
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Paused;
                this.CurrentTween = tween;
            },
            Start: function () {
                this.ElapsedTime = 0;
                this.isRunningInReverse = false;
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Running;
                this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Start();
            },
            RecycleSelf: function () {
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete;
                this.CurrentTween = null;
            },
            IsRunning: function () {
                return this.TweenState === SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Running;
            },
            IsCompleted: function () {
                return this.TweenState === SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete;
            },
            Pause: function () {
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Paused;
            },
            Resume: function () {
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Running;
            },
            Tick: function (gameTime) {
                if (this.TweenState === SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Paused) {
                    return false;
                }

                // when we loop we clamp values between 0 and duration. this will hold the excess that we clamped off so it can be reapplied
                var elapsedTimeExcess = 0.0;
                if (!this.isRunningInReverse && this.ElapsedTime >= this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Duration) {
                    elapsedTimeExcess = this.ElapsedTime - this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Duration;
                    this.ElapsedTime = this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Duration;
                    this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete;
                } else if (this.isRunningInReverse && this.ElapsedTime <= 0) {
                    elapsedTimeExcess = 0 - this.ElapsedTime;
                    this.ElapsedTime = 0.0;
                    this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete;
                }

                // elapsed time will be negative while we are delaying the start of the tween so dont update the value
                if (this.ElapsedTime >= 0 && this.ElapsedTime <= this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Duration) {
                    this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue(this.ElapsedTime);
                }

                // if we have a loopType and we are Complete (meaning we reached 0 or duration) handle the loop.
                // handleLooping will take any excess elapsedTime and factor it in and call udpateValue if necessary to keep
                // the tween perfectly accurate.
                if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$LoopType !== SpineEngine.GlobalManagers.Tweens.LoopType.None && this.TweenState === SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete && this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Loops > 0) {
                    this.HandleLooping(elapsedTimeExcess);
                }

                // running in reverse? then we need to subtract deltaTime
                if (this.isRunningInReverse) {
                    this.ElapsedTime -= gameTime.ElapsedGameTime.getTotalSeconds();
                } else {
                    this.ElapsedTime += gameTime.ElapsedGameTime.getTotalSeconds();
                }

                if (this.TweenState === SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete) {
                    this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NotifyCompleted();

                    // if we have a nextTween add it to TweenManager so that it can start running
                    if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NextTween != null) {
                        this.globalManager.AddTween(this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NextTween);
                    }

                    return true;
                }

                return false;
            },
            Stop: function (bringToCompletion) {
                if (bringToCompletion === void 0) { bringToCompletion = false; }
                this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Complete;

                if (bringToCompletion) {
                    // if we are running in reverse we finish up at 0 else we go to duration
                    this.ElapsedTime = this.isRunningInReverse ? 0.0 : this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Duration;
                    this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Stop();
                }
            },
            /**
             * reverses the current tween. if it was going forward it will be going backwards and vice versa.
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Tweens.Tweenable
             * @memberof SpineEngine.GlobalManagers.Tweens.Tweenable
             * @return  {void}
             */
            ReverseTween: function () {
                this.isRunningInReverse = !this.isRunningInReverse;
            },
            /**
             * handles loop logic
             *
             * @instance
             * @private
             * @this SpineEngine.GlobalManagers.Tweens.Tweenable
             * @memberof SpineEngine.GlobalManagers.Tweens.Tweenable
             * @param   {number}    elapsedTimeExcess
             * @return  {void}
             */
            HandleLooping: function (elapsedTimeExcess) {
                this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Loops = (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Loops - 1) | 0;
                if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$LoopType === SpineEngine.GlobalManagers.Tweens.LoopType.PingPong) {
                    this.ReverseTween();
                }

                if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$LoopType === SpineEngine.GlobalManagers.Tweens.LoopType.RestartFromBeginning || this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Loops % 2 === 0) {
                    this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NotifyLoopCompleted();
                }

                // if we have loops left to process reset our state back to Running so we can continue processing them
                if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Loops > 0) {
                    this.TweenState = SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates.Running;

                    // now we need to set our elapsed time and factor in our elapsedTimeExcess
                    if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$LoopType === SpineEngine.GlobalManagers.Tweens.LoopType.RestartFromBeginning) {
                        this.ElapsedTime = elapsedTimeExcess - this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$DelayBetweenLoops;
                    } else {
                        if (this.isRunningInReverse) {
                            this.ElapsedTime += this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$DelayBetweenLoops - elapsedTimeExcess;
                        } else {
                            this.ElapsedTime = elapsedTimeExcess - this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$DelayBetweenLoops;
                        }
                    }

                    // if we had an elapsedTimeExcess and no delayBetweenLoops update the value
                    if (this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$DelayBetweenLoops === 0.0 && elapsedTimeExcess > 0.0) {
                        this.CurrentTween.SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue(this.ElapsedTime);
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.Tweenable.TweenStates", {
        $kind: "nested enum",
        statics: {
            fields: {
                Running: 0,
                Paused: 1,
                Complete: 2
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenExt", {
        statics: {
            methods: {
                /**
                 * transform.position tween
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {SpineEngine.ECS.Components.PositionComponent}             self        
                 * @param   {Microsoft.Xna.Framework.Vector2}                          to          
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}                The position to.
                 */
                TweenTo$3: function (self, to, duration) {
                    if (duration === void 0) { duration = 0.3; }
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector2Tween(new SpineEngine.GlobalManagers.Tweens.TweenTargets.PositionComponentTweenTarget(self), to.$clone(), duration);
                },
                /**
                 * transform.scale tween
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {SpineEngine.ECS.Components.ScaleComponent}                self        
                 * @param   {number}                                                   to          
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}                The scale to.
                 */
                TweenTo$5: function (self, to, duration) {
                    if (duration === void 0) { duration = 0.3; }
                    return SpineEngine.GlobalManagers.Tweens.TweenExt.TweenTo$4(self, new Microsoft.Xna.Framework.Vector2.$ctor1(to), duration);
                },
                /**
                 * transform.scale tween
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {SpineEngine.ECS.Components.ScaleComponent}                self        
                 * @param   {Microsoft.Xna.Framework.Vector2}                          to          
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}                The scale to.
                 */
                TweenTo$4: function (self, to, duration) {
                    if (duration === void 0) { duration = 0.3; }
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector2Tween(new SpineEngine.GlobalManagers.Tweens.TweenTargets.ScaleComponentTweenTarget(self), to.$clone(), duration);
                },
                /**
                 * RenderableComponent.color tween
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {SpineEngine.ECS.Components.ColorComponent}                self        Self.
                 * @param   {Microsoft.Xna.Framework.Color}                            to          To.
                 * @param   {number}                                                   duration    Duration.
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}                The color to.
                 */
                TweenTo: function (self, to, duration) {
                    if (duration === void 0) { duration = 0.3; }
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.ColorTween(new SpineEngine.GlobalManagers.Tweens.TweenTargets.ColorComponentTweenTarget(self), to.$clone(), duration);
                },
                /**
                 * tweens an int field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {number}                                                   to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$9: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.IntTween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(System.Int32))(self, memberName), to, duration);
                },
                /**
                 * tweens a float field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {number}                                                   to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$10: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.FloatTween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(System.Single))(self, memberName), to, duration);
                },
                /**
                 * tweens a Color field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {Microsoft.Xna.Framework.Color}                            to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$1: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.ColorTween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(Microsoft.Xna.Framework.Color))(self, memberName), to.$clone(), duration);
                },
                /**
                 * tweens a Vector2 field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {Microsoft.Xna.Framework.Vector2}                          to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$6: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector2Tween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(Microsoft.Xna.Framework.Vector2))(self, memberName), to.$clone(), duration);
                },
                /**
                 * tweens a Vector3 field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {Microsoft.Xna.Framework.Vector3}                          to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$7: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector3Tween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(Microsoft.Xna.Framework.Vector3))(self, memberName), to.$clone(), duration);
                },
                /**
                 * tweens a Vector3 field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {Microsoft.Xna.Framework.Vector4}                          to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$8: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector4Tween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(Microsoft.Xna.Framework.Vector4))(self, memberName), to.$clone(), duration);
                },
                /**
                 * tweens a Vector3 field or property
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {System.Object}                                            self          
                 * @param   {string}                                                   memberName    
                 * @param   {Microsoft.Xna.Framework.Quaternion}                       to            
                 * @param   {number}                                                   duration
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}
                 */
                TweenTo$2: function (self, memberName, to, duration) {
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.QuaternionTween(new (SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1(Microsoft.Xna.Framework.Quaternion))(self, memberName), to.$clone(), duration);
                },
                /**
                 * transform.rotation tween
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {SpineEngine.ECS.Components.RotateComponent}               self        Self.
                 * @param   {number}                                                   to          To.
                 * @param   {number}                                                   duration    Duration.
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}                The rotation to.
                 */
                TweenRadiansTo: function (self, to, duration) {
                    if (duration === void 0) { duration = 0.3; }
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.FloatTween(new SpineEngine.GlobalManagers.Tweens.TweenTargets.RotateComponentTweenTarget(self), to, duration);
                },
                /**
                 * transform.localEulers tween
                 *
                 * @static
                 * @public
                 * @this SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenExt
                 * @param   {SpineEngine.ECS.Components.RotateComponent}               self        Self.
                 * @param   {number}                                                   to          To.
                 * @param   {number}                                                   duration    Duration.
                 * @return  {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1}                The klocal eulers to.
                 */
                TweenDegreesTo: function (self, to, duration) {
                    if (duration === void 0) { duration = 0.3; }
                    return new SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.FloatTween(new SpineEngine.GlobalManagers.Tweens.TweenTargets.RotateDegreesComponentTweenTarget(self), to, duration);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Cameras.Camera", {
        fields: {
            position: null,
            rotation: 0,
            zoom: 0,
            minimumZoom: 0,
            maximumZoom: 0,
            bounds: null,
            inset: null,
            transformMatrix: null,
            inverseTransformMatrix: null,
            projectionMatrix: null,
            origin: null,
            areMatrixesDirty: false,
            areBoundsDirty: false,
            isProjectionMatrixDirty: false
        },
        props: {
            /**
             * z-position of the 3D camera projections. Affects the fov greatly. Lower values make the objects appear very long in
                 the z-direction.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function PositionZ3D
             * @type number
             */
            PositionZ3D: 0,
            /**
             * near clip plane of the 3D camera projection
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function NearClipPlane3D
             * @type number
             */
            NearClipPlane3D: 0,
            /**
             * far clip plane of the 3D camera projection
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function FarClipPlane3D
             * @type number
             */
            FarClipPlane3D: 0,
            Position: {
                get: function () {
                    return this.position.$clone();
                },
                set: function (value) {
                    if (Microsoft.Xna.Framework.Vector2.op_Equality(this.position.$clone(), value.$clone())) {
                        return;
                    }

                    this.position = value.$clone();
                    this.areMatrixesDirty = true;
                    this.areBoundsDirty = true;
                }
            },
            Rotation: {
                get: function () {
                    return this.rotation;
                },
                set: function (value) {
                    if (this.rotation === value) {
                        return;
                    }

                    this.rotation = value;
                    this.areMatrixesDirty = true;
                    this.areBoundsDirty = true;
                }
            },
            /**
             * raw zoom value. This is the exact value used for the scale matrix. Default is 1.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function RawZoom
             * @type number
             */
            RawZoom: {
                get: function () {
                    return this.zoom;
                },
                set: function (value) {
                    if (value === this.zoom) {
                        return;
                    }

                    this.zoom = value;
                    this.areBoundsDirty = true;
                    this.areMatrixesDirty = true;
                }
            },
            /**
             * the zoom value should be between -1 and 1. This value is then translated to be from minimumZoom to maximumZoom.
                 This lets you set
                 appropriate minimum/maximum values then use a more intuitive -1 to 1 mapping to change the zoom.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function Zoom
             * @type number
             */
            Zoom: {
                get: function () {
                    if (this.zoom === 0) {
                        return 1.0;
                    }

                    if (this.zoom < 1) {
                        return SpineEngine.Maths.Mathf.Map(this.zoom, this.minimumZoom, 1, -1, 0);
                    }
                    return SpineEngine.Maths.Mathf.Map(this.zoom, 1, this.maximumZoom, 0, 1);
                },
                set: function (value) {
                    var newZoom = SpineEngine.Maths.Mathf.Clamp$1(value, -1, 1);
                    if (newZoom === 0) {
                        this.zoom = 1.0;
                    } else {
                        if (newZoom < 0) {
                            this.zoom = SpineEngine.Maths.Mathf.Map(newZoom, -1, 0, this.minimumZoom, 1);
                        } else {
                            this.zoom = SpineEngine.Maths.Mathf.Map(newZoom, 0, 1, 1, this.maximumZoom);
                        }
                    }

                    this.areMatrixesDirty = true;
                }
            },
            Inset: {
                get: function () {
                    return this.inset.$clone();
                },
                set: function (value) {
                    this.inset = value.$clone();
                    this.areBoundsDirty = true;
                }
            },
            /**
             * minimum non-scaled value (0 - float.Max) that the camera zoom can be. Defaults to 0.3
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function MinimumZoom
             * @type number
             */
            MinimumZoom: {
                get: function () {
                    return this.minimumZoom;
                },
                set: function (value) {
                    if (this.zoom < value) {
                        this.zoom = this.MinimumZoom;
                    }
                    this.minimumZoom = value;
                }
            },
            /**
             * maximum non-scaled value (0 - float.Max) that the camera zoom can be. Defaults to 3
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function MaximumZoom
             * @type number
             */
            MaximumZoom: {
                get: function () {
                    return this.maximumZoom;
                },
                set: function (value) {
                    if (this.zoom > value) {
                        this.zoom = value;
                    }
                    this.maximumZoom = value;
                }
            },
            /**
             * world-space bounds of the camera. useful for culling.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function Bounds
             * @type SpineEngine.Maths.RectangleF
             */
            Bounds: {
                get: function () {
                    this.UpdateMatrices();

                    if (!this.areBoundsDirty) {
                        return this.bounds.$clone();
                    }

                    // top-left and bottom-right are needed by either rotated or non-rotated bounds
                    var topLeft = this.ScreenToWorldPoint$1(new Microsoft.Xna.Framework.Vector2.$ctor2(SpineEngine.Core.Instance.GraphicsDevice.Viewport.X + this.inset.Left, SpineEngine.Core.Instance.GraphicsDevice.Viewport.Y + this.inset.Top));
                    var bottomRight = this.ScreenToWorldPoint$1(new Microsoft.Xna.Framework.Vector2.$ctor2(((SpineEngine.Core.Instance.GraphicsDevice.Viewport.X + SpineEngine.Core.Instance.GraphicsDevice.Viewport.Width) | 0) - this.inset.Right, ((SpineEngine.Core.Instance.GraphicsDevice.Viewport.Y + SpineEngine.Core.Instance.GraphicsDevice.Viewport.Height) | 0) - this.inset.Bottom));

                    if (this.Rotation !== 0) {
                        // special care for rotated bounds. we need to find our absolute min/max values and create the bounds from that
                        var topRight = this.ScreenToWorldPoint$1(new Microsoft.Xna.Framework.Vector2.$ctor2(((SpineEngine.Core.Instance.GraphicsDevice.Viewport.X + SpineEngine.Core.Instance.GraphicsDevice.Viewport.Width) | 0) - this.inset.Right, SpineEngine.Core.Instance.GraphicsDevice.Viewport.Y + this.inset.Top));
                        var bottomLeft = this.ScreenToWorldPoint$1(new Microsoft.Xna.Framework.Vector2.$ctor2(SpineEngine.Core.Instance.GraphicsDevice.Viewport.X + this.inset.Left, ((SpineEngine.Core.Instance.GraphicsDevice.Viewport.Y + SpineEngine.Core.Instance.GraphicsDevice.Viewport.Height) | 0) - this.inset.Bottom));

                        var minX = SpineEngine.Maths.Mathf.MinOf$1(topLeft.X, bottomRight.X, topRight.X, bottomLeft.X);
                        var maxX = SpineEngine.Maths.Mathf.MaxOf$1(topLeft.X, bottomRight.X, topRight.X, bottomLeft.X);
                        var minY = SpineEngine.Maths.Mathf.MinOf$1(topLeft.Y, bottomRight.Y, topRight.Y, bottomLeft.Y);
                        var maxY = SpineEngine.Maths.Mathf.MaxOf$1(topLeft.Y, bottomRight.Y, topRight.Y, bottomLeft.Y);

                        this.bounds.Location = new Microsoft.Xna.Framework.Vector2.$ctor2(minX, minY);
                        this.bounds.Width = maxX - minX;
                        this.bounds.Height = maxY - minY;
                    } else {
                        this.bounds.Location = topLeft.$clone();
                        this.bounds.Width = bottomRight.X - topLeft.X;
                        this.bounds.Height = bottomRight.Y - topLeft.Y;
                    }

                    this.areBoundsDirty = false;

                    return this.bounds.$clone();
                }
            },
            /**
             * used to convert from world coordinates to screen
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function TransformMatrix
             * @type Microsoft.Xna.Framework.Matrix
             */
            TransformMatrix: {
                get: function () {
                    this.UpdateMatrices();
                    return this.transformMatrix.$clone();
                }
            },
            /**
             * used to convert from screen coordinates to world
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function InverseTransformMatrix
             * @type Microsoft.Xna.Framework.Matrix
             */
            InverseTransformMatrix: {
                get: function () {
                    this.UpdateMatrices();
                    return this.inverseTransformMatrix.$clone();
                }
            },
            /**
             * the 2D Cameras projection matrix
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function ProjectionMatrix
             * @type Microsoft.Xna.Framework.Matrix
             */
            ProjectionMatrix: {
                get: function () {
                    if (this.isProjectionMatrixDirty) {
                        Microsoft.Xna.Framework.Matrix.CreateOrthographicOffCenter$2(0, SpineEngine.Core.Instance.GraphicsDevice.Viewport.Width, SpineEngine.Core.Instance.GraphicsDevice.Viewport.Height, 0, 0, -1, Bridge.ref(this, "projectionMatrix"));
                        this.isProjectionMatrixDirty = false;
                    }

                    return this.projectionMatrix.$clone();
                }
            },
            /**
             * gets the view-projection matrix which is the transformMatrix * the projection matrix
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function ViewProjectionMatrix
             * @type Microsoft.Xna.Framework.Matrix
             */
            ViewProjectionMatrix: {
                get: function () {
                    return Microsoft.Xna.Framework.Matrix.op_Multiply(this.TransformMatrix.$clone(), this.ProjectionMatrix.$clone());
                }
            },
            /**
             * returns a perspective projection for this camera for use when rendering 3D objects
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function ProjectionMatrix3D
             * @type Microsoft.Xna.Framework.Matrix
             */
            ProjectionMatrix3D: {
                get: function () {
                    var targetHeight = SpineEngine.Core.Instance.GraphicsDevice.Viewport.Height / this.zoom;
                    var fov = Math.atan(targetHeight / (2.0 * this.PositionZ3D)) * 2.0;
                    return Microsoft.Xna.Framework.Matrix.CreatePerspectiveFieldOfView(fov, SpineEngine.Core.Instance.GraphicsDevice.Viewport.AspectRatio, this.NearClipPlane3D, this.FarClipPlane3D);
                }
            },
            /**
             * returns a view Matrix via CreateLookAt for this camera for use when rendering 3D objects
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @function ViewMatrix3D
             * @type Microsoft.Xna.Framework.Matrix
             */
            ViewMatrix3D: {
                get: function () {
                    // we need to always invert the y-values to match the way Batcher/SpriteBatch does things
                    var position3D = new Microsoft.Xna.Framework.Vector3.$ctor3(this.Position.X, -this.Position.Y, this.PositionZ3D);
                    return Microsoft.Xna.Framework.Matrix.CreateLookAt(position3D.$clone(), Microsoft.Xna.Framework.Vector3.op_Addition(position3D.$clone(), Microsoft.Xna.Framework.Vector3.Forward.$clone()), Microsoft.Xna.Framework.Vector3.Up.$clone());
                }
            },
            Origin: {
                get: function () {
                    return this.origin.$clone();
                },
                set: function (value) {
                    if (Microsoft.Xna.Framework.Vector2.op_Equality(this.origin.$clone(), value.$clone())) {
                        return;
                    }

                    this.origin = value.$clone();
                    this.areMatrixesDirty = true;
                    this.areBoundsDirty = true;
                }
            }
        },
        ctors: {
            init: function () {
                this.position = new Microsoft.Xna.Framework.Vector2();
                this.bounds = new SpineEngine.Maths.RectangleF();
                this.inset = new SpineEngine.Maths.RectangleF();
                this.transformMatrix = new Microsoft.Xna.Framework.Matrix();
                this.inverseTransformMatrix = new Microsoft.Xna.Framework.Matrix();
                this.projectionMatrix = new Microsoft.Xna.Framework.Matrix();
                this.origin = new Microsoft.Xna.Framework.Vector2();
                this.zoom = 1.0;
                this.minimumZoom = 0.3;
                this.maximumZoom = 3.0;
                this.transformMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.inverseTransformMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.areMatrixesDirty = true;
                this.areBoundsDirty = true;
                this.isProjectionMatrixDirty = true;
                this.PositionZ3D = 2000.0;
                this.NearClipPlane3D = 0.0001;
                this.FarClipPlane3D = 5000.0;
            }
        },
        methods: {
            OnSceneRenderTargetSizeChanged: function (sceneRenderTarget) {
                this.isProjectionMatrixDirty = true;
                var oldOrigin = this.origin.$clone();
                this.Origin = new Microsoft.Xna.Framework.Vector2.$ctor2(sceneRenderTarget.Width / 2.0, sceneRenderTarget.Height / 2.0);

                // offset our position to match the new center
                this.Position = Microsoft.Xna.Framework.Vector2.op_Addition(this.Position.$clone(), Microsoft.Xna.Framework.Vector2.op_Subtraction(this.origin.$clone(), oldOrigin.$clone()));
            },
            UpdateMatrices: function () {
                if (!this.areMatrixesDirty) {
                    return;
                }

                var tempMat = { v : new Microsoft.Xna.Framework.Matrix() };
                this.transformMatrix = Microsoft.Xna.Framework.Matrix.CreateTranslation$1(-this.Position.X, -this.Position.Y, 0); // position

                if (this.zoom !== 1.0) {
                    Microsoft.Xna.Framework.Matrix.CreateScale$5(this.zoom, this.zoom, 1, tempMat); // scale ->
                    Microsoft.Xna.Framework.Matrix.Multiply$2(Bridge.ref(this, "transformMatrix"), tempMat, Bridge.ref(this, "transformMatrix"));
                }

                if (this.Rotation !== 0.0) {
                    Microsoft.Xna.Framework.Matrix.CreateRotationZ$1(this.Rotation, tempMat); // rotation
                    Microsoft.Xna.Framework.Matrix.Multiply$2(Bridge.ref(this, "transformMatrix"), tempMat, Bridge.ref(this, "transformMatrix"));
                }

                Microsoft.Xna.Framework.Matrix.CreateTranslation$3(Bridge.Int.clip32(this.origin.X), Bridge.Int.clip32(this.origin.Y), 0, tempMat); // translate -origin
                Microsoft.Xna.Framework.Matrix.Multiply$2(Bridge.ref(this, "transformMatrix"), tempMat, Bridge.ref(this, "transformMatrix"));

                // calculate our inverse as well
                Microsoft.Xna.Framework.Matrix.Invert$1(Bridge.ref(this, "transformMatrix"), Bridge.ref(this, "inverseTransformMatrix"));

                // whenever the matrix changes the bounds are then invalid
                this.areBoundsDirty = true;
                this.areMatrixesDirty = false;
            },
            ZoomIn: function (deltaZoom) {
                this.Zoom += deltaZoom;
            },
            ZoomOut: function (deltaZoom) {
                this.Zoom -= deltaZoom;
            },
            /**
             * converts a point from world coordinates to screen
             *
             * @instance
             * @public
             * @this SpineEngine.Graphics.Cameras.Camera
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @param   {Microsoft.Xna.Framework.Vector2}    worldPosition    World position.
             * @return  {Microsoft.Xna.Framework.Vector2}                     The to screen point.
             */
            WorldToScreenPoint: function (worldPosition) {
                worldPosition = {v:worldPosition};
                this.UpdateMatrices();
                Microsoft.Xna.Framework.Vector2.Transform$2(worldPosition, Bridge.ref(this, "transformMatrix"), worldPosition);
                return worldPosition.v.$clone();
            },
            /**
             * converts a point from screen coordinates to world
             *
             * @instance
             * @public
             * @this SpineEngine.Graphics.Cameras.Camera
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @param   {Microsoft.Xna.Framework.Vector2}    screenPosition    Screen position.
             * @return  {Microsoft.Xna.Framework.Vector2}                      The to world point.
             */
            ScreenToWorldPoint$1: function (screenPosition) {
                screenPosition = {v:screenPosition};
                this.UpdateMatrices();
                Microsoft.Xna.Framework.Vector2.Transform$2(screenPosition, Bridge.ref(this, "inverseTransformMatrix"), screenPosition);
                return screenPosition.v.$clone();
            },
            /**
             * converts a point from screen coordinates to world
             *
             * @instance
             * @public
             * @this SpineEngine.Graphics.Cameras.Camera
             * @memberof SpineEngine.Graphics.Cameras.Camera
             * @param   {Microsoft.Xna.Framework.Point}      screenPosition    Screen position.
             * @return  {Microsoft.Xna.Framework.Vector2}                      The to world point.
             */
            ScreenToWorldPoint: function (screenPosition) {
                return this.ScreenToWorldPoint$1(screenPosition.ToVector2());
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Drawable.IDrawable", {
        $kind: "interface"
    });

    Bridge.define("SpineEngine.Graphics.Graphic", {
        statics: {
            fields: {
                pixelTexture: null,
                spriteEffect: null,
                spriteBatch: null,
                /**
                 * default SamplerState used by Materials. Note that this must be set at launch! Changing it after that time will
                     result in only
                     Materials created after it was set having the new SamplerState
                 *
                 * @static
                 * @public
                 * @memberof SpineEngine.Graphics.Graphic
                 * @type Microsoft.Xna.Framework.Graphics.SamplerState
                 */
                DefaultSamplerState: null
            },
            props: {
                /**
                 * default wrapped SamplerState. Determined by the Filter of the defaultSamplerState.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.Graphic
                 * @function DefaultWrappedSamplerState
                 * @type Microsoft.Xna.Framework.Graphics.SamplerState
                 */
                DefaultWrappedSamplerState: {
                    get: function () {
                        return SpineEngine.Graphics.Graphic.DefaultSamplerState.Filter === Microsoft.Xna.Framework.Graphics.TextureFilter.Point ? Microsoft.Xna.Framework.Graphics.SamplerState.PointWrap : Microsoft.Xna.Framework.Graphics.SamplerState.LinearWrap;
                    }
                },
                /**
                 * A subtexture used to draw rectangles, lines, circles, etc.
                     Will be generated at startup, but you can replace this with a subtexture from your atlas to reduce texture swaps.
                     Should be a 1x1 white pixel
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.Graphic
                 * @function PixelTexture
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                PixelTexture: {
                    get: function () {
                        SpineEngine.Graphics.Graphic.pixelTexture = SpineEngine.Graphics.Graphic.pixelTexture || SpineEngine.Core.Instance.Content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, SpineEngine.ContentPaths.SpineEngine.Textures.pixel);
                        return SpineEngine.Graphics.Graphic.pixelTexture;
                    }
                },
                SpriteEffect: {
                    get: function () {
                        SpineEngine.Graphics.Graphic.spriteEffect = SpineEngine.Graphics.Graphic.spriteEffect || SpineEngine.Core.Instance.Content.Load(SpineEngine.Graphics.SpriteEffect, SpineEngine.Graphics.SpriteEffect.EffectAssetName);
                        return SpineEngine.Graphics.Graphic.spriteEffect;
                    }
                },
                SpriteBatch: {
                    get: function () {
                        SpineEngine.Graphics.Graphic.spriteBatch = SpineEngine.Graphics.Graphic.spriteBatch || new Microsoft.Xna.Framework.Graphics.SpriteBatch(SpineEngine.Core.Instance.GraphicsDevice);
                        return SpineEngine.Graphics.Graphic.spriteBatch;
                    }
                }
            },
            ctors: {
                init: function () {
                    this.DefaultSamplerState = Microsoft.Xna.Framework.Graphics.SamplerState.PointClamp;
                }
            },
            methods: {
                Draw: function (finalRenderTarget, clearColor, batch, material) {
                    var $t;
                    var graphicsDevice = SpineEngine.Core.Instance.GraphicsDevice;
                    graphicsDevice.SetRenderTarget(finalRenderTarget);
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", clearColor), null)) {
                        graphicsDevice.Clear(System.Nullable.getValue(clearColor).$clone());
                    }

                    // material?.OnPreRender();
                    SpineEngine.Graphics.Graphic.SpriteBatch.Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, (material != null ? material.BlendState : null) || Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend, (material != null ? material.SamplerState : null) || SpineEngine.Graphics.Graphic.DefaultSamplerState, (material != null ? material.DepthStencilState : null) || Microsoft.Xna.Framework.Graphics.DepthStencilState.None, Microsoft.Xna.Framework.Graphics.RasterizerState.CullNone, material != null ? material.Effect : null);

                    $t = Bridge.getEnumerator(batch.Meshes);
                    try {
                        while ($t.moveNext()) {
                            var mesh = $t.Current;
                            mesh.Draw(SpineEngine.Graphics.Graphic.SpriteBatch);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    SpineEngine.Graphics.Graphic.SpriteBatch.End();
                }
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Materials.Material", {
        fields: {
            BlendState: null,
            DepthStencilState: null,
            Effect: null,
            SamplerState: null
        },
        ctors: {
            init: function () {
                this.BlendState = Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend;
                this.DepthStencilState = Microsoft.Xna.Framework.Graphics.DepthStencilState.None;
                this.SamplerState = SpineEngine.Graphics.Graphic.DefaultSamplerState;
            }
        },
        methods: {
            OnPreRender: function (camera, entity) { },
            Update: function (gameTime) { }
        }
    });

    Bridge.define("SpineEngine.Graphics.Meshes.IMesh", {
        methods: {
            MoveMesh: function (offset) {
                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateTranslation(offset.$clone()));
            },
            ScaleMesh: function (scale) {
                this.ScaleMesh$1(this.GetCenter(), scale.$clone());
            },
            ScaleMesh$1: function (origin, scale) {
                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateTranslation(Microsoft.Xna.Framework.Vector3.op_UnaryNegation(origin.$clone())));
                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateScale(scale.$clone()));
                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateTranslation(origin.$clone()));
            },
            RotateMesh$1: function (rotationRadians) {
                this.RotateMesh(this.GetCenter(), rotationRadians);
            },
            RotateMesh: function (origin, rotationRadians) {
                if (rotationRadians === 0) {
                    return;
                }

                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateTranslation(Microsoft.Xna.Framework.Vector3.op_UnaryNegation(origin.$clone())));
                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateRotationZ(rotationRadians));
                this.ApplyTransformMesh(Microsoft.Xna.Framework.Matrix.CreateTranslation(origin.$clone()));
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Meshes.MeshBatch", {
        fields: {
            Meshes: null
        },
        ctors: {
            init: function () {
                this.Meshes = new (System.Collections.Generic.List$1(SpineEngine.Graphics.Meshes.IMesh)).ctor();
            }
        },
        methods: {
            Draw: function (texture, destRect, srcRect, color, depth) {
                if (depth === void 0) { depth = 0.0; }
                var mesh = SpineEngine.Utils.Collections.Pool$1(SpineEngine.Graphics.Meshes.SpriteMesh).Obtain();
                mesh.Build(texture, destRect.$clone(), srcRect.$clone(), color.$clone(), depth);
                this.Meshes.add(mesh);
                return mesh;
            },
            Clear: function () {
                for (var i = 0; i < this.Meshes.Count; i = (i + 1) | 0) {
                    SpineEngine.Utils.Collections.Pool$1(SpineEngine.Graphics.Meshes.SpriteMesh).Free(Bridge.cast(this.Meshes.getItem(i), SpineEngine.Graphics.Meshes.SpriteMesh));
                }

                this.Meshes.clear();
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Renderers.RendererList", {
        fields: {
            renderers: null
        },
        props: {
            Count: {
                get: function () {
                    return this.renderers.Count;
                }
            }
        },
        ctors: {
            init: function () {
                this.renderers = new (System.Collections.Generic.List$1(SpineEngine.Graphics.Renderers.Renderer)).ctor();
            }
        },
        methods: {
            NotifyEnd: function () {
                for (var i = 0; i < this.renderers.Count; i = (i + 1) | 0) {
                    this.renderers.getItem(i).End();
                }
            },
            Add: function (renderer) {
                this.renderers.add(renderer);
                this.renderers.Sort();
            },
            Get: function (T) {
                for (var i = 0; i < this.renderers.Count; i = (i + 1) | 0) {
                    if (Bridge.is(this.renderers.getItem(i), T)) {
                        return Bridge.cast(this.renderers.getItem(i), T);
                    }
                }

                return null;
            },
            GetAll: function () {
                return this.renderers;
            },
            Remove: function (renderer) {
                this.renderers.remove(renderer);
            }
        }
    });

    /** @namespace SpineEngine.Graphics.RenderProcessors */

    /**
     * Post Processing step for rendering actions after everything done.
     *
     * @public
     * @class SpineEngine.Graphics.RenderProcessors.RenderProcessor
     * @implements  System.IComparable$1
     */
    Bridge.define("SpineEngine.Graphics.RenderProcessors.RenderProcessor", {
        inherits: function () { return [System.IComparable$1(SpineEngine.Graphics.RenderProcessors.RenderProcessor)]; },
        fields: {
            /**
             * specifies the order in which the Renderers will be called by the scene
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @type number
             */
            ExecutionOrder: 0,
            /**
             * BlendState used by the DrawFullScreenQuad method
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @type Microsoft.Xna.Framework.Graphics.BlendState
             */
            BlendState: null,
            /**
             * The effect used to render with
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @type Microsoft.Xna.Framework.Graphics.Effect
             */
            Effect: null,
            /**
             * Step is Enabled or not.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @type boolean
             */
            Enabled: false,
            /**
             * SamplerState used for the drawFullscreenQuad method
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @type Microsoft.Xna.Framework.Graphics.SamplerState
             */
            SamplerState: null,
            Batch: null,
            Material: null
        },
        alias: ["compareTo", ["System$IComparable$1$SpineEngine$Graphics$RenderProcessors$RenderProcessor$compareTo", "System$IComparable$1$compareTo"]],
        ctors: {
            init: function () {
                this.BlendState = Microsoft.Xna.Framework.Graphics.BlendState.Opaque;
                this.SamplerState = SpineEngine.Graphics.Graphic.DefaultSamplerState;
                this.Batch = new SpineEngine.Graphics.Meshes.MeshBatch();
                this.Material = new SpineEngine.Graphics.Materials.Material();
            },
            ctor: function (executionOrder, effect) {
                if (effect === void 0) { effect = null; }

                this.$initialize();
                this.Enabled = true;
                this.ExecutionOrder = executionOrder;
                this.Effect = effect;
            }
        },
        methods: {
            compareTo: function (other) {
                return Bridge.compare(this.ExecutionOrder, other.ExecutionOrder);
            },
            /**
             * called when the PostProcessor is added to the scene. The scene field is not valid until this is called
             *
             * @instance
             * @public
             * @this SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @param   {SpineEngine.ECS.Scene}    scene
             * @return  {void}
             */
            OnAddedToScene: function (scene) { },
            /**
             * this is the meat method here. The source passed in contains the full scene with any previous PostProcessors
                 rendering. Render it into the destination RenderTarget. The drawFullScreenQuad methods are there to make
                 the process even easier. The default implementation renders source into destination with effect.
                 Note that destination might have a previous render! If your PostProcessor Effect is discarding you should clear
                 the destination before writing to it!
             *
             * @instance
             * @public
             * @this SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @param   {Microsoft.Xna.Framework.Graphics.RenderTarget2D}    source         
             * @param   {Microsoft.Xna.Framework.Graphics.RenderTarget2D}    destination
             * @return  {void}
             */
            Render: function (source, destination) {
                this.DrawFullScreenQuad(source, destination);
            },
            Update: function (gameTime) {

            },
            /**
             * called when a scene is ended. use this for cleanup.
             *
             * @instance
             * @public
             * @this SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @return  {void}
             */
            Unload: function () { },
            /**
             * helper for drawing a texture into a render target, optionally using a custom shader to apply postprocessing effects.
             *
             * @instance
             * @protected
             * @this SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @memberof SpineEngine.Graphics.RenderProcessors.RenderProcessor
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}         texture         
             * @param   {Microsoft.Xna.Framework.Graphics.RenderTarget2D}    renderTarget    
             * @param   {Microsoft.Xna.Framework.Graphics.Effect}            effect
             * @return  {void}
             */
            DrawFullScreenQuad: function (texture, renderTarget, effect) {
                if (effect === void 0) { effect = null; }
                this.Material.Effect = effect || this.Effect;
                this.Material.BlendState = this.BlendState;
                this.Material.SamplerState = this.SamplerState;
                this.Material.DepthStencilState = Microsoft.Xna.Framework.Graphics.DepthStencilState.None;

                this.Batch.Clear();
                this.Batch.Draw(texture, SpineEngine.Maths.RectangleF.op_Implicit$1(renderTarget.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(texture.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);
                SpineEngine.Graphics.Graphic.Draw(renderTarget, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.Material);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderProcessors.Impl.FinalRenderer.LastState", {
        props: {
            RenderTarget: null,
            RenderTarget2: null,
            Material: null,
            Camera: null
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderProcessors.RenderProcessorList", {
        fields: {
            postProcessors: null,
            destinationRenderTarget: null,
            Scene: null,
            sourceRenderTarget: null
        },
        props: {
            Count: {
                get: function () {
                    return this.postProcessors.Count;
                }
            }
        },
        ctors: {
            init: function () {
                this.postProcessors = new (System.Collections.Generic.List$1(SpineEngine.Graphics.RenderProcessors.RenderProcessor)).ctor();
            },
            ctor: function (scene) {
                this.$initialize();
                this.Scene = scene;
            }
        },
        methods: {
            NotifyEnd: function () {
                for (var i = 0; i < this.postProcessors.Count; i = (i + 1) | 0) {
                    this.postProcessors.getItem(i).Unload();
                }
            },
            NotifyPostProcess: function (finalRenderTarget, finalRenderDestinationRect, sceneRenderTarget) {
                if (this.postProcessors.Count === 0) {
                    return;
                }

                if (this.destinationRenderTarget == null || this.destinationRenderTarget.Bounds.Width !== sceneRenderTarget.Width || this.destinationRenderTarget.Bounds.Height !== sceneRenderTarget.Height) {
                    this.destinationRenderTarget != null ? this.destinationRenderTarget.Dispose() : null;
                    this.destinationRenderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, sceneRenderTarget.Width, sceneRenderTarget.Height, false, SpineEngine.Core.Instance.Screen.BackBufferFormat, SpineEngine.Core.Instance.Screen.PreferredDepthStencilFormat, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.DiscardContents);
                }

                if (this.sourceRenderTarget == null || this.sourceRenderTarget.Bounds.Width !== sceneRenderTarget.Width || this.sourceRenderTarget.Bounds.Height !== sceneRenderTarget.Height) {
                    this.sourceRenderTarget != null ? this.sourceRenderTarget.Dispose() : null;
                    this.sourceRenderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, sceneRenderTarget.Width, sceneRenderTarget.Height, false, SpineEngine.Core.Instance.Screen.BackBufferFormat, SpineEngine.Core.Instance.Screen.PreferredDepthStencilFormat, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.DiscardContents);
                }

                for (var i = 0; i < ((this.postProcessors.Count - 1) | 0); i = (i + 1) | 0) {
                    if (!this.postProcessors.getItem(i).Enabled) {
                        continue;
                    }

                    this.postProcessors.getItem(i).Render(this.sourceRenderTarget, this.destinationRenderTarget);
                    var tmpRenderTarget = this.sourceRenderTarget;
                    this.sourceRenderTarget = this.destinationRenderTarget;
                    this.destinationRenderTarget = tmpRenderTarget;
                }

                this.postProcessors.getItem(((this.postProcessors.Count - 1) | 0)).Render(this.sourceRenderTarget, finalRenderTarget);
            },
            Add: function (renderProcessor) {
                this.postProcessors.add(renderProcessor);
                this.postProcessors.Sort();
                renderProcessor.OnAddedToScene(this.Scene);
            },
            Remove: function (step) {
                this.postProcessors.remove(step);
            },
            Get: function (T) {
                for (var i = 0; i < this.postProcessors.Count; i = (i + 1) | 0) {
                    if (Bridge.is(this.postProcessors.getItem(i), T)) {
                        return Bridge.as(this.postProcessors.getItem(i), T);
                    }
                }

                return null;
            },
            GetAll: function () {
                return new (System.Collections.ObjectModel.ReadOnlyCollection$1(SpineEngine.Graphics.RenderProcessors.RenderProcessor))(this.postProcessors);
            },
            NotifyUpdate: function (gameTime) {

                for (var i = 0; i < this.postProcessors.Count; i = (i + 1) | 0) {
                    this.postProcessors.getItem(i).Update(gameTime);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderTexture", {
        inherits: [System.IDisposable],
        statics: {
            methods: {
                op_Implicit: function (tex) {
                    return tex != null ? tex.RenderTarget : null;
                }
            }
        },
        fields: {
            RenderTarget: null,
            ResizeBehavior: 0
        },
        alias: ["Dispose", "System$IDisposable$Dispose"],
        ctors: {
            init: function () {
                this.ResizeBehavior = SpineEngine.Graphics.RenderTexture.RenderTextureResizeBehavior.SizeToSceneRenderTarget;
            },
            ctor: function () {
                SpineEngine.Graphics.RenderTexture.$ctor4.call(this, SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height, SpineEngine.Core.Instance.Screen.BackBufferFormat, SpineEngine.Core.Instance.Screen.PreferredDepthStencilFormat);
            },
            $ctor1: function (preferredDepthFormat) {
                SpineEngine.Graphics.RenderTexture.$ctor4.call(this, SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height, SpineEngine.Core.Instance.Screen.BackBufferFormat, preferredDepthFormat);
            },
            $ctor2: function (width, height) {
                SpineEngine.Graphics.RenderTexture.$ctor4.call(this, width, height, SpineEngine.Core.Instance.Screen.BackBufferFormat, SpineEngine.Core.Instance.Screen.PreferredDepthStencilFormat);
            },
            $ctor3: function (width, height, preferredDepthFormat) {
                SpineEngine.Graphics.RenderTexture.$ctor4.call(this, width, height, SpineEngine.Core.Instance.Screen.BackBufferFormat, preferredDepthFormat);
            },
            $ctor4: function (width, height, preferredFormat, preferredDepthFormat) {
                this.$initialize();
                this.RenderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, width, height, false, preferredFormat, preferredDepthFormat, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
            }
        },
        methods: {
            Dispose: function () {
                if (this.RenderTarget != null && !this.RenderTarget.IsDisposed) {
                    this.RenderTarget.Dispose();
                    this.RenderTarget = null;
                }
            },
            OnSceneBackBufferSizeChanged: function (newWidth, newHeight) {
                switch (this.ResizeBehavior) {
                    case SpineEngine.Graphics.RenderTexture.RenderTextureResizeBehavior.None: 
                        break;
                    case SpineEngine.Graphics.RenderTexture.RenderTextureResizeBehavior.SizeToSceneRenderTarget: 
                        this.Resize(newWidth, newHeight);
                        break;
                    case SpineEngine.Graphics.RenderTexture.RenderTextureResizeBehavior.SizeToScreen: 
                        this.Resize(SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height);
                        break;
                }
            },
            Resize: function (width, height) {
                if (this.RenderTarget.Width === width && this.RenderTarget.Height === height && !this.RenderTarget.IsDisposed) {
                    return;
                }

                var depthFormat = this.RenderTarget.DepthStencilFormat;

                // unload if necessary
                this.Dispose();

                this.RenderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, width, height, false, SpineEngine.Core.Instance.Screen.BackBufferFormat, depthFormat, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderTexture.RenderTextureResizeBehavior", {
        $kind: "nested enum",
        statics: {
            fields: {
                None: 0,
                SizeToSceneRenderTarget: 1,
                SizeToScreen: 2
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy", {
        statics: {
            fields: {
                /**
                 * Default. RenderTarget matches the scene size
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                None: null,
                /**
                 * The entire application is visible in the specified area without trying to preserve the original aspect ratio.
                     Distortion can occur, and the application may appear stretched or compressed.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                ExactFit: null,
                /**
                 * The entire application is visible in the specified area without maintaining the original
                     aspect ratio of the application.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                Stretch: null,
                /**
                 * The entire application fills the specified area, without distortion but possibly with some cropping,
                     while maintaining the original aspect ratio of the application.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                NoBorder: null,
                /**
                 * Pixel perfect version of NoBorder. Scaling is limited to integer values.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                NoBorderPixelPerfect: null,
                /**
                 * The entire application is visible in the specified area without distortion while maintaining the original
                     aspect ratio of the application. Borders can appear on two sides of the application.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                ShowAll: null,
                /**
                 * Pixel perfect version of ShowAll. Scaling is limited to integer values.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                ShowAllPixelPerfect: null,
                /**
                 * The application takes the height of the design resolution size and modifies the width of the internal
                     canvas so that it fits the aspect ratio of the device.
                     no distortion will occur however you must make sure your application works on different
                     aspect ratios
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                FixedHeight: null,
                /**
                 * Pixel perfect version of FixedHeight. Scaling is limited to integer values.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                FixedHeightPixelPerfect: null,
                /**
                 * The application takes the width of the design resolution size and modifies the height of the internal
                     canvas so that it fits the aspect ratio of the device.
                     no distortion will occur however you must make sure your application works on different
                     aspect ratios
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                FixedWidth: null,
                /**
                 * Pixel perfect version of FixedWidth. Scaling is limited to integer values.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                FixedWidthPixelPerfect: null,
                /**
                 * The application takes the width and height that best fits the design resolution with optional cropping inside of
                     the "bleed area"
                     and possible letter/pillar boxing. Works just like ShowAll except with horizontal/vertical bleed (padding). Gives
                     you an area much
                     like the old TitleSafeArea. Example: if design resolution is 1348x900 and bleed is 148x140 the safe area would be
                     1200x760 (design
                     resolution - bleed).
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 * @type SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy
                 */
                BestFit: null
            },
            ctors: {
                init: function () {
                    this.None = new SpineEngine.Graphics.ResolutionPolicy.NoneSceneResolutionPolicy();
                    this.ExactFit = new SpineEngine.Graphics.ResolutionPolicy.ExactFitSceneResolutionPolicy();
                    this.Stretch = new SpineEngine.Graphics.ResolutionPolicy.StretchSceneResolutionPolicy();
                    this.NoBorder = new SpineEngine.Graphics.ResolutionPolicy.NoBorderSceneResolutionPolicy();
                    this.NoBorderPixelPerfect = new SpineEngine.Graphics.ResolutionPolicy.NoBorderPixelPerfectSceneResolutionPolicy();
                    this.ShowAll = new SpineEngine.Graphics.ResolutionPolicy.ShowAllSceneResolutionPolicy();
                    this.ShowAllPixelPerfect = new SpineEngine.Graphics.ResolutionPolicy.ShowAllPixelPerfectSceneResolutionPolicy();
                    this.FixedHeight = new SpineEngine.Graphics.ResolutionPolicy.FixedHeightSceneResolutionPolicy();
                    this.FixedHeightPixelPerfect = new SpineEngine.Graphics.ResolutionPolicy.FixedHeightPixelPerfectSceneResolutionPolicy();
                    this.FixedWidth = new SpineEngine.Graphics.ResolutionPolicy.FixedWidthSceneResolutionPolicy();
                    this.FixedWidthPixelPerfect = new SpineEngine.Graphics.ResolutionPolicy.FixedWidthPixelPerfectSceneResolutionPolicy();
                    this.BestFit = new SpineEngine.Graphics.ResolutionPolicy.BestFitSceneResolutionPolicy();
                }
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.SpriteEffect", {
        inherits: [Microsoft.Xna.Framework.Graphics.Effect],
        statics: {
            fields: {
                EffectAssetName: null
            },
            ctors: {
                init: function () {
                    this.EffectAssetName = "SpineEngine/effects/SpriteEffect";
                }
            }
        },
        fields: {
            matrixTransformParam: null
        },
        ctors: {
            ctor: function (cloneSource) {
                this.$initialize();
                Microsoft.Xna.Framework.Graphics.Effect.ctor.call(this, cloneSource);
                this.matrixTransformParam = this.Parameters.getItem$1("MatrixTransform");
            }
        },
        methods: {
            SetMatrixTransform: function (matrixTransform) {
                this.matrixTransformParam.SetValue$1(matrixTransform.v.$clone());
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Transitions.IProgressEffect", {
        $kind: "interface"
    });

    Bridge.define("SpineEngine.Graphics.Transitions.SceneTransition", {
        fields: {
            OnTransitionCompleted: null,
            Batch: null,
            Material: null,
            SceneLoadAction: null
        },
        props: {
            Effect: null,
            PreviousSceneRender: null
        },
        ctors: {
            init: function () {
                var $t;
                this.Batch = new SpineEngine.Graphics.Meshes.MeshBatch();
                this.Material = ($t = new SpineEngine.Graphics.Materials.Material(), $t.BlendState = Microsoft.Xna.Framework.Graphics.BlendState.NonPremultiplied, $t.SamplerState = SpineEngine.Graphics.Graphic.DefaultSamplerState, $t.DepthStencilState = Microsoft.Xna.Framework.Graphics.DepthStencilState.None, $t);
            },
            ctor: function () {
                this.$initialize();
                this.PreviousSceneRender = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(SpineEngine.Core.Instance.GraphicsDevice, SpineEngine.Core.Instance.Screen.Width, SpineEngine.Core.Instance.Screen.Height, false, SpineEngine.Core.Instance.Screen.BackBufferFormat, Microsoft.Xna.Framework.Graphics.DepthFormat.None, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
            }
        },
        methods: {
            SetNextScene: function () {
                SpineEngine.Core.Instance.Scene = this.SceneLoadAction();
            },
            PreRender: function () { },
            Render: function () {
                this.Batch.Clear();
                this.Batch.Draw(this.PreviousSceneRender, SpineEngine.Maths.RectangleF.op_Implicit$1(this.PreviousSceneRender.Bounds.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(this.PreviousSceneRender.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);
                this.Material.Effect = this.Effect;
                SpineEngine.Graphics.Graphic.Draw(null, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.Material);
            },
            TransitionComplete: function () {
                var $t;
                SpineEngine.Core.Instance.SceneTransition = null;

                ($t = this.PreviousSceneRender) != null ? $t.Dispose() : null;
                this.PreviousSceneRender = null;
                !Bridge.staticEquals(this.OnTransitionCompleted, null) ? this.OnTransitionCompleted() : null;
            },
            TickEffectProgressProperty: function (effect, duration, easeType, reverseDirection) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    start,
                    end,
                    startAt,
                    elapsed,
                    step,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (easeType === void 0) { easeType = 17; }
                                        if (reverseDirection === void 0) { reverseDirection = false; }
                                        start = reverseDirection ? 1.0 : 0.0;
                                        end = reverseDirection ? 0.0 : 1.0;

                                        startAt = System.DateTime.getNow();
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds() < duration ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    elapsed = (System.DateTime.subdd(System.DateTime.getNow(), startAt)).getTotalSeconds();
                                        step = SpineEngine.Maths.Easing.Lerps.Ease$8(easeType, start, end, elapsed, duration);
                                        effect.SpineEngine$Graphics$Transitions$IProgressEffect$Progress = step;

                                        $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {

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
            }
        }
    });

    /** @namespace SpineEngine.Maths */

    /**
     * cubic and quadratic bezier helper
     *
     * @static
     * @abstract
     * @public
     * @class SpineEngine.Maths.Bezier
     */
    Bridge.define("SpineEngine.Maths.Bezier", {
        statics: {
            methods: {
                /**
                 * evaluate quadratic bezier
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Bezier
                 * @memberof SpineEngine.Maths.Bezier
                 * @param   {Microsoft.Xna.Framework.Vector2}    p0    
                 * @param   {Microsoft.Xna.Framework.Vector2}    p1    
                 * @param   {Microsoft.Xna.Framework.Vector2}    p2    
                 * @param   {number}                             t
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                GetPoint$1: function (p0, p1, p2, t) {
                    t = SpineEngine.Maths.Mathf.Clamp01(t);
                    var oneMinusT = 1.0 - t;
                    return Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Multiply$2(oneMinusT * oneMinusT, p0.$clone()), Microsoft.Xna.Framework.Vector2.op_Multiply$2(2.0 * oneMinusT * t, p1.$clone())), Microsoft.Xna.Framework.Vector2.op_Multiply$2(t * t, p2.$clone()));
                },
                /**
                 * evaluate a cubic bezier
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Bezier
                 * @memberof SpineEngine.Maths.Bezier
                 * @param   {Microsoft.Xna.Framework.Vector2}    start                 
                 * @param   {Microsoft.Xna.Framework.Vector2}    firstControlPoint     
                 * @param   {Microsoft.Xna.Framework.Vector2}    secondControlPoint    
                 * @param   {Microsoft.Xna.Framework.Vector2}    end                   
                 * @param   {number}                             t
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                GetPoint: function (start, firstControlPoint, secondControlPoint, end, t) {
                    t = SpineEngine.Maths.Mathf.Clamp01(t);
                    var oneMinusT = 1.0 - t;
                    return Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Multiply$2(oneMinusT * oneMinusT * oneMinusT, start.$clone()), Microsoft.Xna.Framework.Vector2.op_Multiply$2(3.0 * oneMinusT * oneMinusT * t, firstControlPoint.$clone())), Microsoft.Xna.Framework.Vector2.op_Multiply$2(3.0 * oneMinusT * t * t, secondControlPoint.$clone())), Microsoft.Xna.Framework.Vector2.op_Multiply$2(t * t * t, end.$clone()));
                },
                /**
                 * gets the first derivative for a quadratic bezier
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Bezier
                 * @memberof SpineEngine.Maths.Bezier
                 * @param   {Microsoft.Xna.Framework.Vector2}    p0    
                 * @param   {Microsoft.Xna.Framework.Vector2}    p1    
                 * @param   {Microsoft.Xna.Framework.Vector2}    p2    
                 * @param   {number}                             t
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                GetFirstDerivative$1: function (p0, p1, p2, t) {
                    return Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Multiply$2(2.0 * (1.0 - t), (Microsoft.Xna.Framework.Vector2.op_Subtraction(p1.$clone(), p0.$clone()))), Microsoft.Xna.Framework.Vector2.op_Multiply$2(2.0 * t, (Microsoft.Xna.Framework.Vector2.op_Subtraction(p2.$clone(), p1.$clone()))));
                },
                /**
                 * gets the first derivative for a cubic bezier
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Bezier
                 * @memberof SpineEngine.Maths.Bezier
                 * @param   {Microsoft.Xna.Framework.Vector2}    start                 
                 * @param   {Microsoft.Xna.Framework.Vector2}    firstControlPoint     
                 * @param   {Microsoft.Xna.Framework.Vector2}    secondControlPoint    
                 * @param   {Microsoft.Xna.Framework.Vector2}    end                   
                 * @param   {number}                             t
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                GetFirstDerivative: function (start, firstControlPoint, secondControlPoint, end, t) {
                    t = SpineEngine.Maths.Mathf.Clamp01(t);
                    var oneMinusT = 1.0 - t;
                    return Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Addition(Microsoft.Xna.Framework.Vector2.op_Multiply$2(3.0 * oneMinusT * oneMinusT, (Microsoft.Xna.Framework.Vector2.op_Subtraction(firstControlPoint.$clone(), start.$clone()))), Microsoft.Xna.Framework.Vector2.op_Multiply$2(6.0 * oneMinusT * t, (Microsoft.Xna.Framework.Vector2.op_Subtraction(secondControlPoint.$clone(), firstControlPoint.$clone())))), Microsoft.Xna.Framework.Vector2.op_Multiply$2(3.0 * t * t, (Microsoft.Xna.Framework.Vector2.op_Subtraction(end.$clone(), secondControlPoint.$clone()))));
                },
                /**
                 * recursively subdivides a bezier curve until distanceTolerance is met. Flat sections will have less points then
                     curved with this
                     algorithm.
                     This image defines the midpoints calculated and makes the variable names sensical:
                     http://www.antigrain.com/research/adaptive_bezier/bezier09.gif
                     based on http://www.antigrain.com/research/adaptive_bezier/index.html
                 *
                 * @static
                 * @private
                 * @this SpineEngine.Maths.Bezier
                 * @memberof SpineEngine.Maths.Bezier
                 * @param   {Microsoft.Xna.Framework.Vector2}      start                
                 * @param   {Microsoft.Xna.Framework.Vector2}      firstCtrlPoint       
                 * @param   {Microsoft.Xna.Framework.Vector2}      secondCtrlPoint      
                 * @param   {Microsoft.Xna.Framework.Vector2}      end                  
                 * @param   {System.Collections.Generic.List$1}    points               
                 * @param   {number}                               distanceTolerance
                 * @return  {void}
                 */
                RecursiveGetOptimizedDrawingPoints: function (start, firstCtrlPoint, secondCtrlPoint, end, points, distanceTolerance) {
                    // calculate all the mid-points of the line segments
                    var pt12 = Microsoft.Xna.Framework.Vector2.op_Division$1((Microsoft.Xna.Framework.Vector2.op_Addition(start.$clone(), firstCtrlPoint.$clone())), 2);
                    var pt23 = Microsoft.Xna.Framework.Vector2.op_Division$1((Microsoft.Xna.Framework.Vector2.op_Addition(firstCtrlPoint.$clone(), secondCtrlPoint.$clone())), 2);
                    var pt34 = Microsoft.Xna.Framework.Vector2.op_Division$1((Microsoft.Xna.Framework.Vector2.op_Addition(secondCtrlPoint.$clone(), end.$clone())), 2);

                    // calculate the mid-points of the new half lines
                    var pt123 = Microsoft.Xna.Framework.Vector2.op_Division$1((Microsoft.Xna.Framework.Vector2.op_Addition(pt12.$clone(), pt23.$clone())), 2);
                    var pt234 = Microsoft.Xna.Framework.Vector2.op_Division$1((Microsoft.Xna.Framework.Vector2.op_Addition(pt23.$clone(), pt34.$clone())), 2);

                    // finally subdivide the last two midpoints. if we met our distance tolerance this will be the final point we use.
                    var pt1234 = Microsoft.Xna.Framework.Vector2.op_Division$1((Microsoft.Xna.Framework.Vector2.op_Addition(pt123.$clone(), pt234.$clone())), 2);

                    // try to approximate the full cubic curve by a single straight line
                    var deltaLine = Microsoft.Xna.Framework.Vector2.op_Subtraction(end.$clone(), start.$clone());

                    var d2 = Math.abs((firstCtrlPoint.X - end.X) * deltaLine.Y - (firstCtrlPoint.Y - end.Y) * deltaLine.X);
                    var d3 = Math.abs((secondCtrlPoint.X - end.X) * deltaLine.Y - (secondCtrlPoint.Y - end.Y) * deltaLine.X);

                    if ((d2 + d3) * (d2 + d3) < distanceTolerance * (deltaLine.X * deltaLine.X + deltaLine.Y * deltaLine.Y)) {
                        points.add(pt1234.$clone());
                        return;
                    }

                    // Continue subdivision
                    SpineEngine.Maths.Bezier.RecursiveGetOptimizedDrawingPoints(start.$clone(), pt12.$clone(), pt123.$clone(), pt1234.$clone(), points, distanceTolerance);
                    SpineEngine.Maths.Bezier.RecursiveGetOptimizedDrawingPoints(pt1234.$clone(), pt234.$clone(), pt34.$clone(), end.$clone(), points, distanceTolerance);
                },
                /**
                 * recursively subdivides a bezier curve until distanceTolerance is met. Flat sections will have less points then
                     curved with this
                     algorithm. Returns a pooled list that should be returned to the ListPool when done.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Bezier
                 * @memberof SpineEngine.Maths.Bezier
                 * @param   {Microsoft.Xna.Framework.Vector2}      start                Start.
                 * @param   {Microsoft.Xna.Framework.Vector2}      firstCtrlPoint       First ctrl point.
                 * @param   {Microsoft.Xna.Framework.Vector2}      secondCtrlPoint      Second ctrl point.
                 * @param   {Microsoft.Xna.Framework.Vector2}      end                  End.
                 * @param   {number}                               distanceTolerance    Distance tolerance.
                 * @return  {System.Collections.Generic.List$1}
                 */
                GetOptimizedDrawingPoints: function (start, firstCtrlPoint, secondCtrlPoint, end, distanceTolerance) {
                    if (distanceTolerance === void 0) { distanceTolerance = 1.0; }
                    var points = SpineEngine.Utils.Collections.Pool$1(System.Collections.Generic.List$1(Microsoft.Xna.Framework.Vector2)).Obtain();
                    points.add(start.$clone());
                    SpineEngine.Maths.Bezier.RecursiveGetOptimizedDrawingPoints(start.$clone(), firstCtrlPoint.$clone(), secondCtrlPoint.$clone(), end.$clone(), points, distanceTolerance);
                    points.add(end.$clone());

                    return points;
                }
            }
        }
    });

    /**
     * houses a series of cubic bezier points and provides helper methods to access the bezier
     *
     * @public
     * @class SpineEngine.Maths.BezierSpline
     */
    Bridge.define("SpineEngine.Maths.BezierSpline", {
        fields: {
            points: null,
            curveCount: 0
        },
        ctors: {
            init: function () {
                this.points = new (System.Collections.Generic.List$1(Microsoft.Xna.Framework.Vector2)).ctor();
            }
        },
        methods: {
            /**
             * helper that gets the bezier point index at time t. t is modified in the process to be in the range of the curve
                 segment.
             *
             * @instance
             * @private
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {System.Single}    t    T.
             * @return  {number}                The index at time.
             */
            PointIndexAtTime: function (t) {
                var i;
                if (t.v >= 1.0) {
                    t.v = 1.0;
                    i = (this.points.Count - 4) | 0;
                } else {
                    t.v = SpineEngine.Maths.Mathf.Clamp01(t.v) * this.curveCount;
                    i = Bridge.Int.clip32(t.v);
                    t.v -= i;
                    i = Bridge.Int.mul(i, 3);
                }

                return i;
            },
            /**
             * sets a control point taking into account if this is a shared point and adjusting appropriately if it is
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {number}                             index    Index.
             * @param   {Microsoft.Xna.Framework.Vector2}    point    Point.
             * @return  {void}
             */
            SetControlPoint: function (index, point) {
                if (index % 3 === 0) {
                    var delta = Microsoft.Xna.Framework.Vector2.op_Subtraction(point.$clone(), this.points.getItem(index).$clone());
                    if (index > 0) {
                        this.points.setItem(((index - 1) | 0), Microsoft.Xna.Framework.Vector2.op_Addition(this.points.getItem(((index - 1) | 0)).$clone(), delta.$clone()));
                    }

                    if (((index + 1) | 0) < this.points.Count) {
                        this.points.setItem(((index + 1) | 0), Microsoft.Xna.Framework.Vector2.op_Addition(this.points.getItem(((index + 1) | 0)).$clone(), delta.$clone()));
                    }
                }

                this.points.setItem(index, point.$clone());
            },
            /**
             * gets the point on the bezier at time t
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {number}                             t    T.
             * @return  {Microsoft.Xna.Framework.Vector2}         The point at time.
             */
            GetPointAtTime: function (t) {
                t = {v:t};
                var i = this.PointIndexAtTime(t);
                return SpineEngine.Maths.Bezier.GetPoint(this.points.getItem(i).$clone(), this.points.getItem(((i + 1) | 0)).$clone(), this.points.getItem(((i + 2) | 0)).$clone(), this.points.getItem(((i + 3) | 0)).$clone(), t.v);
            },
            /**
             * gets the velocity (first derivative) of the bezier at time t
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {number}                             t    T.
             * @return  {Microsoft.Xna.Framework.Vector2}         The velocity at time.
             */
            GetVelocityAtTime: function (t) {
                t = {v:t};
                var i = this.PointIndexAtTime(t);
                return SpineEngine.Maths.Bezier.GetFirstDerivative(this.points.getItem(i).$clone(), this.points.getItem(((i + 1) | 0)).$clone(), this.points.getItem(((i + 2) | 0)).$clone(), this.points.getItem(((i + 3) | 0)).$clone(), t.v);
            },
            /**
             * gets the direction (normalized first derivative) of the bezier at time t
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {number}                             t    T.
             * @return  {Microsoft.Xna.Framework.Vector2}         The direction at time.
             */
            GetDirectionAtTime: function (t) {
                return Microsoft.Xna.Framework.Vector2.Normalize(this.GetVelocityAtTime(t));
            },
            /**
             * adds a curve to the bezier
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {Microsoft.Xna.Framework.Vector2}    start                 
             * @param   {Microsoft.Xna.Framework.Vector2}    firstControlPoint     
             * @param   {Microsoft.Xna.Framework.Vector2}    secondControlPoint    
             * @param   {Microsoft.Xna.Framework.Vector2}    end
             * @return  {void}
             */
            AddCurve: function (start, firstControlPoint, secondControlPoint, end) {
                // we only add the start point if this is the first curve. For all other curves the previous end should equal the start of the new curve.
                if (this.points.Count === 0) {
                    this.points.add(start.$clone());
                }

                this.points.add(firstControlPoint.$clone());
                this.points.add(secondControlPoint.$clone());
                this.points.add(end.$clone());

                this.curveCount = (Bridge.Int.div((((this.points.Count - 1) | 0)), 3)) | 0;
            },
            /**
             * resets the bezier removing all points
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @return  {void}
             */
            Reset: function () {
                this.points.clear();
            },
            /**
             * breaks up the spline into totalSegments parts and returns all the points required to draw using lines
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.BezierSpline
             * @memberof SpineEngine.Maths.BezierSpline
             * @param   {number}                                     totalSegments    Total segments.
             * @return  {Array.<Microsoft.Xna.Framework.Vector2>}                     The drawing points.
             */
            GetDrawingPoints: function (totalSegments) {
                var result = System.Array.init(totalSegments, function (){
                    return new Microsoft.Xna.Framework.Vector2();
                }, Microsoft.Xna.Framework.Vector2);
                for (var i = 0; i < totalSegments; i = (i + 1) | 0) {
                    var t = i / totalSegments;
                    result[System.Array.index(i, result)] = this.GetPointAtTime(t);
                }

                return result;
            }
        }
    });

    /** @namespace SpineEngine.Maths.Easing */

    /**
     * helper with a single method that takes in an EaseType and applies that ease equation with the given
         duration and time parameters. We do this to avoid passing around Functions which create bogs of trash for
         the garbage collector (function pointers please!)
     *
     * @static
     * @abstract
     * @public
     * @class SpineEngine.Maths.Easing.EaseHelper
     */
    Bridge.define("SpineEngine.Maths.Easing.EaseHelper", {
        statics: {
            methods: {
                /**
                 * returns the opposite EaseType of easeType
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Easing.EaseHelper
                 * @memberof SpineEngine.Maths.Easing.EaseHelper
                 * @param   {SpineEngine.Maths.Easing.EaseType}    easeType    Ease type.
                 * @return  {SpineEngine.Maths.Easing.EaseType}                The ease type.
                 */
                OppositeEaseType: function (easeType) {
                    switch (easeType) {
                        case SpineEngine.Maths.Easing.EaseType.Linear: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.BackIn: 
                            return SpineEngine.Maths.Easing.EaseType.BackOut;
                        case SpineEngine.Maths.Easing.EaseType.BackOut: 
                            return SpineEngine.Maths.Easing.EaseType.BackIn;
                        case SpineEngine.Maths.Easing.EaseType.BackInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.BounceIn: 
                            return SpineEngine.Maths.Easing.EaseType.BounceOut;
                        case SpineEngine.Maths.Easing.EaseType.BounceOut: 
                            return SpineEngine.Maths.Easing.EaseType.BounceIn;
                        case SpineEngine.Maths.Easing.EaseType.BounceInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.CircIn: 
                            return SpineEngine.Maths.Easing.EaseType.CircOut;
                        case SpineEngine.Maths.Easing.EaseType.CircOut: 
                            return SpineEngine.Maths.Easing.EaseType.CircIn;
                        case SpineEngine.Maths.Easing.EaseType.CircInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.CubicIn: 
                            return SpineEngine.Maths.Easing.EaseType.CubicOut;
                        case SpineEngine.Maths.Easing.EaseType.CubicOut: 
                            return SpineEngine.Maths.Easing.EaseType.CubicIn;
                        case SpineEngine.Maths.Easing.EaseType.CubicInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.ElasticIn: 
                            return SpineEngine.Maths.Easing.EaseType.ElasticOut;
                        case SpineEngine.Maths.Easing.EaseType.ElasticOut: 
                            return SpineEngine.Maths.Easing.EaseType.ElasticIn;
                        case SpineEngine.Maths.Easing.EaseType.ElasticInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.Punch: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.ExpoIn: 
                            return SpineEngine.Maths.Easing.EaseType.ExpoOut;
                        case SpineEngine.Maths.Easing.EaseType.ExpoOut: 
                            return SpineEngine.Maths.Easing.EaseType.ExpoIn;
                        case SpineEngine.Maths.Easing.EaseType.ExpoInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.QuadIn: 
                            return SpineEngine.Maths.Easing.EaseType.QuadOut;
                        case SpineEngine.Maths.Easing.EaseType.QuadOut: 
                            return SpineEngine.Maths.Easing.EaseType.QuadIn;
                        case SpineEngine.Maths.Easing.EaseType.QuadInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.QuartIn: 
                            return SpineEngine.Maths.Easing.EaseType.QuartOut;
                        case SpineEngine.Maths.Easing.EaseType.QuartOut: 
                            return SpineEngine.Maths.Easing.EaseType.QuartIn;
                        case SpineEngine.Maths.Easing.EaseType.QuartInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.QuintIn: 
                            return SpineEngine.Maths.Easing.EaseType.QuintOut;
                        case SpineEngine.Maths.Easing.EaseType.QuintOut: 
                            return SpineEngine.Maths.Easing.EaseType.QuintIn;
                        case SpineEngine.Maths.Easing.EaseType.QuintInOut: 
                            return easeType;
                        case SpineEngine.Maths.Easing.EaseType.SineIn: 
                            return SpineEngine.Maths.Easing.EaseType.SineOut;
                        case SpineEngine.Maths.Easing.EaseType.SineOut: 
                            return SpineEngine.Maths.Easing.EaseType.SineIn;
                        case SpineEngine.Maths.Easing.EaseType.SineInOut: 
                            return easeType;
                        default: 
                            return easeType;
                    }
                },
                Ease: function (easeType, t, duration) {
                    switch (easeType) {
                        case SpineEngine.Maths.Easing.EaseType.Linear: 
                            return SpineEngine.Maths.Easing.Easing.Linear.EaseNone(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.BackIn: 
                            return SpineEngine.Maths.Easing.Easing.Back.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.BackOut: 
                            return SpineEngine.Maths.Easing.Easing.Back.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.BackInOut: 
                            return SpineEngine.Maths.Easing.Easing.Back.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.BounceIn: 
                            return SpineEngine.Maths.Easing.Easing.Bounce.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.BounceOut: 
                            return SpineEngine.Maths.Easing.Easing.Bounce.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.BounceInOut: 
                            return SpineEngine.Maths.Easing.Easing.Bounce.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.CircIn: 
                            return SpineEngine.Maths.Easing.Easing.Circular.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.CircOut: 
                            return SpineEngine.Maths.Easing.Easing.Circular.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.CircInOut: 
                            return SpineEngine.Maths.Easing.Easing.Circular.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.CubicIn: 
                            return SpineEngine.Maths.Easing.Easing.Cubic.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.CubicOut: 
                            return SpineEngine.Maths.Easing.Easing.Cubic.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.CubicInOut: 
                            return SpineEngine.Maths.Easing.Easing.Cubic.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.ElasticIn: 
                            return SpineEngine.Maths.Easing.Easing.Elastic.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.ElasticOut: 
                            return SpineEngine.Maths.Easing.Easing.Elastic.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.ElasticInOut: 
                            return SpineEngine.Maths.Easing.Easing.Elastic.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.Punch: 
                            return SpineEngine.Maths.Easing.Easing.Elastic.Punch(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.ExpoIn: 
                            return SpineEngine.Maths.Easing.Easing.Exponential.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.ExpoOut: 
                            return SpineEngine.Maths.Easing.Easing.Exponential.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.ExpoInOut: 
                            return SpineEngine.Maths.Easing.Easing.Exponential.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuadIn: 
                            return SpineEngine.Maths.Easing.Easing.Quadratic.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuadOut: 
                            return SpineEngine.Maths.Easing.Easing.Quadratic.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuadInOut: 
                            return SpineEngine.Maths.Easing.Easing.Quadratic.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuartIn: 
                            return SpineEngine.Maths.Easing.Easing.Quartic.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuartOut: 
                            return SpineEngine.Maths.Easing.Easing.Quartic.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuartInOut: 
                            return SpineEngine.Maths.Easing.Easing.Quartic.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuintIn: 
                            return SpineEngine.Maths.Easing.Easing.Quintic.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuintOut: 
                            return SpineEngine.Maths.Easing.Easing.Quintic.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.QuintInOut: 
                            return SpineEngine.Maths.Easing.Easing.Quintic.EaseInOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.SineIn: 
                            return SpineEngine.Maths.Easing.Easing.Sinusoidal.EaseIn(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.SineOut: 
                            return SpineEngine.Maths.Easing.Easing.Sinusoidal.EaseOut(t, duration);
                        case SpineEngine.Maths.Easing.EaseType.SineInOut: 
                            return SpineEngine.Maths.Easing.Easing.Sinusoidal.EaseInOut(t, duration);
                        default: 
                            return SpineEngine.Maths.Easing.Easing.Linear.EaseNone(t, duration);
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.EaseType", {
        $kind: "enum",
        statics: {
            fields: {
                Linear: 0,
                SineIn: 1,
                SineOut: 2,
                SineInOut: 3,
                QuadIn: 4,
                QuadOut: 5,
                QuadInOut: 6,
                CubicIn: 7,
                CubicOut: 8,
                CubicInOut: 9,
                QuartIn: 10,
                QuartOut: 11,
                QuartInOut: 12,
                QuintIn: 13,
                QuintOut: 14,
                QuintInOut: 15,
                ExpoIn: 16,
                ExpoOut: 17,
                ExpoInOut: 18,
                CircIn: 19,
                CircOut: 20,
                CircInOut: 21,
                ElasticIn: 22,
                ElasticOut: 23,
                ElasticInOut: 24,
                Punch: 25,
                BackIn: 26,
                BackOut: 27,
                BackInOut: 28,
                BounceIn: 29,
                BounceOut: 30,
                BounceInOut: 31
            }
        }
    });

    /**
     * standard easing equations simplified by replacing the b and c params (begin and change values) with 0 and
         1 then reducing. This is done so that we can get back a raw value between 0 - 1 (except elastic/bounce which
         purposely go over the bounds) and then use that value to lerp anything.
     *
     * @static
     * @abstract
     * @public
     * @class SpineEngine.Maths.Easing.Easing
     */
    Bridge.define("SpineEngine.Maths.Easing.Easing");

    Bridge.define("SpineEngine.Maths.Easing.Easing.Back", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return ((t = t / d)) * t * ((2.70158) * t - 1.70158);
                },
                EaseOut: function (t, d) {
                    return ((t = t / d - 1)) * t * ((2.70158) * t + 1.70158) + 1;
                },
                EaseInOut: function (t, d) {
                    var s = 1.70158;
                    if (((t = t / (d / 2))) < 1) {
                        return 0.5 * (t * t * ((((s = s * 1.525)) + 1) * t - s));
                    }

                    return 0.5 * (((t = t - 2)) * t * ((((s = s * 1.525)) + 1) * t + s) + 2);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Bounce", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseOut: function (t, d) {
                    if (((t = t / d)) < 0.36363636363636365) {
                        return 7.5625 * t * t;
                    }

                    if (t < 0.72727272727272729) {
                        return 7.5625 * ((t = t - (0.545454562))) * t + 0.75;
                    }

                    if (t < 0.90909090909090906) {
                        return 7.5625 * ((t = t - (0.8181818))) * t + 0.9375;
                    }

                    return 7.5625 * ((t = t - (0.954545438))) * t + 0.984375;
                },
                EaseIn: function (t, d) {
                    return 1 - SpineEngine.Maths.Easing.Easing.Bounce.EaseOut(d - t, d);
                },
                EaseInOut: function (t, d) {
                    if (t < d / 2) {
                        return SpineEngine.Maths.Easing.Easing.Bounce.EaseIn(t * 2, d) * 0.5;
                    }
                    return SpineEngine.Maths.Easing.Easing.Bounce.EaseOut(t * 2 - d, d) * 0.5 + 0.5;
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Circular", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return -(SpineEngine.Maths.Mathf.Sqrt(1 - ((t = t / d)) * t) - 1);
                },
                EaseOut: function (t, d) {
                    return SpineEngine.Maths.Mathf.Sqrt(1 - ((t = t / d - 1)) * t);
                },
                EaseInOut: function (t, d) {
                    if (((t = t / (d / 2))) < 1) {
                        return -0.5 * (SpineEngine.Maths.Mathf.Sqrt(1 - t * t) - 1);
                    }

                    return 0.5 * (SpineEngine.Maths.Mathf.Sqrt(1 - ((t = t - 2)) * t) + 1);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Cubic", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return ((t = t / d)) * t * t;
                },
                EaseOut: function (t, d) {
                    return ((t = t / d - 1)) * t * t + 1;
                },
                EaseInOut: function (t, d) {
                    if (((t = t / (d / 2))) < 1) {
                        return 0.5 * t * t * t;
                    }

                    return 0.5 * (((t = t - 2)) * t * t + 2);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Elastic", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    if (t === 0) {
                        return 0;
                    }

                    if (((t = t / d)) === 1) {
                        return 1;
                    }

                    var p = d * 0.3;
                    var s = p / 4;
                    return -(1 * SpineEngine.Maths.Mathf.Pow(2, 10 * ((t = t - 1))) * SpineEngine.Maths.Mathf.Sin((t * d - s) * (6.28318548) / p));
                },
                EaseOut: function (t, d) {
                    if (t === 0) {
                        return 0;
                    }

                    if (((t = t / d)) === 1) {
                        return 1;
                    }

                    var p = d * 0.3;
                    var s = p / 4;
                    return 1 * SpineEngine.Maths.Mathf.Pow(2, -10 * t) * SpineEngine.Maths.Mathf.Sin((t * d - s) * (6.28318548) / p) + 1;
                },
                EaseInOut: function (t, d) {
                    if (t === 0) {
                        return 0;
                    }

                    if (((t = t / (d / 2))) === 2) {
                        return 1;
                    }

                    var p = d * (0.450000018);
                    var s = p / 4;

                    if (t < 1) {
                        return -0.5 * (SpineEngine.Maths.Mathf.Pow(2, 10 * ((t = t - 1))) * SpineEngine.Maths.Mathf.Sin((t * d - s) * (6.28318548) / p));
                    }

                    return SpineEngine.Maths.Mathf.Pow(2.0, -10.0 * ((t = t - 1.0))) * SpineEngine.Maths.Mathf.Sin((t * d - s) * (6.28318548) / p) * 0.5 + 1.0;
                },
                Punch: function (t, d) {
                    if (t === 0) {
                        return 0;
                    }

                    if (((t = t / d)) === 1) {
                        return 0;
                    }

                    var P = 0.3;
                    return SpineEngine.Maths.Mathf.Pow(2, -10 * t) * SpineEngine.Maths.Mathf.Sin(t * (6.28318548) / P);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Exponential", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return t === 0 ? 0 : SpineEngine.Maths.Mathf.Pow(2, 10 * (t / d - 1));
                },
                EaseOut: function (t, d) {
                    return t === d ? 1 : -SpineEngine.Maths.Mathf.Pow(2, -10 * t / d) + 1;
                },
                EaseInOut: function (t, d) {
                    if (t === 0) {
                        return 0;
                    }

                    if (t === d) {
                        return 1;
                    }

                    if (((t = t / (d / 2))) < 1) {
                        return 0.5 * SpineEngine.Maths.Mathf.Pow(2, 10 * (t - 1));
                    }

                    return 0.5 * (-SpineEngine.Maths.Mathf.Pow(2, -10 * --t) + 2);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Linear", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseNone: function (t, d) {
                    return t / d;
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Quadratic", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return ((t = t / d)) * t;
                },
                EaseOut: function (t, d) {
                    return -1 * ((t = t / d)) * (t - 2);
                },
                EaseInOut: function (t, d) {
                    if (((t = t / (d / 2))) < 1) {
                        return 0.5 * t * t;
                    }

                    return -0.5 * (--t * (t - 2) - 1);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Quartic", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return ((t = t / d)) * t * t * t;
                },
                EaseOut: function (t, d) {
                    return -1 * (((t = t / d - 1)) * t * t * t - 1);
                },
                EaseInOut: function (t, d) {
                    t /= d / 2;
                    if (t < 1) {
                        return 0.5 * t * t * t * t;
                    }

                    t -= 2;
                    return -0.5 * (t * t * t * t - 2);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Quintic", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return ((t = t / d)) * t * t * t * t;
                },
                EaseOut: function (t, d) {
                    return ((t = t / d - 1)) * t * t * t * t + 1;
                },
                EaseInOut: function (t, d) {
                    if (((t = t / (d / 2))) < 1) {
                        return 0.5 * t * t * t * t * t;
                    }

                    return 0.5 * (((t = t - 2)) * t * t * t * t + 2);
                }
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Easing.Easing.Sinusoidal", {
        $kind: "nested class",
        statics: {
            methods: {
                EaseIn: function (t, d) {
                    return -1 * SpineEngine.Maths.Mathf.Cos(t / d * (1.57079637)) + 1.0;
                },
                EaseOut: function (t, d) {
                    return SpineEngine.Maths.Mathf.Sin(t / d * (1.57079637));
                },
                EaseInOut: function (t, d) {
                    return -0.5 * (SpineEngine.Maths.Mathf.Cos(Microsoft.Xna.Framework.MathHelper.Pi * t / d) - 1);
                }
            }
        }
    });

    /**
     * series of static methods to handle all common tween type structs along with un-clamped lerps for them.
         un-clamped lerps are required for bounce, elastic or other tweens that exceed the 0 - 1 range.
     *
     * @static
     * @abstract
     * @public
     * @class SpineEngine.Maths.Easing.Lerps
     */
    Bridge.define("SpineEngine.Maths.Easing.Lerps", {
        statics: {
            methods: {
                Lerp$7: function (from, to, t) {
                    return from + (to - from) * t;
                },
                Lerp$4: function (from, to, t) {
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(from.X + (to.X - from.X) * t, from.Y + (to.Y - from.Y) * t);
                },
                Lerp$5: function (from, to, t) {
                    return new Microsoft.Xna.Framework.Vector3.$ctor3(from.X + (to.X - from.X) * t, from.Y + (to.Y - from.Y) * t, from.Z + (to.Z - from.Z) * t);
                },
                Lerp$6: function (from, to, t) {
                    return new Microsoft.Xna.Framework.Vector4.$ctor4(from.X + (to.X - from.X) * t, from.Y + (to.Y - from.Y) * t, from.Z + (to.Z - from.Z) * t, from.W + (to.W - from.W) * t);
                },
                Lerp: function (from, to, t) {
                    var t255 = Bridge.Int.clip32(t * 255);
                    return new Microsoft.Xna.Framework.Color.$ctor7(((from.R + ((Bridge.Int.div(Bridge.Int.mul((((to.R - from.R) | 0)), t255), 255)) | 0)) | 0), ((from.G + ((Bridge.Int.div(Bridge.Int.mul((((to.G - from.G) | 0)), t255), 255)) | 0)) | 0), ((from.B + ((Bridge.Int.div(Bridge.Int.mul((((to.B - from.B) | 0)), t255), 255)) | 0)) | 0), ((from.A + ((Bridge.Int.div(Bridge.Int.mul((((to.A - from.A) | 0)), t255), 255)) | 0)) | 0));
                },
                Lerp$1: function (from, to, t) {
                    var t255 = Bridge.Int.clip32(t * 255);
                    return new Microsoft.Xna.Framework.Color.$ctor7(((from.v.R + ((Bridge.Int.div(Bridge.Int.mul((((to.v.R - from.v.R) | 0)), t255), 255)) | 0)) | 0), ((from.v.G + ((Bridge.Int.div(Bridge.Int.mul((((to.v.G - from.v.G) | 0)), t255), 255)) | 0)) | 0), ((from.v.B + ((Bridge.Int.div(Bridge.Int.mul((((to.v.B - from.v.B) | 0)), t255), 255)) | 0)) | 0), ((from.v.A + ((Bridge.Int.div(Bridge.Int.mul((((to.v.A - from.v.A) | 0)), t255), 255)) | 0)) | 0));
                },
                Lerp$2: function (from, to, t) {
                    return new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.clip32(from.X + (((to.X - from.X) | 0)) * t), Bridge.Int.clip32(from.Y + (((to.Y - from.Y) | 0)) * t), Bridge.Int.clip32(from.Width + (((to.Width - from.Width) | 0)) * t), Bridge.Int.clip32(from.Height + (((to.Height - from.Height) | 0)) * t));
                },
                Lerp$3: function (from, to, t) {
                    return new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.clip32(from.v.X + (((to.v.X - from.v.X) | 0)) * t), Bridge.Int.clip32(from.v.Y + (((to.v.Y - from.v.Y) | 0)) * t), Bridge.Int.clip32(from.v.Width + (((to.v.Width - from.v.Width) | 0)) * t), Bridge.Int.clip32(from.v.Height + (((to.v.Height - from.v.Height) | 0)) * t));
                },
                /**
                 * remainingFactorPerSecond is the percentage of the distance it covers every second. should be between 0 and 1.
                     if it's 0.25 it means it covers 75% of the remaining distance every second independent of the framerate
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Easing.Lerps
                 * @memberof SpineEngine.Maths.Easing.Lerps
                 * @param   {number}    from                        From.
                 * @param   {number}    to                          To.
                 * @param   {number}    remainingFactorPerSecond    Remaining factor per second.
                 * @param   {number}    deltaTime                   Delta time.
                 * @return  {number}                                The towards.
                 */
                LerpTowards$3: function (from, to, remainingFactorPerSecond, deltaTime) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$7(from, to, 1.0 - SpineEngine.Maths.Mathf.Pow(remainingFactorPerSecond, deltaTime));
                },
                LerpTowards: function (from, to, remainingFactorPerSecond, deltaTime) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$4(from.$clone(), to.$clone(), 1.0 - SpineEngine.Maths.Mathf.Pow(remainingFactorPerSecond, deltaTime));
                },
                LerpTowards$2: function (from, to, remainingFactorPerSecond, deltaTime) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$5(from.$clone(), to.$clone(), 1.0 - SpineEngine.Maths.Mathf.Pow(remainingFactorPerSecond, deltaTime));
                },
                LerpTowards$1: function (followerCurrentPosition, targetPreviousPosition, targetCurrentPosition, smoothFactor, deltaTime) {
                    var targetDiff = Microsoft.Xna.Framework.Vector3.op_Subtraction(targetCurrentPosition.$clone(), targetPreviousPosition.$clone());
                    var temp = Microsoft.Xna.Framework.Vector3.op_Addition(Microsoft.Xna.Framework.Vector3.op_Subtraction(followerCurrentPosition.$clone(), targetPreviousPosition.$clone()), Microsoft.Xna.Framework.Vector3.op_Division$1(targetDiff.$clone(), (smoothFactor * deltaTime)));
                    return Microsoft.Xna.Framework.Vector3.op_Addition(Microsoft.Xna.Framework.Vector3.op_Subtraction(targetCurrentPosition.$clone(), Microsoft.Xna.Framework.Vector3.op_Division$1(targetDiff.$clone(), (smoothFactor * deltaTime))), Microsoft.Xna.Framework.Vector3.op_Multiply$1(temp.$clone(), SpineEngine.Maths.Mathf.Exp(-smoothFactor * deltaTime)));
                },
                AngleLerp: function (from, to, t) {
                    // we calculate the shortest difference between the angles for this lerp
                    var toMinusFrom = new Microsoft.Xna.Framework.Vector2.$ctor2(SpineEngine.Maths.Mathf.DeltaAngle(from.X, to.X), SpineEngine.Maths.Mathf.DeltaAngle(from.Y, to.Y));
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(from.X + toMinusFrom.X * t, from.Y + toMinusFrom.Y * t);
                },
                Ease$8: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$7(from, to, SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$5: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$4(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$6: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$5(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$7: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$6(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$2: function (easeType, from, to, t, duration) {
                    return Microsoft.Xna.Framework.Quaternion.Lerp(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$1: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$1(from, to, SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$3: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$2(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                Ease$4: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.Lerp$3(from, to, SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                },
                EaseAngle: function (easeType, from, to, t, duration) {
                    return SpineEngine.Maths.Easing.Lerps.AngleLerp(from.$clone(), to.$clone(), SpineEngine.Maths.Easing.EaseHelper.Ease(easeType, t, duration));
                }
            }
        }
    });

    /**
     * utility class to assist with dealing with bitmasks. All methods except isFlagSet expect the flag parameter to be a
         non-shifted flag.
         This lets you use plain old ints (0, 1, 2, 3, etc) to set/unset your flags.
     *
     * @static
     * @abstract
     * @public
     * @class SpineEngine.Maths.Flags
     */
    Bridge.define("SpineEngine.Maths.Flags", {
        statics: {
            methods: {
                /**
                 * checks to see if the bit flag is set in the int. This check expects flag to be shifted already!
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {number}     self    Self.
                 * @param   {number}     flag    Flag.
                 * @return  {boolean}            <pre><code>true</code></pre>, if flag set was ised, <pre><code>false</code></pre> otherwise.
                 */
                IsFlagSet: function (self, flag) {
                    return (self & flag) !== 0;
                },
                /**
                 * checks to see if the bit flag is set in the int
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {number}     self    Self.
                 * @param   {number}     flag    Flag.
                 * @return  {boolean}            <pre><code>true</code></pre>, if flag set was ised, <pre><code>false</code></pre> otherwise.
                 */
                IsUnshiftedFlagSet: function (self, flag) {
                    flag = 1 << flag;
                    return (self & flag) !== 0;
                },
                /**
                 * sets the flag bit of the int removing any already set flags
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {System.Int32}    self    Self.
                 * @param   {number}          flag    Flag.
                 * @return  {void}
                 */
                SetFlagExclusive: function (self, flag) {
                    self.v = 1 << flag;
                },
                /**
                 * sets the flag bit of the int
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {System.Int32}    self    Self.
                 * @param   {number}          flag    Flag.
                 * @return  {void}
                 */
                SetFlag: function (self, flag) {
                    self.v = self.v | 1 << flag;
                },
                /**
                 * unsets the flag bit of the int
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {System.Int32}    self    Self.
                 * @param   {number}          flag    Flag.
                 * @return  {void}
                 */
                UnsetFlag: function (self, flag) {
                    flag = 1 << flag;
                    self.v = self.v & ~flag;
                },
                /**
                 * inverts the set bits of the int
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {System.Int32}    self    Self.
                 * @return  {void}
                 */
                InvertFlags: function (self) {
                    self.v = ~self.v;
                },
                /**
                 * prints the binary representation of the int. Handy for debugging int flag overlaps visually.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Flags
                 * @memberof SpineEngine.Maths.Flags
                 * @param   {number}    self            Self.
                 * @param   {number}    leftPadWidth    Left pad width.
                 * @return  {string}                    The string representation.
                 */
                BinaryStringRepresentation: function (self, leftPadWidth) {
                    if (leftPadWidth === void 0) { leftPadWidth = 10; }
                    return System.String.alignString(System.Convert.toStringInBase(self, 2, 9), leftPadWidth, 48);
                }
            }
        }
    });

    /**
     * simple helper class that manages a float value. It stores the value until the total accumulated is greater than 1.
         Once it exceeds
         1 the value will be added on to amount when update is called.
         General usage would be something like the following.
         - calculate your objects velocity however you normally would
         - multiply by deltaTime to keep it framerate independent
         - pass the calculated delta movement for this frame to the IncrementalFloats.update method for both x and y. This
         will result in deltaMove
         being rounded to an int and the IncrementalFloats will deal with accumulating the excess value.
         var deltaMove = velocity * Time.deltaTime;
         _x.update( ref deltaMove.X );
         _y.update( ref deltaMove.Y );
     *
     * @public
     * @class SpineEngine.Maths.IncrementalFloats
     */
    Bridge.define("SpineEngine.Maths.IncrementalFloats", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new SpineEngine.Maths.IncrementalFloats(); }
            }
        },
        fields: {
            Remainder: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            /**
             * increments remainder by amount, truncates the value to an int, stores off the new remainder and sets amount to the
                 current value.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.IncrementalFloats
             * @memberof SpineEngine.Maths.IncrementalFloats
             * @param   {number}    amount    Amount.
             * @return  {number}
             */
            Update: function (amount) {
                this.Remainder += amount;
                var motion = SpineEngine.Maths.Mathf.TruncateToInt(this.Remainder);
                this.Remainder -= motion;
                return motion;
            },
            /**
             * resets the remainder to 0. Useful when an object collides with an immovable object. In that case you will want to
                 zero out the
                 subpixel remainder since it is null and void due to the collision.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.IncrementalFloats
             * @memberof SpineEngine.Maths.IncrementalFloats
             * @return  {void}
             */
            Reset: function () {
                this.Remainder = 0;
            },
            getHashCode: function () {
                var h = Bridge.addHash([6905310465, this.Remainder]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, SpineEngine.Maths.IncrementalFloats)) {
                    return false;
                }
                return Bridge.equals(this.Remainder, o.Remainder);
            },
            $clone: function (to) {
                var s = to || new SpineEngine.Maths.IncrementalFloats();
                s.Remainder = this.Remainder;
                return s;
            }
        }
    });

    Bridge.define("SpineEngine.Maths.Mathf", {
        statics: {
            fields: {
                Epsilon: 0,
                Deg2Rad: 0,
                Rad2Deg: 0
            },
            ctors: {
                init: function () {
                    this.Epsilon = 1E-05;
                    this.Deg2Rad = 0.0174532924;
                    this.Rad2Deg = 57.29578;
                }
            },
            methods: {
                Round: function (f) {
                    return Bridge.Math.round(f, 0, 6);
                },
                Ceil: function (f) {
                    return Math.ceil(f);
                },
                CeilToInt: function (f) {
                    return Bridge.Int.clip32(Math.ceil(f));
                },
                /**
                 * ceils the float to the nearest int value above y. note that this only works for values in the range of short
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    y    F.
                 * @return  {number}         The ceil to int.
                 */
                FastCeilToInt: function (y) {
                    return ((32768 - Bridge.Int.clip32((32768.0 - y))) | 0);
                },
                Floor: function (f) {
                    return Math.floor(f);
                },
                FloorToInt: function (f) {
                    return Bridge.Int.clip32(Math.floor(f));
                },
                /**
                 * floors the float to the nearest int value below x. note that this only works for values in the range of short
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    x    The x coordinate.
                 * @return  {number}         The floor to int.
                 */
                FastFloorToInt: function (x) {
                    // we shift to guaranteed positive before casting then shift back after
                    return ((Bridge.Int.clip32((x + 32768.0)) - 32768) | 0);
                },
                RoundToInt: function (f) {
                    return Bridge.Int.clip32(Bridge.Math.round(f, 0, 6));
                },
                /**
                 * Calculates the integral part of a number cast to an int
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    f    F.
                 * @return  {number}         The to int.
                 */
                TruncateToInt: function (f) {
                    return Bridge.Int.clip32(Bridge.Int.trunc(f));
                },
                /**
                 * clamps value between 0 and 1
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value    Value.
                 * @return  {number}
                 */
                Clamp01: function (value) {
                    if (value < 0.0) {
                        return 0.0;
                    }

                    if (value > 1.0) {
                        return 1.0;
                    }

                    return value;
                },
                Clamp$1: function (value, min, max) {
                    if (value < min) {
                        return min;
                    }

                    if (value > max) {
                        return max;
                    }

                    return value;
                },
                /**
                 * Restricts a value to be within a specified range.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value    The value to clamp.
                 * @param   {number}    min      The minimum value. If <pre><code>value</code></pre> is less than <pre><code>min</code></pre>, <pre><code>min</code></pre> will be returned.
                 * @param   {number}    max      The maximum value. If <pre><code>value</code></pre> is greater than <pre><code>max</code></pre>, <pre><code>max</code></pre> will be returned.
                 * @return  {number}             The clamped value.
                 */
                Clamp: function (value, min, max) {
                    value = value > max ? max : value;
                    value = value < min ? min : value;

                    return value;
                },
                Snap: function (value, increment) {
                    return SpineEngine.Maths.Mathf.Round(value / increment) * increment;
                },
                Snap$1: function (value, increment, offset) {
                    return SpineEngine.Maths.Mathf.Round((value - offset) / increment) * increment + offset;
                },
                InverseLerp: function (from, to, t) {
                    if (from < to) {
                        if (t < from) {
                            return 0.0;
                        }
                        if (t > to) {
                            return 1.0;
                        }
                    } else {
                        if (t < to) {
                            return 1.0;
                        }
                        if (t > from) {
                            return 0.0;
                        }
                    }

                    return (t - from) / (to - from);
                },
                /**
                 * lerps an angle in degrees between a and b. handles wrapping around 360
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    The alpha component.
                 * @param   {number}    b    The blue component.
                 * @param   {number}    t    T.
                 * @return  {number}         The angle.
                 */
                LerpAngle: function (a, b, t) {
                    var num = SpineEngine.Maths.Mathf.Repeat(b - a, 360.0);
                    if (num > 180.0) {
                        num -= 360.0;
                    }

                    return a + num * SpineEngine.Maths.Mathf.Clamp01(t);
                },
                /**
                 * loops t so that it is never larger than length and never smaller than 0
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    t         T.
                 * @param   {number}    length    Length.
                 * @return  {number}
                 */
                Repeat: function (t, length) {
                    return t - SpineEngine.Maths.Mathf.Floor(t / length) * length;
                },
                /**
                 * increments t and ensures it is always greater than or equal to 0 and less than length
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    t         T.
                 * @param   {number}    length    Length.
                 * @return  {number}
                 */
                IncrementWithWrap: function (t, length) {
                    t = (t + 1) | 0;
                    if (t === length) {
                        return 0;
                    }
                    return t;
                },
                /**
                 * decrements t and ensures it is always greater than or equal to 0 and less than length
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    t         T.
                 * @param   {number}    length    Length.
                 * @return  {number}              The with wrap.
                 */
                DecrementWithWrap: function (t, length) {
                    t = (t - 1) | 0;
                    if (t < 0) {
                        return ((length - 1) | 0);
                    }
                    return t;
                },
                /**
                 * ping-pongs t so that it is never larger than length and never smaller than 0
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    t         T.
                 * @param   {number}    length    Length.
                 * @return  {number}              The pong.
                 */
                PingPong: function (t, length) {
                    t = SpineEngine.Maths.Mathf.Repeat(t, length * 2.0);
                    return length - Math.abs(t - length);
                },
                /**
                 * if value &gt;= threshold returns its sign else returns 0
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value        Value.
                 * @param   {number}    threshold    Threshold.
                 * @return  {number}                 The threshold.
                 */
                SignThreshold: function (value, threshold) {
                    if (Math.abs(value) >= threshold) {
                        return Bridge.Int.sign(value);
                    }
                    return 0;
                },
                /**
                 * Calculates the shortest difference between two given angles in degrees
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    current    Current.
                 * @param   {number}    target     Target.
                 * @return  {number}               The angle.
                 */
                DeltaAngle: function (current, target) {
                    var num = SpineEngine.Maths.Mathf.Repeat(target - current, 360.0);
                    if (num > 180.0) {
                        num -= 360.0;
                    }

                    return num;
                },
                /**
                 * Calculates the shortest difference between two given angles given in radians
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    current    Current.
                 * @param   {number}    target     Target.
                 * @return  {number}               The angle.
                 */
                DeltaAngleRadians: function (current, target) {
                    var num = SpineEngine.Maths.Mathf.Repeat(target - current, 6.28318548);
                    if (num > Microsoft.Xna.Framework.MathHelper.Pi) {
                        num -= 6.28318548;
                    }

                    return num;
                },
                /**
                 * moves start towards end by shift amount clamping the result. start can be less than or greater than end.
                     example: start is 2, end is 10, shift is 4 results in 6
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    start    Start.
                 * @param   {number}    end      End.
                 * @param   {number}    shift    Shift.
                 * @return  {number}
                 */
                Approach: function (start, end, shift) {
                    if (start < end) {
                        return Math.min(start + shift, end);
                    }
                    return Math.max(start - shift, end);
                },
                /**
                 * moves start angle towards end angle by shift amount clamping the result and choosing the shortest path. start can
                     be less than or greater than end.
                     example 1: start is 30, end is 100, shift is 25 results in 55
                     example 2: start is 340, end is 30, shift is 25 results in 5 (365 is wrapped to 5)
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    start    Start.
                 * @param   {number}    end      End.
                 * @param   {number}    shift    Shift.
                 * @return  {number}
                 */
                ApproachAngle: function (start, end, shift) {
                    var deltaAngle = SpineEngine.Maths.Mathf.DeltaAngle(start, end);
                    if (-shift < deltaAngle && deltaAngle < shift) {
                        return end;
                    }
                    return SpineEngine.Maths.Mathf.Repeat(SpineEngine.Maths.Mathf.Approach(start, start + deltaAngle, shift), 360.0);
                },
                /**
                 * moves start angle towards end angle by shift amount (all in radians) clamping the result and choosing the shortest
                     path. start can be less than or greater than end.
                     this method works very similar to approachAngle, the only difference is use of radians instead of degrees and
                     wrapping at 2*Pi instead of 360.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    start    Start.
                 * @param   {number}    end      End.
                 * @param   {number}    shift    Shift.
                 * @return  {number}
                 */
                ApproachAngleRadians: function (start, end, shift) {
                    var deltaAngleRadians = SpineEngine.Maths.Mathf.DeltaAngleRadians(start, end);
                    if (-shift < deltaAngleRadians && deltaAngleRadians < shift) {
                        return end;
                    }
                    return SpineEngine.Maths.Mathf.Repeat(SpineEngine.Maths.Mathf.Approach(start, start + deltaAngleRadians, shift), Microsoft.Xna.Framework.MathHelper.TwoPi);
                },
                /**
                 * checks to see if two values are approximately the same using an acceptable tolerance for the check
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}     value1       Value1.
                 * @param   {number}     value2       Value2.
                 * @param   {number}     tolerance    Tolerance.
                 * @return  {boolean}
                 */
                Approximately: function (value1, value2, tolerance) {
                    if (tolerance === void 0) { tolerance = 1E-05; }
                    return Math.abs(value1 - value2) <= tolerance;
                },
                /**
                 * returns the minimum of the passed in values
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    
                 * @param   {number}    b    
                 * @param   {number}    c
                 * @return  {number}
                 */
                MinOf: function (a, b, c) {
                    return Math.min(a, Math.min(b, c));
                },
                /**
                 * returns the minimum of the passed in values
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    
                 * @param   {number}    b    
                 * @param   {number}    c    
                 * @param   {number}    d
                 * @return  {number}
                 */
                MinOf$1: function (a, b, c, d) {
                    return Math.min(a, Math.min(b, Math.min(c, d)));
                },
                /**
                 * returns the minimum of the passed in values
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    
                 * @param   {number}    b    
                 * @param   {number}    c    
                 * @param   {number}    d    
                 * @param   {number}    e
                 * @return  {number}
                 */
                MinOf$2: function (a, b, c, d, e) {
                    return Math.min(a, Math.min(b, Math.min(c, Math.min(d, e))));
                },
                /**
                 * returns the maximum of the passed in values
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    
                 * @param   {number}    b    
                 * @param   {number}    c
                 * @return  {number}
                 */
                MaxOf: function (a, b, c) {
                    return Math.max(a, Math.max(b, c));
                },
                /**
                 * returns the maximum of the passed in values
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    
                 * @param   {number}    b    
                 * @param   {number}    c    
                 * @param   {number}    d
                 * @return  {number}
                 */
                MaxOf$1: function (a, b, c, d) {
                    return Math.max(a, Math.max(b, Math.max(c, d)));
                },
                /**
                 * returns the maximum of the passed in values
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    a    
                 * @param   {number}    b    
                 * @param   {number}    c    
                 * @param   {number}    d    
                 * @param   {number}    e
                 * @return  {number}
                 */
                MaxOf$2: function (a, b, c, d, e) {
                    return Math.max(a, Math.max(b, Math.max(c, Math.max(d, e))));
                },
                /**
                 * checks to see if value is between min/max inclusive of min/max
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}     value    Value.
                 * @param   {number}     min      Minimum.
                 * @param   {number}     max      Max.
                 * @return  {boolean}
                 */
                Between$1: function (value, min, max) {
                    return value >= min && value <= max;
                },
                /**
                 * checks to see if value is between min/max inclusive of min/max
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}     value    Value.
                 * @param   {number}     min      Minimum.
                 * @param   {number}     max      Max.
                 * @return  {boolean}
                 */
                Between: function (value, min, max) {
                    return value >= min && value <= max;
                },
                /**
                 * returns true if value is even
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}     value    Value.
                 * @return  {boolean}             <pre><code>true</code></pre>, if even was ised, <pre><code>false</code></pre> otherwise.
                 */
                IsEven: function (value) {
                    return value % 2 === 0;
                },
                /**
                 * returns true if value is odd
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}     value    Value.
                 * @return  {boolean}             <pre><code>true</code></pre>, if odd was ised, <pre><code>false</code></pre> otherwise.
                 */
                IsOdd: function (value) {
                    return value % 2 !== 0;
                },
                /**
                 * rounds value and returns it and the amount that was rounded
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}           value            Value.
                 * @param   {System.Single}    roundedAmount    roundedAmount.
                 * @return  {number}                            The with remainder.
                 */
                RoundWithRoundedAmount: function (value, roundedAmount) {
                    var rounded = SpineEngine.Maths.Mathf.Round(value);
                    roundedAmount.v = value - rounded * SpineEngine.Maths.Mathf.Round(value / rounded);
                    return rounded;
                },
                /**
                 * Maps a value from some arbitrary range to the 0 to 1 range
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value    Value.
                 * @param   {number}    min      Lminimum value.
                 * @param   {number}    max      maximum value
                 * @return  {number}
                 */
                Map01: function (value, min, max) {
                    return (value - min) * 1.0 / (max - min);
                },
                /**
                 * Maps a value from some arbitrary range to the 1 to 0 range. this is just the reverse of map01
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value    Value.
                 * @param   {number}    min      Lminimum value.
                 * @param   {number}    max      maximum value
                 * @return  {number}
                 */
                Map10: function (value, min, max) {
                    return 1.0 - SpineEngine.Maths.Mathf.Map01(value, min, max);
                },
                /**
                 * mapps value (which is in the range leftMin - leftMax) to a value in the range rightMin - rightMax
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value       Value.
                 * @param   {number}    leftMin     Left minimum.
                 * @param   {number}    leftMax     Left max.
                 * @param   {number}    rightMin    Right minimum.
                 * @param   {number}    rightMax    Right max.
                 * @return  {number}
                 */
                Map: function (value, leftMin, leftMax, rightMin, rightMax) {
                    return rightMin + (value - leftMin) * (rightMax - rightMin) / (leftMax - leftMin);
                },
                /**
                 * rounds value to the nearest number in steps of roundToNearest. Ex: found 127 to nearest 5 results in 125
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    value             Value.
                 * @param   {number}    roundToNearest    Round to nearest.
                 * @return  {number}                      The to nearest.
                 */
                RoundToNearest: function (value, roundToNearest) {
                    return SpineEngine.Maths.Mathf.Round(value / roundToNearest) * roundToNearest;
                },
                WithinEpsilon: function (floatA, floatB) {
                    return Math.abs(floatA - floatB) < SpineEngine.Maths.Mathf.Epsilon;
                },
                /**
                 * returns sqrt( x * x + y * y )
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    x    The x coordinate.
                 * @param   {number}    y    The y coordinate.
                 * @return  {number}
                 */
                Hypotenuse: function (x, y) {
                    return SpineEngine.Maths.Mathf.Sqrt(x * x + y * y);
                },
                ClosestPowerOfTwoGreaterThan: function (x) {
                    x = (x - 1) | 0;
                    x = x | (x >> 1);
                    x = x | (x >> 2);
                    x = x | (x >> 4);
                    x = x | (x >> 8);
                    x = x | (x >> 16);

                    return ((x + 1) | 0);
                },
                /**
                 * Returns the square root
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    val    Value.
                 * @return  {number}
                 */
                Sqrt: function (val) {
                    return Math.sqrt(val);
                },
                Pow: function (x, y) {
                    return Math.pow(x, y);
                },
                /**
                 * Returns the sine of angle in radians
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    f    F.
                 * @return  {number}
                 */
                Sin: function (f) {
                    return Math.sin(f);
                },
                /**
                 * Returns the cosine of angle in radians
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    f    F.
                 * @return  {number}
                 */
                Cos: function (f) {
                    return Math.cos(f);
                },
                /**
                 * Returns the arc-cosine of f: the angle in radians whose cosine is f
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    f    F.
                 * @return  {number}
                 */
                Acos: function (f) {
                    return Math.acos(f);
                },
                Exp: function (power) {
                    return Math.exp(power);
                },
                /**
                 * returns the angle whose tangent is the quotient (y/x) of two specified numbers
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}    y    The y coordinate.
                 * @param   {number}    x    The x coordinate.
                 * @return  {number}
                 */
                Atan2: function (y, x) {
                    return Math.atan2(y, x);
                },
                Abs: function (deltaAngle) {
                    return Math.abs(deltaAngle);
                },
                AngleBetweenVectors: function (from, to) {
                    return SpineEngine.Maths.Mathf.Atan2(to.Y - from.Y, to.X - from.X);
                },
                AngleToVector: function (angleRadians, length) {
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(SpineEngine.Maths.Mathf.Cos(angleRadians) * length, SpineEngine.Maths.Mathf.Sin(angleRadians) * length);
                },
                /**
                 * helper for moving a value around in a circle.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {Microsoft.Xna.Framework.Vector2}    position          
                 * @param   {number}                             speed             
                 * @param   {number}                             elapsedSeconds
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                RotateAround$1: function (position, speed, elapsedSeconds) {
                    var time = elapsedSeconds * speed;

                    var x = SpineEngine.Maths.Mathf.Cos(time);
                    var y = SpineEngine.Maths.Mathf.Sin(time);

                    return new Microsoft.Xna.Framework.Vector2.$ctor2(position.X + x, position.Y + y);
                },
                /**
                 * the rotation is relative to the current position not the total rotation. For example, if you are currently at 90
                     degrees and
                     want to rotate to 135 degrees, you would use an angle of 45, not 135.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {Microsoft.Xna.Framework.Vector2}    point             Point.
                 * @param   {Microsoft.Xna.Framework.Vector2}    center            Center.
                 * @param   {number}                             angleInDegrees    Angle in degrees.
                 * @return  {Microsoft.Xna.Framework.Vector2}                      The around.
                 */
                RotateAround: function (point, center, angleInDegrees) {
                    angleInDegrees = Microsoft.Xna.Framework.MathHelper.ToRadians(angleInDegrees);
                    var cos = SpineEngine.Maths.Mathf.Cos(angleInDegrees);
                    var sin = SpineEngine.Maths.Mathf.Sin(angleInDegrees);
                    var rotatedX = cos * (point.X - center.X) - sin * (point.Y - center.Y) + center.X;
                    var rotatedY = sin * (point.X - center.X) + cos * (point.Y - center.Y) + center.Y;

                    return new Microsoft.Xna.Framework.Vector2.$ctor2(rotatedX, rotatedY);
                },
                /**
                 * gets a point on the circumference of the circle given its center, radius and angle. 0 degrees is 3 o'clock.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {Microsoft.Xna.Framework.Vector2}    circleCenter      Circle center.
                 * @param   {number}                             radius            Radius.
                 * @param   {number}                             angleInDegrees    Angle in degrees.
                 * @return  {Microsoft.Xna.Framework.Vector2}                      The on circle.
                 */
                PointOnCircle: function (circleCenter, radius, angleInDegrees) {
                    var $t;
                    var radians = Microsoft.Xna.Framework.MathHelper.ToRadians(angleInDegrees);
                    return ($t = new Microsoft.Xna.Framework.Vector2.ctor(), $t.X = SpineEngine.Maths.Mathf.Cos(radians) * radius + circleCenter.X, $t.Y = SpineEngine.Maths.Mathf.Sin(radians) * radius + circleCenter.Y, $t);
                },
                /**
                 * lissajou curve
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}                             elapsedSeconds    
                 * @param   {number}                             xFrequency        
                 * @param   {number}                             yFrequency        
                 * @param   {number}                             xMagnitude        
                 * @param   {number}                             yMagnitude        
                 * @param   {number}                             phase
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                Lissajou: function (elapsedSeconds, xFrequency, yFrequency, xMagnitude, yMagnitude, phase) {
                    if (xFrequency === void 0) { xFrequency = 2.0; }
                    if (yFrequency === void 0) { yFrequency = 3.0; }
                    if (xMagnitude === void 0) { xMagnitude = 1.0; }
                    if (yMagnitude === void 0) { yMagnitude = 1.0; }
                    if (phase === void 0) { phase = 0.0; }
                    var x = SpineEngine.Maths.Mathf.Sin(elapsedSeconds * xFrequency + phase) * xMagnitude;
                    var y = SpineEngine.Maths.Mathf.Cos(elapsedSeconds * yFrequency) * yMagnitude;

                    return new Microsoft.Xna.Framework.Vector2.$ctor2(x, y);
                },
                /**
                 * damped version of a lissajou curve with oscillation between 0 and max magnitude over time. Damping should be
                     between 0 and 1 for best
                     results. oscillationInterval is the time in seconds for half of the animation loop to complete.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Mathf
                 * @memberof SpineEngine.Maths.Mathf
                 * @param   {number}                             elapsedSeconds         
                 * @param   {number}                             xFrequency             
                 * @param   {number}                             yFrequency             
                 * @param   {number}                             xMagnitude             
                 * @param   {number}                             yMagnitude             
                 * @param   {number}                             phase                  
                 * @param   {number}                             damping                
                 * @param   {number}                             oscillationInterval
                 * @return  {Microsoft.Xna.Framework.Vector2}
                 */
                LissajouDamped: function (elapsedSeconds, xFrequency, yFrequency, xMagnitude, yMagnitude, phase, damping, oscillationInterval) {
                    if (xFrequency === void 0) { xFrequency = 2.0; }
                    if (yFrequency === void 0) { yFrequency = 3.0; }
                    if (xMagnitude === void 0) { xMagnitude = 1.0; }
                    if (yMagnitude === void 0) { yMagnitude = 1.0; }
                    if (phase === void 0) { phase = 0.5; }
                    if (damping === void 0) { damping = 0.0; }
                    if (oscillationInterval === void 0) { oscillationInterval = 5.0; }
                    var wrappedTime = SpineEngine.Maths.Mathf.PingPong(elapsedSeconds, oscillationInterval);
                    var damped = SpineEngine.Maths.Mathf.Pow(Microsoft.Xna.Framework.MathHelper.E, -damping * wrappedTime);

                    var x = damped * SpineEngine.Maths.Mathf.Sin(elapsedSeconds * xFrequency + phase) * xMagnitude;
                    var y = damped * SpineEngine.Maths.Mathf.Cos(elapsedSeconds * yFrequency) * yMagnitude;

                    return new Microsoft.Xna.Framework.Vector2.$ctor2(x, y);
                }
            }
        }
    });

    /** @namespace SpineEngine.Maths.QuadTree */

    /**
     * Interface to define Rect, so that QuadTree knows how to store the object.
     *
     * @abstract
     * @public
     * @class SpineEngine.Maths.QuadTree.IQuadTreeStorable
     */
    Bridge.define("SpineEngine.Maths.QuadTree.IQuadTreeStorable", {
        $kind: "interface"
    });

    /**
     * Describes a 2D-rectangle.
     *
     * @public
     * @class SpineEngine.Maths.RectangleF
     * @implements  System.IEquatable$1
     */
    Bridge.define("SpineEngine.Maths.RectangleF", {
        inherits: function () { return [System.IEquatable$1(SpineEngine.Maths.RectangleF)]; },
        $kind: "struct",
        statics: {
            props: {
                /**
                 * Returns a {@link } with X=0, Y=0, Width=0, Height=0.
                 *
                 * @static
                 * @public
                 * @memberof SpineEngine.Maths.RectangleF
                 * @function Empty
                 * @type SpineEngine.Maths.RectangleF
                 */
                Empty: null,
                /**
                 * Returns a {@link } with X=0, Y=0, Width=1, Height=1.
                 *
                 * @static
                 * @public
                 * @memberof SpineEngine.Maths.RectangleF
                 * @function One
                 * @type SpineEngine.Maths.RectangleF
                 */
                One: null
            },
            ctors: {
                init: function () {
                    this.Empty = new SpineEngine.Maths.RectangleF();
                    this.One = new SpineEngine.Maths.RectangleF();
                    this.One = new SpineEngine.Maths.RectangleF.$ctor2(0, 0, 1, 1);
                }
            },
            methods: {
                /**
                 * Creates a new {@link } that contains overlapping region of two other rectangles.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.RectangleF
                 * @memberof SpineEngine.Maths.RectangleF
                 * @param   {SpineEngine.Maths.RectangleF}    value1    The first {@link }.
                 * @param   {SpineEngine.Maths.RectangleF}    value2    The second {@link }.
                 * @return  {SpineEngine.Maths.RectangleF}              Overlapping region of the two rectangles.
                 */
                Intersect: function (value1, value2) {
                    value1 = {v:value1};
                    value2 = {v:value2};
                    var rectangle = { v : new SpineEngine.Maths.RectangleF() };
                    SpineEngine.Maths.RectangleF.Intersect$1(value1, value2, rectangle);
                    return rectangle.v.$clone();
                },
                /**
                 * Creates a new {@link } that contains overlapping region of two other rectangles.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.RectangleF
                 * @memberof SpineEngine.Maths.RectangleF
                 * @param   {SpineEngine.Maths.RectangleF}    value1    The first {@link }.
                 * @param   {SpineEngine.Maths.RectangleF}    value2    The second {@link }.
                 * @param   {SpineEngine.Maths.RectangleF}    result    Overlapping region of the two rectangles as an output parameter.
                 * @return  {void}
                 */
                Intersect$1: function (value1, value2, result) {
                    if (value1.v.Intersects(value2.v.$clone())) {
                        var rightSide = Math.min(value1.v.X + value1.v.Width, value2.v.X + value2.v.Width);
                        var leftSide = Math.max(value1.v.X, value2.v.X);
                        var topSide = Math.max(value1.v.Y, value2.v.Y);
                        var bottomSide = Math.min(value1.v.Y + value1.v.Height, value2.v.Y + value2.v.Height);
                        result.v = new SpineEngine.Maths.RectangleF.$ctor2(leftSide, topSide, rightSide - leftSide, bottomSide - topSide);
                    } else {
                        result.v = new SpineEngine.Maths.RectangleF.$ctor2(0, 0, 0, 0);
                    }
                },
                /**
                 * Creates a new {@link } that completely contains two other rectangles.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.RectangleF
                 * @memberof SpineEngine.Maths.RectangleF
                 * @param   {SpineEngine.Maths.RectangleF}    value1    The first {@link }.
                 * @param   {SpineEngine.Maths.RectangleF}    value2    The second {@link }.
                 * @return  {SpineEngine.Maths.RectangleF}              The union of the two rectangles.
                 */
                Union: function (value1, value2) {
                    var x = Math.min(value1.X, value2.X);
                    var y = Math.min(value1.Y, value2.Y);
                    return new SpineEngine.Maths.RectangleF.$ctor2(x, y, Math.max(value1.Right, value2.Right) - x, Math.max(value1.Bottom, value2.Bottom) - y);
                },
                /**
                 * Creates a new {@link } that completely contains two other rectangles.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.RectangleF
                 * @memberof SpineEngine.Maths.RectangleF
                 * @param   {SpineEngine.Maths.RectangleF}    value1    The first {@link }.
                 * @param   {SpineEngine.Maths.RectangleF}    value2    The second {@link }.
                 * @param   {SpineEngine.Maths.RectangleF}    result    The union of the two rectangles as an output parameter.
                 * @return  {void}
                 */
                Union$1: function (value1, value2, result) {
                    result.v.X = Math.min(value1.v.X, value2.v.X);
                    result.v.Y = Math.min(value1.v.Y, value2.v.Y);
                    result.v.Width = Math.max(value1.v.Right, value2.v.Right) - result.v.X;
                    result.v.Height = Math.max(value1.v.Bottom, value2.v.Bottom) - result.v.Y;
                }/**
                 * Compares whether two {@link } instances are equal.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.RectangleF
                 * @memberof SpineEngine.Maths.RectangleF
                 * @param   {SpineEngine.Maths.RectangleF}    a    {@link } instance on the left of the equal sign.
                 * @param   {SpineEngine.Maths.RectangleF}    b    {@link } instance on the right of the equal sign.
                 * @return  {boolean}                              <pre><code>true</code></pre> if the instances are equal; <pre><code>false</code></pre> otherwise.
                 */
                ,
                op_Equality: function (a, b) {
                    return a.X === b.X && a.Y === b.Y && a.Width === b.Width && a.Height === b.Height;
                }/**
                 * Compares whether two {@link } instances are not equal.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.RectangleF
                 * @memberof SpineEngine.Maths.RectangleF
                 * @param   {SpineEngine.Maths.RectangleF}    a    {@link } instance on the left of the not equal sign.
                 * @param   {SpineEngine.Maths.RectangleF}    b    {@link } instance on the right of the not equal sign.
                 * @return  {boolean}                              <pre><code>true</code></pre> if the instances are not equal; <pre><code>false</code></pre> otherwise.
                 */
                ,
                op_Inequality: function (a, b) {
                    return !(SpineEngine.Maths.RectangleF.op_Equality(a.$clone(), b.$clone()));
                },
                op_Implicit: function (self) {
                    return new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.clip32(self.X), Bridge.Int.clip32(self.Y), Bridge.Int.clip32(self.Width), Bridge.Int.clip32(self.Height));
                },
                op_Implicit$1: function (self) {
                    return new SpineEngine.Maths.RectangleF.$ctor2(self.X, self.Y, self.Width, self.Height);
                },
                getDefaultValue: function () { return new SpineEngine.Maths.RectangleF(); }
            }
        },
        fields: {
            /**
             * The x coordinate of the top-left corner of this {@link }.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.RectangleF
             * @type number
             */
            X: 0,
            /**
             * The y coordinate of the top-left corner of this {@link }.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.RectangleF
             * @type number
             */
            Y: 0,
            /**
             * The width of this {@link }.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.RectangleF
             * @type number
             */
            Width: 0,
            /**
             * The height of this {@link }.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.RectangleF
             * @type number
             */
            Height: 0
        },
        props: {
            /**
             * Returns the x coordinate of the left edge of this {@link }.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.RectangleF
             * @function Left
             * @type number
             */
            Left: {
                get: function () {
                    return this.X;
                }
            },
            /**
             * Returns the x coordinate of the right edge of this {@link }.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.RectangleF
             * @function Right
             * @type number
             */
            Right: {
                get: function () {
                    return this.X + this.Width;
                }
            },
            /**
             * Returns the y coordinate of the top edge of this {@link }.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.RectangleF
             * @function Top
             * @type number
             */
            Top: {
                get: function () {
                    return this.Y;
                }
            },
            /**
             * Returns the y coordinate of the bottom edge of this {@link }.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.RectangleF
             * @function Bottom
             * @type number
             */
            Bottom: {
                get: function () {
                    return this.Y + this.Height;
                }
            },
            /**
             * Whether or not this {@link } has a {@link } and
                 {@link } of 0, and a {@link } of (0, 0).
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.RectangleF
             * @function IsEmpty
             * @type boolean
             */
            IsEmpty: {
                get: function () {
                    return this.Width === 0 && this.Height === 0 && this.X === 0 && this.Y === 0;
                }
            },
            /**
             * The top-left coordinates of this {@link }.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.RectangleF
             * @function Location
             * @type Microsoft.Xna.Framework.Vector2
             */
            Location: {
                get: function () {
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(this.X, this.Y);
                },
                set: function (value) {
                    this.X = value.X;
                    this.Y = value.Y;
                }
            },
            /**
             * The width-height coordinates of this {@link }.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.RectangleF
             * @function Size
             * @type Microsoft.Xna.Framework.Vector2
             */
            Size: {
                get: function () {
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(this.Width, this.Height);
                },
                set: function (value) {
                    this.Width = value.X;
                    this.Height = value.Y;
                }
            },
            DebugDisplayString: {
                get: function () {
                    return System.String.concat(Bridge.box(this.X, System.Single, System.Single.format, System.Single.getHashCode), "  ", Bridge.box(this.Y, System.Single, System.Single.format, System.Single.getHashCode), "  ", Bridge.box(this.Width, System.Single, System.Single.format, System.Single.getHashCode), "  ", Bridge.box(this.Height, System.Single, System.Single.format, System.Single.getHashCode));
                }
            }
        },
        alias: ["equalsT", "System$IEquatable$1$SpineEngine$Maths$RectangleF$equalsT"],
        ctors: {
            /**
             * Creates a new instance of {@link } struct, with the specified
                 position, width, and height.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}    x         The x coordinate of the top-left corner of the created {@link }.
             * @param   {number}    y         The y coordinate of the top-left corner of the created {@link }.
             * @param   {number}    width     The width of the created {@link }.
             * @param   {number}    height    The height of the created {@link }.
             * @return  {void}
             */
            $ctor2: function (x, y, width, height) {
                this.$initialize();
                this.X = x;
                this.Y = y;
                this.Width = width;
                this.Height = height;
            },
            /**
             * Creates a new instance of {@link } struct, with the specified
                 location and size.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Vector2}    location    The x and y coordinates of the top-left corner of the created {@link }.
             * @param   {Microsoft.Xna.Framework.Vector2}    size        The width and height of the created {@link }.
             * @return  {void}
             */
            $ctor1: function (location, size) {
                this.$initialize();
                this.X = location.X;
                this.Y = location.Y;
                this.Width = size.X;
                this.Height = size.Y;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            /**
             * Gets whether or not the provided coordinates lie within the bounds of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}     x    The x coordinate of the point to check for containment.
             * @param   {number}     y    The y coordinate of the point to check for containment.
             * @return  {boolean}         <pre><code>true</code></pre> if the provided coordinates lie inside this {@link }; <pre><code>false</code></pre> otherwise.
             */
            Contains$3: function (x, y) {
                return this.X <= x && x < this.X + this.Width && this.Y <= y && y < this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided coordinates lie within the bounds of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}     x    The x coordinate of the point to check for containment.
             * @param   {number}     y    The y coordinate of the point to check for containment.
             * @return  {boolean}         <pre><code>true</code></pre> if the provided coordinates lie inside this {@link }; <pre><code>false</code></pre> otherwise.
             */
            Contains$4: function (x, y) {
                return this.X <= x && x < this.X + this.Width && this.Y <= y && y < this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided {@link } lies within the bounds of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Point}    value    The coordinates to check for inclusion in this {@link }.
             * @return  {boolean}                                   <pre><code>true</code></pre> if the provided {@link } lies inside this {@link }; <pre><code>false</code></pre>
                 otherwise.
             */
            Contains: function (value) {
                return this.X <= value.X && value.X < this.X + this.Width && this.Y <= value.Y && value.Y < this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided {@link } lies within the bounds of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Point}    value     The coordinates to check for inclusion in this {@link }.
             * @param   {System.Boolean}                   result    <pre><code>true</code></pre> if the provided {@link } lies inside this {@link };
                 <pre><code>false</code></pre> otherwise. As an output parameter.
             * @return  {void}
             */
            Contains$5: function (value, result) {
                result.v = this.X <= value.v.X && value.v.X < this.X + this.Width && this.Y <= value.v.Y && value.v.Y < this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided {@link } lies within the bounds of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Vector2}    value    The coordinates to check for inclusion in this {@link }.
             * @return  {boolean}                                     <pre><code>true</code></pre> if the provided {@link } lies inside this {@link }; <pre><code>false</code></pre>
                 otherwise.
             */
            Contains$1: function (value) {
                return this.X <= value.X && value.X < this.X + this.Width && this.Y <= value.Y && value.Y < this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided {@link } lies within the bounds of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Vector2}    value     The coordinates to check for inclusion in this {@link }.
             * @param   {System.Boolean}                     result    <pre><code>true</code></pre> if the provided {@link } lies inside this {@link };
                 <pre><code>false</code></pre> otherwise. As an output parameter.
             * @return  {void}
             */
            Contains$6: function (value, result) {
                result.v = this.X <= value.v.X && value.v.X < this.X + this.Width && this.Y <= value.v.Y && value.v.Y < this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided {@link } lies within the bounds of this {@link }
                 .
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {SpineEngine.Maths.RectangleF}    value    The {@link } to check for inclusion in this {@link }.
             * @return  {boolean}                                  <pre><code>true</code></pre> if the provided {@link }'s bounds lie entirely inside this
                 {@link }; <pre><code>false</code></pre> otherwise.
             */
            Contains$2: function (value) {
                return this.X <= value.X && value.X + value.Width <= this.X + this.Width && this.Y <= value.Y && value.Y + value.Height <= this.Y + this.Height;
            },
            /**
             * Gets whether or not the provided {@link } lies within the bounds of this {@link }
                 .
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {SpineEngine.Maths.RectangleF}    value     The {@link } to check for inclusion in this {@link }.
             * @param   {System.Boolean}                  result    <pre><code>true</code></pre> if the provided {@link }'s bounds lie entirely inside this
                 {@link }; <pre><code>false</code></pre> otherwise. As an output parameter.
             * @return  {void}
             */
            Contains$7: function (value, result) {
                result.v = this.X <= value.v.X && value.v.X + value.v.Width <= this.X + this.Width && this.Y <= value.v.Y && value.v.Y + value.v.Height <= this.Y + this.Height;
            },
            /**
             * Compares whether current instance is equal to specified {@link }.
             *
             * @instance
             * @public
             * @override
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {System.Object}    obj    The {@link } to compare.
             * @return  {boolean}                 <pre><code>true</code></pre> if the instances are equal; <pre><code>false</code></pre> otherwise.
             */
            equals: function (obj) {
                var rect = new SpineEngine.Maths.RectangleF();
                return System.Nullable.liftne(SpineEngine.Maths.RectangleF.op_Inequality, ((rect = Bridge.as(obj, SpineEngine.Maths.RectangleF))), null) && SpineEngine.Maths.RectangleF.op_Equality(this, rect.$clone());
            },
            /**
             * Compares whether current instance is equal to specified {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {SpineEngine.Maths.RectangleF}    other    The {@link } to compare.
             * @return  {boolean}                                  <pre><code>true</code></pre> if the instances are equal; <pre><code>false</code></pre> otherwise.
             */
            equalsT: function (other) {
                return SpineEngine.Maths.RectangleF.op_Equality(this, other.$clone());
            },
            /**
             * Gets the hash code of this {@link }.
             *
             * @instance
             * @public
             * @override
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @return  {number}        Hash code of this {@link }.
             */
            getHashCode: function () {
                return Bridge.Int.clip32(this.X) ^ Bridge.Int.clip32(this.Y) ^ Bridge.Int.clip32(this.Width) ^ Bridge.Int.clip32(this.Height);
            },
            /**
             * Adjusts the edges of this {@link } by specified horizontal and vertical amounts.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}    horizontalAmount    Value to adjust the left and right edges.
             * @param   {number}    verticalAmount      Value to adjust the top and bottom edges.
             * @return  {void}
             */
            Inflate: function (horizontalAmount, verticalAmount) {
                this.X -= horizontalAmount;
                this.Y -= verticalAmount;
                this.Width += Bridge.Int.mul(horizontalAmount, 2);
                this.Height += Bridge.Int.mul(verticalAmount, 2);
            },
            /**
             * Adjusts the edges of this {@link } by specified horizontal and vertical amounts.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}    horizontalAmount    Value to adjust the left and right edges.
             * @param   {number}    verticalAmount      Value to adjust the top and bottom edges.
             * @return  {void}
             */
            Inflate$1: function (horizontalAmount, verticalAmount) {
                this.X -= horizontalAmount;
                this.Y -= verticalAmount;
                this.Width += horizontalAmount * 2;
                this.Height += verticalAmount * 2;
            },
            /**
             * Gets whether or not the other {@link } intersects with this rectangle.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {SpineEngine.Maths.RectangleF}    value    The other rectangle for testing.
             * @return  {boolean}                                  <pre><code>true</code></pre> if other {@link } intersects with this rectangle; <pre><code>false</code></pre> otherwise.
             */
            Intersects: function (value) {
                return value.Left < this.Right && this.Left < value.Right && value.Top < this.Bottom && this.Top < value.Bottom;
            },
            /**
             * Gets whether or not the other {@link } intersects with this rectangle.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {SpineEngine.Maths.RectangleF}    value     The other rectangle for testing.
             * @param   {System.Boolean}                  result    <pre><code>true</code></pre> if other {@link } intersects with this rectangle; <pre><code>false</code></pre>
                 otherwise. As an output parameter.
             * @return  {void}
             */
            Intersects$2: function (value, result) {
                result.v = value.v.Left < this.Right && this.Left < value.v.Right && value.v.Top < this.Bottom && this.Top < value.v.Bottom;
            },
            /**
             * returns true if other intersects rect
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {SpineEngine.Maths.RectangleF}    other    other.
             * @return  {boolean}
             */
            Intersects$1: function (other) {
                var result = { };
                this.Intersects$2(other, result);
                return result.v;
            },
            /**
             * Changes the {@link } of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}    offsetX    The x coordinate to add to this {@link }.
             * @param   {number}    offsetY    The y coordinate to add to this {@link }.
             * @return  {void}
             */
            Offset$2: function (offsetX, offsetY) {
                this.X += offsetX;
                this.Y += offsetY;
            },
            /**
             * Changes the {@link } of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {number}    offsetX    The x coordinate to add to this {@link }.
             * @param   {number}    offsetY    The y coordinate to add to this {@link }.
             * @return  {void}
             */
            Offset$3: function (offsetX, offsetY) {
                this.X += offsetX;
                this.Y += offsetY;
            },
            /**
             * Changes the {@link } of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Point}    amount    The x and y components to add to this {@link }.
             * @return  {void}
             */
            Offset: function (amount) {
                this.X += amount.X;
                this.Y += amount.Y;
            },
            /**
             * Changes the {@link } of this {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @param   {Microsoft.Xna.Framework.Vector2}    amount    The x and y components to add to this {@link }.
             * @return  {void}
             */
            Offset$1: function (amount) {
                this.X += amount.X;
                this.Y += amount.Y;
            },
            /**
             * Returns a {@link } representation of this {@link } in the format:
                 {X:[{@link }] Y:[{@link }] Width:[{@link }] Height:[{@link }]}
             *
             * @instance
             * @public
             * @override
             * @this SpineEngine.Maths.RectangleF
             * @memberof SpineEngine.Maths.RectangleF
             * @return  {string}        {@link } representation of this {@link }.
             */
            toString: function () {
                return System.String.format("X:{0}, Y:{1}, Width: {2}, Height: {3}", Bridge.box(this.X, System.Single, System.Single.format, System.Single.getHashCode), Bridge.box(this.Y, System.Single, System.Single.format, System.Single.getHashCode), Bridge.box(this.Width, System.Single, System.Single.format, System.Single.getHashCode), Bridge.box(this.Height, System.Single, System.Single.format, System.Single.getHashCode));
            },
            $clone: function (to) {
                var s = to || new SpineEngine.Maths.RectangleF();
                s.X = this.X;
                s.Y = this.Y;
                s.Width = this.Width;
                s.Height = this.Height;
                return s;
            }
        }
    });

    Bridge.define("SpineEngine.Maths.TransformationUtils", {
        statics: {
            methods: {
                GetTransformation: function (entity) {
                    var $t, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $t9;
                    if (entity == null) {
                        return null;
                    }

                    var localPosition = ($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.PositionComponent)) != null ? $t1.Position : null), $t != null ? $t : Microsoft.Xna.Framework.Vector2.Zero);
                    var localScale = ($t2 = (($t3 = entity.GetComponent(SpineEngine.ECS.Components.ScaleComponent)) != null ? $t3.Scale : null), $t2 != null ? $t2 : Microsoft.Xna.Framework.Vector2.One);
                    var localRotation = ($t4 = (($t5 = entity.GetComponent(SpineEngine.ECS.Components.RotateComponent)) != null ? $t5.Rotation : null), $t4 != null ? $t4 : 0);
                    var localParent = SpineEngine.Maths.TransformationUtils.GetTransformation(($t6 = entity.GetComponent(SpineEngine.ECS.Components.ParentComponent)) != null ? $t6.Parent : null);
                    var positionalEntity = entity.Cache.GetOrAddData(SpineEngine.Maths.TransformationUtils.Transformation, "TransformationUtils", $asm.$.SpineEngine.Maths.TransformationUtils.f1);

                    var parentChanged = false;

                    var parentMatrix = ($t7 = (localParent != null ? localParent.LocalTransformMatrix : null), $t7 != null ? $t7 : Microsoft.Xna.Framework.Matrix.Identity);
                    var parentRotate = ($t8 = (localParent != null ? localParent.Rotate : null), $t8 != null ? $t8 : 0);
                    var parentScale = ($t9 = (localParent != null ? localParent.Scale : null), $t9 != null ? $t9 : Microsoft.Xna.Framework.Vector2.One);

                    if (Microsoft.Xna.Framework.Matrix.op_Inequality(parentMatrix.$clone(), positionalEntity.ParentTransformMatrix.$clone())) {
                        positionalEntity.ParentTransformMatrix = parentMatrix.$clone();
                        parentChanged = true;
                    }

                    var localMatrixChanged = false;
                    if (Microsoft.Xna.Framework.Vector2.op_Inequality(positionalEntity.SelfPosition.$clone(), localPosition.$clone()) || parentChanged) {
                        positionalEntity.SelfPosition = localPosition.$clone();
                        positionalEntity.Position = Microsoft.Xna.Framework.Vector2.Transform(positionalEntity.SelfPosition.$clone(), parentMatrix.$clone());
                        positionalEntity.RebuildPositionalMatrix();
                        localMatrixChanged = true;
                    }

                    if (positionalEntity.SelfRotate !== localRotation || parentChanged) {
                        positionalEntity.SelfRotate = localRotation;
                        positionalEntity.Rotate = localRotation + parentRotate;
                        positionalEntity.RebuildRotateMatrix();
                        localMatrixChanged = true;
                    }

                    if (Microsoft.Xna.Framework.Vector2.op_Inequality(positionalEntity.SelfScale.$clone(), localScale.$clone()) || parentChanged) {
                        positionalEntity.SelfScale = localScale.$clone();
                        positionalEntity.Scale = Microsoft.Xna.Framework.Vector2.op_Multiply(localScale.$clone(), parentScale.$clone());
                        positionalEntity.RebuildScaleMatrix();
                        localMatrixChanged = true;
                    }

                    if (localMatrixChanged) {
                        positionalEntity.RebuildLocalTransformationMatrixPositionalEntity();
                    }

                    return positionalEntity;
                }
            }
        }
    });

    Bridge.ns("SpineEngine.Maths.TransformationUtils", $asm.$);

    Bridge.apply($asm.$.SpineEngine.Maths.TransformationUtils, {
        f1: function () {
            return new SpineEngine.Maths.TransformationUtils.Transformation();
        }
    });

    Bridge.define("SpineEngine.Maths.TransformationUtils.Transformation", {
        $kind: "nested class",
        fields: {
            LocalTransformMatrix: null,
            ParentTransformMatrix: null,
            Position: null,
            PositionMatrix: null,
            Rotate: 0,
            RotateMatrix: null,
            Scale: null,
            ScaleMatrix: null,
            SelfPosition: null,
            SelfRotate: 0,
            SelfScale: null
        },
        ctors: {
            init: function () {
                this.LocalTransformMatrix = new Microsoft.Xna.Framework.Matrix();
                this.ParentTransformMatrix = new Microsoft.Xna.Framework.Matrix();
                this.Position = new Microsoft.Xna.Framework.Vector2();
                this.PositionMatrix = new Microsoft.Xna.Framework.Matrix();
                this.RotateMatrix = new Microsoft.Xna.Framework.Matrix();
                this.Scale = new Microsoft.Xna.Framework.Vector2();
                this.ScaleMatrix = new Microsoft.Xna.Framework.Matrix();
                this.SelfPosition = new Microsoft.Xna.Framework.Vector2();
                this.SelfScale = new Microsoft.Xna.Framework.Vector2();
                this.LocalTransformMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.ParentTransformMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.PositionMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.RotateMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.Scale = Microsoft.Xna.Framework.Vector2.One.$clone();
                this.ScaleMatrix = Microsoft.Xna.Framework.Matrix.Identity.$clone();
                this.SelfScale = Microsoft.Xna.Framework.Vector2.One.$clone();
            }
        },
        methods: {
            RebuildLocalTransformationMatrixPositionalEntity: function () {
                Microsoft.Xna.Framework.Matrix.Multiply$2(Bridge.ref(this, "ScaleMatrix"), Bridge.ref(this, "RotateMatrix"), Bridge.ref(this, "LocalTransformMatrix"));
                Microsoft.Xna.Framework.Matrix.Multiply$2(Bridge.ref(this, "LocalTransformMatrix"), Bridge.ref(this, "PositionMatrix"), Bridge.ref(this, "LocalTransformMatrix"));
                return this.LocalTransformMatrix.$clone();
            },
            RebuildScaleMatrix: function () {
                Microsoft.Xna.Framework.Matrix.CreateScale$5(this.Scale.X, this.Scale.Y, 1, Bridge.ref(this, "ScaleMatrix"));
            },
            RebuildRotateMatrix: function () {
                Microsoft.Xna.Framework.Matrix.CreateRotationZ$1(this.Rotate, Bridge.ref(this, "RotateMatrix"));
            },
            RebuildPositionalMatrix: function () {
                Microsoft.Xna.Framework.Matrix.CreateTranslation$3(this.Position.X, this.Position.Y, 0, Bridge.ref(this, "PositionMatrix"));
            }
        }
    });

    /**
     * simple ear clipping triangulator. the final triangles will be present in the triangleIndices list
     *
     * @public
     * @class SpineEngine.Maths.Triangulator
     */
    Bridge.define("SpineEngine.Maths.Triangulator", {
        statics: {
            methods: {
                /**
                 * Computes a triangle list that fully covers the area enclosed by the given set of points. If points are not CCW,
                     pass false for
                     the arePointsCCW parameter
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Triangulator
                 * @memberof SpineEngine.Maths.Triangulator
                 * @param   {Array.<Microsoft.Xna.Framework.Vector2>}    points          A list of points that defines an enclosing path.
                 * @param   {boolean}                                    arePointsCcw    Flag to know that points are ccw.
                 * @return  {System.Collections.Generic.List$1}
                 */
                Triangulate: function (points, arePointsCcw) {
                    if (arePointsCcw === void 0) { arePointsCcw = true; }
                    var count = points.length;
                    var triangleIndices = SpineEngine.Utils.Collections.Pool$1(System.Collections.Generic.List$1(System.Int32)).Obtain();
                    triangleIndices.clear();
                    var triPrev = { v : System.Array.init(12, 0, System.Int32) };
                    var triNext = { v : System.Array.init(12, 0, System.Int32) };
                    if (triNext.v.length < count) {
                        System.Array.resize(triNext, Math.max(Bridge.Int.mul(triNext.v.length, 2), count), 0);
                    }
                    if (triPrev.v.length < count) {
                        System.Array.resize(triPrev, Math.max(Bridge.Int.mul(triPrev.v.length, 2), count), 0);
                    }

                    for (var i = 0; i < count; i = (i + 1) | 0) {
                        triPrev.v[System.Array.index(i, triPrev.v)] = (i - 1) | 0;
                        triNext.v[System.Array.index(i, triNext.v)] = (i + 1) | 0;
                    }

                    triPrev.v[System.Array.index(0, triPrev.v)] = (count - 1) | 0;
                    triNext.v[System.Array.index(((count - 1) | 0), triNext.v)] = 0;

                    // loop breaker for polys that are not triangulatable
                    var iterations = 0;

                    // start at vert 0
                    var index = 0;

                    // keep removing verts until just a triangle is left
                    while (count > 3 && iterations < 500) {
                        iterations = (iterations + 1) | 0;
                        // test if current vert is an ear
                        var isEar = true;

                        var a = points[System.Array.index(triPrev.v[System.Array.index(index, triPrev.v)], points)].$clone();
                        var b = points[System.Array.index(index, points)].$clone();
                        var c = points[System.Array.index(triNext.v[System.Array.index(index, triNext.v)], points)].$clone();

                        // an ear must be convex (here counterclockwise)
                        if (SpineEngine.Maths.Triangulator.IsTriangleCcw(a.$clone(), b.$clone(), c.$clone())) {
                            // loop over all verts not part of the tentative ear
                            var k = triNext.v[System.Array.index(triNext.v[System.Array.index(index, triNext.v)], triNext.v)];
                            do {
                                // if vert k is inside the ear triangle, then this is not an ear
                                if (SpineEngine.Maths.Triangulator.TestPointTriangle(points[System.Array.index(k, points)].$clone(), a.$clone(), b.$clone(), c.$clone())) {
                                    isEar = false;
                                    break;
                                }

                                k = triNext.v[System.Array.index(k, triNext.v)];
                            } while (k !== triPrev.v[System.Array.index(index, triPrev.v)]);
                        } else {
                            // the ear triangle is clockwise so points[i] is not an ear
                            isEar = false;
                        }

                        // if current vert is an ear, delete it and visit the previous vert
                        if (isEar) {
                            // triangle is an ear
                            triangleIndices.add(triPrev.v[System.Array.index(index, triPrev.v)]);
                            triangleIndices.add(index);
                            triangleIndices.add(triNext.v[System.Array.index(index, triNext.v)]);

                            // delete vert by redirecting next and previous links of neighboring verts past it
                            // decrement vertext count
                            triNext.v[System.Array.index(triPrev.v[System.Array.index(index, triPrev.v)], triNext.v)] = triNext.v[System.Array.index(index, triNext.v)];
                            triPrev.v[System.Array.index(triNext.v[System.Array.index(index, triNext.v)], triPrev.v)] = triPrev.v[System.Array.index(index, triPrev.v)];
                            count = (count - 1) | 0;

                            // visit the previous vert next
                            index = triPrev.v[System.Array.index(index, triPrev.v)];
                        } else {
                            // current vert is not an ear. visit the next vert
                            index = triNext.v[System.Array.index(index, triNext.v)];
                        }
                    }

                    // output the final triangle
                    triangleIndices.add(triPrev.v[System.Array.index(index, triPrev.v)]);
                    triangleIndices.add(index);
                    triangleIndices.add(triNext.v[System.Array.index(index, triNext.v)]);

                    if (!arePointsCcw) {
                        triangleIndices.Reverse();
                    }

                    return triangleIndices;
                },
                /**
                 * checks if a triangle is CCW or CW
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Triangulator
                 * @memberof SpineEngine.Maths.Triangulator
                 * @param   {Microsoft.Xna.Framework.Vector2}    a         The alpha component.
                 * @param   {Microsoft.Xna.Framework.Vector2}    center    Center.
                 * @param   {Microsoft.Xna.Framework.Vector2}    c         C.
                 * @return  {boolean}                                      <pre><code>true</code></pre>, if triangle ccw was ised, <pre><code>false</code></pre> otherwise.
                 */
                IsTriangleCcw: function (a, center, c) {
                    return SpineEngine.Maths.Triangulator.Cross(Microsoft.Xna.Framework.Vector2.op_Subtraction(center.$clone(), a.$clone()), Microsoft.Xna.Framework.Vector2.op_Subtraction(c.$clone(), center.$clone())) < 0;
                },
                TestPointTriangle: function (point, a, b, c) {
                    // if point to the right of AB then outside triangle
                    if (SpineEngine.Maths.Triangulator.Cross(Microsoft.Xna.Framework.Vector2.op_Subtraction(point.$clone(), a.$clone()), Microsoft.Xna.Framework.Vector2.op_Subtraction(b.$clone(), a.$clone())) < 0.0) {
                        return false;
                    }

                    // if point to the right of BC then outside of triangle
                    if (SpineEngine.Maths.Triangulator.Cross(Microsoft.Xna.Framework.Vector2.op_Subtraction(point.$clone(), b.$clone()), Microsoft.Xna.Framework.Vector2.op_Subtraction(c.$clone(), b.$clone())) < 0.0) {
                        return false;
                    }

                    // if point to the right of ca then outside of triangle
                    if (SpineEngine.Maths.Triangulator.Cross(Microsoft.Xna.Framework.Vector2.op_Subtraction(point.$clone(), c.$clone()), Microsoft.Xna.Framework.Vector2.op_Subtraction(a.$clone(), c.$clone())) < 0.0) {
                        return false;
                    }

                    // point is in or on triangle
                    return true;
                },
                /**
                 * compute the 2d pseudo cross product Dot( Perp( u ), v )
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Maths.Triangulator
                 * @memberof SpineEngine.Maths.Triangulator
                 * @param   {Microsoft.Xna.Framework.Vector2}    u    U.
                 * @param   {Microsoft.Xna.Framework.Vector2}    v    V.
                 * @return  {number}
                 */
                Cross: function (u, v) {
                    return u.Y * v.X - u.X * v.Y;
                }
            }
        }
    });

    /** @namespace SpineEngine.Utils */

    /**
     * helper class to fetch property delegates
     *
     * @public
     * @class SpineEngine.Utils.BuildTargetUtils
     */
    Bridge.define("SpineEngine.Utils.BuildTargetUtils", {
        statics: {
            methods: {
                TryParseFloat: function (str, newValue) {
                    return System.Single.tryParse(str, System.Globalization.CultureInfo.invariantCulture, newValue);
                },
                InvokeMethod: function (materialMethod, target) {
                    return Bridge.Reflection.midel(materialMethod, Bridge.unbox(target))(null);
                },
                GetAssembly: function (type) {
                    return Bridge.Reflection.getTypeAssembly(type);
                },
                GetFieldInfo: function (targetObject, fieldName) {
                    return SpineEngine.Utils.BuildTargetUtils.GetFieldInfo$1(Bridge.getType(targetObject), fieldName);
                },
                GetFieldInfo$1: function (type, fieldName) {
                    var fieldInfo = null;
                    do {
                        fieldInfo = Bridge.Reflection.getMembers(type, 4, 52 | 256, fieldName);
                        type = Bridge.Reflection.getBaseType(type);
                    } while (fieldInfo == null && type != null);

                    return fieldInfo;
                },
                GetFields: function (type) {
                    return Bridge.Reflection.getMembers(type, 4, 52);
                },
                GetFieldValue: function (targetObject, fieldName) {
                    var fieldInfo = SpineEngine.Utils.BuildTargetUtils.GetFieldInfo(targetObject, fieldName);
                    return Bridge.Reflection.fieldAccess(fieldInfo, Bridge.unbox(targetObject));
                },
                GetPropertyInfo: function (targetObject, propertyName) {
                    return Bridge.Reflection.getMembers(Bridge.getType(targetObject), 16, 52 | 256, propertyName);
                },
                GetProperties: function (type) {
                    return Bridge.Reflection.getMembers(type, 16, 52);
                },
                GetPropertyGetter: function (prop) {
                    return prop.g;
                },
                GetPropertySetter: function (prop) {
                    return prop.s;
                },
                GetPropertyValue: function (targetObject, propertyName) {
                    var propInfo = SpineEngine.Utils.BuildTargetUtils.GetPropertyInfo(targetObject, propertyName);
                    var methodInfo = SpineEngine.Utils.BuildTargetUtils.GetPropertyGetter(propInfo);
                    return Bridge.Reflection.midel(methodInfo, Bridge.unbox(targetObject)).apply(null, Bridge.unbox(System.Array.init([], System.Object)));
                },
                GetMethods: function (type) {
                    return Bridge.Reflection.getMembers(type, 8, 52);
                },
                GetMethodInfo: function (targetObject, methodName) {
                    return SpineEngine.Utils.BuildTargetUtils.GetMethodInfo$2(Bridge.getType(targetObject), methodName);
                },
                GetMethodInfo$1: function (targetObject, methodName, parameters) {
                    return SpineEngine.Utils.BuildTargetUtils.GetMethodInfo$2(Bridge.getType(targetObject), methodName, parameters);
                },
                GetMethodInfo$2: function (type, methodName, parameters) {
                    if (parameters === void 0) { parameters = null; }
                    if (parameters == null) {
                        return Bridge.Reflection.getMembers(type, 8, 52 | 256, methodName);
                    }
                    return Bridge.Reflection.getMembers(type, 8, 52 | 256, methodName, parameters);
                },
                CreateDelegate: function (T, targetObject, methodInfo) {
                    return Bridge.cast(Bridge.unbox(Bridge.Reflection.midel(methodInfo, Bridge.unbox(targetObject)), T), T);
                },
                /**
                 * either returns a super fast Delegate to set the given property or null if it couldn't be found
                     via reflection
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.BuildTargetUtils
                 * @memberof SpineEngine.Utils.BuildTargetUtils
                 * @param   {Function}         T               
                 * @param   {System.Object}    targetObject    
                 * @param   {string}           propertyName
                 * @return  {T}
                 */
                SetterForProperty: function (T, targetObject, propertyName) {
                    // first get the property
                    var propInfo = SpineEngine.Utils.BuildTargetUtils.GetPropertyInfo(targetObject, propertyName);
                    if (propInfo == null) {
                        return Bridge.getDefaultValue(T);
                    }

                    return SpineEngine.Utils.BuildTargetUtils.CreateDelegate(T, targetObject, propInfo.s);
                },
                /**
                 * either returns a super fast Delegate to get the given property or null if it couldn't be found
                     via reflection
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.BuildTargetUtils
                 * @memberof SpineEngine.Utils.BuildTargetUtils
                 * @param   {Function}         T               
                 * @param   {System.Object}    targetObject    
                 * @param   {string}           propertyName
                 * @return  {T}
                 */
                GetterForProperty: function (T, targetObject, propertyName) {
                    // first get the property
                    var propInfo = SpineEngine.Utils.BuildTargetUtils.GetPropertyInfo(targetObject, propertyName);
                    if (propInfo == null) {
                        return Bridge.getDefaultValue(T);
                    }

                    return SpineEngine.Utils.BuildTargetUtils.CreateDelegate(T, targetObject, propInfo.g);
                },
                GetCustomAttributes: function (T, prop) {
                    return System.Linq.Enumerable.from(System.Attribute.getCustomAttributes(prop, T)).select(function (x) { return Bridge.cast(x, T); }).ToArray(T);
                },
                GetCustomAttribute: function (T, prop) {
                    return System.Linq.Enumerable.from(System.Attribute.getCustomAttributes(prop, T)).select(function (x) { return Bridge.cast(x, T); }).firstOrDefault(null, null);
                },
                GetCustomAttribute$1: function (T, type) {
                    return System.Linq.Enumerable.from(Bridge.Reflection.getAttributes(type, T, true)).select(function (x) { return Bridge.cast(x, T); }).firstOrDefault(null, null);
                },
                IsEnum: function (valueType) {
                    return Bridge.Reflection.isEnum(valueType);
                },
                IsValueType: function (valueType) {
                    return Bridge.Reflection.isValueType(valueType);
                }
            }
        }
    });

    /**
     * sourced from: https://github.com/tejacques/Deque
         A genetic Deque class. It can be thought of as a double-ended queue, hence Deque. This allows for
         an O(1) AddFront, AddBack, RemoveFront, RemoveBack. The Deque also has O(1) indexed lookup, as it is backed
         by a circular array.
     *
     * @public
     * @class SpineEngine.Utils.Collections.Deque$1
     * @implements  System.Collections.Generic.IList$1
     * @param   {Function}    [name]    The type of objects to store in the deque.
     */
    Bridge.define("SpineEngine.Utils.Collections.Deque$1", function (T) { return {
        inherits: [System.Collections.Generic.IList$1(T)],
        statics: {
            fields: {
                /**
                 * The default capacity of the deque.
                 *
                 * @static
                 * @private
                 * @memberof SpineEngine.Utils.Collections.Deque$1
                 * @constant
                 * @default 16
                 * @type number
                 */
                DefaultCapacity: 0
            },
            ctors: {
                init: function () {
                    this.DefaultCapacity = 16;
                }
            },
            methods: {
                CheckArgumentsOutOfRange: function (length, offset, count) {
                    if (offset < 0) {
                        throw new System.ArgumentOutOfRangeException.$ctor4("offset", "Invalid offset " + offset);
                    }

                    if (count < 0) {
                        throw new System.ArgumentOutOfRangeException.$ctor4("count", "Invalid count " + count);
                    }

                    if (((length - offset) | 0) < count) {
                        throw new System.ArgumentException.$ctor1((System.String.format("Invalid offset ({0}) or count + ({1}) ", Bridge.box(offset, System.Int32), Bridge.box(count, System.Int32)) || "") + (System.String.format("for source length {0}", [Bridge.box(length, System.Int32)]) || ""));
                    }
                }
            }
        },
        fields: {
            /**
             * The circular array holding the items.
             *
             * @instance
             * @private
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @type Array.<T>
             */
            buffer: null,
            capacityClosestPowerOfTwoMinusOne: 0,
            /**
             * The first element offset from the beginning of the data array.
             *
             * @instance
             * @private
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @type number
             */
            startOffset: 0
        },
        props: {
            /**
             * Gets or sets the total number of elements
                 the internal array can hold without resizing.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @function Capacity
             * @type number
             */
            Capacity: {
                get: function () {
                    return this.buffer.length;
                },
                set: function (value) {
                    if (value < 0) {
                        throw new System.ArgumentOutOfRangeException.$ctor4("value", "Capacity is less than 0.");
                    }

                    if (value < this.Count) {
                        throw new System.InvalidOperationException.$ctor1("Capacity cannot be set to a value less than Count");
                    }

                    if (null != this.buffer && value === this.buffer.length) {
                        return;
                    }

                    // Create a new array and copy the old values.
                    var powOfTwo = SpineEngine.Maths.Mathf.ClosestPowerOfTwoGreaterThan(value);
                    value = powOfTwo;
                    var newBuffer = System.Array.init(value, function (){
                        return Bridge.getDefaultValue(T);
                    }, T);
                    this.copyTo(newBuffer, 0);
                    // Set up to use the new buffer.
                    this.buffer = newBuffer;
                    this.startOffset = 0;
                    this.capacityClosestPowerOfTwoMinusOne = (powOfTwo - 1) | 0;
                }
            },
            /**
             * Gets whether or not the Deque is filled to capacity.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @function IsFull
             * @type boolean
             */
            IsFull: {
                get: function () {
                    return this.Count === this.Capacity;
                }
            },
            /**
             * Gets whether or not the Deque is empty.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @function IsEmpty
             * @type boolean
             */
            IsEmpty: {
                get: function () {
                    return 0 === this.Count;
                }
            },
            /**
             * Gets a value indicating whether the Deque is read-only.
             *
             * @instance
             * @readonly
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @function "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$IsReadOnly"
             * @type boolean
             */
            System$Collections$Generic$ICollection$1$IsReadOnly: {
                get: function () {
                    return false;
                }
            },
            /**
             * Gets the number of elements contained in the Deque.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @function Count
             * @type number
             */
            Count: 0
        },
        alias: [
            "GetEnumerator", ["System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$GetEnumerator", "System$Collections$Generic$IEnumerable$1$GetEnumerator"],
            "\"System$Collections$Generic$ICollection$1$\" + Bridge.getTypeAlias(T) + \"$IsReadOnly\"", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$IsReadOnly",
            "Count", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$Count",
            "add", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$add",
            "clear", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$clear",
            "contains", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$contains",
            "copyTo", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$copyTo",
            "remove", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$remove",
            "getItem", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$getItem",
            "setItem", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$setItem",
            "insert", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$insert",
            "indexOf", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$indexOf",
            "removeAt", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$removeAt"
        ],
        ctors: {
            /**
             * Creates a new instance of the Deque class with
                 the default capacity.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @return  {void}
             */
            ctor: function () {
                SpineEngine.Utils.Collections.Deque$1(T).$ctor2.call(this, SpineEngine.Utils.Collections.Deque$1(T).DefaultCapacity);
            },
            /**
             * Creates a new instance of the Deque class with
                 the specified capacity.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {number}    capacity    The initial capacity of the Deque.
             * @return  {void}
             */
            $ctor2: function (capacity) {
                this.$initialize();
                if (capacity < 0) {
                    throw new System.ArgumentOutOfRangeException.$ctor4("capacity", "capacity is less than 0.");
                }

                this.Capacity = capacity;
            },
            /**
             * Create a new instance of the Deque class with the elements
                 from the specified collection.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {System.Collections.Generic.ICollection$1}    collection    The co
             * @return  {void}
             */
            $ctor1: function (collection) {
                SpineEngine.Utils.Collections.Deque$1(T).$ctor2.call(this, System.Array.getCount(collection, T));
                this.InsertRange(0, collection);
            }
        },
        methods: {
            /**
             * Gets or sets the element at the specified index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @throws {System.ArgumentOutOfRangeException} <b /> is not a valid index in this deque
             * @param   {number}    index    The zero-based index of the element to get or set.
             * @return  {T}                  The element at the specified index
             */
            getItem: function (index) {
                return this.Get(index);
            },
            /**
             * Gets or sets the element at the specified index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @throws {System.ArgumentOutOfRangeException} <b /> is not a valid index in this deque
             * @param   {number}    index    The zero-based index of the element to get or set.
             * @param   {T}         value
             * @return  {void}               The element at the specified index
             */
            setItem: function (index, value) {
                this.Set(index, value);
            },
            EnsureCapacityFor: function (numElements) {
                if (((this.Count + numElements) | 0) > this.Capacity) {
                    this.Capacity = (this.Count + numElements) | 0;
                }
            },
            ToBufferIndex: function (index) {
                return (((index + this.startOffset) | 0)) & this.capacityClosestPowerOfTwoMinusOne;
            },
            CheckIndexOutOfRange: function (index) {
                if (index >= this.Count) {
                    throw new System.IndexOutOfRangeException.$ctor1("The supplied index is greater than the Count");
                }
            },
            ShiftStartOffset: function (value) {
                this.startOffset = this.ToBufferIndex(value);

                return this.startOffset;
            },
            PreShiftStartOffset: function (value) {
                var offset = this.startOffset;
                this.ShiftStartOffset(value);
                return offset;
            },
            PostShiftStartOffset: function (value) {
                return this.ShiftStartOffset(value);
            },
            /**
             * Adds the provided item to the front of the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {T}       item    The item to add.
             * @return  {void}
             */
            AddFront: function (item) {
                this.EnsureCapacityFor(1);
                this.buffer[System.Array.index(this.PostShiftStartOffset(-1), this.buffer)] = item;
                this.IncrementCount(1);
            },
            /**
             * Adds the provided item to the back of the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {T}       item    The item to add.
             * @return  {void}
             */
            AddBack: function (item) {
                this.EnsureCapacityFor(1);
                this.buffer[System.Array.index(this.ToBufferIndex(this.Count), this.buffer)] = item;
                this.IncrementCount(1);
            },
            /**
             * Removes an item from the front of the Deque and returns it.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @return  {T}        The item at the front of the Deque.
             */
            RemoveFront: function () {
                if (this.IsEmpty) {
                    throw new System.InvalidOperationException.$ctor1("The Deque is empty");
                }

                var result = this.buffer[System.Array.index(this.startOffset, this.buffer)];
                this.buffer[System.Array.index(this.PreShiftStartOffset(1), this.buffer)] = Bridge.getDefaultValue(T);
                this.DecrementCount(1);
                return result;
            },
            /**
             * Removes an item from the back of the Deque and returns it.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @return  {T}        The item in the back of the Deque.
             */
            RemoveBack: function () {
                if (this.IsEmpty) {
                    throw new System.InvalidOperationException.$ctor1("The Deque is empty");
                }

                this.DecrementCount(1);
                var endIndex = this.ToBufferIndex(this.Count);
                var result = this.buffer[System.Array.index(endIndex, this.buffer)];
                this.buffer[System.Array.index(endIndex, this.buffer)] = Bridge.getDefaultValue(T);

                return result;
            },
            /**
             * Adds a collection of items to the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {System.Collections.Generic.ICollection$1}    collection    The collection to add.
             * @return  {void}
             */
            AddRange: function (collection) {
                this.AddBackRange(collection);
            },
            /**
             * Adds a collection of items to the front of the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {System.Collections.Generic.ICollection$1}    collection    The collection to add.
             * @return  {void}
             */
            AddFrontRange: function (collection) {
                this.AddFrontRange$1(collection, 0, System.Array.getCount(collection, T));
            },
            /**
             * Adds count items from a collection of items
                 from a specified index to the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {System.Collections.Generic.IEnumerable$1}    collection    The collection to add.
             * @param   {number}                                      fromIndex     The index in the collection to begin adding from.
             * @param   {number}                                      count         The number of items in the collection to add.
             * @return  {void}
             */
            AddFrontRange$1: function (collection, fromIndex, count) {
                this.InsertRange$1(0, collection, fromIndex, count);
            },
            /**
             * Adds a collection of items to the back of the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {System.Collections.Generic.ICollection$1}    collection    The collection to add.
             * @return  {void}
             */
            AddBackRange: function (collection) {
                this.AddBackRange$1(collection, 0, System.Array.getCount(collection, T));
            },
            /**
             * Adds count items from a collection of items
                 from a specified index to the back of the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {System.Collections.Generic.IEnumerable$1}    collection    The collection to add.
             * @param   {number}                                      fromIndex     The index in the collection to begin adding from.
             * @param   {number}                                      count         The number of items in the collection to add.
             * @return  {void}
             */
            AddBackRange$1: function (collection, fromIndex, count) {
                this.InsertRange$1(this.Count, collection, fromIndex, count);
            },
            /**
             * Inserts a collection of items into the Deque
                 at the specified index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {number}                                      index         The index in the Deque to insert the collection.
             * @param   {System.Collections.Generic.ICollection$1}    collection    The collection to add.
             * @return  {void}
             */
            InsertRange: function (index, collection) {
                var count = System.Array.getCount(collection, T);
                this.InsertRange$1(index, collection, 0, count);
            },
            /**
             * Inserts count items from a collection of items from a specified
                 index into the Deque at the specified index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {number}                                      index         The index in the Deque to insert the collection.
             * @param   {System.Collections.Generic.IEnumerable$1}    collection    The collection to add.
             * @param   {number}                                      fromIndex     The index in the collection to begin adding from.
             * @param   {number}                                      count         The number of items in the colleciton to add.
             * @return  {void}
             */
            InsertRange$1: function (index, collection, fromIndex, count) {
                var $t;
                this.CheckIndexOutOfRange(((index - 1) | 0));

                if (0 === count) {
                    return;
                }

                // Make room
                this.EnsureCapacityFor(count);

                if (index < ((Bridge.Int.div(this.Count, 2)) | 0)) {
                    // Inserting into the first half of the list

                    if (index > 0) {
                        // Move items down:
                        //  [0, index) -> 
                        //  [Capacity - count, Capacity - count + index)
                        var copyCount = index;
                        var shiftIndex = (this.Capacity - count) | 0;
                        for (var j = 0; j < copyCount; j = (j + 1) | 0) {
                            this.buffer[System.Array.index(this.ToBufferIndex(((shiftIndex + j) | 0)), this.buffer)] = this.buffer[System.Array.index(this.ToBufferIndex(j), this.buffer)];
                        }
                    }

                    // shift the starting offset
                    this.ShiftStartOffset(((-count) | 0));
                } else {
                    // Inserting into the second half of the list

                    if (index < this.Count) {
                        // Move items up:
                        // [index, Count) -> [index + count, count + Count)
                        var copyCount1 = (this.Count - index) | 0;
                        var shiftIndex1 = (index + count) | 0;
                        for (var j1 = 0; j1 < copyCount1; j1 = (j1 + 1) | 0) {
                            this.buffer[System.Array.index(this.ToBufferIndex(((shiftIndex1 + j1) | 0)), this.buffer)] = this.buffer[System.Array.index(this.ToBufferIndex(((index + j1) | 0)), this.buffer)];
                        }
                    }
                }

                // Copy new items into place
                var i = index;
                $t = Bridge.getEnumerator(collection, T);
                try {
                    while ($t.moveNext()) {
                        var item = $t.Current;
                        this.buffer[System.Array.index(this.ToBufferIndex(i), this.buffer)] = item;
                        i = (i + 1) | 0;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // Adjust valid count
                this.IncrementCount(count);
            },
            /**
             * Removes a range of elements from the view.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {number}    index    The index into the view at which the range begins.
             * @param   {number}    count    The number of elements in the range. This must be greater
                 than 0 and less than or equal to {@link }.
             * @return  {void}
             */
            RemoveRange: function (index, count) {
                if (this.IsEmpty) {
                    throw new System.InvalidOperationException.$ctor1("The Deque is empty");
                }

                if (index > ((this.Count - count) | 0)) {
                    throw new System.IndexOutOfRangeException.$ctor1("The supplied index is greater than the Count");
                }

                // Clear out the underlying array
                this.ClearBuffer(index, count);

                if (index === 0) {
                    // Removing from the beginning: shift the start offset
                    this.ShiftStartOffset(count);
                    this.Count = (this.Count - count) | 0;
                    return;
                }

                if (index === ((this.Count - count) | 0)) {
                    // Removing from the ending: trim the existing view
                    this.Count = (this.Count - count) | 0;
                    return;
                }

                if (((index + ((Bridge.Int.div(count, 2)) | 0)) | 0) < ((Bridge.Int.div(this.Count, 2)) | 0)) {
                    // Removing from first half of list

                    // Move items up:
                    //  [0, index) -> [count, count + index)
                    var copyCount = index;
                    var writeIndex = count;
                    for (var j = 0; j < copyCount; j = (j + 1) | 0) {
                        this.buffer[System.Array.index(this.ToBufferIndex(((writeIndex + j) | 0)), this.buffer)] = this.buffer[System.Array.index(this.ToBufferIndex(j), this.buffer)];
                    }

                    // Rotate to new view
                    this.ShiftStartOffset(count);
                } else {
                    // Removing from second half of list

                    // Move items down:
                    // [index + collectionCount, count) ->
                    // [index, count - collectionCount)
                    var copyCount1 = (((this.Count - count) | 0) - index) | 0;
                    var readIndex = (index + count) | 0;
                    for (var j1 = 0; j1 < copyCount1; j1 = (j1 + 1) | 0) {
                        this.buffer[System.Array.index(this.ToBufferIndex(((index + j1) | 0)), this.buffer)] = this.buffer[System.Array.index(this.ToBufferIndex(((readIndex + j1) | 0)), this.buffer)];
                    }
                }

                // Adjust valid count
                this.DecrementCount(count);
            },
            /**
             * Gets the value at the specified index of the Deque
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {number}    index    The index of the Deque.
             * @return  {T}
             */
            Get: function (index) {
                this.CheckIndexOutOfRange(index);
                return this.buffer[System.Array.index(this.ToBufferIndex(index), this.buffer)];
            },
            /**
             * Sets the value at the specified index of the
                 Deque to the given item.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {number}    index    The index of the deque to set the item.
             * @param   {T}         item     The item to set at the specified index.
             * @return  {void}
             */
            Set: function (index, item) {
                this.CheckIndexOutOfRange(index);
                this.buffer[System.Array.index(this.ToBufferIndex(index), this.buffer)] = item;
            },
            /**
             * Returns an enumerator that iterates through the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @return  {System.Collections.Generic.IEnumerator$1}        An iterator that can be used to iterate through the Deque.
             */
            GetEnumerator: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    i,
                    endIndex,
                    i1,
                    endIndex1,
                    i2,
                    $async_e;

                var $enumerator = new (Bridge.GeneratorEnumerator$1(T))(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    // The below is done for performance reasons.
                                        // Rather than doing bounds checking and modulo arithmetic
                                        // that would go along with calls to Get(index), we can skip
                                        // all of that by referencing the underlying array.

                                        if (((this.startOffset + this.Count) | 0) > this.Capacity) {
                                            $step = 1;
                                            continue;
                                        } else  {
                                            $step = 12;
                                            continue;
                                        }
                                }
                                case 1: {
                                    i = this.startOffset;
                                        $step = 2;
                                        continue;
                                }
                                case 2: {
                                    if ( i < this.Capacity ) {
                                            $step = 3;
                                            continue;
                                        }
                                    $step = 6;
                                    continue;
                                }
                                case 3: {
                                    $enumerator.current = this.buffer[System.Array.index(i, this.buffer)];
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    $step = 5;
                                    continue;
                                }
                                case 5: {
                                    i = (i + 1) | 0;
                                    $step = 2;
                                    continue;
                                }
                                case 6: {
                                    endIndex = this.ToBufferIndex(this.Count);
                                        i1 = 0;
                                        $step = 7;
                                        continue;
                                }
                                case 7: {
                                    if ( i1 < endIndex ) {
                                            $step = 8;
                                            continue;
                                        }
                                    $step = 11;
                                    continue;
                                }
                                case 8: {
                                    $enumerator.current = this.buffer[System.Array.index(i1, this.buffer)];
                                        $step = 9;
                                        return true;
                                }
                                case 9: {
                                    $step = 10;
                                    continue;
                                }
                                case 10: {
                                    i1 = (i1 + 1) | 0;
                                    $step = 7;
                                    continue;
                                }
                                case 11: {
                                    $step = 18;
                                    continue;
                                }
                                case 12: {
                                    endIndex1 = (this.startOffset + this.Count) | 0;
                                        i2 = this.startOffset;
                                        $step = 13;
                                        continue;
                                }
                                case 13: {
                                    if ( i2 < endIndex1 ) {
                                            $step = 14;
                                            continue;
                                        }
                                    $step = 17;
                                    continue;
                                }
                                case 14: {
                                    $enumerator.current = this.buffer[System.Array.index(i2, this.buffer)];
                                        $step = 15;
                                        return true;
                                }
                                case 15: {
                                    $step = 16;
                                    continue;
                                }
                                case 16: {
                                    i2 = (i2 + 1) | 0;
                                    $step = 13;
                                    continue;
                                }
                                case 17: {
                                    $step = 18;
                                    continue;
                                }
                                case 18: {

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
            },
            /**
             * Returns an enumerator that iterates through the Deque.
             *
             * @instance
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @return  {System.Collections.IEnumerator}        An iterator that can be used to iterate through the Deque.
             */
            System$Collections$IEnumerable$GetEnumerator: function () {
                return this.GetEnumerator();
            },
            IncrementCount: function (value) {
                this.Count = (this.Count + value) | 0;
            },
            DecrementCount: function (value) {
                this.Count = Math.max(((this.Count - value) | 0), 0);
            },
            /**
             * Adds an item to the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {T}       item    The object to add to the Deque.
             * @return  {void}
             */
            add: function (item) {
                this.AddBack(item);
            },
            ClearBuffer: function (logicalIndex, length) {
                var offset = this.ToBufferIndex(logicalIndex);
                if (((offset + length) | 0) > this.Capacity) {
                    var len = (this.Capacity - offset) | 0;
                    System.Array.fill(this.buffer, Bridge.getDefaultValue(T), offset, len);

                    len = this.ToBufferIndex(((logicalIndex + length) | 0));
                    System.Array.fill(this.buffer, Bridge.getDefaultValue(T), 0, len);
                } else {
                    System.Array.fill(this.buffer, Bridge.getDefaultValue(T), offset, length);
                }
            },
            /**
             * Removes all items from the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @return  {void}
             */
            clear: function () {
                if (this.Count > 0) {
                    this.ClearBuffer(0, this.Count);
                }

                this.Count = 0;
                this.startOffset = 0;
            },
            /**
             * Determines whether the Deque contains a specific value.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {T}          item    The object to locate in the Deque.
             * @return  {boolean}            true if item is found in the Deque; otherwise, false.
             */
            contains: function (item) {
                return this.indexOf(item) !== -1;
            },
            /**
             * Copies the elements of the Deque to a System.Array,
                 starting at a particular System.Array index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @throws {System.ArgumentNullException} array is null.
             * @throws {System.ArgumentOutOfRangeException} arrayIndex is less than 0.
             * @throws {System.ArgumentException} The number of elements in the source Deque is greater than
                 the available space from arrayIndex to the end of the
                 destination array.
             * @param   {Array.<T>}    array         The one-dimensional System.Array that is the destination of
                 the elements copied from the Deque. The System.Array must
                 have zero-based indexing.
             * @param   {number}       arrayIndex    The zero-based index in array at which copying begins.
             * @return  {void}
             */
            copyTo: function (array, arrayIndex) {
                if (null == array) {
                    throw new System.ArgumentNullException.$ctor3("array", "Array is null");
                }

                // Nothing to copy
                if (null == this.buffer) {
                    return;
                }

                SpineEngine.Utils.Collections.Deque$1(T).CheckArgumentsOutOfRange(array.length, arrayIndex, this.Count);

                if (0 !== this.startOffset && ((this.startOffset + this.Count) | 0) >= this.Capacity) {
                    var lengthFromStart = (this.Capacity - this.startOffset) | 0;
                    var lengthFromEnd = (this.Count - lengthFromStart) | 0;

                    System.Array.copy(this.buffer, this.startOffset, array, 0, lengthFromStart);

                    System.Array.copy(this.buffer, 0, array, lengthFromStart, lengthFromEnd);
                } else {
                    System.Array.copy(this.buffer, this.startOffset, array, 0, this.Count);
                }
            },
            /**
             * Removes the first occurrence of a specific object from the Deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {T}          item    The object to remove from the Deque.
             * @return  {boolean}            true if item was successfully removed from the Deque;
                 otherwise, false. This method also returns false if item
                 is not found in the original
             */
            remove: function (item) {
                var result = true;
                var index = this.indexOf(item);

                if (-1 === index) {
                    result = false;
                } else {
                    this.removeAt(index);
                }

                return result;
            },
            /**
             * Inserts an item to the Deque at the specified index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @throws {System.ArgumentOutOfRangeException} <b /> is not a valid index in the Deque.
             * @param   {number}    index    The zero-based index at which item should be inserted.
             * @param   {T}         item     The object to insert into the Deque.
             * @return  {void}
             */
            insert: function (index, item) {
                this.EnsureCapacityFor(1);

                if (index === 0) {
                    this.AddFront(item);
                    return;
                }

                if (index === this.Count) {
                    this.AddBack(item);
                    return;
                }

                this.InsertRange(index, System.Array.init([item], T));
            },
            /**
             * Determines the index of a specific item in the deque.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @param   {T}         item    The object to locate in the deque.
             * @return  {number}            The index of the item if found in the deque; otherwise, -1.
             */
            indexOf: function (item) {
                var $t;
                var index = 0;
                $t = Bridge.getEnumerator(this);
                try {
                    while ($t.moveNext()) {
                        var myItem = $t.Current;
                        if (Bridge.equals(myItem, item)) {
                            break;
                        }

                        index = (index + 1) | 0;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (index === this.Count) {
                    index = -1;
                }

                return index;
            },
            /**
             * Removes the item at the specified index.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.Deque$1
             * @memberof SpineEngine.Utils.Collections.Deque$1
             * @throws {System.ArgumentOutOfRangeException} <b /> is not a valid index in the Deque.
             * @param   {number}    index    The zero-based index of the item to remove.
             * @return  {void}
             */
            removeAt: function (index) {
                if (index === 0) {
                    this.RemoveFront();
                    return;
                }

                if (index === ((this.Count - 1) | 0)) {
                    this.RemoveBack();
                    return;
                }

                this.RemoveRange(index, 1);
            }
        }
    }; });

    Bridge.define("SpineEngine.Utils.Collections.FunctionComparer$1", function (T) { return {
        inherits: [System.Collections.Generic.IComparer$1(T)],
        fields: {
            comparison: null
        },
        alias: ["compare", ["System$Collections$Generic$IComparer$1$" + Bridge.getTypeAlias(T) + "$compare", "System$Collections$Generic$IComparer$1$compare"]],
        ctors: {
            ctor: function (comparison) {
                this.$initialize();
                this.comparison = comparison;
            },
            $ctor1: function (func) {
                this.$initialize();
                this.comparison = function (a, b) {
                    return ((func(a) - func(b)) | 0);
                };
            }
        },
        methods: {
            compare: function (x, y) {
                return this.comparison(x, y);
            }
        }
    }; });

    /**
     * The IPriorityQueue interface.  This is mainly here for purists, and in case I decide to add more implementations
         later.
         For speed purposes, it is actually recommended that you *don't* access the priority queue through this interface,
         since the JIT can
         (theoretically?) optimize method calls from concrete-types slightly better.
     *
     * @abstract
     * @public
     * @class SpineEngine.Utils.Collections.IPriorityQueue$1
     * @implements  System.Collections.Generic.IEnumerable$1
     */
    Bridge.definei("SpineEngine.Utils.Collections.IPriorityQueue$1", function (T) { return {
        inherits: [System.Collections.Generic.IEnumerable$1(T)],
        $kind: "interface"
    }; });

    /**
     * simple static class that can be used to pool any object
     *
     * @static
     * @abstract
     * @public
     * @class SpineEngine.Utils.Collections.Pool$1
     */
    Bridge.define("SpineEngine.Utils.Collections.Pool$1", function (T) { return {
        statics: {
            fields: {
                objectQueue: null
            },
            ctors: {
                init: function () {
                    this.objectQueue = new (System.Collections.Generic.Queue$1(T)).$ctor2(10);
                }
            },
            methods: {
                /**
                 * warms up the cache filling it with a max of cacheCount objects
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.Collections.Pool$1
                 * @memberof SpineEngine.Utils.Collections.Pool$1
                 * @param   {number}    cacheCount    new cache count
                 * @return  {void}
                 */
                WarmCache: function (cacheCount) {
                    cacheCount = (cacheCount - SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Count) | 0;
                    if (cacheCount > 0) {
                        for (var i = 0; i < cacheCount; i = (i + 1) | 0) {
                            SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Enqueue(Bridge.createInstance(T));
                        }
                    }
                },
                /**
                 * trims the cache down to cacheCount items
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.Collections.Pool$1
                 * @memberof SpineEngine.Utils.Collections.Pool$1
                 * @param   {number}    cacheCount    Cache count.
                 * @return  {void}
                 */
                TrimCache: function (cacheCount) {
                    while (cacheCount > SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Count) {
                        SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Dequeue();
                    }
                },
                /**
                 * clears out the cache
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.Collections.Pool$1
                 * @memberof SpineEngine.Utils.Collections.Pool$1
                 * @return  {void}
                 */
                ClearCache: function () {
                    SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Clear();
                },
                /**
                 * pops an item off the stack if available creating a new item as necessary
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.Collections.Pool$1
                 * @memberof SpineEngine.Utils.Collections.Pool$1
                 * @return  {T}
                 */
                Obtain: function () {
                    if (SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Count > 0) {
                        return SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Dequeue();
                    }

                    return Bridge.createInstance(T);
                },
                /**
                 * pushes an item back on the stack
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Utils.Collections.Pool$1
                 * @memberof SpineEngine.Utils.Collections.Pool$1
                 * @param   {T}       obj    Object.
                 * @return  {void}
                 */
                Free: function (obj) {
                    var $t;
                    SpineEngine.Utils.Collections.Pool$1(T).objectQueue.Enqueue(obj);

                    ($t = (Bridge.as(obj, SpineEngine.Utils.Collections.IPoolable))) != null ? $t.SpineEngine$Utils$Collections$IPoolable$Reset() : null;
                }
            }
        }
    }; });

    Bridge.define("SpineEngine.Utils.Collections.PriorityQueueNode", {
        props: {
            /**
             * The Priority to insert this node at.  Must be set BEFORE adding a node to the queue
             *
             * @instance
             * @public
             * @memberof SpineEngine.Utils.Collections.PriorityQueueNode
             * @function Priority
             * @type number
             */
            Priority: 0,
            /**
             * <b>Used by the priority queue - do not edit this value.</b>
                 Represents the order the node was inserted in
             *
             * @instance
             * @public
             * @memberof SpineEngine.Utils.Collections.PriorityQueueNode
             * @function InsertionIndex
             * @type System.Int64
             */
            InsertionIndex: System.Int64(0),
            /**
             * <b>Used by the priority queue - do not edit this value.</b>
                 Represents the current position in the queue
             *
             * @instance
             * @public
             * @memberof SpineEngine.Utils.Collections.PriorityQueueNode
             * @function QueueIndex
             * @type number
             */
            QueueIndex: 0
        }
    });

    Bridge.define("SpineEngine.XnaManagers.GlobalContentManager", {
        inherits: [Microsoft.Xna.Framework.Content.ContentManager],
        fields: {
            PostLoadActions: null
        },
        ctors: {
            init: function () {
                this.PostLoadActions = new (System.Collections.Generic.List$1(SpineEngine.XnaManagers.IPostLoadAction)).ctor();
            },
            ctor: function () {
                this.$initialize();
                Microsoft.Xna.Framework.Content.ContentManager.$ctor1.call(this, SpineEngine.Core.Instance.Services, SpineEngine.Core.Instance.Content.RootDirectory);
            }
        },
        methods: {
            Load: function (T, assetName) {
                var $t;
                var result = Microsoft.Xna.Framework.Content.ContentManager.prototype.Load.call(this, System.Object, assetName);
                if (result == null) {
                    return Bridge.getDefaultValue(T);
                }

                $t = Bridge.getEnumerator(this.PostLoadActions);
                try {
                    while ($t.moveNext()) {
                        var action = $t.Current;
                        if (Bridge.Reflection.isAssignableFrom(action.SpineEngine$XnaManagers$IPostLoadAction$ActionType, T)) {
                            action.SpineEngine$XnaManagers$IPostLoadAction$Apply(result, this);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (Bridge.referenceEquals(T, Bridge.getType(result))) {
                    return Bridge.cast(Bridge.unbox(result, T), T);
                }

                // If it is not the exact type we are looking for.
                // Try to create a wrapper of a type with this class in constructor parameters.
                // See NoiseEffect (or any other effect for example).
                result = Bridge.cast(Bridge.unbox(Bridge.createInstance(T, [result]), T), T);
                this.LoadedAssets.set(assetName, result);
                return Bridge.cast(Bridge.unbox(result, T), T);
            }
        }
    });

    Bridge.define("SpineEngine.XnaManagers.GlobalGraphicsDeviceManager", {
        inherits: [Microsoft.Xna.Framework.GraphicsDeviceManager],
        props: {
            Bounds: {
                get: function () {
                    return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, this.Width, this.Height);
                },
                set: function (value) {
                    this.Width = value.Width;
                    this.Height = value.Height;
                }
            },
            Width: {
                get: function () {
                    return this.GraphicsDevice.PresentationParameters.BackBufferWidth;
                },
                set: function (value) {
                    this.GraphicsDevice.PresentationParameters.BackBufferWidth = value;
                }
            },
            Height: {
                get: function () {
                    return this.GraphicsDevice.PresentationParameters.BackBufferHeight;
                },
                set: function (value) {
                    this.GraphicsDevice.PresentationParameters.BackBufferHeight = value;
                }
            },
            Center: {
                get: function () {
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(this.Width / 2.0, this.Height / 2.0);
                }
            },
            MonitorWidth: {
                get: function () {
                    return Microsoft.Xna.Framework.Graphics.GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width;
                }
            },
            MonitorHeight: {
                get: function () {
                    return Microsoft.Xna.Framework.Graphics.GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height;
                }
            },
            BackBufferFormat: {
                get: function () {
                    return this.GraphicsDevice.PresentationParameters.BackBufferFormat;
                }
            }
        },
        ctors: {
            ctor: function (game) {
                this.$initialize();
                Microsoft.Xna.Framework.GraphicsDeviceManager.ctor.call(this, game);
            }
        },
        methods: {
            SetSize: function (width, height) {
                this.PreferredBackBufferWidth = width;
                this.PreferredBackBufferHeight = height;
                this.ApplyChanges();
            }
        }
    });

    Bridge.define("SpineEngine.XnaManagers.IPostLoadAction", {
        $kind: "interface"
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.InputGamePadUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem,SpineEngine.ECS.IScreenResolutionChangedListener],
        props: {
            ResolutionOffset: null,
            ResolutionScale: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.ResolutionOffset = new Microsoft.Xna.Framework.Point();
                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputGamePadComponent]));
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                var scaleX = sceneRenderTarget.Width / realRenderTarget.Width;
                var scaleY = sceneRenderTarget.Height / realRenderTarget.Height;

                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2.$ctor2(scaleX, scaleY);
                this.ResolutionOffset = realRenderTarget.Location.$clone();

                Microsoft.Xna.Framework.Input.Touch.TouchPanel.DisplayWidth = SpineEngine.Core.Instance.GraphicsDevice.Viewport.Width;
                Microsoft.Xna.Framework.Input.Touch.TouchPanel.DisplayHeight = SpineEngine.Core.Instance.GraphicsDevice.Viewport.Height;
                Microsoft.Xna.Framework.Input.Touch.TouchPanel.DisplayOrientation = SpineEngine.Core.Instance.GraphicsDevice.PresentationParameters.DisplayOrientation;
            },
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var gamePad = entity.GetComponent(SpineEngine.ECS.Components.InputGamePadComponent);

                gamePad.PreviousState = gamePad.CurrentState.$clone();
                gamePad.CurrentState = Microsoft.Xna.Framework.Input.GamePad.GetState(gamePad.PlayerIndex);

                // check for controller connects/disconnects
                gamePad.ThisTickConnected = !gamePad.PreviousState.IsConnected && gamePad.CurrentState.IsConnected;
                gamePad.ThisTickDisconnected = gamePad.PreviousState.IsConnected && !gamePad.CurrentState.IsConnected;

                if (gamePad.RumbleTime > 0.0) {
                    gamePad.RumbleTime -= gameTime.getTotalSeconds();
                    if (gamePad.RumbleTime <= 0.0) {
                        Microsoft.Xna.Framework.Input.GamePad.SetVibration(gamePad.PlayerIndex, 0, 0);
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.InputMouseUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem,SpineEngine.ECS.IScreenResolutionChangedListener],
        props: {
            ResolutionOffset: null,
            ResolutionScale: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.ResolutionOffset = new Microsoft.Xna.Framework.Point();
                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputMouseComponent]));
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                var scaleX = sceneRenderTarget.Width / realRenderTarget.Width;
                var scaleY = sceneRenderTarget.Height / realRenderTarget.Height;

                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2.$ctor2(scaleX, scaleY);
                this.ResolutionOffset = realRenderTarget.Location.$clone();
            },
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var mouse = entity.GetComponent(SpineEngine.ECS.Components.InputMouseComponent);

                mouse.ResolutionScale = this.ResolutionScale.$clone();
                mouse.ResolutionOffset = this.ResolutionOffset.$clone();

                mouse.PreviousMouseState = mouse.CurrentMouseState.$clone();
                mouse.CurrentMouseState = Microsoft.Xna.Framework.Input.Mouse.GetState();
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.InputTouchUpdateSystem", {
        inherits: [LocomotorECS.EntityProcessingSystem,SpineEngine.ECS.IScreenResolutionChangedListener],
        props: {
            ResolutionOffset: null,
            ResolutionScale: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.ResolutionOffset = new Microsoft.Xna.Framework.Point();
                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2();
            },
            ctor: function () {
                this.$initialize();
                LocomotorECS.EntityProcessingSystem.ctor.call(this, new LocomotorECS.Matching.Matcher().All([SpineEngine.ECS.Components.InputTouchComponent]));
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                var scaleX = sceneRenderTarget.Width / realRenderTarget.Width;
                var scaleY = sceneRenderTarget.Height / realRenderTarget.Height;

                this.ResolutionScale = new Microsoft.Xna.Framework.Vector2.$ctor2(scaleX, scaleY);
                this.ResolutionOffset = realRenderTarget.Location.$clone();

                Microsoft.Xna.Framework.Input.Touch.TouchPanel.DisplayWidth = SpineEngine.Core.Instance.GraphicsDevice.Viewport.Width;
                Microsoft.Xna.Framework.Input.Touch.TouchPanel.DisplayHeight = SpineEngine.Core.Instance.GraphicsDevice.Viewport.Height;
                Microsoft.Xna.Framework.Input.Touch.TouchPanel.DisplayOrientation = SpineEngine.Core.Instance.GraphicsDevice.PresentationParameters.DisplayOrientation;
            },
            DoAction$1: function (entity, gameTime) {
                LocomotorECS.EntityProcessingSystem.prototype.DoAction$1.call(this, entity, gameTime);

                var touch = entity.GetComponent(SpineEngine.ECS.Components.InputTouchComponent);

                touch.IsConnected = Microsoft.Xna.Framework.Input.Touch.TouchPanel.GetCapabilities().IsConnected;

                touch.ResolutionScale = this.ResolutionScale.$clone();
                touch.ResolutionOffset = this.ResolutionOffset.$clone();

                touch.PreviousTouches = touch.CurrentTouches;
                touch.CurrentTouches = Microsoft.Xna.Framework.Input.Touch.TouchPanel.GetState();

                touch.PreviousGestures = touch.CurrentGestures;
                touch.CurrentGestures.clear();
                while (Microsoft.Xna.Framework.Input.Touch.TouchPanel.IsGestureAvailable) {
                    touch.CurrentGestures.add(Microsoft.Xna.Framework.Input.Touch.TouchPanel.ReadGesture());
                }
            }
        }
    });

    /**
     * A virtual input represented as a float between -1 and 1
     *
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis
     * @augments SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput],
        props: {
            Value: 0
        },
        ctors: {
            ctor: function (overlap) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.ctor.call(this, overlap);
            },
            $ctor1: function (overlap, nodes) {
                if (nodes === void 0) { nodes = []; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.ctor.call(this, overlap);
                this.Nodes.AddRange(nodes);
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.prototype.Update.call(this, inputKeyboard, inputMouse, inputTouch, inputGamePad);

                var thisTickValue = 0.0;
                for (var i = 0; i < this.Nodes.Count; i = (i + 1) | 0) {
                    var val = Bridge.cast(this.Nodes.getItem(i), SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node).Value;

                    if (val == null) {
                        thisTickValue = this.CheckOverlap(this.Value);
                        break;
                    }

                    if (System.Nullable.eq(val, 0)) {
                        continue;
                    }

                    var newResult = Bridge.Int.sign(System.Nullable.getValue(val));
                    var oldResult = Bridge.Int.sign(thisTickValue);

                    if (oldResult === newResult) {
                        continue;
                    }

                    if (thisTickValue === 0) {
                        thisTickValue = newResult;
                        continue;
                    }

                    thisTickValue = this.CheckOverlap(this.Value);
                    break;
                }

                this.Value = thisTickValue;
            },
            CheckOverlap: function (value) {
                switch (this.Overlap) {
                    case SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior.CancelOut: 
                        {
                            return 0;
                        }
                    case SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior.TakeNewer: 
                        {
                            return -value;
                        }
                    case SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior.TakeOlder: 
                        {
                            return value;
                        }
                    default: 
                        {
                            throw new System.IndexOutOfRangeException.ctor();
                        }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInputNode],
        $kind: "nested class",
        props: {
            Value: null
        },
        methods: {
            SetValue: function (left, right) {
                if (right) {
                    if (left) {
                        this.Value = null;
                    } else {
                        this.Value = 1;
                    }
                } else if (left) {
                    this.Value = -1;
                } else {
                    this.Value = 0;
                }
            }
        }
    });

    /**
     * A virtual input that is represented as a boolean. As well as simply checking the current button state, you can ask
         whether
         it was just pressed or released this frame.
     *
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton
     * @augments SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput],
        props: {
            IsDown: false,
            IsPressed: false,
            IsReleased: false
        },
        ctors: {
            ctor: function (overlapBehavior) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.ctor.call(this, overlapBehavior);
            },
            $ctor1: function (overlapBehavior, nodes) {
                if (nodes === void 0) { nodes = []; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.ctor.call(this, overlapBehavior);
                this.Nodes.AddRange(nodes);
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                var $t;
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.prototype.Update.call(this, inputKeyboard, inputMouse, inputTouch, inputGamePad);

                var downLastFrame = this.IsDown;
                this.IsDown = false;
                $t = Bridge.getEnumerator(this.Nodes);
                try {
                    while ($t.moveNext()) {
                        var node = $t.Current;
                        if (Bridge.cast(node, SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node).IsDown) {
                            this.IsDown = true;
                            break;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                this.IsPressed = !downLastFrame && this.IsDown;
                this.IsReleased = downLastFrame && !this.IsDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInputNode],
        $kind: "nested class",
        props: {
            IsDown: false
        }
    });

    /**
     * A virtual input that is represented as a Vector2, with both X and Y as values between -1 and 1
     *
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick
     * @augments SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput],
        fields: {
            Normalized: false
        },
        props: {
            Value: null
        },
        ctors: {
            init: function () {
                this.Value = new Microsoft.Xna.Framework.Vector2();
            },
            ctor: function (overlapBehavior, normalized) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.ctor.call(this, overlapBehavior);
                this.Normalized = normalized;
            },
            $ctor1: function (overlapBehavior, normalized, nodes) {
                if (nodes === void 0) { nodes = []; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.ctor.call(this, overlapBehavior);
                this.Normalized = normalized;
                this.Nodes.AddRange(nodes);
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.prototype.Update.call(this, inputKeyboard, inputMouse, inputTouch, inputGamePad);

                var thisTickValueX = 0.0;
                for (var i = 0; i < this.Nodes.Count; i = (i + 1) | 0) {
                    var val = Bridge.cast(this.Nodes.getItem(i), SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node).ValueX;

                    if (val == null) {
                        thisTickValueX = this.CheckOverlap(this.Value.X);
                        break;
                    }

                    if (System.Nullable.eq(val, 0)) {
                        continue;
                    }

                    var newResult = Bridge.Int.sign(System.Nullable.getValue(val));
                    var oldResult = Bridge.Int.sign(thisTickValueX);

                    if (oldResult === newResult) {
                        continue;
                    }

                    if (thisTickValueX === 0) {
                        thisTickValueX = newResult;
                        continue;
                    }

                    thisTickValueX = this.CheckOverlap(this.Value.X);
                    break;
                }

                var thisTickValueY = 0.0;
                for (var i1 = 0; i1 < this.Nodes.Count; i1 = (i1 + 1) | 0) {
                    var val1 = Bridge.cast(this.Nodes.getItem(i1), SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node).ValueY;

                    if (val1 == null) {
                        thisTickValueY = this.CheckOverlap(this.Value.Y);
                        break;
                    }

                    if (System.Nullable.eq(val1, 0)) {
                        continue;
                    }

                    var newResult1 = Bridge.Int.sign(System.Nullable.getValue(val1));
                    var oldResult1 = Bridge.Int.sign(thisTickValueY);

                    if (oldResult1 === newResult1) {
                        continue;
                    }

                    if (thisTickValueY === 0) {
                        thisTickValueY = newResult1;
                        continue;
                    }

                    thisTickValueY = this.CheckOverlap(this.Value.Y);
                    break;
                }

                this.Value = new Microsoft.Xna.Framework.Vector2.$ctor2(thisTickValueX, thisTickValueY);
                if (this.Normalized) {
                    this.Value.Normalize();
                }
            },
            CheckOverlap: function (value) {
                switch (this.Overlap) {
                    case SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior.CancelOut: 
                        {
                            return 0;
                        }
                    case SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior.TakeNewer: 
                        {
                            return -value;
                        }
                    case SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInput.OverlapBehavior.TakeOlder: 
                        {
                            return value;
                        }
                    default: 
                        {
                            throw new System.IndexOutOfRangeException.ctor();
                        }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualInputNode],
        $kind: "nested class",
        props: {
            ValueX: null,
            ValueY: null
        },
        methods: {
            SetValue: function (up, down, left, right) {
                if (down) {
                    if (up) {
                        this.ValueY = null;
                    } else {
                        this.ValueY = 1;
                    }
                } else if (up) {
                    this.ValueY = -1;
                } else {
                    this.ValueY = 0;
                }

                if (right) {
                    if (left) {
                        this.ValueX = null;
                    } else {
                        this.ValueX = 1;
                    }
                } else if (left) {
                    this.ValueX = -1;
                } else {
                    this.ValueX = 0;
                }
            }
        }
    });

    /** @namespace SpineEngine.GlobalManagers.Coroutines */

    /**
     * class used by the CoroutineManager to hide the data it requires for a Coroutine
     *
     * @public
     * @class SpineEngine.GlobalManagers.Coroutines.Coroutine
     * @implements  SpineEngine.Utils.Collections.IPoolable
     */
    Bridge.define("SpineEngine.GlobalManagers.Coroutines.Coroutine", {
        inherits: [SpineEngine.Utils.Collections.IPoolable],
        fields: {
            Enumerator: null,
            IsDone: false,
            WaitForCoroutine: null
        },
        methods: {
            SpineEngine$Utils$Collections$IPoolable$Reset: function () {
                this.IsDone = true;
                this.WaitForCoroutine = null;
                this.Enumerator = null;
            },
            Stop: function () {
                this.IsDone = true;
            }
        }
    });

    /**
     * basic CoroutineManager. Coroutines can do the following:
         - yield return null (tick again the next frame)
         - yield return DefaultCoroutines.Wait( 5.5f ) (tick again after a 5.5 second delay)
         - yield return StartCoroutine( DefaultCoroutines.Wait( 5.5f ) ) (wait for the other coroutine before getting ticked
         again)
         - yield return StartCoroutine( Another() ) (wait for the other coroutine before getting ticked again)
         - yield return Another() (wait for the other IEnumerable coroutine before getting ticked again)
     *
     * @public
     * @class SpineEngine.GlobalManagers.Coroutines.CoroutineGlobalManager
     * @augments SpineEngine.GlobalManagers.GlobalManager
     */
    Bridge.define("SpineEngine.GlobalManagers.Coroutines.CoroutineGlobalManager", {
        inherits: [SpineEngine.GlobalManagers.GlobalManager],
        fields: {
            nextFrameCoroutines: null
        },
        ctors: {
            init: function () {
                this.nextFrameCoroutines = new (System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Coroutines.Coroutine)).ctor();
            }
        },
        methods: {
            StartCoroutine: function (enumerator) {
                enumerator = enumerator || SpineEngine.GlobalManagers.Coroutines.DefaultCoroutines.Empty();

                // find or create a Coroutine
                var coroutine = SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Coroutines.Coroutine).Obtain();

                // setup the coroutine and add it
                coroutine.Enumerator = enumerator;
                coroutine.IsDone = false;
                coroutine.WaitForCoroutine = null;

                // guard against empty coroutines
                if (!this.TickCoroutine(coroutine)) {
                    return null;
                }

                this.nextFrameCoroutines.add(coroutine);

                return coroutine;
            },
            Update: function (gameTime) {
                var $t;
                var unblockedCoroutines = SpineEngine.Utils.Collections.Pool$1(System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Coroutines.Coroutine)).Obtain();
                unblockedCoroutines.clear();
                unblockedCoroutines.AddRange(this.nextFrameCoroutines);
                this.nextFrameCoroutines.clear();

                $t = Bridge.getEnumerator(unblockedCoroutines);
                try {
                    while ($t.moveNext()) {
                        var coroutine = $t.Current;
                        // check for stopped coroutines
                        if (coroutine.IsDone) {
                            SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Coroutines.Coroutine).Free(coroutine);
                            continue;
                        }

                        // are we waiting for any other coroutines to finish?
                        if (coroutine.WaitForCoroutine != null) {
                            if (coroutine.WaitForCoroutine.IsDone) {
                                coroutine.WaitForCoroutine = null;
                            } else {
                                this.nextFrameCoroutines.add(coroutine);
                                continue;
                            }
                        }

                        if (!this.TickCoroutine(coroutine)) {
                            SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Coroutines.Coroutine).Free(coroutine);
                            continue;
                        }

                        this.nextFrameCoroutines.add(coroutine);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                unblockedCoroutines.clear();
                SpineEngine.Utils.Collections.Pool$1(System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Coroutines.Coroutine)).Free(unblockedCoroutines);
            },
            TickCoroutine: function (coroutine) {
                if (!coroutine.Enumerator.System$Collections$IEnumerator$moveNext() || coroutine.IsDone) {
                    return false;
                }

                if (coroutine.Enumerator.System$Collections$IEnumerator$Current == null) {
                    return true;
                }
                var current;
                if (((current = Bridge.as(coroutine.Enumerator.System$Collections$IEnumerator$Current, SpineEngine.GlobalManagers.Coroutines.Coroutine))) != null) {
                    coroutine.WaitForCoroutine = current;
                    return true;
                }
                var enumerator;
                if (((enumerator = Bridge.as(coroutine.Enumerator.System$Collections$IEnumerator$Current, System.Collections.IEnumerator))) != null) {
                    coroutine.WaitForCoroutine = this.StartCoroutine(enumerator);
                    return true;
                }

                return true;
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Timers.TimerGlobalManager", {
        inherits: [SpineEngine.GlobalManagers.GlobalManager],
        fields: {
            timers: null
        },
        ctors: {
            init: function () {
                this.timers = new (System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Timers.Timer)).ctor();
            }
        },
        methods: {
            Update: function (gameTime) {
                for (var i = (this.timers.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    // tick our timer. if it returns true it is done so we remove it
                    var timer = this.timers.getItem(i);
                    if (timer.Tick(gameTime)) {
                        timer.Unload();
                        this.timers.removeAt(i);
                        SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Timers.Timer).Free(timer);
                    }
                }
            },
            /**
             * schedules a one-time or repeating timer that will call the passed in Action
             *
             * @instance
             * @this SpineEngine.GlobalManagers.Timers.TimerGlobalManager
             * @memberof SpineEngine.GlobalManagers.Timers.TimerGlobalManager
             * @param   {number}                                     timeInSeconds    Time in seconds.
             * @param   {boolean}                                    repeats          If set to <pre><code>true</code></pre> repeats.
             * @param   {System.Action}                              onTime           On time.
             * @return  {SpineEngine.GlobalManagers.Timers.Timer}
             */
            Schedule: function (timeInSeconds, repeats, onTime) {
                var timer = SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Timers.Timer).Obtain();
                timer.Initialize(timeInSeconds, repeats, onTime);
                this.timers.add(timer);

                return timer;
            }
        }
    });

    /**
     * a series of strongly typed, chainable methods to setup various tween properties
     *
     * @abstract
     * @public
     * @class SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1
     * @implements  SpineEngine.GlobalManagers.Tweens.Interfaces.ITween
     */
    Bridge.definei("SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1", function (T) { return {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITween],
        $kind: "interface"
    }; });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenGlobalManager", {
        inherits: [SpineEngine.GlobalManagers.GlobalManager],
        statics: {
            fields: {
                DefaultEaseType: 0,
                /**
                 * if true, the active tween list will be cleared when a new level loads
                 *
                 * @static
                 * @public
                 * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
                 * @default false
                 * @type boolean
                 */
                RemoveAllTweensOnLevelLoad: false
            },
            ctors: {
                init: function () {
                    this.DefaultEaseType = SpineEngine.Maths.Easing.EaseType.QuartIn;
                    this.RemoveAllTweensOnLevelLoad = false;
                }
            }
        },
        fields: {
            /**
             * internal list of all the currently active tweens
             *
             * @instance
             * @private
             * @readonly
             * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @type System.Collections.Generic.List$1
             */
            activeTweens: null
        },
        ctors: {
            init: function () {
                this.activeTweens = new (System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Tweens.Tweenable)).ctor();
            }
        },
        methods: {
            Update: function (gameTime) {
                var list = SpineEngine.Utils.Collections.Pool$1(System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Tweens.Tweenable)).Obtain();
                list.clear();
                list.AddRange(this.activeTweens);

                // loop backwards so we can remove completed tweens
                for (var i = (list.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    var tweenable = list.getItem(i);
                    if (tweenable.Tick(gameTime)) {
                        this.RemoveTween(tweenable.CurrentTween);
                    }
                }

                list.clear();
                SpineEngine.Utils.Collections.Pool$1(System.Collections.Generic.List$1(SpineEngine.GlobalManagers.Tweens.Tweenable)).Free(list);
            },
            /**
             * adds a tween to the active tweens list
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @param   {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween}    tween    Tween.
             * @return  {void}
             */
            AddTween: function (tween) {
                var tweenable = SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Tweens.Tweenable).Obtain();
                tweenable.Initialize(this, tween);
                this.activeTweens.add(tweenable);
            },
            /**
             * removes a tween from the active tweens list
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @param   {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween}    tween
             * @return  {void}
             */
            RemoveTween: function (tween) {
                var tweenable = System.Linq.Enumerable.from(this.activeTweens).firstOrDefault(function (a) {
                        return Bridge.referenceEquals(a.CurrentTween, tween);
                    }, null);
                if (tweenable == null) {
                    return;
                }

                tweenable.RecycleSelf();
                this.activeTweens.remove(tweenable);
                SpineEngine.Utils.Collections.Pool$1(SpineEngine.GlobalManagers.Tweens.Tweenable).Free(tweenable);
            },
            /**
             * stops all tweens optionlly bringing them all to completion
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @param   {boolean}    bringToCompletion
             * @return  {void}
             */
            StopAllTweens: function (bringToCompletion) {
                if (bringToCompletion === void 0) { bringToCompletion = false; }
                for (var i = (this.activeTweens.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    this.activeTweens.getItem(i).Stop(bringToCompletion);
                }
            },
            /**
             * stops tween optionlly bringing it to completion
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @param   {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween}    tween                
             * @param   {boolean}                                                bringToCompletion
             * @return  {void}
             */
            StopTween: function (tween, bringToCompletion) {
                if (bringToCompletion === void 0) { bringToCompletion = false; }
                var tweenable = System.Linq.Enumerable.from(this.activeTweens).firstOrDefault(function (a) {
                        return Bridge.referenceEquals(a.CurrentTween, tween);
                    }, null);
                tweenable != null ? tweenable.Stop(bringToCompletion) : null;
            },
            /**
             * starts tween
             *
             * @instance
             * @public
             * @this SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @memberof SpineEngine.GlobalManagers.Tweens.TweenGlobalManager
             * @param   {SpineEngine.GlobalManagers.Tweens.Interfaces.ITween}    tween
             * @return  {void}
             */
            StartTween: function (tween) {
                var tweenable = System.Linq.Enumerable.from(this.activeTweens).firstOrDefault(function (a) {
                        return Bridge.referenceEquals(a.CurrentTween, tween);
                    }, null);
                if (tweenable == null) {
                    this.AddTween(tween);
                }

                tweenable = System.Linq.Enumerable.from(this.activeTweens).first(function (a) {
                        return Bridge.referenceEquals(a.CurrentTween, tween);
                    });
                tweenable.Start();
            },
            IsTweenCompleted: function (tween) {
                var tweenable = System.Linq.Enumerable.from(this.activeTweens).firstOrDefault(function (a) {
                        return Bridge.referenceEquals(a.CurrentTween, tween);
                    }, null);
                if (tweenable == null) {
                    return true;
                }

                return tweenable.IsCompleted();
            }
        }
    });

    /** @namespace SpineEngine.GlobalManagers.Tweens.TweenTargets */

    /**
     * generic ITweenTarget used for all property tweens
     *
     * @class SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1
     * @implements  SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1
     */
    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenTargets.PropertyTweenTarget$1", function (T) { return {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1(T)],
        fields: {
            fieldInfo: null,
            getter: null,
            setter: null
        },
        props: {
            TweenedValue: {
                get: function () {
                    if (this.fieldInfo != null) {
                        return System.Nullable.getValue(Bridge.cast(Bridge.unbox(Bridge.Reflection.fieldAccess(this.fieldInfo, Bridge.unbox(this.Target)), T), T));
                    }
                    return this.getter();
                },
                set: function (value) {
                    if (this.fieldInfo != null) {
                        Bridge.Reflection.fieldAccess(this.fieldInfo, Bridge.unbox(this.Target), value);
                    } else {
                        this.setter(value);
                    }
                }
            },
            Target: null
        },
        alias: [
            "TweenedValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$" + Bridge.getTypeAlias(T) + "$TweenedValue",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$" + Bridge.getTypeAlias(T) + "$Target"
        ],
        ctors: {
            ctor: function (target, propertyName) {
                this.$initialize();
                this.Target = target;

                // try to fetch the field. if we don't find it this is a property
                if (((this.fieldInfo = SpineEngine.Utils.BuildTargetUtils.GetFieldInfo(target, propertyName))) == null) {
                    this.setter = SpineEngine.Utils.BuildTargetUtils.SetterForProperty(Function, target, propertyName);
                    this.getter = SpineEngine.Utils.BuildTargetUtils.GetterForProperty(Function, target, propertyName);
                }

            }
        }
    }; });

    Bridge.define("SpineEngine.Graphics.Cameras.ScreenSpaceCamera", {
        inherits: [SpineEngine.Graphics.Cameras.Camera],
        methods: {
            /**
             * we are screen space, so our matrix should always be identity
             *
             * @instance
             * @protected
             * @override
             * @this SpineEngine.Graphics.Cameras.ScreenSpaceCamera
             * @memberof SpineEngine.Graphics.Cameras.ScreenSpaceCamera
             * @return  {void}
             */
            UpdateMatrices: function () { }
        }
    });

    Bridge.define("SpineEngine.Graphics.Drawable.SubtextureDrawable", {
        inherits: [SpineEngine.Graphics.Drawable.IDrawable],
        statics: {
            methods: {
                SubtexturesFromAtlas: function (texture, cellWidth, cellHeight, cellOffset, maxCellsToInclude) {
                    if (cellOffset === void 0) { cellOffset = 0; }
                    if (maxCellsToInclude === void 0) { maxCellsToInclude = 2147483647; }
                    var subtextures = new (System.Collections.Generic.List$1(SpineEngine.Graphics.Drawable.SubtextureDrawable)).ctor();

                    var cols = (Bridge.Int.div(texture.Width, cellWidth)) | 0;
                    var rows = (Bridge.Int.div(texture.Height, cellHeight)) | 0;
                    var i = 0;

                    for (var y = 0; y < rows; y = (y + 1) | 0) {
                        for (var x = 0; x < cols; x = (x + 1) | 0) {
                            // skip everything before the first cellOffset
                            if (Bridge.identity(i, (i = (i + 1) | 0)) < cellOffset) {
                                continue;
                            }

                            subtextures.add(new SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor1(texture, new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.mul(x, cellWidth), Bridge.Int.mul(y, cellHeight), cellWidth, cellHeight)));

                            // once we hit the max number of cells to include bail out. were done.
                            if (subtextures.Count === maxCellsToInclude) {
                                break;
                            }
                        }
                    }

                    return subtextures;
                }
            }
        },
        fields: {
            renderTexture: null,
            texture: null,
            sourceRect: null,
            Origin: null
        },
        props: {
            Texture2D: {
                get: function () {
                    return SpineEngine.Graphics.RenderTexture.op_Implicit(this.renderTexture) || this.texture;
                }
            },
            SourceRect: {
                get: function () {
                    var $t;
                    return ($t = System.Nullable.lift1("$clone", this.sourceRect), $t != null ? $t : this.Texture2D.Bounds);
                }
            },
            Bounds: {
                get: function () {
                    return SpineEngine.Maths.RectangleF.op_Implicit$1(this.SourceRect.$clone());
                }
            }
        },
        alias: [
            "Bounds", "SpineEngine$Graphics$Drawable$IDrawable$Bounds",
            "DrawInto", "SpineEngine$Graphics$Drawable$IDrawable$DrawInto",
            "DrawInto$1", "SpineEngine$Graphics$Drawable$IDrawable$DrawInto$1"
        ],
        ctors: {
            $ctor3: function (texture, sourceRect, origin) {
                this.$initialize();
                this.texture = texture;
                this.sourceRect = System.Nullable.lift1("$clone", sourceRect);
                this.Origin = System.Nullable.lift1("$clone", origin);
            },
            $ctor1: function (texture, sourceRect) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor3.call(this, texture, sourceRect, null);
            },
            ctor: function (texture) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor3.call(this, texture, null, null);
            },
            $ctor2: function (texture, x, y, width, height) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor1.call(this, texture, new Microsoft.Xna.Framework.Rectangle.$ctor2(x, y, width, height));
            },
            $ctor4: function (texture, x, y, width, height) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor2.call(this, texture, Bridge.Int.clip32(x), Bridge.Int.clip32(y), Bridge.Int.clip32(width), Bridge.Int.clip32(height));
            },
            $ctor8: function (texture, sourceRect, origin) {
                this.$initialize();
                this.renderTexture = texture;
                this.sourceRect = System.Nullable.lift1("$clone", sourceRect);
                this.Origin = System.Nullable.lift1("$clone", origin);
            },
            $ctor5: function (texture) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor8.call(this, texture, null, null);
            },
            $ctor6: function (texture, sourceRect) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor8.call(this, texture, sourceRect, null);
            },
            $ctor7: function (texture, x, y, width, height) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor6.call(this, texture, new Microsoft.Xna.Framework.Rectangle.$ctor2(x, y, width, height));
            },
            $ctor9: function (texture, x, y, width, height) {
                SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor7.call(this, texture, Bridge.Int.clip32(x), Bridge.Int.clip32(y), Bridge.Int.clip32(width), Bridge.Int.clip32(height));
            }
        },
        methods: {
            DrawInto: function (color, depth, target) {
                this.DrawInto$1(this.SourceRect.Width, this.SourceRect.Height, color.$clone(), depth, target);
            },
            DrawInto$1: function (width, height, color, depth, target) {
                var $t, $t1;
                var source = this.SourceRect.$clone();
                var destination = new SpineEngine.Maths.RectangleF.$ctor2(-(($t = (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.Origin), null) ? System.Nullable.getValue(System.Nullable.lift1("$clone", this.Origin)).X : null), $t != null ? $t : this.SourceRect.Width / 2.0)), -(($t1 = (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.Origin), null) ? System.Nullable.getValue(System.Nullable.lift1("$clone", this.Origin)).Y : null), $t1 != null ? $t1 : this.SourceRect.Height / 2.0)), width, height);
                target.Draw(this.Texture2D, destination.$clone(), SpineEngine.Maths.RectangleF.op_Implicit$1(source.$clone()), color.$clone(), depth);
            },
            toString: function () {
                return System.String.format("{0}", [this.SourceRect.$clone()]);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Drawable.PrimitiveDrawable", {
        inherits: [SpineEngine.Graphics.Drawable.IDrawable],
        fields: {
            Color: null
        },
        props: {
            Origin: null,
            Bounds: {
                get: function () {
                    return new SpineEngine.Maths.RectangleF.$ctor2(0, 0, 1, 1);
                }
            }
        },
        alias: [
            "Bounds", "SpineEngine$Graphics$Drawable$IDrawable$Bounds",
            "DrawInto", "SpineEngine$Graphics$Drawable$IDrawable$DrawInto",
            "DrawInto$1", "SpineEngine$Graphics$Drawable$IDrawable$DrawInto$1"
        ],
        ctors: {
            init: function () {
                this.Origin = new Microsoft.Xna.Framework.Vector2();
                this.Origin = Microsoft.Xna.Framework.Vector2.op_Division$1(Microsoft.Xna.Framework.Vector2.One.$clone(), 2);
            },
            ctor: function (color) {
                if (color === void 0) { color = null; }

                this.$initialize();
                this.Color = System.Nullable.lift1("$clone", color);
            }
        },
        methods: {
            DrawInto: function (color, depth, target) {
                this.DrawInto$1(1, 1, color.$clone(), depth, target);
            },
            DrawInto$1: function (width, height, color, depth, target) {
                var $t;
                var destination = new SpineEngine.Maths.RectangleF.$ctor2(0, 0, width, height);
                destination.Location = Microsoft.Xna.Framework.Vector2.op_Subtraction(destination.Location.$clone(), this.Origin.$clone());
                target.Draw(SpineEngine.Graphics.Graphic.PixelTexture, destination.$clone(), SpineEngine.Maths.RectangleF.op_Implicit$1(SpineEngine.Graphics.Graphic.PixelTexture.Bounds.$clone()), ($t = this.Color, $t != null ? $t : color), depth);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Materials.Material$1", function (T) { return {
        inherits: [SpineEngine.Graphics.Materials.Material],
        props: {
            TypedEffect: {
                get: function () {
                    return Bridge.cast(this.Effect, T);
                },
                set: function (value) {
                    this.Effect = value;
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                SpineEngine.Graphics.Materials.Material.ctor.call(this);
            },
            $ctor1: function (effect) {
                this.$initialize();
                SpineEngine.Graphics.Materials.Material.ctor.call(this);
                this.TypedEffect = effect;
            }
        }
    }; });

    Bridge.define("SpineEngine.Graphics.Meshes.SpriteMesh", {
        inherits: [SpineEngine.Graphics.Meshes.IMesh],
        props: {
            Texture: null,
            Effect: 0,
            Depth: 0,
            Color: null,
            SrcRect: null,
            DestRect: null,
            Rotation: 0
        },
        ctors: {
            init: function () {
                this.Color = new Microsoft.Xna.Framework.Color();
                this.SrcRect = new SpineEngine.Maths.RectangleF();
                this.DestRect = new SpineEngine.Maths.RectangleF();
            }
        },
        methods: {
            Build: function (texture, destRect, srcRect, color, depth) {
                this.Texture = texture;
                this.DestRect = destRect.$clone();
                this.SrcRect = srcRect.$clone();
                this.Color = color.$clone();
                this.Depth = depth;
                this.Rotation = 0;
            },
            Draw: function (spriteBatch) {
                spriteBatch.Draw$2(this.Texture, SpineEngine.Maths.RectangleF.op_Implicit(this.DestRect.$clone()), SpineEngine.Maths.RectangleF.op_Implicit(this.SrcRect.$clone()), this.Color.$clone(), this.Rotation, Microsoft.Xna.Framework.Vector2.Zero.$clone(), this.Effect, this.Depth);
            },
            ApplyEffectToMesh: function (effect) {
                this.Effect = effect;
            },
            ApplyTransformMesh: function (transform) {
                var $t;
                var leftTop = Microsoft.Xna.Framework.Vector3.Transform(($t = new Microsoft.Xna.Framework.Vector3.ctor(), $t.X = this.DestRect.Left, $t.Y = this.DestRect.Top, $t.Z = 0, $t), transform.$clone());
                var leftBottom = Microsoft.Xna.Framework.Vector3.Transform(($t = new Microsoft.Xna.Framework.Vector3.ctor(), $t.X = this.DestRect.Left, $t.Y = this.DestRect.Bottom, $t.Z = 0, $t), transform.$clone());
                var rightTop = Microsoft.Xna.Framework.Vector3.Transform(($t = new Microsoft.Xna.Framework.Vector3.ctor(), $t.X = this.DestRect.Right, $t.Y = this.DestRect.Top, $t.Z = 0, $t), transform.$clone());
                var rightBottom = Microsoft.Xna.Framework.Vector3.Transform(($t = new Microsoft.Xna.Framework.Vector3.ctor(), $t.X = this.DestRect.Right, $t.Y = this.DestRect.Bottom, $t.Z = 0, $t), transform.$clone());

                var rotation = 0.0;
                var position = new Microsoft.Xna.Framework.Vector2.$ctor2(leftTop.X, leftTop.Y);
                var size = new Microsoft.Xna.Framework.Vector2.$ctor2(rightBottom.X - leftTop.X, rightBottom.Y - leftTop.Y);

                if (leftTop.Y !== rightTop.Y) {
                    rotation = Math.atan((leftTop.X - rightTop.X) / (leftTop.Y - rightTop.Y));
                    var squareCenter = Microsoft.Xna.Framework.Vector3.op_Division$1((Microsoft.Xna.Framework.Vector3.op_Addition(leftTop.$clone(), rightBottom.$clone())), 2);
                    size = new Microsoft.Xna.Framework.Vector2.$ctor2((Microsoft.Xna.Framework.Vector3.op_Subtraction(leftTop.$clone(), rightTop.$clone())).Length(), (Microsoft.Xna.Framework.Vector3.op_Subtraction(leftTop.$clone(), leftBottom.$clone())).Length());
                    position = new Microsoft.Xna.Framework.Vector2.$ctor2(squareCenter.X, squareCenter.Y);
                }

                this.DestRect = new SpineEngine.Maths.RectangleF.$ctor1(position.$clone(), size.$clone());
                this.Rotation += rotation;
            },
            SetColor: function (value) {
                this.Color = value.$clone();
            },
            GetCenter: function () {
                return new Microsoft.Xna.Framework.Vector3.$ctor3(this.DestRect.X + this.DestRect.Width / 2, this.DestRect.Y + this.DestRect.Height / 2, 0);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Meshes.VertexMesh", {
        inherits: [SpineEngine.Graphics.Meshes.IMesh],
        props: {
            PrimitiveType: 0,
            PrimitiveCount: 0,
            Triangles: null,
            Verts: null,
            Texture: null,
            RasterizerState: null
        },
        ctors: {
            init: function () {
                this.PrimitiveType = Microsoft.Xna.Framework.Graphics.PrimitiveType.TriangleList;
                this.Triangles = System.Array.init(0, 0, System.Int32);
                this.Verts = System.Array.init(0, function (){
                    return new Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture();
                }, Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture);
            }
        },
        methods: {
            Draw: function (spriteBatch) {
                var graphicsDevice = spriteBatch.GraphicsDevice;

                if (this.PrimitiveCount === 0) {
                    return;
                }

                graphicsDevice.Textures.setItem(0, this.Texture);
                graphicsDevice.RasterizerState = this.RasterizerState || Microsoft.Xna.Framework.Graphics.RasterizerState.CullNone;
                if (this.Triangles == null || this.Triangles.length === 0) {
                    graphicsDevice.DrawUserPrimitives(Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture, this.PrimitiveType, this.Verts, 0, this.PrimitiveCount);
                } else {
                    graphicsDevice.DrawUserIndexedPrimitives$2(Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture, this.PrimitiveType, this.Verts, 0, this.Verts.length, this.Triangles, 0, this.PrimitiveCount);
                }
            },
            ApplyEffectToMesh: function (effect) {
                var $t, $t1, $t2, $t3;
                var mesh = this;
                if (effect === Microsoft.Xna.Framework.Graphics.SpriteEffects.None) {
                    return;
                }

                var minX = System.Linq.Enumerable.from(mesh.Verts).min($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f1);
                var maxX = System.Linq.Enumerable.from(mesh.Verts).max($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f1);
                var minY = System.Linq.Enumerable.from(mesh.Verts).min($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f2);
                var maxY = System.Linq.Enumerable.from(mesh.Verts).max($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f2);
                var maxMinX = maxX + minX;
                var maxMinY = maxY + minY;

                for (var index = 0; index < mesh.Verts.length; index = (index + 1) | 0) {
                    if ((effect & Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally) === Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally) {
                        ($t = mesh.Verts)[System.Array.index(index, $t)].TextureCoordinate.X = maxMinX - ($t1 = mesh.Verts)[System.Array.index(index, $t1)].TextureCoordinate.X;
                    }

                    if ((effect & Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically) === Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically) {
                        ($t2 = mesh.Verts)[System.Array.index(index, $t2)].TextureCoordinate.Y = maxMinY - ($t3 = mesh.Verts)[System.Array.index(index, $t3)].TextureCoordinate.Y;
                    }
                }
            },
            ApplyTransformMesh: function (transform) {
                var $t, $t1;
                var mesh = this;
                for (var index = 0; index < mesh.Verts.length; index = (index + 1) | 0) {
                    ($t = mesh.Verts)[System.Array.index(index, $t)].Position = Microsoft.Xna.Framework.Vector3.Transform(($t1 = mesh.Verts)[System.Array.index(index, $t1)].Position.$clone(), transform.$clone());
                }
            },
            SetColor: function (value) {
                var $t;
                var mesh = this;
                for (var index = 0; index < mesh.Verts.length; index = (index + 1) | 0) {
                    ($t = mesh.Verts)[System.Array.index(index, $t)].Color = value.$clone();
                }
            },
            GetCenter: function () {
                var count = this.Verts.length;
                return Microsoft.Xna.Framework.Vector3.op_Division$1(new Microsoft.Xna.Framework.Vector3.$ctor3(System.Linq.Enumerable.from(this.Verts).sum($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f3), System.Linq.Enumerable.from(this.Verts).sum($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f4), System.Linq.Enumerable.from(this.Verts).sum($asm.$.SpineEngine.Graphics.Meshes.VertexMesh.f5)), count);
            },
            Build: function (texture, destRect, srcRect, color, depth) {
                var $t, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $t9;
                var mesh = this;
                if (mesh.Verts.length !== 4) {
                    mesh.Verts = System.Array.init(4, function (){
                        return new Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture();
                    }, Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture);
                }

                if (mesh.Triangles.length !== 6) {
                    mesh.Triangles = System.Array.init(6, 0, System.Int32);
                }

                mesh.Texture = texture;
                mesh.PrimitiveType = Microsoft.Xna.Framework.Graphics.PrimitiveType.TriangleList;
                mesh.PrimitiveCount = 2;
                ($t = mesh.Triangles)[System.Array.index(0, $t)] = 0;
                ($t1 = mesh.Triangles)[System.Array.index(1, $t1)] = 1;
                ($t2 = mesh.Triangles)[System.Array.index(2, $t2)] = 2;
                ($t3 = mesh.Triangles)[System.Array.index(3, $t3)] = 2;
                ($t4 = mesh.Triangles)[System.Array.index(4, $t4)] = 3;
                ($t5 = mesh.Triangles)[System.Array.index(5, $t5)] = 0;
                ($t6 = mesh.Verts)[System.Array.index(0, $t6)] = new Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture.$ctor1(new Microsoft.Xna.Framework.Vector3.$ctor3(destRect.Left, destRect.Top, depth), color.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(srcRect.Left / texture.Bounds.Width, srcRect.Top / texture.Bounds.Height));
                ($t7 = mesh.Verts)[System.Array.index(1, $t7)] = new Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture.$ctor1(new Microsoft.Xna.Framework.Vector3.$ctor3(destRect.Right, destRect.Top, depth), color.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(srcRect.Right / texture.Bounds.Width, srcRect.Top / texture.Bounds.Height));
                ($t8 = mesh.Verts)[System.Array.index(2, $t8)] = new Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture.$ctor1(new Microsoft.Xna.Framework.Vector3.$ctor3(destRect.Right, destRect.Bottom, depth), color.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(srcRect.Right / texture.Bounds.Width, srcRect.Bottom / texture.Bounds.Height));
                ($t9 = mesh.Verts)[System.Array.index(3, $t9)] = new Microsoft.Xna.Framework.Graphics.VertexPositionColorTexture.$ctor1(new Microsoft.Xna.Framework.Vector3.$ctor3(destRect.Left, destRect.Bottom, depth), color.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(srcRect.Left / texture.Bounds.Width, srcRect.Bottom / texture.Bounds.Height));
            }
        }
    });

    Bridge.ns("SpineEngine.Graphics.Meshes.VertexMesh", $asm.$);

    Bridge.apply($asm.$.SpineEngine.Graphics.Meshes.VertexMesh, {
        f1: function (a) {
            return a.TextureCoordinate.X;
        },
        f2: function (a) {
            return a.TextureCoordinate.Y;
        },
        f3: function (a) {
            return a.Position.X;
        },
        f4: function (a) {
            return a.Position.Y;
        },
        f5: function (a) {
            return a.Position.Z;
        }
    });

    Bridge.define("SpineEngine.Graphics.Renderers.Renderer", {
        inherits: function () { return [System.IComparable$1(SpineEngine.Graphics.Renderers.Renderer),SpineEngine.ECS.IScreenResolutionChangedListener]; },
        props: {
            /**
             * material that is renderer specific. If set - all other materials will be ignored.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RendererMaterial
             * @type SpineEngine.Graphics.Materials.Material
             */
            RendererMaterial: null,
            /**
             * camera that is renderer specific. If set - all other cameras will be ignored
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RendererCamera
             * @type SpineEngine.Graphics.Cameras.Camera
             */
            RendererCamera: null,
            /**
             * specifies the order in which the Renderers will be called by the scene
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RenderOrder
             * @type number
             */
            RenderOrder: 0,
            /**
             * if RenderTexture is not null this renderer will render into the RenderTarget instead of to the screen
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RenderTexture
             * @type SpineEngine.Graphics.RenderTexture
             */
            RenderTexture: null,
            /**
             * if RenderTexture2 is not null - it will be used in SetRenderTargets method with RenderTexture as a first parameter.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RenderTexture2
             * @type SpineEngine.Graphics.RenderTexture
             */
            RenderTexture2: null,
            /**
             * if renderTarget is not null this Color will be used to clear the screen
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RenderTargetClearColor
             * @type ?Microsoft.Xna.Framework.Color
             */
            RenderTargetClearColor: null,
            /**
             * if true, the Scene will call the render method AFTER all PostProcessors have finished. Renderer should NOT have a
                 renderTexture.
                 The main reason for this type of Renderer  is so that you can render your UI without post processing on top of the
                 rest of your Scene.
                 The ScreenSpaceRenderer is an example Renderer that sets this to true;
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.Renderer
             * @function RenderAfterPostProcessors
             * @type boolean
             */
            RenderAfterPostProcessors: false
        },
        alias: [
            "compareTo", ["System$IComparable$1$SpineEngine$Graphics$Renderers$Renderer$compareTo", "System$IComparable$1$compareTo"],
            "SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"
        ],
        methods: {
            compareTo: function (other) {
                if (Bridge.referenceEquals(this, other)) {
                    return 0;
                }
                if (Bridge.referenceEquals(null, other)) {
                    return 1;
                }
                return Bridge.compare(this.RenderOrder, other.RenderOrder);
            },
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                var $t, $t1;
                ($t = this.RenderTexture) != null ? $t.OnSceneBackBufferSizeChanged(sceneRenderTarget.Width, sceneRenderTarget.Height) : null;
                ($t1 = this.RenderTexture2) != null ? $t1.OnSceneBackBufferSizeChanged(sceneRenderTarget.Width, sceneRenderTarget.Height) : null;
            },
            Begin: function () { },
            End: function () { }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderProcessors.Impl.EntityRendererProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor],
        fields: {
            entities: null,
            lastState: null,
            postProcessRender: false,
            scene: null,
            matrixTransformMatrix: null
        },
        ctors: {
            init: function () {
                this.matrixTransformMatrix = new Microsoft.Xna.Framework.Matrix();
                this.lastState = new SpineEngine.Graphics.RenderProcessors.Impl.FinalRenderer.LastState();
            },
            ctor: function (postProcessRender, scene, entities, executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.ctor.call(this, executionOrder);
                this.postProcessRender = postProcessRender;
                this.scene = scene;
                this.entities = entities;
            }
        },
        methods: {
            Render: function (source, destination) {
                var $t, $t1, $t2, $t3, $t4, $t5;
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.prototype.Render.call(this, source, destination);
                var graphicsDevice = SpineEngine.Core.Instance.GraphicsDevice;
                var renderers = this.scene.Renderers.GetAll();

                this.lastState.RenderTarget = null;
                this.lastState.RenderTarget2 = null;
                this.lastState.Material = null;
                this.lastState.Camera = null;
                SpineEngine.Graphics.Graphic.SpriteBatch.Begin();
                $t = Bridge.getEnumerator(renderers);
                try {
                    while ($t.moveNext()) {
                        var renderer = $t.Current;
                        if (renderer.RenderAfterPostProcessors !== this.postProcessRender) {
                            continue;
                        }

                        renderer.Begin();

                        $t1 = Bridge.getEnumerator(this.entities);
                        try {
                            while ($t1.moveNext()) {
                                var entity = { v : $t1.Current };
                                if (!entity.v.Enabled) {
                                    continue;
                                }

                                if (!renderer.IsApplicable(entity.v)) {
                                    continue;
                                }

                                var finalComponent = entity.v.GetComponent(SpineEngine.ECS.Components.FinalRenderComponent);

                                if (finalComponent.Batch == null) {
                                    continue;
                                }

                                var material = { v : renderer.RendererMaterial || (($t2 = entity.v.GetComponent(SpineEngine.ECS.Components.MaterialComponent)) != null ? $t2.Material : null) };
                                var camera = { v : renderer.RendererCamera || (($t3 = entity.v.GetComponent(SpineEngine.ECS.Components.CameraComponent)) != null ? $t3.Camera : null) || this.scene.Camera };
                                var renderTarget = SpineEngine.Graphics.RenderTexture.op_Implicit(renderer.RenderTexture) || destination;
                                var renderTarget2 = renderer.RenderTexture2 == null ? null : SpineEngine.Graphics.RenderTexture.op_Implicit(renderer.RenderTexture2);

                                if (!Bridge.referenceEquals(this.lastState.RenderTarget, renderTarget) || !Bridge.referenceEquals(this.lastState.RenderTarget2, renderTarget2)) {
                                    this.lastState.RenderTarget = renderTarget;
                                    this.lastState.RenderTarget2 = renderTarget2;

                                    if (this.lastState.RenderTarget2 == null) {
                                        graphicsDevice.SetRenderTarget(this.lastState.RenderTarget);
                                    } else {
                                        graphicsDevice.SetRenderTargets([Microsoft.Xna.Framework.Graphics.RenderTargetBinding.op_Implicit(this.lastState.RenderTarget), Microsoft.Xna.Framework.Graphics.RenderTargetBinding.op_Implicit(this.lastState.RenderTarget2)]);
                                    }

                                    if (!this.postProcessRender) {
                                        graphicsDevice.Clear(($t4 = renderer.RenderTargetClearColor, $t4 != null ? $t4 : this.scene.ClearColor));
                                    }
                                }

                                if (!Bridge.referenceEquals(this.lastState.Material, material.v) || !Bridge.referenceEquals(this.lastState.Camera, camera.v)) {
                                    this.lastState.Material = material.v;
                                    this.lastState.Camera = camera.v;

                                    material.v != null ? material.v.OnPreRender(camera.v, entity.v) : null;
                                    SpineEngine.Graphics.Graphic.SpriteBatch.End();
                                    SpineEngine.Graphics.Graphic.SpriteBatch.Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, (material.v != null ? material.v.BlendState : null) || Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend, (material.v != null ? material.v.SamplerState : null) || SpineEngine.Graphics.Graphic.DefaultSamplerState, (material.v != null ? material.v.DepthStencilState : null) || Microsoft.Xna.Framework.Graphics.DepthStencilState.None, Microsoft.Xna.Framework.Graphics.RasterizerState.CullNone, material.v != null ? material.v.Effect : null, camera.v.TransformMatrix.$clone());
                                }

                                $t5 = Bridge.getEnumerator(finalComponent.Batch.Meshes);
                                try {
                                    while ($t5.moveNext()) {
                                        var mesh = $t5.Current;
                                        mesh.Draw(SpineEngine.Graphics.Graphic.SpriteBatch);
                                    }
                                } finally {
                                    if (Bridge.is($t5, System.IDisposable)) {
                                        $t5.System$IDisposable$Dispose();
                                    }
                                }
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }

                        renderer.End();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                SpineEngine.Graphics.Graphic.SpriteBatch.End();
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderProcessors.Impl.FinalRenderRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor,SpineEngine.ECS.IScreenResolutionChangedListener],
        fields: {
            samplerState: null,
            finalRenderDestinationRect: null
        },
        alias: ["SceneBackBufferSizeChanged", "SpineEngine$ECS$IScreenResolutionChangedListener$SceneBackBufferSizeChanged"],
        ctors: {
            init: function () {
                this.finalRenderDestinationRect = new SpineEngine.Maths.RectangleF();
            },
            ctor: function (samplerState, executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.ctor.call(this, executionOrder);
                this.samplerState = samplerState;
            }
        },
        methods: {
            SceneBackBufferSizeChanged: function (realRenderTarget, sceneRenderTarget) {
                this.finalRenderDestinationRect = SpineEngine.Maths.RectangleF.op_Implicit$1(realRenderTarget.$clone());
            },
            Render: function (source, destination) {
                this.Material.SamplerState = this.samplerState;

                this.Batch.Clear();
                this.Batch.Draw(source, this.finalRenderDestinationRect.$clone(), SpineEngine.Maths.RectangleF.op_Implicit$1(source.Bounds.$clone()), Microsoft.Xna.Framework.Color.White.$clone(), 0);

                SpineEngine.Graphics.Graphic.Draw(destination, Microsoft.Xna.Framework.Color.Black.$clone(), this.Batch, this.Material);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderProcessors.Impl.ScreenShotRenderProcessor", {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor],
        props: {
            Action: null
        },
        ctors: {
            ctor: function (executionOrder) {
                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.ctor.call(this, executionOrder);
            }
        },
        methods: {
            Render: function (source, destination) {
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.prototype.Render.call(this, source, destination);
                if (Bridge.staticEquals(this.Action, null)) {
                    return;
                }

                var tex = new Microsoft.Xna.Framework.Graphics.Texture2D.ctor(SpineEngine.Core.Instance.GraphicsDevice, source.Width, source.Height);
                var data = System.Array.init(Bridge.Int.mul(tex.Bounds.Width, tex.Bounds.Height), 0, System.Int32);
                source.GetData(System.Int32, data);
                tex.SetData(System.Int32, data);
                this.Action(tex);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.RenderProcessors.RenderProcessor$1", function (T) { return {
        inherits: [SpineEngine.Graphics.RenderProcessors.RenderProcessor],
        props: {
            TypedEffect: {
                get: function () {
                    return Bridge.cast(this.Effect, T);
                },
                set: function (value) {
                    this.Effect = value;
                }
            }
        },
        ctors: {
            ctor: function (executionOrder, typedEffect) {
                if (typedEffect === void 0) { typedEffect = Bridge.getDefaultValue(T); }

                this.$initialize();
                SpineEngine.Graphics.RenderProcessors.RenderProcessor.ctor.call(this, executionOrder, typedEffect);
                this.TypedEffect = typedEffect;
            }
        }
    }; });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.BestFitSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        props: {
            BleedSize: null
        },
        ctors: {
            init: function () {
                this.BleedSize = new Microsoft.Xna.Framework.Point();
            }
        },
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                var safeScaleX = screenWidth / (((designSize.X - this.BleedSize.X) | 0));
                var safeScaleY = screenHeight / (((designSize.Y - this.BleedSize.Y) | 0));

                var resolutionScale = Microsoft.Xna.Framework.MathHelper.Max$1(resolutionScaleX, resolutionScaleY);
                var safeScale = Microsoft.Xna.Framework.MathHelper.Min$1(safeScaleX, safeScaleY);

                resolutionScaleX = (resolutionScaleY = Microsoft.Xna.Framework.MathHelper.Min$1(resolutionScale, safeScale));

                // calculate the display rect of the RenderTarget
                var renderWidth = designSize.X * resolutionScaleX;
                var renderHeight = designSize.Y * resolutionScaleY;

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(Bridge.Int.clip32((screenWidth - renderWidth)), 2)) | 0), ((Bridge.Int.div(Bridge.Int.clip32((screenHeight - renderHeight)), 2)) | 0), Bridge.Int.clip32(renderWidth), Bridge.Int.clip32(renderHeight));
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.ExactFitSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                // calculate the display rect of the RenderTarget
                var renderWidth = designSize.X * resolutionScaleX;
                var renderHeight = designSize.Y * resolutionScaleY;

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(Bridge.Int.clip32((screenWidth - renderWidth)), 2)) | 0), ((Bridge.Int.div(Bridge.Int.clip32((screenHeight - renderHeight)), 2)) | 0), Bridge.Int.clip32(renderWidth), Bridge.Int.clip32(renderHeight));
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.FixedHeightPixelPerfectSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var screenAspectRatio = screenWidth / screenHeight;
                var resolutionScaleX = screenWidth / designSize.X;

                // we are going to do some cropping so we need to use floats for the scale then round up
                var pixelPerfectScale;
                if (designSize.X / designSize.Y < screenAspectRatio) {
                    var floatScale = screenWidth / designSize.X;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale);
                } else {
                    var floatScale1 = screenHeight / designSize.Y;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale1);
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                var result = new Microsoft.Xna.Framework.Rectangle.ctor();

                result.Width = SpineEngine.Maths.Mathf.CeilToInt(designSize.X * resolutionScaleX);
                result.Height = SpineEngine.Maths.Mathf.CeilToInt(Bridge.Int.mul(designSize.Y, pixelPerfectScale));
                result.X = (Bridge.Int.div((((screenWidth - result.Width) | 0)), 2)) | 0;
                result.Y = (Bridge.Int.div((((screenHeight - result.Height) | 0)), 2)) | 0;

                return result.$clone();
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                var screenAspectRatio = screenWidth / screenHeight;
                var resolutionScaleX = screenWidth / designSize.X;

                // we are going to do some cropping so we need to use floats for the scale then round up
                var pixelPerfectScale;
                if (designSize.X / designSize.Y < screenAspectRatio) {
                    var floatScale = screenWidth / designSize.X;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale);
                } else {
                    var floatScale1 = screenHeight / designSize.Y;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale1);
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, Bridge.Int.clip32(designSize.X * resolutionScaleX / pixelPerfectScale), designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.FixedHeightSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                resolutionScaleX = resolutionScaleY;

                // calculate the display rect of the RenderTarget
                var renderWidth = designSize.X * resolutionScaleX;
                var renderHeight = designSize.Y * resolutionScaleY;

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(Bridge.Int.clip32((screenWidth - renderWidth)), 2)) | 0), ((Bridge.Int.div(Bridge.Int.clip32((screenHeight - renderHeight)), 2)) | 0), Bridge.Int.clip32(renderWidth), Bridge.Int.clip32(renderHeight));
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                resolutionScaleX = resolutionScaleY;

                var newWidth = SpineEngine.Maths.Mathf.CeilToInt(screenWidth / resolutionScaleX);

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, newWidth, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.FixedWidthPixelPerfectSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var screenAspectRatio = screenWidth / screenHeight;
                var resolutionScaleY = screenHeight / designSize.Y;

                // we are going to do some cropping so we need to use floats for the scale then round up
                var pixelPerfectScale;
                if (designSize.X / designSize.Y < screenAspectRatio) {
                    var floatScale = screenWidth / designSize.X;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale);
                } else {
                    var floatScale1 = screenHeight / designSize.Y;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale1);
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                var result = new Microsoft.Xna.Framework.Rectangle.ctor();

                result.Width = SpineEngine.Maths.Mathf.CeilToInt(Bridge.Int.mul(designSize.X, pixelPerfectScale));
                result.Height = SpineEngine.Maths.Mathf.CeilToInt(designSize.Y * resolutionScaleY);
                result.X = (Bridge.Int.div((((screenWidth - result.Width) | 0)), 2)) | 0;
                result.Y = (Bridge.Int.div((((screenHeight - result.Height) | 0)), 2)) | 0;

                return result.$clone();
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                var screenAspectRatio = screenWidth / screenHeight;
                var resolutionScaleY = screenHeight / designSize.Y;

                // we are going to do some cropping so we need to use floats for the scale then round up
                var pixelPerfectScale;
                if (designSize.X / designSize.Y < screenAspectRatio) {
                    var floatScale = screenWidth / designSize.X;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale);
                } else {
                    var floatScale1 = screenHeight / designSize.Y;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale1);
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, Bridge.Int.clip32(designSize.Y * resolutionScaleY / pixelPerfectScale));
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.FixedWidthSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                resolutionScaleY = resolutionScaleX;

                // calculate the display rect of the RenderTarget
                var renderWidth = designSize.X * resolutionScaleX;
                var renderHeight = designSize.Y * resolutionScaleY;

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(Bridge.Int.clip32((screenWidth - renderWidth)), 2)) | 0), ((Bridge.Int.div(Bridge.Int.clip32((screenHeight - renderHeight)), 2)) | 0), Bridge.Int.clip32(renderWidth), Bridge.Int.clip32(renderHeight));
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                resolutionScaleY = resolutionScaleX;

                var newHeight = SpineEngine.Maths.Mathf.CeilToInt(screenHeight / resolutionScaleY);

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, newHeight);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.NoBorderPixelPerfectSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var screenAspectRatio = screenWidth / screenHeight;

                // we are going to do some cropping so we need to use floats for the scale then round up
                var pixelPerfectScale;
                if (designSize.X / designSize.Y < screenAspectRatio) {
                    var floatScale = screenWidth / designSize.X;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale);
                } else {
                    var floatScale1 = screenHeight / designSize.Y;
                    pixelPerfectScale = SpineEngine.Maths.Mathf.CeilToInt(floatScale1);
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                var result = new Microsoft.Xna.Framework.Rectangle.ctor();

                result.Width = SpineEngine.Maths.Mathf.CeilToInt(Bridge.Int.mul(designSize.X, pixelPerfectScale));
                result.Height = SpineEngine.Maths.Mathf.CeilToInt(Bridge.Int.mul(designSize.Y, pixelPerfectScale));
                result.X = (Bridge.Int.div((((screenWidth - result.Width) | 0)), 2)) | 0;
                result.Y = (Bridge.Int.div((((screenHeight - result.Height) | 0)), 2)) | 0;

                return result.$clone();
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.NoBorderSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                resolutionScaleX = (resolutionScaleY = Math.max(resolutionScaleX, resolutionScaleY));

                // calculate the display rect of the RenderTarget
                var renderWidth = designSize.X * resolutionScaleX;
                var renderHeight = designSize.Y * resolutionScaleY;

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(Bridge.Int.clip32((screenWidth - renderWidth)), 2)) | 0), ((Bridge.Int.div(Bridge.Int.clip32((screenHeight - renderHeight)), 2)) | 0), Bridge.Int.clip32(renderWidth), Bridge.Int.clip32(renderHeight));
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.NoneSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, screenWidth, screenHeight);
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, screenWidth, screenHeight);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.ShowAllPixelPerfectSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var screenAspectRatio = screenWidth / screenHeight;

                var pixelPerfectScale;
                if (designSize.X / designSize.Y > screenAspectRatio) {
                    pixelPerfectScale = (Bridge.Int.div(screenWidth, designSize.X)) | 0;
                } else {
                    pixelPerfectScale = (Bridge.Int.div(screenHeight, designSize.Y)) | 0;
                }

                if (pixelPerfectScale === 0) {
                    pixelPerfectScale = 1;
                }

                var result = new Microsoft.Xna.Framework.Rectangle.ctor();

                result.Width = SpineEngine.Maths.Mathf.CeilToInt(Bridge.Int.mul(designSize.X, pixelPerfectScale));
                result.Height = SpineEngine.Maths.Mathf.CeilToInt(Bridge.Int.mul(designSize.Y, pixelPerfectScale));
                result.X = (Bridge.Int.div((((screenWidth - result.Width) | 0)), 2)) | 0;
                result.Y = (Bridge.Int.div((((screenHeight - result.Height) | 0)), 2)) | 0;

                return result.$clone();
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.ShowAllSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                var resolutionScaleX = screenWidth / designSize.X;
                var resolutionScaleY = screenHeight / designSize.Y;

                resolutionScaleX = (resolutionScaleY = Math.min(resolutionScaleX, resolutionScaleY));

                // calculate the display rect of the RenderTarget
                var renderWidth = designSize.X * resolutionScaleX;
                var renderHeight = designSize.Y * resolutionScaleY;

                return new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.div(Bridge.Int.clip32((screenWidth - renderWidth)), 2)) | 0), ((Bridge.Int.div(Bridge.Int.clip32((screenHeight - renderHeight)), 2)) | 0), Bridge.Int.clip32(renderWidth), Bridge.Int.clip32(renderHeight));
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.ResolutionPolicy.StretchSceneResolutionPolicy", {
        inherits: [SpineEngine.Graphics.ResolutionPolicy.SceneResolutionPolicy],
        methods: {
            GetFinalRenderDestinationRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, screenWidth, screenHeight);
            },
            GetRenderTargetRect: function (screenWidth, screenHeight, designSize) {
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, designSize.X, designSize.Y);
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Transitions.QuickTransition", {
        inherits: [SpineEngine.Graphics.Transitions.SceneTransition],
        methods: {
            OnBeginTransition: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = null;
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    this.SetNextScene();

                                        this.TransitionComplete();

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
            }
        }
    });

    /**
     * A QuadTree Object that provides fast and efficient storage of objects in a world space.
     *
     * @public
     * @class SpineEngine.Maths.QuadTree.QuadTree$1
     * @implements  System.Collections.Generic.ICollection$1
     * @param   {Function}    [name]    Any object implementing IQuadStorable.
     */
    Bridge.define("SpineEngine.Maths.QuadTree.QuadTree$1", function (T) { return {
        inherits: [System.Collections.Generic.ICollection$1(T)],
        fields: {
            wrappedDictionary: null
        },
        props: {
            /**
             * The top left child for this QuadTree, only usable in debug mode
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @function QuadTreeRoot
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            QuadTreeRoot: null,
            /**
             * Gets the rectangle that bounds this QuadTree
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @function QuadRect
             * @type Microsoft.Xna.Framework.Rectangle
             */
            QuadRect: {
                get: function () {
                    return this.QuadTreeRoot.QuadRect.$clone();
                }
            },
            /**
             * Gets the number of elements contained in the {@link }.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @function Count
             * @type number
             * @return  {[type]}        The number of elements contained in the {@link }.
             */
            Count: {
                get: function () {
                    return this.wrappedDictionary.count;
                }
            },
            /**
             * Gets a value indicating whether the {@link } is read-only.
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @function IsReadOnly
             * @type boolean
             * @return  {[type]}        true if the {@link } is read-only; otherwise, false.
             */
            IsReadOnly: {
                get: function () {
                    return false;
                }
            }
        },
        alias: [
            "add", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$add",
            "clear", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$clear",
            "contains", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$contains",
            "copyTo", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$copyTo",
            "Count", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$Count",
            "IsReadOnly", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$IsReadOnly",
            "remove", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$remove",
            "GetEnumerator", ["System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$GetEnumerator", "System$Collections$Generic$IEnumerable$1$GetEnumerator"]
        ],
        ctors: {
            init: function () {
                this.wrappedDictionary = new (System.Collections.Generic.Dictionary$2(T,SpineEngine.Maths.QuadTree.QuadTreeObject$1(T)))();
            },
            /**
             * Creates a QuadTree for the specified area.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @param   {Microsoft.Xna.Framework.Rectangle}    rect    The area this QuadTree object will encompass.
             * @return  {void}
             */
            ctor: function (rect) {
                this.$initialize();
                this.QuadTreeRoot = new (SpineEngine.Maths.QuadTree.QuadTreeNode$1(T)).ctor(rect.$clone());
            },
            /**
             * Creates a QuadTree for the specified area.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @param   {number}    x         The top-left position of the area rectangle.
             * @param   {number}    y         The top-right position of the area rectangle.
             * @param   {number}    width     The width of the area rectangle.
             * @param   {number}    height    The height of the area rectangle.
             * @return  {void}
             */
            $ctor1: function (x, y, width, height) {
                this.$initialize();
                this.QuadTreeRoot = new (SpineEngine.Maths.QuadTree.QuadTreeNode$1(T)).ctor(new Microsoft.Xna.Framework.Rectangle.$ctor2(x, y, width, height));
            }
        },
        methods: {
            /**
             * Get the objects in this tree that intersect with the specified rectangle.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @param   {Microsoft.Xna.Framework.Rectangle}    rect    The rectangle to find objects in.
             * @return  {System.Collections.Generic.List$1}
             */
            GetObjects: function (rect) {
                return this.QuadTreeRoot.GetObjects(rect.$clone());
            },
            /**
             * Get the objects in this tree that intersect with the specified rectangle.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @param   {Microsoft.Xna.Framework.Rectangle}    rect       The rectangle to find objects in.
             * @param   {System.Collections.Generic.List}      results    A reference to a list that will be populated with the results.
             * @return  {void}
             */
            GetObjects$1: function (rect, results) {
                this.QuadTreeRoot.GetObjects$1(rect.$clone(), results);
            },
            /**
             * Get all objects in this Quad, and it's children.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @return  {System.Collections.Generic.List$1}
             */
            GetAllObjects: function () {
                return new (System.Collections.Generic.List$1(T)).$ctor1(this.wrappedDictionary.getKeys());
            },
            /**
             * Moves the object in the tree
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @param   {T}          item    The item that has moved
             * @return  {boolean}
             */
            Move: function (item) {
                if (this.contains(item)) {
                    this.QuadTreeRoot.Move(this.wrappedDictionary.get(item));
                    return true;
                }

                return false;
            },
            /**
             * Adds an item to the QuadTree
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @throws The {@link T:System.NotSupportedException} is read-only.
             * @param   {T}       item    The object to add to the {@link }.
             * @return  {void}
             */
            add: function (item) {
                var wrappedObject = new (SpineEngine.Maths.QuadTree.QuadTreeObject$1(T))(item);
                this.wrappedDictionary.add(item, wrappedObject);
                this.QuadTreeRoot.Insert(wrappedObject);
            },
            /**
             * Removes all items from the {@link }.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @throws The {@link T:System.NotSupportedException} is read-only.
             * @return  {void}
             */
            clear: function () {
                this.wrappedDictionary.clear();
                this.QuadTreeRoot.Clear();
            },
            /**
             * Determines whether the QuadTree contains a specific value.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @param   {T}          item    The object to locate in the {@link }.
             * @return  {boolean}            true if <b /> is found in the {@link }; otherwise, false.
             */
            contains: function (item) {
                return this.wrappedDictionary.containsKey(item);
            },
            /**
             * Copies the elements of the {@link } to an {@link }, starting at a particular {@link } index.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @throws <b /> is null.
             * @throws <b /> is less than 0.
             * @throws <b /> is multidimensional.-or-<b /> is equal to or greater than the length of <b />.-or-The number of elements in the source {@link T:System.ArgumentException} is greater than the available space from <b /> to the end of the destination <b />.-or-Type T cannot be cast automatically to the type of the destination <b />.
             * @param   {Array.<T>}    array         The one-dimensional {@link } that is the destination of the elements copied from {@link }. The {@link } must have zero-based indexing.
             * @param   {number}       arrayIndex    The zero-based index in <b>arrayIndex</b> at which copying begins.
             * @return  {void}
             */
            copyTo: function (array, arrayIndex) {
                System.Array.copyTo(this.wrappedDictionary.getKeys(), array, arrayIndex, T);
            },
            /**
             * Removes the first occurrence of a specific object from the QuadTree
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @throws The {@link T:System.NotSupportedException} is read-only.
             * @param   {T}          item    The object to remove from the {@link }.
             * @return  {boolean}            true if <b /> was successfully removed from the {@link }; otherwise, false. This method also returns false if <b /> is not found in the original {@link }.
             */
            remove: function (item) {
                if (this.contains(item)) {
                    this.QuadTreeRoot.Delete(this.wrappedDictionary.get(item), true);
                    this.wrappedDictionary.remove(item);
                    return true;
                }

                return false;
            },
            /**
             * Returns an enumerator that iterates through the collection.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @return  {System.Collections.Generic.IEnumerator$1}        A {@link } that can be used to iterate through the collection.
             */
            GetEnumerator: function () {
                return Bridge.getEnumerator(this.wrappedDictionary.getKeys(), T);
            },
            /**
             * Returns an enumerator that iterates through a collection.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTree$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTree$1
             * @return  {System.Collections.IEnumerator}        An {@link } object that can be used to iterate through the collection.
             */
            System$Collections$IEnumerable$GetEnumerator: function () {
                return this.GetEnumerator();
            }
        }
    }; });

    /**
     * A QuadTree Object that provides fast and efficient storage of objects in a world space.
     *
     * @public
     * @class SpineEngine.Maths.QuadTree.QuadTreeNode$1
     * @param   {Function}    [name]    Any object implementing IQuadStorable.
     */
    Bridge.define("SpineEngine.Maths.QuadTree.QuadTreeNode$1", function (T) { return {
        statics: {
            fields: {
                MaxObjectsPerNode: 0
            },
            ctors: {
                init: function () {
                    this.MaxObjectsPerNode = 2;
                }
            }
        },
        fields: {
            objects: null
        },
        props: {
            /**
             * The area this QuadTree represents.
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function QuadRect
             * @type Microsoft.Xna.Framework.Rectangle
             */
            QuadRect: null,
            /**
             * The top left child for this QuadTree
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function TopLeftChild
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            TopLeftChild: null,
            /**
             * The top right child for this QuadTree
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function TopRightChild
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            TopRightChild: null,
            /**
             * The bottom left child for this QuadTree
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function BottomLeftChild
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            BottomLeftChild: null,
            /**
             * The bottom right child for this QuadTree
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function BottomRightChild
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            BottomRightChild: null,
            /**
             * This QuadTree's parent
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function Parent
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            Parent: null,
            /**
             * How many total objects are contained within this QuadTree (ie, includes children)
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function Count
             * @type number
             */
            Count: {
                get: function () {
                    return this.ObjectCount();
                }
            },
            /**
             * Returns true if this is a empty leaf node
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @function IsEmptyLeaf
             * @type boolean
             */
            IsEmptyLeaf: {
                get: function () {
                    return this.Count === 0 && this.TopLeftChild == null;
                }
            }
        },
        ctors: {
            init: function () {
                this.QuadRect = new Microsoft.Xna.Framework.Rectangle();
            },
            /**
             * Creates a QuadTree for the specified area.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {Microsoft.Xna.Framework.Rectangle}    quadRect    The area this QuadTree object will encompass.
             * @return  {void}
             */
            ctor: function (quadRect) {
                this.$initialize();
                this.QuadRect = quadRect.$clone();
            },
            /**
             * Creates a QuadTree for the specified area.
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {number}    x         The top-left position of the area rectangle.
             * @param   {number}    y         The top-right position of the area rectangle.
             * @param   {number}    width     The width of the area rectangle.
             * @param   {number}    height    The height of the area rectangle.
             * @return  {void}
             */
            $ctor2: function (x, y, width, height) {
                this.$initialize();
                this.QuadRect = new Microsoft.Xna.Framework.Rectangle.$ctor2(x, y, width, height);
            },
            $ctor1: function (parent, rect) {
                SpineEngine.Maths.QuadTree.QuadTreeNode$1(T).ctor.call(this, rect);
                this.Parent = parent;
            }
        },
        methods: {
            /**
             * Add an item to the object list.
             *
             * @instance
             * @private
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {SpineEngine.Maths.QuadTree.QuadTreeObject$1}    item    The item to add.
             * @return  {void}
             */
            Add: function (item) {
                if (this.objects == null) {
                    this.objects = new (System.Collections.Generic.List$1(SpineEngine.Maths.QuadTree.QuadTreeObject$1(T))).ctor();
                }

                item.Owner = this;
                this.objects.add(item);
            },
            /**
             * Remove an item from the object list.
             *
             * @instance
             * @private
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {SpineEngine.Maths.QuadTree.QuadTreeObject$1}    item    The object to remove.
             * @return  {void}
             */
            Remove: function (item) {
                if (this.objects != null) {
                    var removeIndex = this.objects.indexOf(item);
                    if (removeIndex >= 0) {
                        this.objects.setItem(removeIndex, this.objects.getItem(((this.objects.Count - 1) | 0)));
                        this.objects.removeAt(((this.objects.Count - 1) | 0));
                    }
                }
            },
            /**
             * Get the total for all objects in this QuadTree, including children.
             *
             * @instance
             * @private
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @return  {number}        The number of objects contained within this QuadTree and its children.
             */
            ObjectCount: function () {
                var count = 0;

                // Add the objects at this level
                if (this.objects != null) {
                    count = (count + this.objects.Count) | 0;
                }

                // Add the objects that are contained in the children
                if (this.TopLeftChild != null) {
                    count = (count + (this.TopLeftChild.ObjectCount())) | 0;
                    count = (count + (this.TopRightChild.ObjectCount())) | 0;
                    count = (count + (this.BottomLeftChild.ObjectCount())) | 0;
                    count = (count + (this.BottomRightChild.ObjectCount())) | 0;
                }

                return count;
            },
            /**
             * Subdivide this QuadTree and move it's children into the appropriate Quads where applicable.
             *
             * @instance
             * @private
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @return  {void}
             */
            Subdivide: function () {
                // We've reached capacity, subdivide...
                var size = new Microsoft.Xna.Framework.Point.$ctor2(((Bridge.Int.div(this.QuadRect.Width, 2)) | 0), ((Bridge.Int.div(this.QuadRect.Height, 2)) | 0));
                var mid = new Microsoft.Xna.Framework.Point.$ctor2(((this.QuadRect.X + size.X) | 0), ((this.QuadRect.Y + size.Y) | 0));

                this.TopLeftChild = new (SpineEngine.Maths.QuadTree.QuadTreeNode$1(T)).$ctor1(this, new Microsoft.Xna.Framework.Rectangle.$ctor2(this.QuadRect.Left, this.QuadRect.Top, size.X, size.Y));
                this.TopRightChild = new (SpineEngine.Maths.QuadTree.QuadTreeNode$1(T)).$ctor1(this, new Microsoft.Xna.Framework.Rectangle.$ctor2(mid.X, this.QuadRect.Top, size.X, size.Y));
                this.BottomLeftChild = new (SpineEngine.Maths.QuadTree.QuadTreeNode$1(T)).$ctor1(this, new Microsoft.Xna.Framework.Rectangle.$ctor2(this.QuadRect.Left, mid.Y, size.X, size.Y));
                this.BottomRightChild = new (SpineEngine.Maths.QuadTree.QuadTreeNode$1(T)).$ctor1(this, new Microsoft.Xna.Framework.Rectangle.$ctor2(mid.X, mid.Y, size.X, size.Y));

                // If they're completely contained by the quad, bump objects down
                for (var i = 0; i < this.objects.Count; i = (i + 1) | 0) {
                    var destTree = this.GetDestinationTree(this.objects.getItem(i));

                    if (!Bridge.referenceEquals(destTree, this)) {
                        // Insert to the appropriate tree, remove the object, and back up one in the loop
                        destTree.Insert(this.objects.getItem(i));
                        this.Remove(this.objects.getItem(i));
                        i = (i - 1) | 0;
                    }
                }
            },
            /**
             * Get the child Quad that would contain an object.
             *
             * @instance
             * @private
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {SpineEngine.Maths.QuadTree.QuadTreeObject$1}    item    The object to get a child for.
             * @return  {SpineEngine.Maths.QuadTree.QuadTreeNode$1}
             */
            GetDestinationTree: function (item) {
                // If a child can't contain an object, it will live in this Quad
                var destTree = this;

                if (this.TopLeftChild.QuadRect.Contains$1(item.Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                    destTree = this.TopLeftChild;
                } else {
                    if (this.TopRightChild.QuadRect.Contains$1(item.Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                        destTree = this.TopRightChild;
                    } else {
                        if (this.BottomLeftChild.QuadRect.Contains$1(item.Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                            destTree = this.BottomLeftChild;
                        } else {
                            if (this.BottomRightChild.QuadRect.Contains$1(item.Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                                destTree = this.BottomRightChild;
                            }
                        }
                    }
                }

                return destTree;
            },
            Relocate: function (item) {
                var $t;
                // Are we still inside our parent?
                if (this.QuadRect.Contains$1(item.Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                    // Good, have we moved inside any of our children?
                    if (this.TopLeftChild != null) {
                        var dest = this.GetDestinationTree(item);
                        if (!Bridge.referenceEquals(item.Owner, dest)) {
                            // Delete the item from this quad and add it to our child
                            // Note: Do NOT clean during this call, it can potentially delete our destination quad
                            var formerOwner = item.Owner;
                            this.Delete(item, false);
                            dest.Insert(item);

                            // Clean up ourselves
                            formerOwner.CleanUpwards();
                        }
                    }
                } else {
                    // We don't fit here anymore, move up, if we can
                    ($t = this.Parent) != null ? $t.Relocate(item) : null;
                }
            },
            CleanUpwards: function () {
                if (this.TopLeftChild != null) {
                    // If all the children are empty leaves, delete all the children
                    if (this.TopLeftChild.IsEmptyLeaf && this.TopRightChild.IsEmptyLeaf && this.BottomLeftChild.IsEmptyLeaf && this.BottomRightChild.IsEmptyLeaf) {
                        this.TopLeftChild = null;
                        this.TopRightChild = null;
                        this.BottomLeftChild = null;
                        this.BottomRightChild = null;

                        if (this.Parent != null && this.Count === 0) {
                            this.Parent.CleanUpwards();
                        }
                    }
                } else {
                    // I could be one of 4 empty leaves, tell my parent to clean up
                    if (this.Parent != null && this.Count === 0) {
                        this.Parent.CleanUpwards();
                    }
                }
            },
            /**
             * Clears the QuadTree of all objects, including any objects living in its children.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @return  {void}
             */
            Clear: function () {
                // Clear out the children, if we have any
                if (this.TopLeftChild != null) {
                    this.TopLeftChild.Clear();
                    this.TopRightChild.Clear();
                    this.BottomLeftChild.Clear();
                    this.BottomRightChild.Clear();
                }

                // Clear any objects at this level
                if (this.objects != null) {
                    this.objects.clear();
                    this.objects = null;
                }

                // Set the children to null
                this.TopLeftChild = null;
                this.TopRightChild = null;
                this.BottomLeftChild = null;
                this.BottomRightChild = null;
            },
            /**
             * Deletes an item from this QuadTree. If the object is removed causes this Quad to have no objects in its children,
                 it's children will be removed as well.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {SpineEngine.Maths.QuadTree.QuadTreeObject$1}    item     The item to remove.
             * @param   {boolean}                                        clean    Whether or not to clean the tree
             * @return  {void}
             */
            Delete: function (item, clean) {
                if (item.Owner != null) {
                    if (Bridge.referenceEquals(item.Owner, this)) {
                        this.Remove(item);
                        if (clean) {
                            this.CleanUpwards();
                        }
                    } else {
                        item.Owner.Delete(item, clean);
                    }
                }
            },
            /**
             * Insert an item into this QuadTree object.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {SpineEngine.Maths.QuadTree.QuadTreeObject$1}    item    The item to insert.
             * @return  {void}
             */
            Insert: function (item) {
                // If this quad doesn't contain the items rectangle, do nothing, unless we are the root
                if (!this.QuadRect.Contains$1(item.Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                    if (this.Parent == null) {
                        // This object is outside of the QuadTree bounds, we should add it at the root level
                        this.Add(item);
                    } else {
                        return;
                    }
                }

                if (this.objects == null || this.TopLeftChild == null && ((this.objects.Count + 1) | 0) <= SpineEngine.Maths.QuadTree.QuadTreeNode$1(T).MaxObjectsPerNode) {
                    // If there's room to add the object, just add it
                    this.Add(item);
                } else {
                    // No quads, create them and bump objects down where appropriate
                    if (this.TopLeftChild == null) {
                        this.Subdivide();
                    }

                    // Find out which tree this object should go in and add it there
                    var destTree = this.GetDestinationTree(item);
                    if (Bridge.referenceEquals(destTree, this)) {
                        this.Add(item);
                    } else {
                        destTree.Insert(item);
                    }
                }
            },
            /**
             * Get the objects in this tree that intersect with the specified rectangle.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {Microsoft.Xna.Framework.Rectangle}    searchRect    The rectangle to find objects in.
             * @return  {System.Collections.Generic.List$1}
             */
            GetObjects: function (searchRect) {
                var results = { v : new (System.Collections.Generic.List$1(T)).ctor() };
                this.GetObjects$1(searchRect.$clone(), results);
                return results.v;
            },
            /**
             * Get the objects in this tree that intersect with the specified rectangle.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {Microsoft.Xna.Framework.Rectangle}    searchRect    The rectangle to find objects in.
             * @param   {System.Collections.Generic.List}      results       A reference to a list that will be populated with the results.
             * @return  {void}
             */
            GetObjects$1: function (searchRect, results) {
                // We can't do anything if the results list doesn't exist
                if (results.v != null) {
                    if (searchRect.Contains$1(this.QuadRect.$clone())) {
                        // If the search area completely contains this quad, just get every object this quad and all it's children have
                        this.GetAllObjects(results);
                    } else if (searchRect.Intersects(this.QuadRect.$clone())) {
                        // Otherwise, if the quad isn't fully contained, only add objects that intersect with the search rectangle
                        if (this.objects != null) {
                            for (var i = 0; i < this.objects.Count; i = (i + 1) | 0) {
                                if (searchRect.Intersects(this.objects.getItem(i).Data.SpineEngine$Maths$QuadTree$IQuadTreeStorable$Bounds.$clone())) {
                                    results.v.add(this.objects.getItem(i).Data);
                                }
                            }
                        }

                        // Get the objects for the search rectangle from the children
                        if (this.TopLeftChild != null) {
                            this.TopLeftChild.GetObjects$1(searchRect.$clone(), results);
                            this.TopRightChild.GetObjects$1(searchRect.$clone(), results);
                            this.BottomLeftChild.GetObjects$1(searchRect.$clone(), results);
                            this.BottomRightChild.GetObjects$1(searchRect.$clone(), results);
                        }
                    }
                }
            },
            /**
             * Get all objects in this Quad, and it's children.
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {System.Collections.Generic.List}    results    A reference to a list in which to store the objects.
             * @return  {void}
             */
            GetAllObjects: function (results) {
                // If this Quad has objects, add them
                if (this.objects != null) {
                    for (var i = 0; i < this.objects.Count; i = (i + 1) | 0) {
                        results.v.add(this.objects.getItem(i).Data);
                    }
                }

                // If we have children, get their objects too
                if (this.TopLeftChild != null) {
                    this.TopLeftChild.GetAllObjects(results);
                    this.TopRightChild.GetAllObjects(results);
                    this.BottomLeftChild.GetAllObjects(results);
                    this.BottomRightChild.GetAllObjects(results);
                }
            },
            /**
             * Moves the QuadTree object in the tree
             *
             * @instance
             * @this SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeNode$1
             * @param   {SpineEngine.Maths.QuadTree.QuadTreeObject$1}    item    The item that has moved
             * @return  {void}
             */
            Move: function (item) {
                if (item.Owner != null) {
                    item.Owner.Relocate(item);
                } else {
                    this.Relocate(item);
                }
            }
        }
    }; });

    /**
     * Used internally to attach an Owner to each object stored in the QuadTree
     *
     * @class SpineEngine.Maths.QuadTree.QuadTreeObject$1
     * @param   {Function}    [name]
     */
    Bridge.define("SpineEngine.Maths.QuadTree.QuadTreeObject$1", function (T) { return {
        fields: {
            /**
             * The wrapped data value
             *
             * @instance
             * @public
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeObject$1
             * @type T
             */
            Data: Bridge.getDefaultValue(T),
            /**
             * The QuadTreeNode that owns this object
             *
             * @instance
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeObject$1
             * @type SpineEngine.Maths.QuadTree.QuadTreeNode$1
             */
            Owner: null
        },
        ctors: {
            /**
             * Wraps the data value
             *
             * @instance
             * @public
             * @this SpineEngine.Maths.QuadTree.QuadTreeObject$1
             * @memberof SpineEngine.Maths.QuadTree.QuadTreeObject$1
             * @param   {T}       data    The data value to wrap
             * @return  {void}
             */
            ctor: function (data) {
                this.$initialize();
                this.Data = data;
            }
        }
    }; });

    /**
     * An implementation of a min-Priority Queue using a heap.  Has O(1) .Contains()!
         See https://github.com/BlueRaja/High-Speed-Priority-Queue-for-C-Sharp/wiki/Getting-Started for more information
     *
     * @public
     * @class SpineEngine.Utils.Collections.PriorityQueue$1
     * @implements  SpineEngine.Utils.Collections.IPriorityQueue$1
     * @param   {Function}    [name]    The values in the queue.  Must extend the FastPriorityQueueNode class
     */
    Bridge.define("SpineEngine.Utils.Collections.PriorityQueue$1", function (T) { return {
        inherits: [SpineEngine.Utils.Collections.IPriorityQueue$1(T)],
        statics: {
            methods: {
                /**
                 * Returns true if 'higher' has higher priority than 'lower', false otherwise.
                     Note that calling HasHigherPriority(node, node) (ie. both arguments the same node) will return false
                 *
                 * @static
                 * @private
                 * @this SpineEngine.Utils.Collections.PriorityQueue$1
                 * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
                 * @param   {T}          higher    
                 * @param   {T}          lower
                 * @return  {boolean}
                 */
                HasHigherPriority: function (higher, lower) {
                    return higher.Priority < lower.Priority || higher.Priority === lower.Priority && higher.InsertionIndex.lt(lower.InsertionIndex);
                }
            }
        },
        fields: {
            nodes: null,
            numNodesEverEnqueued: System.Int64(0)
        },
        props: {
            /**
             * Returns the maximum number of items that can be enqueued at once in this queue.  Once you hit this number (ie. once
                 Count == MaxSize),
                 attempting to enqueue another item will cause undefined behavior.  O(1)
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @function MaxSize
             * @type number
             */
            MaxSize: {
                get: function () {
                    return ((this.nodes.length - 1) | 0);
                }
            },
            /**
             * Returns the number of nodes in the queue.
                 O(1)
             *
             * @instance
             * @public
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @function Count
             * @type number
             */
            Count: 0,
            /**
             * Returns the head of the queue, without removing it (use Dequeue() for that).
                 If the queue is empty, behavior is undefined.
                 O(1)
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @function First
             * @type T
             */
            First: {
                get: function () {
                    return this.nodes[System.Array.index(1, this.nodes)];
                }
            }
        },
        alias: [
            "Count", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Count",
            "Clear", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Clear",
            "Contains", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Contains",
            "Enqueue", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Enqueue",
            "Dequeue", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Dequeue",
            "First", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$First",
            "UpdatePriority", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$UpdatePriority",
            "Remove", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Remove",
            "GetEnumerator", ["System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$GetEnumerator", "System$Collections$Generic$IEnumerable$1$GetEnumerator"]
        ],
        ctors: {
            /**
             * Instantiate a new Priority Queue
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @param   {number}    maxNodes    The max nodes ever allowed to be enqueued (going over this will cause undefined behavior)
             * @return  {void}
             */
            ctor: function (maxNodes) {
                this.$initialize();

                this.Count = 0;
                this.nodes = System.Array.init(((maxNodes + 1) | 0), function (){
                    return Bridge.getDefaultValue(T);
                }, T);
                this.numNodesEverEnqueued = System.Int64(0);
            }
        },
        methods: {
            /**
             * Removes every node from the queue.
                 O(n) (So, don't do this often!)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @return  {void}
             */
            Clear: function () {
                System.Array.fill(this.nodes, Bridge.getDefaultValue(T), 1, this.Count);
                this.Count = 0;
            },
            /**
             * Returns (in O(1)!) whether the given node is in the queue.  O(1)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @param   {T}          node
             * @return  {boolean}
             */
            Contains: function (node) {

                return Bridge.referenceEquals(this.nodes[System.Array.index(node.QueueIndex, this.nodes)], node);
            },
            /**
             * Enqueue a node to the priority queue.  Lower values are placed in front. Ties are broken by first-in-first-out.
                 If the queue is full, the result is undefined.
                 If the node is already enqueued, the result is undefined.
                 O(log n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @param   {T}         node        
             * @param   {number}    priority
             * @return  {void}
             */
            Enqueue: function (node, priority) {
                var $t;

                node.Priority = priority;
                this.Count = (this.Count + 1) | 0;
                this.nodes[System.Array.index(this.Count, this.nodes)] = node;
                node.QueueIndex = this.Count;
                node.InsertionIndex = ($t = this.numNodesEverEnqueued, this.numNodesEverEnqueued = this.numNodesEverEnqueued.inc(), $t);
                this.CascadeUp(this.nodes[System.Array.index(this.Count, this.nodes)]);
            },
            /**
             * Removes the head of the queue (node with minimum priority; ties are broken by order of insertion), and returns it.
                 If queue is empty, result is undefined
                 O(log n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @return  {T}
             */
            Dequeue: function () {

                var returnMe = this.nodes[System.Array.index(1, this.nodes)];
                this.Remove(returnMe);
                return returnMe;
            },
            /**
             * This method must be called on a node every time its priority changes while it is in the queue.
                 <b>Forgetting to call this method will result in a corrupted queue!</b>
                 Calling this method on a node not in the queue results in undefined behavior
                 O(log n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @param   {T}         node        
             * @param   {number}    priority
             * @return  {void}
             */
            UpdatePriority: function (node, priority) {

                node.Priority = priority;
                this.OnNodeUpdated(node);
            },
            /**
             * Removes a node from the queue.  The node does not need to be the head of the queue.
                 If the node is not in the queue, the result is undefined.  If unsure, check Contains() first
                 O(log n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @param   {T}       node
             * @return  {void}
             */
            Remove: function (node) {

                //If the node is already the last node, we can remove it immediately
                if (node.QueueIndex === this.Count) {
                    this.nodes[System.Array.index(this.Count, this.nodes)] = null;
                    this.Count = (this.Count - 1) | 0;
                    return;
                }

                //Swap the node with the last node
                var formerLastNode = this.nodes[System.Array.index(this.Count, this.nodes)];
                this.Swap(node, formerLastNode);
                this.nodes[System.Array.index(this.Count, this.nodes)] = null;
                this.Count = (this.Count - 1) | 0;

                //Now bubble formerLastNode (which is no longer the last node) up or down as appropriate
                this.OnNodeUpdated(formerLastNode);
            },
            GetEnumerator: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    i,
                    $async_e;

                var $enumerator = new (Bridge.GeneratorEnumerator$1(T))(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    i = 1;
                                        $step = 1;
                                        continue;
                                }
                                case 1: {
                                    if ( i <= this.Count ) {
                                            $step = 2;
                                            continue;
                                        }
                                    $step = 5;
                                    continue;
                                }
                                case 2: {
                                    $enumerator.current = this.nodes[System.Array.index(i, this.nodes)];
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    $step = 4;
                                    continue;
                                }
                                case 4: {
                                    i = (i + 1) | 0;
                                    $step = 1;
                                    continue;
                                }
                                case 5: {

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
            },
            System$Collections$IEnumerable$GetEnumerator: function () {
                return this.GetEnumerator();
            },
            Swap: function (node1, node2) {
                //Swap the nodes
                this.nodes[System.Array.index(node1.QueueIndex, this.nodes)] = node2;
                this.nodes[System.Array.index(node2.QueueIndex, this.nodes)] = node1;

                //Swap their indicies
                var temp = node1.QueueIndex;
                node1.QueueIndex = node2.QueueIndex;
                node2.QueueIndex = temp;
            },
            CascadeUp: function (node) {
                //aka Heapify-up
                var parent = (Bridge.Int.div(node.QueueIndex, 2)) | 0;
                while (parent >= 1) {
                    var parentNode = this.nodes[System.Array.index(parent, this.nodes)];
                    if (SpineEngine.Utils.Collections.PriorityQueue$1(T).HasHigherPriority(parentNode, node)) {
                        break;
                    }

                    //Node has lower priority value, so move it up the heap
                    this.Swap(node, parentNode); //For some reason, this is faster with Swap() rather than (less..?) individual operations, like in CascadeDown()

                    parent = (Bridge.Int.div(node.QueueIndex, 2)) | 0;
                }
            },
            CascadeDown: function (node) {
                //aka Heapify-down
                var finalQueueIndex = node.QueueIndex;
                while (true) {
                    var newParent = node;
                    var childLeftIndex = Bridge.Int.mul(2, finalQueueIndex);

                    //Check if the left-child is higher-priority than the current node
                    if (childLeftIndex > this.Count) {
                        //This could be placed outside the loop, but then we'd have to check newParent != node twice
                        node.QueueIndex = finalQueueIndex;
                        this.nodes[System.Array.index(finalQueueIndex, this.nodes)] = node;
                        break;
                    }

                    var childLeft = this.nodes[System.Array.index(childLeftIndex, this.nodes)];
                    if (SpineEngine.Utils.Collections.PriorityQueue$1(T).HasHigherPriority(childLeft, newParent)) {
                        newParent = childLeft;
                    }

                    //Check if the right-child is higher-priority than either the current node or the left child
                    var childRightIndex = (childLeftIndex + 1) | 0;
                    if (childRightIndex <= this.Count) {
                        var childRight = this.nodes[System.Array.index(childRightIndex, this.nodes)];
                        if (SpineEngine.Utils.Collections.PriorityQueue$1(T).HasHigherPriority(childRight, newParent)) {
                            newParent = childRight;
                        }
                    }

                    //If either of the children has higher (smaller) priority, swap and continue cascading
                    if (!Bridge.referenceEquals(newParent, node)) {
                        //Move new parent to its new index.  node will be moved once, at the end
                        //Doing it this way is one less assignment operation than calling Swap()
                        this.nodes[System.Array.index(finalQueueIndex, this.nodes)] = newParent;

                        var temp = newParent.QueueIndex;
                        newParent.QueueIndex = finalQueueIndex;
                        finalQueueIndex = temp;
                    } else {
                        //See note above
                        node.QueueIndex = finalQueueIndex;
                        this.nodes[System.Array.index(finalQueueIndex, this.nodes)] = node;
                        break;
                    }
                }
            },
            /**
             * Resize the queue so it can accept more nodes.  All currently enqueued nodes are remain.
                 Attempting to decrease the queue size to a size too small to hold the existing nodes results in undefined behavior
                 O(n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @param   {number}    maxNodes
             * @return  {void}
             */
            Resize: function (maxNodes) {

                var newArray = System.Array.init(((maxNodes + 1) | 0), function (){
                    return Bridge.getDefaultValue(T);
                }, T);
                var highestIndexToCopy = Math.min(maxNodes, this.Count);
                for (var i = 1; i <= highestIndexToCopy; i = (i + 1) | 0) {
                    newArray[System.Array.index(i, newArray)] = this.nodes[System.Array.index(i, this.nodes)];
                }

                this.nodes = newArray;
            },
            OnNodeUpdated: function (node) {
                //Bubble the updated node up or down as appropriate
                var parentIndex = (Bridge.Int.div(node.QueueIndex, 2)) | 0;
                var parentNode = this.nodes[System.Array.index(parentIndex, this.nodes)];

                if (parentIndex > 0 && SpineEngine.Utils.Collections.PriorityQueue$1(T).HasHigherPriority(node, parentNode)) {
                    this.CascadeUp(node);
                } else {
                    //Note that CascadeDown will be called if parentNode == node (that is, node is the root)
                    this.CascadeDown(node);
                }
            },
            /**
             * <b>Should not be called in production code.</b>
                 Checks to make sure the queue is still in a valid state.  Used for testing/debugging the queue.
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.PriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.PriorityQueue$1
             * @return  {boolean}
             */
            IsValidQueue: function () {
                for (var i = 1; i < this.nodes.length; i = (i + 1) | 0) {
                    if (this.nodes[System.Array.index(i, this.nodes)] != null) {
                        var childLeftIndex = Bridge.Int.mul(2, i);
                        if (childLeftIndex < this.nodes.length && this.nodes[System.Array.index(childLeftIndex, this.nodes)] != null && SpineEngine.Utils.Collections.PriorityQueue$1(T).HasHigherPriority(this.nodes[System.Array.index(childLeftIndex, this.nodes)], this.nodes[System.Array.index(i, this.nodes)])) {
                            return false;
                        }

                        var childRightIndex = (childLeftIndex + 1) | 0;
                        if (childRightIndex < this.nodes.length && this.nodes[System.Array.index(childRightIndex, this.nodes)] != null && SpineEngine.Utils.Collections.PriorityQueue$1(T).HasHigherPriority(this.nodes[System.Array.index(childRightIndex, this.nodes)], this.nodes[System.Array.index(i, this.nodes)])) {
                            return false;
                        }
                    }
                }

                return true;
            }
        }
    }; });

    Bridge.define("SpineEngine.Utils.Collections.SimplePriorityQueue$1", function (T) { return {
        inherits: [SpineEngine.Utils.Collections.IPriorityQueue$1(T)],
        statics: {
            fields: {
                InitialQueueSize: 0
            },
            ctors: {
                init: function () {
                    this.InitialQueueSize = 10;
                }
            }
        },
        fields: {
            queue: null
        },
        props: {
            /**
             * Returns the number of nodes in the queue.
                 O(1)
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @function Count
             * @type number
             */
            Count: {
                get: function () {
                    this.queue;
                    {
                        return this.queue.Count;
                    }
                }
            },
            /**
             * Returns the head of the queue, without removing it (use Dequeue() for that).
                 Throws an exception when the queue is empty.
                 O(1)
             *
             * @instance
             * @public
             * @readonly
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @function First
             * @type T
             */
            First: {
                get: function () {
                    this.queue;
                    {
                        if (this.queue.Count <= 0) {
                            throw new System.InvalidOperationException.$ctor1("Cannot call .First on an empty queue");
                        }

                        var first = this.queue.First;
                        return first != null ? first.Data : Bridge.getDefaultValue(T);
                    }
                }
            }
        },
        alias: [
            "Count", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Count",
            "First", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$First",
            "Clear", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Clear",
            "Contains", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Contains",
            "Dequeue", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Dequeue",
            "Enqueue", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Enqueue",
            "Remove", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$Remove",
            "UpdatePriority", "SpineEngine$Utils$Collections$IPriorityQueue$1$" + Bridge.getTypeAlias(T) + "$UpdatePriority",
            "GetEnumerator", ["System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$GetEnumerator", "System$Collections$Generic$IEnumerable$1$GetEnumerator"]
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this.queue = new (SpineEngine.Utils.Collections.PriorityQueue$1(SpineEngine.Utils.Collections.SimplePriorityQueue$1.SimpleNode(T)))(SpineEngine.Utils.Collections.SimplePriorityQueue$1(T).InitialQueueSize);
            }
        },
        methods: {
            /**
             * Removes every node from the queue.
                 O(n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @return  {void}
             */
            Clear: function () {
                this.queue;
                {
                    this.queue.Clear();
                }
            },
            /**
             * Returns whether the given item is in the queue.
                 O(n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @param   {T}          item
             * @return  {boolean}
             */
            Contains: function (item) {
                var $t;
                this.queue;
                {
                    var comparer = System.Collections.Generic.EqualityComparer$1(T).def;
                    $t = Bridge.getEnumerator(this.queue);
                    try {
                        while ($t.moveNext()) {
                            var node = $t.Current;
                            if (comparer.equals2(node.Data, item)) {
                                return true;
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    return false;
                }
            },
            /**
             * Removes the head of the queue (node with minimum priority; ties are broken by order of insertion), and returns it.
                 If queue is empty, throws an exception
                 O(log n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @return  {T}
             */
            Dequeue: function () {
                this.queue;
                {
                    if (this.queue.Count <= 0) {
                        throw new System.InvalidOperationException.$ctor1("Cannot call Dequeue() on an empty queue");
                    }

                    var node = this.queue.Dequeue();
                    return node.Data;
                }
            },
            /**
             * Enqueue a node to the priority queue.  Lower values are placed in front. Ties are broken by first-in-first-out.
                 This queue automatically resizes itself, so there's no concern of the queue becoming 'full'.
                 Duplicates are allowed.
                 O(log n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @param   {T}         item        
             * @param   {number}    priority
             * @return  {void}
             */
            Enqueue: function (item, priority) {
                this.queue;
                {
                    var node = new (SpineEngine.Utils.Collections.SimplePriorityQueue$1.SimpleNode(T))(item);
                    if (this.queue.Count === this.queue.MaxSize) {
                        this.queue.Resize(((Bridge.Int.mul(this.queue.MaxSize, 2) + 1) | 0));
                    }

                    this.queue.Enqueue(node, priority);
                }
            },
            /**
             * Removes an item from the queue.  The item does not need to be the head of the queue.
                 If the item is not in the queue, an exception is thrown.  If unsure, check Contains() first.
                 If multiple copies of the item are enqueued, only the first one is removed.
                 O(n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @param   {T}       item
             * @return  {void}
             */
            Remove: function (item) {
                this.queue;
                {
                    try {
                        this.queue.Remove(this.GetExistingNode(item));
                    } catch ($e1) {
                        $e1 = System.Exception.create($e1);
                        var ex;
                        if (Bridge.is($e1, System.InvalidOperationException)) {
                            ex = $e1;
                            throw new System.InvalidOperationException.$ctor2(System.String.concat("Cannot call Remove() on a node which is not enqueued: ", item), ex);
                        } else {
                            throw $e1;
                        }
                    }
                }
            },
            /**
             * Call this method to change the priority of an item.
                 Calling this method on a item not in the queue will throw an exception.
                 If the item is enqueued multiple times, only the first one will be updated.
                 (If your requirements are complex enough that you need to enqueue the same item multiple times <i>and</i> be able
                 to update all of them, please wrap your items in a wrapper class so they can be distinguished).
                 O(n)
             *
             * @instance
             * @public
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @param   {T}         item        
             * @param   {number}    priority
             * @return  {void}
             */
            UpdatePriority: function (item, priority) {
                this.queue;
                {
                    try {
                        var updateMe = this.GetExistingNode(item);
                        this.queue.UpdatePriority(updateMe, priority);
                    } catch ($e1) {
                        $e1 = System.Exception.create($e1);
                        var ex;
                        if (Bridge.is($e1, System.InvalidOperationException)) {
                            ex = $e1;
                            throw new System.InvalidOperationException.$ctor2(System.String.concat("Cannot call UpdatePriority() on a node which is not enqueued: ", item), ex);
                        } else {
                            throw $e1;
                        }
                    }
                }
            },
            GetEnumerator: function () {
                var $t;
                var queueData = new (System.Collections.Generic.List$1(T)).ctor();
                this.queue;
                {
                    //Copy to a separate list because we don't want to 'yield return' inside a lock
                    $t = Bridge.getEnumerator(this.queue);
                    try {
                        while ($t.moveNext()) {
                            var node = $t.Current;
                            queueData.add(node.Data);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }

                return queueData.GetEnumerator().$clone();
            },
            System$Collections$IEnumerable$GetEnumerator: function () {
                return this.GetEnumerator();
            },
            /**
             * Given an item of type T, returns the exist SimpleNode in the queue
             *
             * @instance
             * @private
             * @this SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @memberof SpineEngine.Utils.Collections.SimplePriorityQueue$1
             * @param   {T}                                                                 item
             * @return  {SpineEngine.Utils.Collections.SimplePriorityQueue$1.SimpleNode}
             */
            GetExistingNode: function (item) {
                var $t;
                var comparer = System.Collections.Generic.EqualityComparer$1(T).def;
                $t = Bridge.getEnumerator(this.queue);
                try {
                    while ($t.moveNext()) {
                        var node = $t.Current;
                        if (comparer.equals2(node.Data, item)) {
                            return node;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                throw new System.InvalidOperationException.$ctor1(System.String.concat("Item cannot be found in queue: ", item));
            },
            IsValidQueue: function () {
                this.queue;
                {
                    return this.queue.IsValidQueue();
                }
            }
        }
    }; });

    Bridge.define("SpineEngine.Utils.Collections.SimplePriorityQueue$1.SimpleNode", function (T) { return {
        inherits: [SpineEngine.Utils.Collections.PriorityQueueNode],
        $kind: "nested class",
        props: {
            Data: Bridge.getDefaultValue(T)
        },
        ctors: {
            ctor: function (data) {
                this.$initialize();
                SpineEngine.Utils.Collections.PriorityQueueNode.ctor.call(this);
                this.Data = data;
            }
        }
    }; });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadDpadLeftRight", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                if (inputGamePad.DpadRightDown) {
                    this.Value = 1.0;
                } else {
                    if (inputGamePad.DpadLeftDown) {
                        this.Value = -1.0;
                    } else {
                        this.Value = 0.0;
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadDpadUpDown", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                if (inputGamePad.DpadDownDown) {
                    this.Value = 1.0;
                } else {
                    if (inputGamePad.DpadUpDown) {
                        this.Value = -1.0;
                    } else {
                        this.Value = 0.0;
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadLeftStickX", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        fields: {
            Deadzone: 0
        },
        ctors: {
            ctor: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node.ctor.call(this);
                this.Deadzone = deadzone;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.Value = SpineEngine.Maths.Mathf.SignThreshold(inputGamePad.GetLeftStick$1(this.Deadzone).X, this.Deadzone);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadLeftStickY", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        fields: {
            Deadzone: 0,
            /**
             * if true, pressing up will return -1 and down will return 1 matching GamePadDpadUpDown
             *
             * @instance
             * @public
             * @memberof SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadLeftStickY
             * @default true
             * @type boolean
             */
            InvertResult: false
        },
        ctors: {
            init: function () {
                this.InvertResult = true;
            },
            ctor: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node.ctor.call(this);
                this.Deadzone = deadzone;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                var multiplier = this.InvertResult ? -1 : 1;
                this.Value = multiplier * SpineEngine.Maths.Mathf.SignThreshold(inputGamePad.GetLeftStick$1(this.Deadzone).Y, this.Deadzone);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadRightStickX", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        fields: {
            Deadzone: 0
        },
        ctors: {
            ctor: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node.ctor.call(this);
                this.Deadzone = deadzone;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.Value = SpineEngine.Maths.Mathf.SignThreshold(inputGamePad.GetRightStick$1(this.Deadzone).X, this.Deadzone);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.GamePadRightStickY", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        fields: {
            Deadzone: 0
        },
        ctors: {
            ctor: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node.ctor.call(this);
                this.Deadzone = deadzone;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.Value = SpineEngine.Maths.Mathf.SignThreshold(inputGamePad.GetRightStick$1(this.Deadzone).Y, this.Deadzone);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.KeyboardKeys", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        fields: {
            Negative: 0,
            Positive: 0
        },
        ctors: {
            ctor: function (negative, positive) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node.ctor.call(this);
                this.Negative = negative;
                this.Positive = positive;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.SetValue(inputKeyboard.IsKeyDown(this.Negative), inputKeyboard.IsKeyDown(this.Positive));
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.MouseButtons", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.SetValue(inputMouse.LeftMouseButtonDown, inputMouse.RightMouseButtonDown);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.SettableValue", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        props: {
            AxisValue: 0
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.Value = this.AxisValue;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node],
        $kind: "nested class",
        fields: {
            isVertical: false,
            region: null
        },
        ctors: {
            init: function () {
                this.region = new Microsoft.Xna.Framework.Rectangle();
            },
            ctor: function (isVertical, region) {
                if (region === void 0) { region = null; }
                var $t;

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.Node.ctor.call(this);
                this.isVertical = isVertical;
                this.region = ($t = region, $t != null ? $t : SpineEngine.Core.Instance.Screen.Bounds);
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                if (!inputTouch.IsConnected || !System.Linq.Enumerable.from(inputTouch.CurrentTouches).any()) {
                    this.Value = 0;
                    return;
                }

                var leftTouch;
                var rightTouch;

                if (this.isVertical) {
                    leftTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion.f1));
                    rightTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion.f2));
                } else {
                    leftTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion.f3));
                    rightTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion.f4));
                }

                this.SetValue(leftTouch, rightTouch);
            }
        }
    });

    Bridge.ns("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion", $asm.$);

    Bridge.apply($asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.TouchHalfRegion, {
        f1: function (a) {
            return a.Position.Y < this.region.$clone().Height / 2.0;
        },
        f2: function (a) {
            return a.Position.Y >= this.region.$clone().Height / 2.0;
        },
        f3: function (a) {
            return a.Position.X < this.region.$clone().Width / 2.0;
        },
        f4: function (a) {
            return a.Position.X >= this.region.$clone().Width / 2.0;
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadButton", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        fields: {
            Button: 0
        },
        ctors: {
            ctor: function (button) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node.ctor.call(this);
                this.Button = button;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.IsButtonDown(this.Button);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadDPadDown", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.DpadDownDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadDPadLeft", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.DpadLeftDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadDPadRight", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.DpadRightDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadDPadUp", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.DpadUpDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadLeftTrigger", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        fields: {
            Threshold: 0
        },
        ctors: {
            ctor: function (threshold) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node.ctor.call(this);
                this.Threshold = threshold;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.IsLeftTriggerDown(this.Threshold);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.GamePadRightTrigger", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        fields: {
            Threshold: 0
        },
        ctors: {
            ctor: function (threshold) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node.ctor.call(this);
                this.Threshold = threshold;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputGamePad.IsRightTriggerDown(this.Threshold);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.KeyboardKey", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        fields: {
            Key: 0
        },
        ctors: {
            ctor: function (key) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node.ctor.call(this);
                this.Key = key;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputKeyboard.IsKeyDown(this.Key);
            }
        }
    });

    /**
     * works like KeyboardKey except the modifier key must also be down for isDown/isPressed to be true. isReleased checks
         only key.
     *
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.KeyboardModifiedKey
     * @augments SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.KeyboardModifiedKey", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        fields: {
            Key: 0,
            Modifier: 0
        },
        ctors: {
            ctor: function (key, modifier) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node.ctor.call(this);
                this.Key = key;
                this.Modifier = modifier;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputKeyboard.IsKeyDown(this.Modifier) && inputKeyboard.IsKeyDown(this.Key);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.MouseLeftButton", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputMouse.LeftMouseButtonDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.MouseMiddleButton", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputMouse.MiddleMouseButtonDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.MouseRightButton", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputMouse.RightMouseButtonDown;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.SettableValue", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        fields: {
            ButtonValue: false
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = this.ButtonValue;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.TouchTouched", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualButton.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.IsDown = inputTouch.IsConnected && System.Linq.Enumerable.from(inputTouch.CurrentTouches).any();
            }
        }
    });

    /**
     * A virtual input that is represented as a int that is either -1, 0, or 1. It corresponds to input that can range
         from on to neutral to off
         such as GamePad DPad left/right. Can also use two keyboard Keys as the positive/negative checks.
     *
     * @public
     * @class SpineEngine.ECS.EntitySystems.VirtualInput.VirtualIntegerAxis
     * @augments SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis
     */
    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualIntegerAxis", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis],
        props: {
            IntegerValue: {
                get: function () {
                    return Bridge.Int.sign(this.Value);
                }
            }
        },
        ctors: {
            ctor: function (overlap) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.ctor.call(this, overlap);
            },
            $ctor1: function (overlap, nodes) {
                if (nodes === void 0) { nodes = []; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualAxis.ctor.call(this, overlap);
                this.Nodes.AddRange(nodes);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.GamePadDpad", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node],
        $kind: "nested class",
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                if (inputGamePad.DpadRightDown) {
                    this.ValueX = 1;
                } else {
                    if (inputGamePad.DpadLeftDown) {
                        this.ValueX = -1;
                    } else {
                        this.ValueX = 0;
                    }
                }

                if (inputGamePad.DpadDownDown) {
                    this.ValueY = 1;
                } else {
                    if (inputGamePad.DpadUpDown) {
                        this.ValueY = -1;
                    } else {
                        this.ValueY = 0;
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.GamePadLeftStick", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node],
        $kind: "nested class",
        fields: {
            Deadzone: 0
        },
        ctors: {
            ctor: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node.ctor.call(this);
                this.Deadzone = deadzone;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                var value = inputGamePad.GetLeftStick$1(this.Deadzone);
                this.ValueX = value.X;
                this.ValueY = value.Y;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.GamePadRightStick", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node],
        $kind: "nested class",
        fields: {
            Deadzone: 0
        },
        ctors: {
            ctor: function (deadzone) {
                if (deadzone === void 0) { deadzone = 0.1; }

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node.ctor.call(this);
                this.Deadzone = deadzone;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                var value = inputGamePad.GetRightStick$1(this.Deadzone);
                this.ValueX = value.X;
                this.ValueY = value.Y;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.KeyboardKeys", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node],
        $kind: "nested class",
        fields: {
            Down: 0,
            Left: 0,
            Right: 0,
            Up: 0
        },
        ctors: {
            ctor: function (left, right, up, down) {
                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node.ctor.call(this);
                this.Left = left;
                this.Right = right;
                this.Up = up;
                this.Down = down;
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                var up = inputKeyboard.IsKeyDown(this.Up);
                var down = inputKeyboard.IsKeyDown(this.Down);
                var left = inputKeyboard.IsKeyDown(this.Left);
                var right = inputKeyboard.IsKeyDown(this.Right);

                this.SetValue(up, down, left, right);
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.SettableValue", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node],
        $kind: "nested class",
        fields: {
            JoysticValue: null
        },
        ctors: {
            init: function () {
                this.JoysticValue = new Microsoft.Xna.Framework.Vector2();
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                this.ValueX = this.JoysticValue.X;
                this.ValueY = this.JoysticValue.Y;
            }
        }
    });

    Bridge.define("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion", {
        inherits: [SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node],
        $kind: "nested class",
        fields: {
            region: null
        },
        ctors: {
            init: function () {
                this.region = new Microsoft.Xna.Framework.Rectangle();
            },
            ctor: function (region) {
                if (region === void 0) { region = null; }
                var $t;

                this.$initialize();
                SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.Node.ctor.call(this);
                this.region = ($t = region, $t != null ? $t : SpineEngine.Core.Instance.Screen.Bounds);
            }
        },
        methods: {
            Update: function (inputKeyboard, inputMouse, inputTouch, inputGamePad) {
                if (!inputTouch.IsConnected || !System.Linq.Enumerable.from(inputTouch.CurrentTouches).any()) {
                    this.ValueX = 0;
                    this.ValueY = 0;
                    return;
                }

                var leftTouch;
                var rightTouch;
                var upTouch;
                var downTouch;

                upTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion.f1));
                downTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion.f2));
                leftTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion.f3));
                rightTouch = System.Linq.Enumerable.from(inputTouch.CurrentTouches).any(Bridge.fn.bind(this, $asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion.f4));

                this.SetValue(upTouch, downTouch, leftTouch, rightTouch);
            }
        }
    });

    Bridge.ns("SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion", $asm.$);

    Bridge.apply($asm.$.SpineEngine.ECS.EntitySystems.VirtualInput.VirtualJoystick.TouchHalfRegion, {
        f1: function (a) {
            return a.Position.Y < this.region.$clone().Height / 2.0;
        },
        f2: function (a) {
            return a.Position.Y >= this.region.$clone().Height / 2.0;
        },
        f3: function (a) {
            return a.Position.X < this.region.$clone().Width / 2.0;
        },
        f4: function (a) {
            return a.Position.X >= this.region.$clone().Width / 2.0;
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.Tween$1", function (T) { return {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITween$1(T)],
        fields: {
            fromValue: Bridge.getDefaultValue(T),
            isFromValueOverridden: false,
            TweenTarget: null
        },
        props: {
            ToValue: Bridge.getDefaultValue(T),
            IsTimeScaleIndependent: false,
            TimeScale: 0,
            FromValue: {
                get: function () {
                    return this.fromValue;
                },
                set: function (value) {
                    this.isFromValueOverridden = true;
                    this.fromValue = value;
                }
            },
            EaseType: 0,
            CompletionHandler: null,
            LoopCompleteHandler: null,
            NextTween: null,
            Delay: 0,
            Duration: 0,
            LoopType: 0,
            Loops: 0,
            DelayBetweenLoops: 0,
            Target: {
                get: function () {
                    return this.TweenTarget["SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$" + Bridge.getTypeAlias(T) + "$Target"];
                }
            }
        },
        alias: [
            "FromValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$1$" + Bridge.getTypeAlias(T) + "$FromValue",
            "EaseType", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$EaseType",
            "CompletionHandler", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$1$" + Bridge.getTypeAlias(T) + "$CompletionHandler",
            "LoopCompleteHandler", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$1$" + Bridge.getTypeAlias(T) + "$LoopCompleteHandler",
            "NextTween", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NextTween",
            "Delay", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Delay",
            "Duration", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Duration",
            "LoopType", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$LoopType",
            "Loops", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Loops",
            "DelayBetweenLoops", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$DelayBetweenLoops",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$1$" + Bridge.getTypeAlias(T) + "$Target",
            "Start", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Start",
            "NotifyLoopCompleted", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NotifyLoopCompleted",
            "NotifyCompleted", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$NotifyCompleted",
            "Stop", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$Stop"
        ],
        ctors: {
            init: function () {
                this.TimeScale = 1.0;
            },
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                this.TweenTarget = tweenTarget;
                this.ToValue = toValue;
                this.Duration = duration;
            }
        },
        methods: {
            Start: function () {
                if (!this.isFromValueOverridden) {
                    this.FromValue = this.TweenTarget["SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$" + Bridge.getTypeAlias(T) + "$TweenedValue"];
                }
            },
            NotifyLoopCompleted: function () {
                var $t;
                !Bridge.staticEquals(($t = this.LoopCompleteHandler), null) ? $t(this) : null;
            },
            NotifyCompleted: function () {
                var $t;
                !Bridge.staticEquals(($t = this.CompletionHandler), null) ? $t(this) : null;
            },
            Stop: function () {
                this.LoopType = SpineEngine.GlobalManagers.Tweens.LoopType.None;
                this.Loops = 0;
            }
        }
    }; });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenTargets.ColorComponentTweenTarget", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1(Microsoft.Xna.Framework.Color)],
        fields: {
            target: null
        },
        props: {
            TweenedValue: {
                get: function () {
                    return this.target.Color.$clone();
                },
                set: function (value) {
                    this.target.Color = value.$clone();
                }
            },
            Target: {
                get: function () {
                    return this.target;
                }
            }
        },
        alias: [
            "TweenedValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Color$TweenedValue",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Color$Target"
        ],
        ctors: {
            ctor: function (target) {
                this.$initialize();
                this.target = target;
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenTargets.PositionComponentTweenTarget", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1(Microsoft.Xna.Framework.Vector2)],
        fields: {
            target: null
        },
        props: {
            TweenedValue: {
                get: function () {
                    return this.target.Position.$clone();
                },
                set: function (value) {
                    this.target.Position = value.$clone();
                }
            },
            Target: {
                get: function () {
                    return this.target;
                }
            }
        },
        alias: [
            "TweenedValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector2$TweenedValue",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector2$Target"
        ],
        ctors: {
            ctor: function (target) {
                this.$initialize();
                this.target = target;
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenTargets.RotateComponentTweenTarget", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1(System.Single)],
        fields: {
            target: null
        },
        props: {
            TweenedValue: {
                get: function () {
                    return this.target.Rotation;
                },
                set: function (value) {
                    this.target.Rotation = value;
                }
            },
            Target: {
                get: function () {
                    return this.target;
                }
            }
        },
        alias: [
            "TweenedValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$System$Single$TweenedValue",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$System$Single$Target"
        ],
        ctors: {
            ctor: function (target) {
                this.$initialize();
                this.target = target;
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenTargets.RotateDegreesComponentTweenTarget", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1(System.Single)],
        fields: {
            target: null
        },
        props: {
            TweenedValue: {
                get: function () {
                    return this.target.RotationDegrees;
                },
                set: function (value) {
                    this.target.RotationDegrees = value;
                }
            },
            Target: {
                get: function () {
                    return this.target;
                }
            }
        },
        alias: [
            "TweenedValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$System$Single$TweenedValue",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$System$Single$Target"
        ],
        ctors: {
            ctor: function (target) {
                this.$initialize();
                this.target = target;
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.TweenTargets.ScaleComponentTweenTarget", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Interfaces.ITweenTarget$1(Microsoft.Xna.Framework.Vector2)],
        fields: {
            target: null
        },
        props: {
            TweenedValue: {
                get: function () {
                    return this.target.Scale.$clone();
                },
                set: function (value) {
                    this.target.Scale = value.$clone();
                }
            },
            Target: {
                get: function () {
                    return this.target;
                }
            }
        },
        alias: [
            "TweenedValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector2$TweenedValue",
            "Target", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector2$Target"
        ],
        ctors: {
            ctor: function (target) {
                this.$initialize();
                this.target = target;
            }
        }
    });

    /** @namespace SpineEngine.Graphics.Drawable */

    /**
     * The drawable sizes are set when the ninepatch is set, but they are separate values. Eg, {@link
         Drawable#getLeftWidth()} could
         be set to more than {@link NinePatch#getLeftWidth()} in order to provide more space on the left than actually
         exists in the
         ninepatch.
         The min size is set to the ninepatch total size by default. It could be set to the left+right and top+bottom,
         excluding the
         middle size, to allow the drawable to be sized down as small as possible.
     *
     * @public
     * @class SpineEngine.Graphics.Drawable.NinePatchDrawable
     * @augments SpineEngine.Graphics.Drawable.SubtextureDrawable
     */
    Bridge.define("SpineEngine.Graphics.Drawable.NinePatchDrawable", {
        inherits: [SpineEngine.Graphics.Drawable.SubtextureDrawable],
        statics: {
            fields: {
                TopLeft: 0,
                TopCenter: 0,
                TopRight: 0,
                MiddleLeft: 0,
                MiddleCenter: 0,
                MiddleRight: 0,
                BottomLeft: 0,
                BottomCenter: 0,
                BottomRight: 0
            },
            ctors: {
                init: function () {
                    this.TopLeft = 0;
                    this.TopCenter = 1;
                    this.TopRight = 2;
                    this.MiddleLeft = 3;
                    this.MiddleCenter = 4;
                    this.MiddleRight = 5;
                    this.BottomLeft = 6;
                    this.BottomCenter = 7;
                    this.BottomRight = 8;
                }
            },
            methods: {
                /**
                 * generates nine patch Rectangles. destArray should have 9 elements. renderRect is the final area in which the nine
                     patch will be rendered.
                     To just get the source rects for rendering pass in the SubtextureDrawable.sourceRect. Pass in a larger Rectangle to
                     get final destination
                     rendering Rectangles.
                 *
                 * @static
                 * @public
                 * @this SpineEngine.Graphics.Drawable.NinePatchDrawable
                 * @memberof SpineEngine.Graphics.Drawable.NinePatchDrawable
                 * @param   {Microsoft.Xna.Framework.Rectangle}            renderRect      Render rect.
                 * @param   {Array.<Microsoft.Xna.Framework.Rectangle>}    destArray       Destination array.
                 * @param   {number}                                       marginLeft      Margin left.
                 * @param   {number}                                       marginRight     Margin right.
                 * @param   {number}                                       marginTop       Margin top.
                 * @param   {number}                                       marginBottom    Margin bottom.
                 * @return  {void}
                 */
                GenerateNinePatchRects: function (renderRect, destArray, marginLeft, marginRight, marginTop, marginBottom) {

                    var stretchedCenterWidth = (((renderRect.Width - marginLeft) | 0) - marginRight) | 0;
                    var stretchedCenterHeight = (((renderRect.Height - marginTop) | 0) - marginBottom) | 0;
                    var bottomY = (((renderRect.Y + renderRect.Height) | 0) - marginBottom) | 0;
                    var rightX = (((renderRect.X + renderRect.Width) | 0) - marginRight) | 0;
                    var leftX = (renderRect.X + marginLeft) | 0;
                    var topY = (renderRect.Y + marginTop) | 0;

                    destArray[System.Array.index(0, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(renderRect.X, renderRect.Y, marginLeft, marginTop); // top-left
                    destArray[System.Array.index(1, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(leftX, renderRect.Y, stretchedCenterWidth, marginTop); // top-center
                    destArray[System.Array.index(2, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(rightX, renderRect.Y, marginRight, marginTop); // top-right

                    destArray[System.Array.index(3, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(renderRect.X, topY, marginLeft, stretchedCenterHeight); // middle-left
                    destArray[System.Array.index(4, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(leftX, topY, stretchedCenterWidth, stretchedCenterHeight); // middle-center
                    destArray[System.Array.index(5, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(rightX, topY, marginRight, stretchedCenterHeight); // middle-right

                    destArray[System.Array.index(6, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(renderRect.X, bottomY, marginLeft, marginBottom); // bottom-left
                    destArray[System.Array.index(7, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(leftX, bottomY, stretchedCenterWidth, marginBottom); // bottom-center
                    destArray[System.Array.index(8, destArray)] = new Microsoft.Xna.Framework.Rectangle.$ctor2(rightX, bottomY, marginRight, marginBottom); // bottom-right
                }
            }
        },
        fields: {
            Bottom: 0,
            destinationRects: null,
            Left: 0,
            NinePatchRects: null,
            Right: 0,
            Top: 0
        },
        alias: ["DrawInto$1", "SpineEngine$Graphics$Drawable$IDrawable$DrawInto$1"],
        ctors: {
            init: function () {
                this.destinationRects = System.Array.init(9, function (){
                    return new Microsoft.Xna.Framework.Rectangle();
                }, Microsoft.Xna.Framework.Rectangle);
                this.NinePatchRects = System.Array.init(9, function (){
                    return new Microsoft.Xna.Framework.Rectangle();
                }, Microsoft.Xna.Framework.Rectangle);
            },
            ctor: function (texture, sourceRect, left, right, top, bottom) {
                SpineEngine.Graphics.Drawable.NinePatchDrawable.$ctor2.call(this, new SpineEngine.Graphics.Drawable.SubtextureDrawable.$ctor1(texture, sourceRect.$clone()), left, right, top, bottom);
            },
            $ctor1: function (texture, left, right, top, bottom) {
                SpineEngine.Graphics.Drawable.NinePatchDrawable.$ctor2.call(this, new SpineEngine.Graphics.Drawable.SubtextureDrawable.ctor(texture), left, right, top, bottom);
            },
            $ctor2: function (subtexture, left, right, top, bottom) {
                this.$initialize();
                SpineEngine.Graphics.Drawable.SubtextureDrawable.ctor.call(this, subtexture.Texture2D);
                this.Left = left;
                this.Right = right;
                this.Top = top;
                this.Bottom = bottom;

                SpineEngine.Graphics.Drawable.NinePatchDrawable.GenerateNinePatchRects(subtexture.SourceRect.$clone(), this.NinePatchRects, left, right, top, bottom);
            }
        },
        methods: {
            DrawInto$1: function (width, height, color, depth, target) {
                var $t;
                var scale = new Microsoft.Xna.Framework.Vector2.$ctor2(width / this.SourceRect.Width, height / this.SourceRect.Height);

                var rects = new (System.Collections.Generic.List$1(System.Tuple$2(Microsoft.Xna.Framework.Rectangle,Microsoft.Xna.Framework.Rectangle))).ctor();
                var sourceRects = this.NinePatchRects;

                SpineEngine.Graphics.Drawable.NinePatchDrawable.GenerateNinePatchRects(this.SourceRect.$clone(), this.destinationRects, Bridge.Int.clip32(this.Left / scale.X), Bridge.Int.clip32(this.Right / scale.X), Bridge.Int.clip32(this.Top / scale.Y), Bridge.Int.clip32(this.Bottom / scale.Y));

                for (var i = 0; i < 9; i = (i + 1) | 0) {
                    var source = sourceRects[System.Array.index(i, sourceRects)].$clone();
                    var destination = this.destinationRects[System.Array.index(i, this.destinationRects)].$clone();
                    destination.Location = Microsoft.Xna.Framework.Point.op_Subtraction(destination.Location.$clone(), Microsoft.Xna.Framework.Point.op_Addition(this.SourceRect.Location.$clone(), (($t = (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.Origin), null) ? System.Nullable.getValue(System.Nullable.lift1("$clone", this.Origin)).ToPoint() : null), $t != null ? $t : this.SourceRect.Center))));
                    destination.Width = Bridge.Int.clip32(destination.Width * width / this.SourceRect.Width);
                    destination.Height = Bridge.Int.clip32(destination.Height * height / this.SourceRect.Height);
                    rects.add({ Item1: source.$clone(), Item2: destination.$clone() });
                }

                for (var i1 = 0; i1 < rects.Count; i1 = (i1 + 1) | 0) {
                    var rect = rects.getItem(i1);
                    var source1 = rect.Item1.$clone();
                    var destination1 = rect.Item2.$clone();

                    target.Draw(this.Texture2D, SpineEngine.Maths.RectangleF.op_Implicit$1(destination1.$clone()), SpineEngine.Maths.RectangleF.op_Implicit$1(source1.$clone()), color.$clone(), depth);
                }
            }
        }
    });

    /**
     * Draws a {@link SubtextureDrawable} repeatedly to fill the area, instead of stretching it
     *
     * @public
     * @class SpineEngine.Graphics.Drawable.TiledDrawable
     * @augments SpineEngine.Graphics.Drawable.SubtextureDrawable
     */
    Bridge.define("SpineEngine.Graphics.Drawable.TiledDrawable", {
        inherits: [SpineEngine.Graphics.Drawable.SubtextureDrawable],
        alias: ["DrawInto$1", "SpineEngine$Graphics$Drawable$IDrawable$DrawInto$1"],
        ctors: {
            $ctor1: function (subtexture) {
                this.$initialize();
                SpineEngine.Graphics.Drawable.SubtextureDrawable.ctor.call(this, subtexture.Texture2D);
            },
            ctor: function (texture) {
                this.$initialize();
                SpineEngine.Graphics.Drawable.SubtextureDrawable.ctor.call(this, texture);
            }
        },
        methods: {
            DrawInto$1: function (width, height, color, depth, target) {
                var $t, $t1;
                var source = this.SourceRect.$clone();
                var destination = new SpineEngine.Maths.RectangleF.$ctor2(-(($t = (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.Origin), null) ? System.Nullable.getValue(System.Nullable.lift1("$clone", this.Origin)).X : null), $t != null ? $t : ((Bridge.Int.div(source.Width, 2)) | 0))), -(($t1 = (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.Origin), null) ? System.Nullable.getValue(System.Nullable.lift1("$clone", this.Origin)).Y : null), $t1 != null ? $t1 : ((Bridge.Int.div(source.Height, 2)) | 0))), source.Width, source.Height);

                var repeatX = width / this.SourceRect.Width;
                var repeatY = height / this.SourceRect.Height;

                for (var x = 0; x < repeatX; x = (x + 1) | 0) {
                    for (var y = 0; y < repeatY; y = (y + 1) | 0) {
                        var destination1 = destination.$clone();
                        destination1.Location = Microsoft.Xna.Framework.Vector2.op_Addition(destination1.Location.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(Bridge.Int.mul(x, this.SourceRect.Width), Bridge.Int.mul(y, this.SourceRect.Height)));
                        target.Draw(this.Texture2D, destination1.$clone(), SpineEngine.Maths.RectangleF.op_Implicit$1(source.$clone()), color.$clone(), depth);
                    }
                }
            }
        }
    });

    Bridge.define("SpineEngine.Graphics.Renderers.DefaultRenderer", {
        inherits: [SpineEngine.Graphics.Renderers.Renderer],
        methods: {
            IsApplicable: function (entity) {
                return true;
            }
        }
    });

    /** @namespace SpineEngine.Graphics.Renderers */

    /**
     * Renderer that only renders all but one renderLayer. Useful to keep UI rendering separate from the rest of the game
         when used in conjunction
         with a RenderLayerRenderer. Note that UI would most likely want to be rendered in screen space so the camera matrix
         shouldn't be passed to
         Batcher.Begin.
     *
     * @public
     * @class SpineEngine.Graphics.Renderers.RenderLayerExcludeRenderer
     * @augments SpineEngine.Graphics.Renderers.Renderer
     */
    Bridge.define("SpineEngine.Graphics.Renderers.RenderLayerExcludeRenderer", {
        inherits: [SpineEngine.Graphics.Renderers.Renderer],
        fields: {
            ExcludedRenderLayers: null
        },
        ctors: {
            ctor: function (excludedRenderLayers) {
                if (excludedRenderLayers === void 0) { excludedRenderLayers = []; }

                this.$initialize();
                SpineEngine.Graphics.Renderers.Renderer.ctor.call(this);
                this.ExcludedRenderLayers = excludedRenderLayers;
            }
        },
        methods: {
            IsApplicable: function (entity) {
                var $t, $t1;
                return !System.Linq.Enumerable.from(this.ExcludedRenderLayers).contains(($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.RenderLayerComponent)) != null ? $t1.Layer : null), $t != null ? $t : 0));
            }
        }
    });

    /**
     * Renderer that only renders the specified renderLayers. Useful to keep UI rendering separate from the rest of the
         game when used in conjunction
         with other RenderLayerRenderers rendering different renderLayers.
     *
     * @public
     * @class SpineEngine.Graphics.Renderers.RenderLayerRenderer
     * @augments SpineEngine.Graphics.Renderers.Renderer
     */
    Bridge.define("SpineEngine.Graphics.Renderers.RenderLayerRenderer", {
        inherits: [SpineEngine.Graphics.Renderers.Renderer],
        fields: {
            /**
             * the renderLayers this Renderer will render
             *
             * @instance
             * @public
             * @memberof SpineEngine.Graphics.Renderers.RenderLayerRenderer
             * @type Array.<number>
             */
            RenderLayers: null
        },
        ctors: {
            ctor: function (renderLayers) {
                if (renderLayers === void 0) { renderLayers = []; }

                this.$initialize();
                SpineEngine.Graphics.Renderers.Renderer.ctor.call(this);
                System.Array.sort(renderLayers);
                System.Array.reverse(renderLayers);
                this.RenderLayers = renderLayers;
            }
        },
        methods: {
            IsApplicable: function (entity) {
                var $t, $t1;
                return System.Array.contains(this.RenderLayers, ($t = (($t1 = entity.GetComponent(SpineEngine.ECS.Components.RenderLayerComponent)) != null ? $t1.Layer : null), $t != null ? $t : 0), System.Int32);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.ColorTween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Color)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Color).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Color$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease(this.EaseType, this.FromValue.$clone(), this.ToValue.$clone(), elapsedTime, this.Duration);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.FloatTween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(System.Single)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(System.Single).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$System$Single$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease$8(this.EaseType, this.FromValue, this.ToValue, elapsedTime, this.Duration);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.IntTween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(System.Int32)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(System.Int32).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$System$Int32$TweenedValue = Bridge.Int.clip32(SpineEngine.Maths.Easing.Lerps.Ease$8(this.EaseType, this.FromValue, this.ToValue, elapsedTime, this.Duration));
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.QuaternionTween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Quaternion)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Quaternion).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Quaternion$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease$2(this.EaseType, this.FromValue.$clone(), this.ToValue.$clone(), elapsedTime, this.Duration);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.RectangleTween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Rectangle)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Rectangle).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Rectangle$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease$3(this.EaseType, this.FromValue.$clone(), this.ToValue.$clone(), elapsedTime, this.Duration);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector2Tween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Vector2)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Vector2).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector2$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease$5(this.EaseType, this.FromValue.$clone(), this.ToValue.$clone(), elapsedTime, this.Duration);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector3Tween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Vector3)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Vector3).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector3$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease$6(this.EaseType, this.FromValue.$clone(), this.ToValue.$clone(), elapsedTime, this.Duration);
            }
        }
    });

    Bridge.define("SpineEngine.GlobalManagers.Tweens.PrimitiveTweens.Vector4Tween", {
        inherits: [SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Vector4)],
        alias: ["UpdateValue", "SpineEngine$GlobalManagers$Tweens$Interfaces$ITween$UpdateValue"],
        ctors: {
            ctor: function (tweenTarget, toValue, duration) {
                this.$initialize();
                SpineEngine.GlobalManagers.Tweens.Tween$1(Microsoft.Xna.Framework.Vector4).ctor.call(this, tweenTarget, toValue, duration);
            }
        },
        methods: {
            UpdateValue: function (elapsedTime) {
                this.TweenTarget.SpineEngine$GlobalManagers$Tweens$Interfaces$ITweenTarget$1$Microsoft$Xna$Framework$Vector4$TweenedValue = SpineEngine.Maths.Easing.Lerps.Ease$7(this.EaseType, this.FromValue.$clone(), this.ToValue.$clone(), elapsedTime, this.Duration);
            }
        }
    });

    /**
     * Renderer that renders using its own Camera which doesn't move.
     *
     * @public
     * @class SpineEngine.Graphics.Renderers.ScreenSpaceRenderer
     * @augments SpineEngine.Graphics.Renderers.RenderLayerRenderer
     */
    Bridge.define("SpineEngine.Graphics.Renderers.ScreenSpaceRenderer", {
        inherits: [SpineEngine.Graphics.Renderers.RenderLayerRenderer],
        ctors: {
            ctor: function (renderLayers) {
                if (renderLayers === void 0) { renderLayers = []; }

                this.$initialize();
                SpineEngine.Graphics.Renderers.RenderLayerRenderer.ctor.call(this, renderLayers);
                this.RenderAfterPostProcessors = true;
                this.RendererCamera = new SpineEngine.Graphics.Cameras.ScreenSpaceCamera();
            }
        }
    });
});
