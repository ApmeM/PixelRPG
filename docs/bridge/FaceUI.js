/**
 * @version 1.0.0
 * @author ApmeM
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.6.0
 */
Bridge.assembly("FaceUI", function ($asm, globals) {
    "use strict";

    /** @namespace FaceUI.Animators */

    /**
     * Animator that can animate different entities.
     *
     * @abstract
     * @public
     * @class FaceUI.Animators.IAnimator
     */
    Bridge.define("FaceUI.Animators.IAnimator", {
        fields: {
            /**
             * Is this animator currently running?
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.IAnimator
             * @default true
             * @type boolean
             */
            Enabled: false
        },
        props: {
            /**
             * Target entity this animator operates on.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.IAnimator
             * @function TargetEntity
             * @type FaceUI.Entities.Entity
             */
            TargetEntity: null,
            /**
             * Should remove this animator when done?
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.IAnimator
             * @function ShouldRemoveWhenDone
             * @type boolean
             */
            ShouldRemoveWhenDone: false,
            /**
             * Did this animator finish?
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.IAnimator
             * @function IsDone
             * @type boolean
             */
            IsDone: false
        },
        ctors: {
            init: function () {
                this.Enabled = true;
            }
        },
        methods: {
            /**
             * Set the entity this animator works on.
             *
             * @instance
             * @this FaceUI.Animators.IAnimator
             * @memberof FaceUI.Animators.IAnimator
             * @param   {FaceUI.Entities.Entity}    entity    Target entity to animate.
             * @return  {void}
             */
            SetTargetEntity: function (entity) {
                // validate compatibility
                if (!this.CheckEntityCompatibility(entity)) {
                    throw new FaceUI.Exceptions.InvalidValueException.$ctor1("Entity type not compatible with this animator!");
                }

                // make sure not already attached
                if (this.TargetEntity != null && entity != null) {
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Cannot attach animator to entity after it was already attached!");
                }

                // set entity
                if (entity == null) {
                    this.OnDetach();
                }
                this.TargetEntity = entity;
                if (entity != null) {
                    this.OnAttached();
                }
            },
            /**
             * Called after attached to an entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Animators.IAnimator
             * @memberof FaceUI.Animators.IAnimator
             * @return  {void}
             */
            OnAttached: function () { },
            /**
             * Called right before detached from an entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Animators.IAnimator
             * @memberof FaceUI.Animators.IAnimator
             * @return  {void}
             */
            OnDetach: function () { },
            /**
             * Return if an entity type is compatible with this animator.
             *
             * @instance
             * @public
             * @this FaceUI.Animators.IAnimator
             * @memberof FaceUI.Animators.IAnimator
             * @param   {FaceUI.Entities.Entity}    entity    Entity to test.
             * @return  {boolean}                             True if compatible, false otherwise.
             */
            CheckEntityCompatibility: function (entity) {
                return true;
            }
        }
    });

    /** @namespace FaceUI */

    /**
     * Enum with all the built-in themes.
     *
     * @public
     * @class FaceUI.BuiltinThemes
     */
    Bridge.define("FaceUI.BuiltinThemes", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Old-school style theme with hi-res textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.BuiltinThemes
                 * @constant
                 * @default 0
                 * @type FaceUI.BuiltinThemes
                 */
                hd: 0,
                /**
                 * Old-school style theme with low-res textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.BuiltinThemes
                 * @constant
                 * @default 1
                 * @type FaceUI.BuiltinThemes
                 */
                lowres: 1,
                /**
                 * Clean, editor-like theme.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.BuiltinThemes
                 * @constant
                 * @default 2
                 * @type FaceUI.BuiltinThemes
                 */
                editor: 2
            }
        }
    });

    /**
     * Curser styles / types.
     *
     * @public
     * @class FaceUI.CursorType
     */
    Bridge.define("FaceUI.CursorType", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Default cursor.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.CursorType
                 * @constant
                 * @default 0
                 * @type FaceUI.CursorType
                 */
                Default: 0,
                /**
                 * Pointing hand cursor.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.CursorType
                 * @constant
                 * @default 1
                 * @type FaceUI.CursorType
                 */
                Pointer: 1,
                /**
                 * Text-input I-beam cursor.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.CursorType
                 * @constant
                 * @default 2
                 * @type FaceUI.CursorType
                 */
                IBeam: 2
            }
        }
    });

    /** @namespace FaceUI.DataTypes */

    /**
     * Font styles (should match the font styles defined in FaceUI engine).
     *
     * @public
     * @class FaceUI.DataTypes._FontStyle
     */
    Bridge.define("FaceUI.DataTypes._FontStyle", {
        $kind: "enum",
        statics: {
            fields: {
                Regular: 0,
                Bold: 1,
                Italic: 2
            }
        }
    });

    /**
     * Meta data we attach to cursor textures.
     The values of these structs are defined in xml files that share the same name as the texture with _md sufix.
     *
     * @public
     * @class FaceUI.DataTypes.CursorTextureData
     */
    Bridge.define("FaceUI.DataTypes.CursorTextureData", {
        fields: {
            /**
             * Cursor offset from mouse position, on X axis, in texture pixels.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.CursorTextureData
             * @default 0
             * @type number
             */
            OffsetX: 0,
            /**
             * Cursor offset from mouse position, on Y axis, in texture pixels.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.CursorTextureData
             * @default 0
             * @type number
             */
            OffsetY: 0,
            /**
             * Width, in pixels, to draw this cursor. The height will be calculated automatically to fit texture propotions.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.CursorTextureData
             * @default 64
             * @type number
             */
            DrawWidth: 0
        },
        ctors: {
            init: function () {
                this.OffsetX = 0;
                this.OffsetY = 0;
                this.DrawWidth = 64;
            }
        }
    });

    /**
     * All the stylesheet possible settings for an entity state.
     *
     * @public
     * @class FaceUI.DataTypes.DefaultStyles
     */
    Bridge.define("FaceUI.DataTypes.DefaultStyles", {
        fields: {
            State: null,
            Scale: null,
            FillColor: null,
            OutlineColor: null,
            OutlineWidth: null,
            ForceAlignCenter: null,
            FontStyle: null,
            SelectedHighlightColor: null,
            ShadowColor: null,
            ShadowOffset: null,
            Padding: null,
            SpaceBefore: null,
            SpaceAfter: null,
            ShadowScale: null,
            DefaultSize: null
        }
    });

    Bridge.define("FaceUI.DataTypes.DefaultStylesList", {
        fields: {
            Styles: null
        }
    });

    /**
     * Represent a single style property to apply on entity and state.
     For example, coloring for paragraph when mouse is over.
     This class acts like a Union, eg we don't use all the fields.
     This is a waste of some memory, but we need it to be able to serialize / desrialize to XMLs.
     *
     * @public
     * @class FaceUI.DataTypes.StyleProperty
     */
    Bridge.define("FaceUI.DataTypes.StyleProperty", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new FaceUI.DataTypes.StyleProperty(); }
            }
        },
        fields: {
            /**
             * Color value.
             *
             * @instance
             * @private
             * @memberof FaceUI.DataTypes.StyleProperty
             * @type ?Microsoft.Xna.Framework.Color
             */
            _color: null,
            /**
             * Vector value.
             *
             * @instance
             * @private
             * @memberof FaceUI.DataTypes.StyleProperty
             * @type ?Microsoft.Xna.Framework.Vector2
             */
            _vector: null,
            /**
             * Float value.
             *
             * @instance
             * @private
             * @memberof FaceUI.DataTypes.StyleProperty
             * @type ?number
             */
            _float: null
        },
        props: {
            /**
             * helper function to get / set color value.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.StyleProperty
             * @function asColor
             * @type Microsoft.Xna.Framework.Color
             */
            asColor: {
                get: function () {
                    return System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", this._color), null) ? System.Nullable.getValue(this._color) : Microsoft.Xna.Framework.Color.White;
                },
                set: function (value) {
                    this._color = value.$clone();
                }
            },
            /**
             * helper function to get / set vector value.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.StyleProperty
             * @function asVector
             * @type Microsoft.Xna.Framework.Vector2
             */
            asVector: {
                get: function () {
                    return System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this._vector), null) ? System.Nullable.getValue(this._vector) : Microsoft.Xna.Framework.Vector2.One;
                },
                set: function (value) {
                    this._vector = value.$clone();
                }
            },
            /**
             * helper function to get / set float value.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.StyleProperty
             * @function asFloat
             * @type number
             */
            asFloat: {
                get: function () {
                    return System.Nullable.getValue(this._float);
                },
                set: function (value) {
                    this._float = value;
                }
            },
            /**
             * helper function to get / set int value.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.StyleProperty
             * @function asInt
             * @type number
             */
            asInt: {
                get: function () {
                    return Bridge.Int.clip32(System.Nullable.getValue(this._float));
                },
                set: function (value) {
                    this._float = value;
                }
            },
            /**
             * helper function to get / set bool value.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.StyleProperty
             * @function asBool
             * @type boolean
             */
            asBool: {
                get: function () {
                    return System.Nullable.getValue(this._float) > 0.0;
                },
                set: function (value) {
                    this._float = value ? 1.0 : 0.0;
                }
            },
            /**
             * Get/set currently-set value, for serialization.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.StyleProperty
             * @function _Value
             * @type System.Object
             */
            _Value: {
                get: function () {
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", this._color), null)) {
                        return System.Nullable.getValue(this._color).$clone();
                    } else {
                        if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this._vector), null)) {
                            return System.Nullable.getValue(this._vector).$clone();
                        } else {
                            return Bridge.box(System.Nullable.getValue(this._float), System.Single, System.Single.format, System.Single.getHashCode);
                        }
                    }
                },
                set: function (value) {
                    if (Bridge.is(value, Microsoft.Xna.Framework.Color)) {
                        this._color = System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, Microsoft.Xna.Framework.Color), Microsoft.Xna.Framework.Color));
                    } else {
                        if (Bridge.is(value, Microsoft.Xna.Framework.Vector2)) {
                            this._vector = System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, Microsoft.Xna.Framework.Vector2), Microsoft.Xna.Framework.Vector2));
                        } else {
                            this._float = System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, System.Single), System.Single));
                        }
                    }
                }
            }
        },
        ctors: {
            /**
             * Init with float value.
             *
             * @instance
             * @public
             * @this FaceUI.DataTypes.StyleProperty
             * @memberof FaceUI.DataTypes.StyleProperty
             * @param   {number}    value    Value to set.
             * @return  {void}
             */
            $ctor5: function (value) {
                this.$initialize();
                this._float = value;
                this._color = null;
                this._vector = null;
            },
            /**
             * Init with int value.
             *
             * @instance
             * @public
             * @this FaceUI.DataTypes.StyleProperty
             * @memberof FaceUI.DataTypes.StyleProperty
             * @param   {number}    value    Value to set.
             * @return  {void}
             */
            $ctor4: function (value) {
                this.$initialize();
                this._float = value;
                this._color = null;
                this._vector = null;
            },
            /**
             * Init with vector value.
             *
             * @instance
             * @public
             * @this FaceUI.DataTypes.StyleProperty
             * @memberof FaceUI.DataTypes.StyleProperty
             * @param   {Microsoft.Xna.Framework.Vector2}    value    Value to set.
             * @return  {void}
             */
            $ctor2: function (value) {
                this.$initialize();
                this._vector = value.$clone();
                this._color = null;
                this._float = null;
            },
            /**
             * Init with color value.
             *
             * @instance
             * @public
             * @this FaceUI.DataTypes.StyleProperty
             * @memberof FaceUI.DataTypes.StyleProperty
             * @param   {Microsoft.Xna.Framework.Color}    value    Value to set.
             * @return  {void}
             */
            $ctor1: function (value) {
                this.$initialize();
                this._color = value.$clone();
                this._vector = null;
                this._float = null;
            },
            /**
             * Init with bool value.
             *
             * @instance
             * @public
             * @this FaceUI.DataTypes.StyleProperty
             * @memberof FaceUI.DataTypes.StyleProperty
             * @param   {boolean}    value    Value to set.
             * @return  {void}
             */
            $ctor3: function (value) {
                this.$initialize();
                this._vector = null;
                this._color = null;
                this._float = value ? 1.0 : 0.0;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([5643315873, this._color, this._vector, this._float]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, FaceUI.DataTypes.StyleProperty)) {
                    return false;
                }
                return Bridge.equals(this._color, o._color) && Bridge.equals(this._vector, o._vector) && Bridge.equals(this._float, o._float);
            },
            $clone: function (to) {
                var s = to || new FaceUI.DataTypes.StyleProperty();
                s._color = System.Nullable.lift1("$clone", this._color);
                s._vector = System.Nullable.lift1("$clone", this._vector);
                s._float = this._float;
                return s;
            }
        }
    });

    /**
     * Meta data we attach to different textures.
     The values of these structs are defined in xml files that share the same name as the texture with _md sufix.
     It tells us things like the width of the frame (if texture is for panel), etc.
     *
     * @public
     * @class FaceUI.DataTypes.TextureData
     */
    Bridge.define("FaceUI.DataTypes.TextureData", {
        fields: {
            /**
             * Frame width, in percents relative to texture size (eg if texture width is 100 and frame width is 0.1, final frame width would be 10 pixels)
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.TextureData
             * @type number
             */
            FrameWidth: 0,
            /**
             * Frame height, in percents relative to texture size (eg if texture height is 100 and frame height is 0.1, final frame height would be 10 pixels)
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.TextureData
             * @type number
             */
            FrameHeight: 0
        }
    });

    /**
     * General data / settings about a UI theme.
     Loaded from the theme data xml file.
     *
     * @public
     * @class FaceUI.DataTypes.ThemeSettings
     */
    Bridge.define("FaceUI.DataTypes.ThemeSettings", {
        fields: {
            /**
             * Name fot he theme.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            ThemeName: null,
            /**
             * Theme author name.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            AuthorName: null,
            /**
             * Theme description.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            Description: null,
            /**
             * Theme additional credits.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            Credits: null,
            /**
             * Theme version.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            Version: null,
            /**
             * Theme project URL.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            RepoUrl: null,
            /**
             * Theme license.
             *
             * @instance
             * @public
             * @memberof FaceUI.DataTypes.ThemeSettings
             * @type string
             */
            License: null
        }
    });

    /**
     * Define the interface FaceUI uses to get keyboard and typing input from users.
     *
     * @abstract
     * @public
     * @class FaceUI.IKeyboardInput
     */
    Bridge.define("FaceUI.IKeyboardInput", {
        $kind: "interface"
    });

    /**
     * Define the interface FaceUI uses to get mouse or mouse-like input from users.
     *
     * @abstract
     * @public
     * @class FaceUI.IMouseInput
     */
    Bridge.define("FaceUI.IMouseInput", {
        $kind: "interface"
    });

    /**
     * Helper class with drawing-related functionality.
     *
     * @public
     * @class FaceUI.DrawUtils
     */
    Bridge.define("FaceUI.DrawUtils", {
        fields: {
            _renderTargets: null,
            _lastRenderTarget: null
        },
        ctors: {
            init: function () {
                this._renderTargets = new (System.Collections.Generic.Stack$1(Microsoft.Xna.Framework.Graphics.RenderTarget2D)).ctor();
            }
        },
        methods: {
            /**
             * Add a render target to the render targets stack.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {Microsoft.Xna.Framework.Graphics.RenderTarget2D}    target
             * @return  {void}
             */
            PushRenderTarget: function (target) {
                // sanity check - make sure we are in use-render-target mode
                if (!FaceUI.UserInterface.Active.UseRenderTarget) {
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("UserInterface.Active.UseRenderTarget must be 'true' to use render-target features!");
                }

                // add render target
                this._renderTargets.Push(target);
            },
            /**
             * Pop a render target from the render targets stack.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @return  {void}
             */
            PopRenderTarget: function () {
                this._renderTargets.Pop();
            },
            /**
             * Scale a rectangle by given factor
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {Microsoft.Xna.Framework.Rectangle}    rect     Rectangle to scale.
             * @param   {number}                               scale    By how much to scale the rectangle.
             * @return  {Microsoft.Xna.Framework.Rectangle}             Scaled rectangle.
             */
            ScaleRect: function (rect, scale) {
                // if scale is 1 just return rect as-is
                if (scale === 1.0) {
                    return rect.$clone();
                }

                // clone the rectangle to scale it
                var ret = rect.$clone();

                // update width
                var prevSize = ret.Size.$clone();
                ret.Width = Bridge.Int.clip32(ret.Width * scale);
                ret.Height = Bridge.Int.clip32(ret.Height * scale);

                // update position
                var move = (Microsoft.Xna.Framework.Point.op_Subtraction(ret.Size.$clone(), prevSize.$clone()));
                move.X = (Bridge.Int.div(move.X, 2)) | 0;
                move.Y = (Bridge.Int.div(move.Y, 2)) | 0;
                ret.Location = Microsoft.Xna.Framework.Point.op_Subtraction(ret.Location.$clone(), move.$clone());

                // return the scaled rect
                return ret.$clone();
            },
            /**
             * Get a 2d vector and convert to a Point object, while applying Floor() to make sure its round down.
             *
             * @instance
             * @protected
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {Microsoft.Xna.Framework.Vector2}    vector    Vector to convert to point.
             * @return  {Microsoft.Xna.Framework.Point}                new rounded point instance.
             */
            VectorToRoundPoint: function (vector) {
                return new Microsoft.Xna.Framework.Point.$ctor2(Bridge.Int.clip32(Math.floor(vector.X)), Bridge.Int.clip32(Math.floor(vector.Y)));
            },
            /**
             * Set default color to white and fix RGB based on Alpha channel.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {?Microsoft.Xna.Framework.Color}    color    Color to process.
             * @return  {Microsoft.Xna.Framework.Color}              Color if provided or default color, with alpha applied.
             */
            FixColorOpacity$1: function (color) {
                var $t;
                return this.FixColorOpacity(($t = color, $t != null ? $t : Microsoft.Xna.Framework.Color.White));
            },
            /**
             * Fix RGB based on Alpha channel.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {Microsoft.Xna.Framework.Color}    color    Color to process.
             * @return  {Microsoft.Xna.Framework.Color}             Color if provided or default color, with alpha applied.
             */
            FixColorOpacity: function (color) {
                return Microsoft.Xna.Framework.Color.op_Multiply(color.$clone(), (color.A / 255.0));
            },
            /**
             * Draw a simple image with texture and destination rectangle.
             This function will stretch the texture to fit the destination rect.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}              spriteBatch    SpriteBatch to draw on.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    texture        Texture to draw.
             * @param   {Microsoft.Xna.Framework.Rectangle}             destination    Destination rectangle.
             * @param   {?Microsoft.Xna.Framework.Color}                color          Optional color tint.
             * @param   {number}                                        scale          Optional scale factor.
             * @param   {?Microsoft.Xna.Framework.Rectangle}            sourceRect     Optional source rectangle to use.
             * @return  {void}
             */
            DrawImage: function (spriteBatch, texture, destination, color, scale, sourceRect) {
                var $t;
                if (color === void 0) { color = null; }
                if (scale === void 0) { scale = 1.0; }
                if (sourceRect === void 0) { sourceRect = null; }
                // default color
                color = this.FixColorOpacity$1(System.Nullable.lift1("$clone", color));

                // get source rectangle
                var src = ($t = sourceRect, $t != null ? $t : new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, texture.Width, texture.Height));

                // scale
                destination = this.ScaleRect(destination.$clone(), scale);

                // draw image
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destination.$clone(), src.$clone(), System.Nullable.getValue(color));
            },
            /**
             * Draw a tiled texture with frame on destination rectangle.
             This function will draw repeating frame parts + tile center parts to cover destination rect.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}              spriteBatch          SpriteBatch to draw on.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    texture              Texture to draw.
             * @param   {Microsoft.Xna.Framework.Rectangle}             destination          Destination rectangle.
             * @param   {Microsoft.Xna.Framework.Vector2}               textureFrameWidth    Frame width in percents relative to texture file size. For example, 0.1, 0.1 means the frame takes 10% of the texture file.
             * @param   {number}                                        scale                Optional scale factor.
             * @param   {?Microsoft.Xna.Framework.Color}                color                Optional color tint.
             * @param   {number}                                        frameScale           Optional scale factor for the frame parts.
             * @return  {void}
             */
            DrawSurface: function (spriteBatch, texture, destination, textureFrameWidth, scale, color, frameScale) {
                if (scale === void 0) { scale = 1.0; }
                if (color === void 0) { color = null; }
                if (frameScale === void 0) { frameScale = 1.0; }
                // default color
                color = this.FixColorOpacity$1(System.Nullable.lift1("$clone", color));

                // if frame width Y is 0, use DrawSurfaceHorizontal()
                if (textureFrameWidth.Y === 0) {
                    this.DrawSurfaceHorizontal(spriteBatch, texture, destination.$clone(), textureFrameWidth.X, System.Nullable.lift1("$clone", color), frameScale);
                    return;
                }

                // if frame width X is 0, use DrawSurfaceVertical()
                if (textureFrameWidth.X === 0) {
                    this.DrawSurfaceVertical(spriteBatch, texture, destination.$clone(), textureFrameWidth.Y, System.Nullable.lift1("$clone", color), frameScale);
                    return;
                }

                // apply scale on dest rect
                destination = this.ScaleRect(destination.$clone(), scale);

                // source rect and dest rect (reused throughout the function to reduce new allocations)
                var srcRect = new Microsoft.Xna.Framework.Rectangle.ctor();
                var destRect = new Microsoft.Xna.Framework.Rectangle.ctor();

                // factor used to scale between source in texture file and dest on the screen
                var ScaleFactor = FaceUI.UserInterface.Active.GlobalScale * frameScale;

                // calc the surface frame size in texture file (Src) and for drawing destination (Dest)
                var frameSizeSrcVec = Microsoft.Xna.Framework.Vector2.op_Multiply(new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width, texture.Height), textureFrameWidth.$clone());
                var frameSizeSrc = this.VectorToRoundPoint(frameSizeSrcVec.$clone());
                var frameSizeDest = this.VectorToRoundPoint(Microsoft.Xna.Framework.Vector2.op_Multiply$1(frameSizeSrcVec.$clone(), ScaleFactor));

                // calc the surface center part in texture file (Src) and for drawing destination (Dest)
                var frameCenterSrcVec = Microsoft.Xna.Framework.Vector2.op_Subtraction(new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width, texture.Height), Microsoft.Xna.Framework.Vector2.op_Multiply$1(frameSizeSrcVec.$clone(), 2));
                var centerSizeSrc = this.VectorToRoundPoint(frameCenterSrcVec.$clone());
                var centerSizeDest = this.VectorToRoundPoint(Microsoft.Xna.Framework.Vector2.op_Multiply$1(frameCenterSrcVec.$clone(), ScaleFactor));

                // start by rendering corners
                // top left corner
                {
                    srcRect.X = 0;
                    srcRect.Y = 0;
                    srcRect.Width = frameSizeSrc.X;
                    srcRect.Height = frameSizeSrc.Y;
                    destRect.X = destination.X;
                    destRect.Y = destination.Y;
                    destRect.Width = frameSizeDest.X;
                    destRect.Height = frameSizeDest.Y;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // top right corner
                {
                    srcRect.X = (texture.Width - frameSizeSrc.X) | 0;
                    srcRect.Y = 0;
                    destRect.X = (destination.Right - frameSizeDest.X) | 0;
                    destRect.Y = destination.Y;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // bottom left corner
                {
                    srcRect.X = 0;
                    srcRect.Y = (texture.Height - frameSizeSrc.Y) | 0;
                    destRect.X = destination.X;
                    destRect.Y = (destination.Bottom - frameSizeDest.Y) | 0;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // bottom right corner
                {
                    srcRect.X = (texture.Width - frameSizeSrc.X) | 0;
                    destRect.X = (destination.Right - frameSizeDest.X) | 0;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }

                // draw top and bottom strips
                var needTopBottomStrips = destination.Width > Bridge.Int.mul(frameSizeDest.X, 2);
                if (needTopBottomStrips) {
                    // current x position
                    var currX = frameSizeDest.X;

                    // set source rectangle (except for y, which changes internally)
                    srcRect.X = frameSizeSrc.X;
                    srcRect.Width = centerSizeSrc.X;
                    srcRect.Height = frameSizeSrc.Y;

                    // set dest rectangle width and height (x and y change internally)
                    destRect.Width = centerSizeDest.X;
                    destRect.Height = frameSizeDest.Y;

                    // draw top and bottom strips until get to edge
                    do {
                        // set destination x
                        destRect.X = (destination.X + currX) | 0;

                        // special case - if its last call and this segment overflows right frame, cut it
                        var toCut = (destRect.Right - (((destination.Right - frameSizeDest.X) | 0))) | 0;
                        if (toCut > 0) {
                            destRect.Width = (destRect.Width - toCut) | 0;
                            srcRect.Width = (srcRect.Width - (Bridge.Int.clip32(toCut / ScaleFactor))) | 0;
                        }

                        // draw upper part
                        srcRect.Y = 0;
                        destRect.Y = destination.Y;
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                        // draw lower part
                        srcRect.Y = (texture.Height - frameSizeSrc.Y) | 0;
                        destRect.Y = (destination.Bottom - frameSizeDest.Y) | 0;
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                        // advance current x position
                        currX = (currX + centerSizeDest.X) | 0;

                        // stop loop when reach the right side
                    } while (currX < ((destination.Width - frameSizeDest.X) | 0));
                }

                // draw left and right strips
                var needSideStrips = destination.Height > Bridge.Int.mul(frameSizeDest.Y, 2);
                if (needSideStrips) {
                    // current y position
                    var currY = frameSizeDest.Y;

                    // set source rectangle (except for x, which changes internally)
                    srcRect.Y = frameSizeSrc.Y;
                    srcRect.Width = frameSizeSrc.X;
                    srcRect.Height = centerSizeSrc.Y;

                    // set dest rectangle width and height (x and y change internally)
                    destRect.Width = frameSizeDest.X;
                    destRect.Height = centerSizeDest.Y;

                    // draw top and bottom strips until get to edge
                    do {
                        // set destination y
                        destRect.Y = (destination.Y + currY) | 0;

                        // special case - if its last call and this segment overflows bottom, cut it
                        var toCut1 = (destRect.Bottom - (((destination.Bottom - frameSizeDest.Y) | 0))) | 0;
                        if (toCut1 > 0) {
                            destRect.Height = (destRect.Height - toCut1) | 0;
                            srcRect.Height = (srcRect.Height - (Bridge.Int.clip32(toCut1 / ScaleFactor))) | 0;
                        }

                        // draw left part
                        srcRect.X = 0;
                        destRect.X = destination.X;
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                        // draw right part
                        srcRect.X = (texture.Width - frameSizeSrc.X) | 0;
                        destRect.X = (destination.Right - frameSizeDest.X) | 0;
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                        // advance current y position
                        currY = (currY + centerSizeDest.Y) | 0;

                        // stop loop when reach bottom
                    } while (currY < ((destination.Height - frameSizeDest.Y) | 0));
                }

                // now at last draw the center parts
                if (needTopBottomStrips && needSideStrips) {
                    // current x position
                    var currX1 = 0;

                    // set source rectangle
                    srcRect.X = frameSizeSrc.X;
                    srcRect.Y = frameSizeSrc.Y;
                    srcRect.Width = centerSizeSrc.X;

                    // set dest rectangle width (x and y change internally)
                    destRect.Width = centerSizeDest.X;

                    // iterate over center segments width
                    do {
                        // set destination x
                        destRect.X = (((destination.X + frameSizeDest.X) | 0) + currX1) | 0;

                        // current y position of segment
                        var currY1 = 0;

                        // set source and dest rect height
                        srcRect.Height = centerSizeSrc.Y;
                        destRect.Height = centerSizeDest.Y;

                        // special case - if its last call and this segment overflows right side, cut it
                        var toCutX = (destRect.Right - (((destination.Right - frameSizeDest.X) | 0))) | 0;
                        if (toCutX > 0) {
                            destRect.Width = (destRect.Width - toCutX) | 0;
                            srcRect.Width = (srcRect.Width - (Bridge.Int.clip32(toCutX / ScaleFactor))) | 0;
                        }

                        // iterate over center segments height
                        do {
                            // set destination y
                            destRect.Y = (((destination.Y + frameSizeDest.Y) | 0) + currY1) | 0;

                            // special case - if its last call and this segment overflows bottom, cut it
                            var toCutY = (destRect.Bottom - (((destination.Bottom - frameSizeDest.Y) | 0))) | 0;
                            if (toCutY > 0) {
                                destRect.Height = (destRect.Height - toCutY) | 0;
                                srcRect.Height = (srcRect.Height - (Bridge.Int.clip32(toCutY / ScaleFactor))) | 0;
                            }

                            // draw center segment
                            spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                            // advance current y position
                            currY1 = (currY1 + centerSizeDest.Y) | 0;

                            // stop loop when reach the bottom
                        } while (currY1 < ((destination.Height - Bridge.Int.mul(frameSizeDest.Y, 2)) | 0));

                        // advance current x position
                        currX1 = (currX1 + centerSizeDest.X) | 0;

                        // stop loop when reach the right side
                    } while (currX1 < ((destination.Width - Bridge.Int.mul(frameSizeDest.X, 2)) | 0));
                }
            },
            /**
             * Just like DrawSurface, but will stretch texture on Y axis.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}              spriteBatch    SpriteBatch to draw on.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    texture        Texture to draw.
             * @param   {Microsoft.Xna.Framework.Rectangle}             destination    Destination rectangle.
             * @param   {number}                                        frameWidth     Frame width in percents relative to texture file size. For example, 0.1 means the frame takes 10% of the texture file.
             * @param   {?Microsoft.Xna.Framework.Color}                color          Optional tint color to draw texture with.
             * @param   {number}                                        frameScale     Optional scale for the frame part.
             * @return  {void}
             */
            DrawSurfaceHorizontal: function (spriteBatch, texture, destination, frameWidth, color, frameScale) {
                if (color === void 0) { color = null; }
                if (frameScale === void 0) { frameScale = 1.0; }
                // default color
                color = this.FixColorOpacity$1(System.Nullable.lift1("$clone", color));

                // calc frame size in texture file (Src) and in destination render rect (Dest)
                var ScaleXfac = destination.Height / texture.Height;
                var frameSizeTextureVector = new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width * frameWidth, texture.Height);
                var frameSizeSrc = this.VectorToRoundPoint(frameSizeTextureVector.$clone());
                var frameSizeDest = this.VectorToRoundPoint(new Microsoft.Xna.Framework.Vector2.$ctor2(frameSizeTextureVector.X * ScaleXfac * frameScale, destination.Height));

                // calc the surface center in texture file (Src) and for drawing destination (Dest)
                var frameCenterSrcVec = new Microsoft.Xna.Framework.Vector2.$ctor2(((texture.Width - Bridge.Int.mul(frameSizeSrc.X, 2)) | 0), texture.Height);
                var centerSizeSrc = this.VectorToRoundPoint(frameCenterSrcVec.$clone());
                var centerSizeDest = this.VectorToRoundPoint(new Microsoft.Xna.Framework.Vector2.$ctor2(((destination.Width - Bridge.Int.mul(frameSizeDest.X, 2)) | 0), destination.Height));

                // source rect and dest rect (reused throughout the function to reduce new allocations)
                var srcRect = new Microsoft.Xna.Framework.Rectangle.ctor();
                var destRect = new Microsoft.Xna.Framework.Rectangle.ctor();

                // draw left side
                {
                    srcRect.X = 0;
                    srcRect.Y = 0;
                    srcRect.Width = frameSizeSrc.X;
                    srcRect.Height = frameSizeSrc.Y;
                    destRect.X = destination.X;
                    destRect.Y = destination.Y;
                    destRect.Width = frameSizeDest.X;
                    destRect.Height = frameSizeDest.Y;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // draw right side
                {
                    srcRect.X = (texture.Width - frameSizeSrc.X) | 0;
                    destRect.X = (destination.Right - frameSizeDest.X) | 0;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // draw center parts
                if (destination.Width > Bridge.Int.mul(frameSizeDest.X, 2)) {
                    // current x position
                    var currX = frameSizeDest.X;

                    // set source rectangle
                    srcRect.Y = 0;
                    srcRect.X = frameSizeSrc.X;
                    srcRect.Width = centerSizeSrc.X;
                    srcRect.Height = centerSizeSrc.Y;

                    // set dest rectangle (except for x which changes internally)
                    destRect.Y = destination.Y;
                    destRect.Width = centerSizeDest.X;
                    destRect.Height = centerSizeDest.Y;

                    // draw top and bottom strips until get to edge
                    do {
                        // set destination x
                        destRect.X = (destination.X + currX) | 0;

                        // special case - if its last call and this segment overflows right frame, cut it
                        var toCut = (destRect.Right - (((destination.Right - frameSizeDest.X) | 0))) | 0;
                        if (toCut > 0) {
                            destRect.Width = (destRect.Width - toCut) | 0;
                            srcRect.Width = (srcRect.Width - (Bridge.Int.clip32(toCut / (srcRect.Width / destRect.Width)))) | 0;
                        }

                        // draw center segment
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                        // advance current x position
                        currX = (currX + centerSizeDest.X) | 0;

                        // stop loop when reach the right side
                    } while (currX < ((destination.Width - frameSizeDest.X) | 0));
                }
            },
            /**
             * Just like DrawSurface, but will stretch texture on X axis.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}              spriteBatch    SpriteBatch to draw on.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    texture        Texture to draw.
             * @param   {Microsoft.Xna.Framework.Rectangle}             destination    Destination rectangle.
             * @param   {number}                                        frameWidth     Frame width in percents relative to texture file size. For example, 0.1 means the frame takes 10% of the texture file.
             * @param   {?Microsoft.Xna.Framework.Color}                color          Optional tint color to draw texture with.
             * @param   {number}                                        frameScale     Optional scale for the frame part.
             * @return  {void}
             */
            DrawSurfaceVertical: function (spriteBatch, texture, destination, frameWidth, color, frameScale) {
                if (color === void 0) { color = null; }
                if (frameScale === void 0) { frameScale = 1.0; }
                // default color
                color = this.FixColorOpacity$1(System.Nullable.lift1("$clone", color));

                // calc frame size in texture file (Src) and in destination render rect (Dest)
                var ScaleYfac = destination.Width / texture.Width;
                var frameSizeTextureVector = new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width, texture.Height * frameWidth);
                var frameSizeSrc = this.VectorToRoundPoint(frameSizeTextureVector.$clone());
                var frameSizeDest = this.VectorToRoundPoint(new Microsoft.Xna.Framework.Vector2.$ctor2(destination.Width, frameSizeTextureVector.Y * ScaleYfac * frameScale));

                // calc the surface center in texture file (Src) and for drawing destination (Dest)
                var frameCenterSrcVec = new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width, ((texture.Height - Bridge.Int.mul(frameSizeSrc.Y, 2)) | 0));
                var centerSizeSrc = this.VectorToRoundPoint(frameCenterSrcVec.$clone());
                var centerSizeDest = this.VectorToRoundPoint(new Microsoft.Xna.Framework.Vector2.$ctor2(destination.Width, ((destination.Height - Bridge.Int.mul(frameSizeDest.Y, 2)) | 0)));

                // source rect and dest rect (reused throughout the function to reduce new allocations)
                var srcRect = new Microsoft.Xna.Framework.Rectangle.ctor();
                var destRect = new Microsoft.Xna.Framework.Rectangle.ctor();

                // draw upper side
                {
                    srcRect.X = 0;
                    srcRect.Y = 0;
                    srcRect.Width = frameSizeSrc.X;
                    srcRect.Height = frameSizeSrc.Y;
                    destRect.X = destination.X;
                    destRect.Y = destination.Y;
                    destRect.Width = frameSizeDest.X;
                    destRect.Height = frameSizeDest.Y;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // draw bottom
                {
                    srcRect.Y = (texture.Height - frameSizeSrc.Y) | 0;
                    destRect.Y = (destination.Bottom - frameSizeDest.Y) | 0;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));
                }
                // draw center parts
                if (destination.Height > Bridge.Int.mul(frameSizeDest.Y, 2)) {
                    // current y position
                    var currY = frameSizeDest.Y;

                    // set source rectangle
                    srcRect.X = 0;
                    srcRect.Y = frameSizeSrc.Y;
                    srcRect.Width = centerSizeSrc.X;
                    srcRect.Height = centerSizeSrc.Y;

                    // set dest rectangle (except for x which changes internally)
                    destRect.Y = destination.Y;
                    destRect.Width = centerSizeDest.X;
                    destRect.Height = centerSizeDest.Y;

                    // draw top and bottom strips until get to edge
                    do {
                        // set destination y
                        destRect.Y = (destination.Y + currY) | 0;

                        // special case - if its last call and this segment overflows bottom, cut it
                        var toCut = (destRect.Bottom - (((destination.Bottom - frameSizeDest.Y) | 0))) | 0;
                        if (toCut > 0) {
                            destRect.Height = (destRect.Height - toCut) | 0;
                            srcRect.Height = (srcRect.Height - (Bridge.Int.clip32(toCut / (srcRect.Height / destRect.Height)))) | 0;
                        }

                        // draw center segment
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, destRect.$clone(), srcRect.$clone(), System.Nullable.getValue(color));

                        // advance current y position
                        currY = (currY + centerSizeDest.Y) | 0;

                        // stop loop when reach bottom
                    } while (currY < ((destination.Height - frameSizeDest.Y) | 0));
                }
            },
            /**
             * Start drawing on a given SpriteBatch.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @param   {boolean}                             isDisabled     If true, will use the greyscale 'disabled' effect.
             * @return  {void}
             */
            StartDraw: function (spriteBatch, isDisabled) {
                // start drawing
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, FaceUI.UserInterface.Active.BlendState, FaceUI.UserInterface.Active.SamplerState, Microsoft.Xna.Framework.Graphics.DepthStencilState.None, Microsoft.Xna.Framework.Graphics.RasterizerState.CullCounterClockwise, isDisabled ? FaceUI.Resources.DisabledEffect : null, void 0);

                // update drawing target
                this.UpdateRenderTarget(spriteBatch);
            },
            /**
             * Start drawing on a given SpriteBatch, but only draw colored Silhouette of the texture.
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            StartDrawSilhouette: function (spriteBatch) {
                // start drawing silhouette
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, FaceUI.UserInterface.Active.BlendState, FaceUI.UserInterface.Active.SamplerState, Microsoft.Xna.Framework.Graphics.DepthStencilState.None, Microsoft.Xna.Framework.Graphics.RasterizerState.CullCounterClockwise, FaceUI.Resources.SilhouetteEffect, void 0);

                // update drawing target
                this.UpdateRenderTarget(spriteBatch);
            },
            /**
             * Update the current rendering target.
             *
             * @instance
             * @protected
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Current spritebatch we are using.
             * @return  {void}
             */
            UpdateRenderTarget: function (spriteBatch) {
                // get current render target
                var newRenderTarget = null;
                if (this._renderTargets.Count > 0) {
                    newRenderTarget = this._renderTargets.Peek();
                } else {
                    newRenderTarget = FaceUI.UserInterface.Active.RenderTarget;
                }

                // only if changed, set render target (costly function)
                if (!Bridge.referenceEquals(this._lastRenderTarget, newRenderTarget)) {
                    this._lastRenderTarget = newRenderTarget;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.SetRenderTarget(this._lastRenderTarget);
                }
            },
            /**
             * Finish drawing on a given SpriteBatch
             *
             * @instance
             * @public
             * @this FaceUI.DrawUtils
             * @memberof FaceUI.DrawUtils
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            EndDraw: function (spriteBatch) {
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$End();
            }
        }
    });

    /** @namespace FaceUI.Entities */

    /**
     * An Anchor is a pre-defined position in parent entity that we use to position a child.
     For eample, we can use anchors to position an entity at the bottom-center point of its parent.
     Note: anchor affect both the position relative to parent and also the offset origin point of the entity.
     *
     * @public
     * @class FaceUI.Entities.Anchor
     */
    Bridge.define("FaceUI.Entities.Anchor", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Center of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.Anchor
                 */
                Center: 0,
                /**
                 * Top-Left corner of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.Anchor
                 */
                TopLeft: 1,
                /**
                 * Top-Right corner of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.Anchor
                 */
                TopRight: 2,
                /**
                 * Top-Center of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 3
                 * @type FaceUI.Entities.Anchor
                 */
                TopCenter: 3,
                /**
                 * Bottom-Left corner of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 4
                 * @type FaceUI.Entities.Anchor
                 */
                BottomLeft: 4,
                /**
                 * Bottom-Right corner of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 5
                 * @type FaceUI.Entities.Anchor
                 */
                BottomRight: 5,
                /**
                 * Bottom-Center of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 6
                 * @type FaceUI.Entities.Anchor
                 */
                BottomCenter: 6,
                /**
                 * Center-Left of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 7
                 * @type FaceUI.Entities.Anchor
                 */
                CenterLeft: 7,
                /**
                 * Center-Right of parent element.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 8
                 * @type FaceUI.Entities.Anchor
                 */
                CenterRight: 8,
                /**
                 * Automatically position this entity below its older sibling.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 9
                 * @type FaceUI.Entities.Anchor
                 */
                Auto: 9,
                /**
                 * Automatically position this entity to the right side of its older sibling, and begin a new row whenever
                 exceeding the parent container width.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 10
                 * @type FaceUI.Entities.Anchor
                 */
                AutoInline: 10,
                /**
                 * Automatically position this entity to the right side of its older sibling, even if exceeding parent container width.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 11
                 * @type FaceUI.Entities.Anchor
                 */
                AutoInlineNoBreak: 11,
                /**
                 * Position of the older sibling bottom, eg align this entity based on its older sibling, but center on X axis.
                 Use this property to place entities one after another but keep them aligned to center (especially paragraphs).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Anchor
                 * @constant
                 * @default 12
                 * @type FaceUI.Entities.Anchor
                 */
                AutoCenter: 12
            }
        }
    });

    /**
     * @memberof FaceUI
     * @callback FaceUI.EventCallback
     * @param   {FaceUI.Entities.Entity}    entity
     * @return  {void}
     */

    /**
     * Basic UI entity.
     All entities inherit from this class and share this API.
     *
     * @abstract
     * @public
     * @class FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.Entity", {
        statics: {
            fields: {
                _serializableTypes: null,
                /**
                 * A special size used value to use when you want to get the entity default size.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof FaceUI.Entities.Entity
                 * @type Microsoft.Xna.Framework.Vector2
                 */
                USE_DEFAULT_SIZE: null,
                /**
                 * Basic default style that all entities share. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Entity
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.USE_DEFAULT_SIZE = new Microsoft.Xna.Framework.Vector2();
                    this._serializableTypes = new (System.Collections.Generic.List$1(Function)).ctor();
                    this.USE_DEFAULT_SIZE = new Microsoft.Xna.Framework.Vector2.$ctor2(-1, -1);
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Entity);
                }
            },
            methods: {
                /**
                 * Make an entity type serializable.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Entities.Entity
                 * @memberof FaceUI.Entities.Entity
                 * @param   {Function}    type    Entity type to make serializable.
                 * @return  {void}
                 */
                MakeSerializable: function (type) {
                    FaceUI.Entities.Entity._serializableTypes.add(type);
                }
            }
        },
        fields: {
            /**
             * List of child elements.
             *
             * @instance
             * @memberof FaceUI.Entities.Entity
             * @type System.Collections.Generic.List$1
             */
            _children: null,
            _sortedChildren: null,
            _needToSortChildren: false,
            /**
             * If true, will not show this entity when searching.
             Used for internal entities.
             *
             * @instance
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            _hiddenInternalEntity: false,
            /**
             * The direct parent of this entity.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.Entities.Entity
             */
            _parent: null,
            /**
             * Index inside parent.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type number
             */
            _indexInParent: 0,
            _animators: null,
            /**
             * Optional extra drawing priority, to bring certain objects before others.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default 0
             * @type number
             */
            PriorityBonus: 0,
            /**
             * Is the entity currently interactable.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            _isInteractable: false,
            /**
             * Optional identifier you can attach to entities so you can later search and retrieve by.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default ""
             * @type string
             */
            Identifier: null,
            /**
             * Last known scroll value, when entities are inside scrollable panels.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type Microsoft.Xna.Framework.Point
             */
            _lastScrollVal: null,
            /**
             * If this boolean is true, events will just "go through" this entity to its children or entities behind it.
             This bool comes to solve conditions where you have two panels without skin that hide each other but you want
             users to be able to click on the bottom panel through the upper panel, provided it doesn't hit any of the first
             panel's children.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            ClickThrough: false,
            /**
             * If in promiscuous mode, mouse button is pressed *outside* the entity and then released on the entity, click event will be fired.
             If false, in order to fire click event the mouse button must be pressed AND released over this entity (but can travel outside while being
             held down, as long as its released inside).
             Note: Windows default behavior is non promiscuous mode.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            PromiscuousClicksMode: false,
            /**
             * If this set to true, this entity will still react to events if its direct parent is locked.
             This setting is mostly for scrollbars etc, that even if parent is locked should still be scrollable.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            DoEventsIfDirectParentIsLocked: false,
            /**
             * If true, this entity will always inherit its parent state.
             This is useful for stuff like a paragraph that's attached to a button etc.
             NOTE!!! entities that inherit parent state will not trigger any events either.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            InheritParentState: false,
            _background: null,
            _isFirstUpdate: false,
            /**
             * Mark if this entity is dirty and need to recalculate its destination rect.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Entity
             * @default true
             * @type boolean
             */
            _isDirty: false,
            _style: null,
            _minSize: null,
            _maxSize: null,
            /**
             * Every time we update destination rect and internal destination rect view the update function, we increase this counter.
             This is so our children will know we did an update and they need to update too.
             *
             * @instance
             * @memberof FaceUI.Entities.Entity
             * @default 0
             * @type number
             */
            _destRectVersion: 0,
            /**
             * The last known version we have of the parent dest rect version.
             If this number does not match our parent's _destRectVersion, we will recalculate destination rect.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Entity
             * @default 0
             * @type number
             */
            _parentLastDestRectVersion: 0,
            /**
             * Optional data you can attach to this entity and retrieve later (for example when handling events).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type System.Object
             */
            AttachedData: null,
            /**
             * If true (default), will use the actual object size for collision detection. If false, will use the size property.
             This is useful for paragraphs, for example, where the actual width is based on text content and can vary and be totally
             different than the size set in the constructor.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default true
             * @type boolean
             */
            UseActualSizeForCollision: false,
            /**
             * Entity size (in pixels). Value of 0 will take parent's full size. -1 will take defaults.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type Microsoft.Xna.Framework.Vector2
             */
            _size: null,
            /**
             * Offset, in pixels, from the anchor position.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type Microsoft.Xna.Framework.Vector2
             */
            _offset: null,
            /**
             * Anchor to position this entity based on (see Anchor enum for more info).
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.Entities.Anchor
             */
            _anchor: 0,
            /**
             * Callback to execute when mouse button is pressed over this entity (called once when button is pressed).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnMouseDown: null,
            /**
             * Callback to execute when right mouse button is pressed over this entity (called once when button is pressed).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnRightMouseDown: null,
            /**
             * Callback to execute when mouse button is released over this entity (called once when button is released).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnMouseReleased: null,
            /**
             * Callback to execute every frame while mouse button is pressed over the entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            WhileMouseDown: null,
            /**
             * Callback to execute every frame while right mouse button is pressed over the entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            WhileRightMouseDown: null,
            /**
             * Callback to execute every frame while mouse is hovering over the entity (not called while mouse button is down).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            WhileMouseHover: null,
            /**
             * Callback to execute every frame while mouse is hovering over the entity, even if mouse is down.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            WhileMouseHoverOrDown: null,
            /**
             * Callback to execute when user clicks on this entity (eg release mouse over it).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnClick: null,
            /**
             * Callback to execute when user clicks on this entity with right mouse button (eg release mouse over it).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnRightClick: null,
            /**
             * Callback to execute when entity value changes (relevant only for entities with value).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnValueChange: null,
            /**
             * Callback to execute when mouse start hovering over this entity (eg enters its region).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnMouseEnter: null,
            /**
             * Callback to execute when mouse stop hovering over this entity (eg leaves its region).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnMouseLeave: null,
            /**
             * Callback to execute when mouse wheel scrolls and this entity is the active entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnMouseWheelScroll: null,
            /**
             * Called when entity starts getting dragged (only if draggable).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnStartDrag: null,
            /**
             * Called when entity stop getting dragged (only if draggable).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnStopDrag: null,
            /**
             * Called every frame while the entity is being dragged.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            WhileDragging: null,
            /**
             * Callback to execute every frame before this entity is rendered.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            BeforeDraw: null,
            /**
             * Callback to execute every frame after this entity is rendered.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            AfterDraw: null,
            /**
             * Callback to execute every frame before this entity updates.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            BeforeUpdate: null,
            /**
             * Callback to execute every frame after this entity updates.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            AfterUpdate: null,
            /**
             * Callback to execute every time the visibility of this entity changes (also invokes when parent becomes invisible / visible again).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnVisiblityChange: null,
            /**
             * Callback to execute every time this entity focus / unfocus.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.EventCallback
             */
            OnFocusChange: null,
            /**
             * Optional tooltip text to show if the user points on this entity for long enough.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type string
             */
            ToolTipText: null,
            /**
             * Is mouse currently pointing on this entity.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            _isMouseOver: false,
            /**
             * Is the entity currently enabled? If false, will not be interactive and be rendered with a greyscale effect.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default true
             * @type boolean
             */
            Enabled: false,
            /**
             * If true, this entity and its children will not respond to events (but will be drawn normally, unlike when disabled).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            Locked: false,
            /**
             * Is the entity currently visible.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Entity
             * @default true
             * @type boolean
             */
            _visible: false,
            /**
             * Is this entity currently disabled?
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Entity
             * @default false
             * @type boolean
             */
            _isCurrentlyDisabled: false,
            /**
             * Current entity state.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type FaceUI.Entities.EntityState
             */
            _entityState: 0,
            _isFocused: false,
            /**
             * Currently calculated destination rect (eg the region this entity is drawn on).
             *
             * @instance
             * @memberof FaceUI.Entities.Entity
             * @type Microsoft.Xna.Framework.Rectangle
             */
            _destRect: null,
            /**
             * Currently calculated internal destination rect (eg the region this entity children are positioned in).
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Entity
             * @type Microsoft.Xna.Framework.Rectangle
             */
            _destRectInternal: null,
            _draggable: false,
            _needToSetDragOffset: false,
            _dragOffset: null,
            _isBeingDragged: false,
            /**
             * If true, users will not be able to drag this entity outside its parent boundaries.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @default true
             * @type boolean
             */
            LimitDraggingToParentBoundaries: false,
            /**
             * Adds extra space outside the dest rect for collision detection.
             In other words, if extra margin is set to 10 and the user points with its mouse 5 pixels above this entity,
             it would still think the user points on the entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @type Microsoft.Xna.Framework.Point
             */
            ExtraMargin: null
        },
        props: {
            /**
             * Get / set children list.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function Children
             * @type System.Collections.Generic.IReadOnlyList$1
             */
            Children: {
                get: function () {
                    return Bridge.as(this._children.AsReadOnly(), System.Collections.Generic.IReadOnlyList$1(FaceUI.Entities.Entity));
                }
            },
            /**
             * Get / set raw stylesheet.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function RawStyleSheet
             * @type FaceUI.Entities.StyleSheet
             */
            RawStyleSheet: {
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    this._style = value;
                }
            },
            /**
             * Get overflow scrollbar value.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function OverflowScrollVal
             * @type Microsoft.Xna.Framework.Point
             */
            OverflowScrollVal: {
                get: function () {
                    return Microsoft.Xna.Framework.Point.Zero.$clone();
                }
            },
            /**
             * If defined, will limit the minimum size of this entity when calculating size.
             This is especially useful for entities with size that depends on their parent entity size, for example
             if you define an entity to take 20% of its parent space but can't be less than 200 pixels width.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function MinSize
             * @type ?Microsoft.Xna.Framework.Vector2
             */
            MinSize: {
                get: function () {
                    return System.Nullable.lift1("$clone", this._minSize);
                },
                set: function (value) {
                    this._minSize = System.Nullable.lift1("$clone", value);
                    this.MarkAsDirty();
                }
            },
            /**
             * If defined, will limit the maximum size of this entity when calculating size.
             This is especially useful for entities with size that depends on their parent entity size, for example
             if you define an entity to take 20% of its parent space but can't be more than 200 pixels width.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function MaxSize
             * @type ?Microsoft.Xna.Framework.Vector2
             */
            MaxSize: {
                get: function () {
                    return System.Nullable.lift1("$clone", this._maxSize);
                },
                set: function (value) {
                    this._maxSize = System.Nullable.lift1("$clone", value);
                    this.MarkAsDirty();
                }
            },
            /**
             * Set / get offset.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Offset
             * @type Microsoft.Xna.Framework.Vector2
             */
            Offset: {
                get: function () {
                    return this._offset.$clone();
                },
                set: function (value) {
                    this.SetOffset(value.$clone());
                }
            },
            /**
             * Set / get anchor.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Anchor
             * @type FaceUI.Entities.Anchor
             */
            Anchor: {
                get: function () {
                    return this._anchor;
                },
                set: function (value) {
                    this.SetAnchor(value);
                }
            },
            /**
             * Does this entity or one of its children currently focused?
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function IsFocused
             * @type boolean
             */
            IsFocused: {
                get: function () {
                    return this._isFocused;
                },
                set: function (value) {
                    if (this._isFocused !== value) {
                        this._isFocused = value;
                        this.DoOnFocusChange();
                    }
                }
            },
            /**
             * Get internal destination rect.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function InternalDestRect
             * @type Microsoft.Xna.Framework.Rectangle
             */
            InternalDestRect: {
                get: function () {
                    return this._destRectInternal.$clone();
                }
            },
            /**
             * Return the default size for this entity.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function EntityDefaultSize
             * @type Microsoft.Xna.Framework.Vector2
             */
            EntityDefaultSize: {
                get: function () {
                    var ret = this.GetStyleProperty(FaceUI.Entities.StylePropertyIds.DefaultSize, FaceUI.Entities.EntityState.Default, true).asVector.$clone();
                    return ret.$clone();
                }
            },
            /**
             * Get mouse input provider.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function MouseInput
             * @type FaceUI.IMouseInput
             */
            MouseInput: {
                get: function () {
                    return FaceUI.UserInterface.Active.MouseInputProvider;
                }
            },
            /**
             * Get keyboard input provider.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function KeyboardInput
             * @type FaceUI.IKeyboardInput
             */
            KeyboardInput: {
                get: function () {
                    return FaceUI.UserInterface.Active.KeyboardInputProvider;
                }
            },
            /**
             * Get the active user interface global scale.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function GlobalScale
             * @type number
             */
            GlobalScale: {
                get: function () {
                    return FaceUI.UserInterface.Active.GlobalScale;
                }
            },
            /**
             * If true, will add debug drawing to UI system to show offsets, margin, etc.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function DebugDraw
             * @type boolean
             */
            DebugDraw: {
                get: function () {
                    return FaceUI.UserInterface.Active.DebugDraw;
                }
            },
            /**
             * Get extra space after with current UI scale applied.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function _scaledSpaceAfter
             * @type Microsoft.Xna.Framework.Vector2
             */
            _scaledSpaceAfter: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Multiply$1(this.SpaceAfter.$clone(), this.GlobalScale);
                }
            },
            /**
             * Get extra space before with current UI scale applied.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function _scaledSpaceBefore
             * @type Microsoft.Xna.Framework.Vector2
             */
            _scaledSpaceBefore: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Multiply$1(this.SpaceBefore.$clone(), this.GlobalScale);
                }
            },
            /**
             * Get size with current UI scale applied. Note: doesn't effect relative sizes with values from 0.0 to 1.0.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function _scaledSize
             * @type Microsoft.Xna.Framework.Vector2
             */
            _scaledSize: {
                get: function () {
                    return new Microsoft.Xna.Framework.Vector2.$ctor2(this._size.X < 1 ? this._size.X : this._size.X * this.GlobalScale, this._size.Y < 1 ? this._size.Y : this._size.Y * this.GlobalScale);
                }
            },
            /**
             * Get offset with current UI scale applied.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function _scaledOffset
             * @type Microsoft.Xna.Framework.Vector2
             */
            _scaledOffset: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Multiply$1(this._offset.$clone(), this.GlobalScale);
                }
            },
            /**
             * Get offset with current UI scale applied.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function _scaledPadding
             * @type Microsoft.Xna.Framework.Vector2
             */
            _scaledPadding: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Multiply$1(this.Padding.$clone(), this.GlobalScale);
                }
            },
            /**
             * Set / get visibility.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Visible
             * @type boolean
             */
            Visible: {
                get: function () {
                    return this._visible;
                },
                set: function (value) {
                    this._visible = value;
                    this.DoOnVisibilityChange();
                }
            },
            /**
             * Return entity priority in drawing order and event handling.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function Priority
             * @type number
             */
            Priority: {
                get: function () {
                    return ((this._indexInParent + this.PriorityBonus) | 0);
                }
            },
            /**
             * Get if this entity needs to recalculate destination rect.
             *
             * @instance
             * @protected
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function IsDirty
             * @type boolean
             */
            IsDirty: {
                get: function () {
                    return this._isDirty;
                }
            },
            /**
             * Is the entity draggable (eg can a user grab it and drag it around).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Draggable
             * @type boolean
             */
            Draggable: {
                get: function () {
                    return this._draggable;
                },
                set: function (value) {
                    this._needToSetDragOffset = this._draggable !== value;
                    this._draggable = value;
                    this.MarkAsDirty();
                }
            },
            /**
             * Optional background entity that will not respond to events and will always be rendered right behind this entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Background
             * @type FaceUI.Entities.Entity
             */
            Background: {
                get: function () {
                    return this._background;
                },
                set: function (value) {
                    if (value != null && value._parent != null) {
                        throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Cannot set background entity that have a parent!");
                    }
                    this._background = value;
                }
            },
            /**
             * Current entity state (default / mouse hover / mouse down..).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function State
             * @type FaceUI.Entities.EntityState
             */
            State: {
                get: function () {
                    return this._entityState;
                },
                set: function (value) {
                    this._entityState = value;
                }
            },
            /**
             * Entity current size property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Size
             * @type Microsoft.Xna.Framework.Vector2
             */
            Size: {
                get: function () {
                    return this._size.$clone();
                },
                set: function (value) {
                    if (Microsoft.Xna.Framework.Vector2.op_Inequality(this._size.$clone(), value.$clone())) {
                        this._size = value.$clone();
                        this.MarkAsDirty();
                    }
                }
            },
            /**
             * Extra space (in pixels) to reserve *after* this entity when using Auto Anchors.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function SpaceAfter
             * @type Microsoft.Xna.Framework.Vector2
             */
            SpaceAfter: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.SpaceAfter).asVector.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.SpaceAfter, new FaceUI.DataTypes.StyleProperty.$ctor2(value.$clone()));
                }
            },
            /**
             * Extra space (in pixels) to reserve *before* this entity when using Auto Anchors.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function SpaceBefore
             * @type Microsoft.Xna.Framework.Vector2
             */
            SpaceBefore: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.SpaceBefore).asVector.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.SpaceBefore, new FaceUI.DataTypes.StyleProperty.$ctor2(value.$clone()));
                }
            },
            /**
             * Entity fill color - this is just a sugarcoat to access the default fill color style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function FillColor
             * @type Microsoft.Xna.Framework.Color
             */
            FillColor: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.FillColor).asColor.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.FillColor, new FaceUI.DataTypes.StyleProperty.$ctor1(value.$clone()), 0, false);
                }
            },
            /**
             * Entity fill color opacity - this is just a sugarcoat to access the default fill color alpha style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Opacity
             * @type number
             */
            Opacity: {
                get: function () {
                    return this.FillColor.A;
                },
                set: function (value) {
                    // update fill color
                    var col = this.FillColor.$clone();
                    col.A = value;
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.FillColor, new FaceUI.DataTypes.StyleProperty.$ctor1(col.$clone()), 0, false);

                    // update outline color
                    col = this.OutlineColor.$clone();
                    col.A = value;
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.OutlineColor, new FaceUI.DataTypes.StyleProperty.$ctor1(col.$clone()), 0, false);
                }
            },
            /**
             * Entity outline color opacity - this is just a sugarcoat to access the default outline color alpha style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function OutlineOpacity
             * @type number
             */
            OutlineOpacity: {
                get: function () {
                    return this.OutlineColor.A;
                },
                set: function (value) {
                    var col = this.OutlineColor.$clone();
                    col.A = value;
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.OutlineColor, new FaceUI.DataTypes.StyleProperty.$ctor1(col.$clone()), 0, false);
                }
            },
            /**
             * Entity padding - this is just a sugarcoat to access the default padding style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Padding
             * @type Microsoft.Xna.Framework.Vector2
             */
            Padding: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.Padding).asVector.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.Padding, new FaceUI.DataTypes.StyleProperty.$ctor2(value.$clone()));
                }
            },
            /**
             * Entity shadow color - this is just a sugarcoat to access the default shadow color style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function ShadowColor
             * @type Microsoft.Xna.Framework.Color
             */
            ShadowColor: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.ShadowColor).asColor.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.ShadowColor, new FaceUI.DataTypes.StyleProperty.$ctor1(value.$clone()), 0, false);
                }
            },
            /**
             * Entity shadow scale - this is just a sugarcoat to access the default shadow scale style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function ShadowScale
             * @type number
             */
            ShadowScale: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.ShadowScale).asFloat;
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.ShadowScale, new FaceUI.DataTypes.StyleProperty.$ctor5(value), 0, false);
                }
            },
            /**
             * Entity shadow offset - this is just a sugarcoat to access the default shadow offset style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function ShadowOffset
             * @type Microsoft.Xna.Framework.Vector2
             */
            ShadowOffset: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.ShadowOffset).asVector.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.ShadowOffset, new FaceUI.DataTypes.StyleProperty.$ctor2(value.$clone()), 0, false);
                }
            },
            /**
             * Entity scale - this is just a sugarcoat to access the default scale style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function Scale
             * @type number
             */
            Scale: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.Scale).asFloat;
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.Scale, new FaceUI.DataTypes.StyleProperty.$ctor5(value));
                }
            },
            /**
             * Entity outline color - this is just a sugarcoat to access the default outline color style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function OutlineColor
             * @type Microsoft.Xna.Framework.Color
             */
            OutlineColor: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.OutlineColor).asColor.$clone();
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.OutlineColor, new FaceUI.DataTypes.StyleProperty.$ctor1(value.$clone()), 0, false);
                }
            },
            /**
             * Entity outline width - this is just a sugarcoat to access the default outline color style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Entity
             * @function OutlineWidth
             * @type number
             */
            OutlineWidth: {
                get: function () {
                    return this.GetActiveStyle(FaceUI.Entities.StylePropertyIds.OutlineWidth).asInt;
                },
                set: function (value) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.OutlineWidth, new FaceUI.DataTypes.StyleProperty.$ctor4(value), 0, false);
                }
            },
            /**
             * Get the direct parent of this entity.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function Parent
             * @type FaceUI.Entities.Entity
             */
            Parent: {
                get: function () {
                    return this._parent;
                }
            },
            /**
             * Return if the mouse is currently pressing on this entity (eg over it and left mouse button is down).
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function IsMouseDown
             * @type boolean
             */
            IsMouseDown: {
                get: function () {
                    return this._entityState === FaceUI.Entities.EntityState.MouseDown;
                }
            },
            /**
             * Return if the mouse is currently over this entity (regardless of whether or not mouse button is down).
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Entity
             * @function IsMouseOver
             * @type boolean
             */
            IsMouseOver: {
                get: function () {
                    return this._isMouseOver;
                }
            }
        },
        ctors: {
            init: function () {
                this._lastScrollVal = new Microsoft.Xna.Framework.Point();
                this._size = new Microsoft.Xna.Framework.Vector2();
                this._offset = new Microsoft.Xna.Framework.Vector2();
                this._destRect = new Microsoft.Xna.Framework.Rectangle();
                this._destRectInternal = new Microsoft.Xna.Framework.Rectangle();
                this._dragOffset = new Microsoft.Xna.Framework.Vector2();
                this.ExtraMargin = new Microsoft.Xna.Framework.Point();
                this._children = new (System.Collections.Generic.List$1(FaceUI.Entities.Entity)).ctor();
                this._needToSortChildren = true;
                this._hiddenInternalEntity = false;
                this._animators = new (System.Collections.Generic.List$1(FaceUI.Animators.IAnimator)).ctor();
                this.PriorityBonus = 0;
                this._isInteractable = false;
                this.Identifier = "";
                this._lastScrollVal = Microsoft.Xna.Framework.Point.Zero.$clone();
                this.ClickThrough = false;
                this.PromiscuousClicksMode = false;
                this.DoEventsIfDirectParentIsLocked = false;
                this.InheritParentState = false;
                this._isFirstUpdate = true;
                this._isDirty = true;
                this._style = new FaceUI.Entities.StyleSheet();
                this._destRectVersion = 0;
                this._parentLastDestRectVersion = 0;
                this.UseActualSizeForCollision = true;
                this._isMouseOver = false;
                this.Enabled = true;
                this.Locked = false;
                this._visible = true;
                this._isCurrentlyDisabled = false;
                this._entityState = FaceUI.Entities.EntityState.Default;
                this._isFocused = false;
                this._draggable = false;
                this._needToSetDragOffset = false;
                this._dragOffset = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                this._isBeingDragged = false;
                this.LimitDraggingToParentBoundaries = true;
                this.ExtraMargin = Microsoft.Xna.Framework.Point.Zero.$clone();
            },
            /**
             * Create the entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Entity size, in pixels.
             * @param   {FaceUI.Entities.Anchor}              anchor    Poisition anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            ctor: function (size, anchor, offset) {
                if (size === void 0) { size = null; }
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }
                var $t, $t1;

                this.$initialize();
                // set as dirty (eg need to recalculate destination rect)
                this.MarkAsDirty();

                // set basic default style
                this.UpdateStyle(FaceUI.Entities.Entity.DefaultStyle);

                // store size, anchor and offset
                this._size = ($t = size, $t != null ? $t : FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone());
                this._offset = ($t1 = offset, $t1 != null ? $t1 : Microsoft.Xna.Framework.Vector2.Zero);
                this._anchor = anchor;
            }
        },
        methods: {
            /**
             * Get current mouse position.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {?Microsoft.Xna.Framework.Vector2}    addVector    Optional vector to add to cursor position.
             * @return  {Microsoft.Xna.Framework.Vector2}                  Mouse position.
             */
            GetMousePos: function (addVector) {
                if (addVector === void 0) { addVector = null; }
                return FaceUI.UserInterface.Active.GetTransformedCursorPos(System.Nullable.lift1("$clone", addVector));
            },
            /**
             * Call this function when the first update occures.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnFirstUpdate: function () {
                // call the spawn event
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnEntitySpawn, null) ? FaceUI.UserInterface.Active.OnEntitySpawn(this) : null;

                // make parent dirty
                if (this._parent != null) {
                    this._parent.MarkAsDirty();
                }
            },
            /**
             * Return stylesheet property for a given state.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {string}                            property             Property identifier.
             * @param   {FaceUI.Entities.EntityState}       state                State to get property for (if undefined will fallback to default state).
             * @param   {boolean}                           fallbackToDefault    If true and property not found for given state, will fallback to default state.
             * @return  {FaceUI.DataTypes.StyleProperty}                         Style property value for given state or default, or null if undefined.
             */
            GetStyleProperty: function (property, state, fallbackToDefault) {
                if (state === void 0) { state = 0; }
                if (fallbackToDefault === void 0) { fallbackToDefault = true; }
                return this._style.getStyleProperty(property, state, fallbackToDefault);
            },
            /**
             * Set a stylesheet property.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {string}                            property       Property identifier.
             * @param   {FaceUI.DataTypes.StyleProperty}    value          Property value.
             * @param   {FaceUI.Entities.EntityState}       state          State to set property for.
             * @param   {boolean}                           markAsDirty    If true, will mark this entity as dirty after this style change.
             * @return  {void}
             */
            SetStyleProperty: function (property, value, state, markAsDirty) {
                if (state === void 0) { state = 0; }
                if (markAsDirty === void 0) { markAsDirty = true; }
                this._style.setStyleProperty(property, value.$clone(), state);
                if (markAsDirty) {
                    this.MarkAsDirty();
                }
            },
            /**
             * Return stylesheet property for current entity state (or default if undefined for state).
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {string}                            property    Property identifier.
             * @return  {FaceUI.DataTypes.StyleProperty}                Stylesheet property value for current entity state, or default if not defined.
             */
            GetActiveStyle: function (property) {
                return this.GetStyleProperty(property, this._entityState);
            },
            /**
             * Update the entire stylesheet from a different stylesheet.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.StyleSheet}    updates    Stylesheet to update from.
             * @return  {void}
             */
            UpdateStyle: function (updates) {
                this._style.updateFrom(updates);
                this.MarkAsDirty();
            },
            /**
             * Find and return first occurance of a child entity with a given identifier and specific type.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {Function}    T             Entity type to get.
             * @param   {string}      identifier    Identifier to find.
             * @param   {boolean}     recursive     If true, will search recursively in children of children. If false, will search only in direct children.
             * @return  {T}                         First found entity with given identifier and type, or null if nothing found.
             */
            Find: function (T, identifier, recursive) {
                var $t;
                if (recursive === void 0) { recursive = false; }
                // should we return any entity type?
                var anyType = Bridge.referenceEquals(T, FaceUI.Entities.Entity);

                // iterate children
                $t = Bridge.getEnumerator(this._children);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        // skip hidden entities
                        if (child._hiddenInternalEntity) {
                            continue;
                        }

                        // check if identifier and type matches - if so, return it
                        if (Bridge.referenceEquals(child.Identifier, identifier) && (anyType || (Bridge.referenceEquals(Bridge.getType(child), T)))) {
                            return Bridge.cast(child, T);
                        }

                        // if recursive, search in child
                        if (recursive) {
                            // search in child
                            var ret = child.Find(T, identifier, recursive);

                            // if found return it
                            if (ret != null) {
                                return ret;
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // not found?
                return null;
            },
            /**
             * Find and return first occurance of a child entity with a given identifier.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {string}                    identifier    Identifier to find.
             * @param   {boolean}                   recursive     If true, will search recursively in children of children. If false, will search only in direct children.
             * @return  {FaceUI.Entities.Entity}                  First found entity with given identifier, or null if nothing found.
             */
            Find$1: function (identifier, recursive) {
                if (recursive === void 0) { recursive = false; }
                return this.Find(FaceUI.Entities.Entity, identifier, recursive);
            },
            /**
             * Iterate over children and call 'callback' for every direct child of this entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.EventCallback}    callback    Callback function to call with every child of this entity.
             * @return  {void}
             */
            IterateChildren: function (callback) {
                var $t;
                $t = Bridge.getEnumerator(this._children);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        callback(child);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /**
             * Return if this entity is currently disabled, due to self or one of the parents / grandparents being disabled.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {boolean}        True if entity is disabled.
             */
            IsDisabled: function () {
                // iterate over parents until root, starting with self.
                // if any entity along the way is disabled we return true.
                var parent = this;
                while (parent != null) {
                    if (!parent.Enabled) {
                        return true;
                    }
                    parent = parent._parent;
                }

                // not disabled
                return false;
            },
            /**
             * Check if this entity is a descendant of another entity.
             This goes up all the way to root.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Entity}    other    Entity to check if this entity is descendant of.
             * @return  {boolean}                            True if this entity is descendant of the other entity.
             */
            IsDeepChildOf: function (other) {
                // iterate over parents until root, starting with self.
                // if any entity along the way is child of 'other', we return true.
                var parent = this;
                while (parent != null) {
                    if (Bridge.referenceEquals(parent._parent, other)) {
                        return true;
                    }
                    parent = parent._parent;
                }

                // not child of
                return false;
            },
            /**
             * Return if this entity is currently locked, due to self or one of the parents / grandparents being locked.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {boolean}        True if entity is disabled.
             */
            IsLocked: function () {
                // iterate over parents until root, starting with self.
                // if any entity along the way is locked we return true.
                var parent = this;
                while (parent != null) {
                    if (parent.Locked) {
                        // special case - if should do events even when parent is locked and direct parent, skip
                        if (this.DoEventsIfDirectParentIsLocked) {
                            if (Bridge.referenceEquals(parent, this._parent)) {
                                parent = parent._parent;
                                continue;
                            }
                        }

                        // if parent locked return true
                        return true;
                    }

                    // advance to next parent
                    parent = parent._parent;
                }

                // not disabled
                return false;
            },
            /**
             * Return if this entity is currently visible, eg this and all its parents and grandparents are visible.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {boolean}        True if entity is really visible.
             */
            IsVisible: function () {
                // iterate over parents until root, starting with self.
                // if any entity along the way is not visible we return false.
                var parent = this;
                while (parent != null) {
                    if (!parent.Visible) {
                        return false;
                    }
                    parent = parent._parent;
                }

                // visible!
                return true;
            },
            /**
             * Set the position and anchor of this entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Anchor}             anchor    New anchor to set.
             * @param   {Microsoft.Xna.Framework.Vector2}    offset    Offset from new anchor position.
             * @return  {void}
             */
            SetAnchorAndOffset: function (anchor, offset) {
                this.SetAnchor(anchor);
                this.SetOffset(offset.$clone());
            },
            /**
             * Set the anchor of this entity.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Anchor}    anchor    New anchor to set.
             * @return  {void}
             */
            SetAnchor: function (anchor) {
                this._anchor = anchor;
                this.MarkAsDirty();
            },
            /**
             * Set the offset of this entity.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {Microsoft.Xna.Framework.Vector2}    offset    New offset to set.
             * @return  {void}
             */
            SetOffset: function (offset) {
                if (Microsoft.Xna.Framework.Vector2.op_Inequality(this._offset.$clone(), offset.$clone()) || Microsoft.Xna.Framework.Vector2.op_Inequality(this._dragOffset.$clone(), offset.$clone())) {
                    this._dragOffset = (this._offset = offset.$clone());
                    this.MarkAsDirty();
                }
            },
            /**
             * Return children in a sorted list by priority.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {System.Collections.Generic.List$1}        List of children sorted by priority.
             */
            GetSortedChildren: function () {
                // if need to sort children, rebuild the sorted list
                if (this._needToSortChildren) {
                    // create list to sort and return
                    this._sortedChildren = new (System.Collections.Generic.List$1(FaceUI.Entities.Entity)).$ctor1(this._children);

                    // get children in a sorted list
                    this._sortedChildren.Sort$2($asm.$.FaceUI.Entities.Entity.f1);

                    // no longer need to sort
                    this._needToSortChildren = false;
                }

                // return the sorted list
                return this._sortedChildren;
            },
            /**
             * Update dest rect and internal dest rect.
             This is called internally whenever a change is made to the entity or its parent.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            UpdateDestinationRects: function () {
                // update dest and internal dest rects
                this._destRect = this.CalcDestRect();
                this._destRectInternal = this.CalcInternalRect();

                // mark as no longer dirty
                this._isDirty = false;

                // increase dest rect version and update parent last known
                this._destRectVersion = (this._destRectVersion + 1) >>> 0;
                if (this._parent != null) {
                    this._parentLastDestRectVersion = this._parent._destRectVersion;
                }
            },
            /**
             * Update dest rect and internal dest rect, but only if needed (eg if something changed since last update).
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            UpdateDestinationRectsIfDirty: function () {
                // if dirty, update destination rectangles
                if (this._parent != null && (this._isDirty || (this._parentLastDestRectVersion !== this._parent._destRectVersion))) {
                    this.UpdateDestinationRects();
                }
            },
            /**
             * Draw this entity and its children.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to use for drawing.
             * @return  {void}
             */
            Draw: function (spriteBatch) {
                // if not visible skip
                if (!this.Visible) {
                    return;
                }

                // update if disabled
                this._isCurrentlyDisabled = this.IsDisabled();

                // do before draw event
                this.OnBeforeDraw(spriteBatch);

                // draw background
                if (this.Background != null) {
                    this._background._parent = this;
                    this._background._indexInParent = 0;
                    this._background.Draw(spriteBatch);
                    this._background._parent = null;
                }

                // calc desination rects (if needed)
                this.UpdateDestinationRectsIfDirty();

                // draw shadow
                this.DrawEntityShadow(spriteBatch);

                // draw entity outline
                this.DrawEntityOutline(spriteBatch);

                // draw the entity itself
                FaceUI.UserInterface.Active.DrawUtils.StartDraw(spriteBatch, this._isCurrentlyDisabled);
                this.DrawEntity(spriteBatch, FaceUI.Entities.DrawPhase.Base);
                FaceUI.UserInterface.Active.DrawUtils.EndDraw(spriteBatch);

                // do debug drawing
                if (this.DebugDraw) {
                    this.DrawDebugStuff(spriteBatch);
                }

                // draw all child entities
                this.DrawChildren(spriteBatch);

                // do after draw event
                this.OnAfterDraw(spriteBatch);
            },
            /**
             * Draw debug stuff for this entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Spritebatch to use for drawing.
             * @return  {void}
             */
            DrawDebugStuff: function (spriteBatch) {
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Immediate, Microsoft.Xna.Framework.Graphics.BlendState.NonPremultiplied, void 0, void 0, void 0, void 0, void 0);

                // first draw whole dest rect
                var destRectCol = new Microsoft.Xna.Framework.Color.$ctor9(0.0, 1.0, 0.25, 0.05);
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, this._destRect.$clone(), destRectCol.$clone());

                // now draw internal dest rect
                var internalCol = new Microsoft.Xna.Framework.Color.$ctor9(1.0, 0.5, 0.0, 0.5);
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, this._destRectInternal.$clone(), internalCol.$clone());

                // draw space before
                var spaceColor = new Microsoft.Xna.Framework.Color.$ctor9(0.0, 0.0, 0.5, 0.5);
                if (this.SpaceBefore.X > 0) {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.clip32(this._destRect.Left - this._scaledSpaceBefore.X), this._destRect.Y, Bridge.Int.clip32(this._scaledSpaceBefore.X), this._destRect.Height), spaceColor.$clone());
                }
                if (this.SpaceBefore.Y > 0) {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, new Microsoft.Xna.Framework.Rectangle.$ctor2(this._destRect.X, Bridge.Int.clip32(this._destRect.Top - this._scaledSpaceBefore.Y), this._destRect.Width, Bridge.Int.clip32(this._scaledSpaceBefore.Y)), spaceColor.$clone());
                }

                // draw space after
                spaceColor = new Microsoft.Xna.Framework.Color.$ctor9(0.5, 0.0, 0.5, 0.5);
                if (this.SpaceAfter.X > 0) {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, new Microsoft.Xna.Framework.Rectangle.$ctor2(this._destRect.Right, this._destRect.Y, Bridge.Int.clip32(this._scaledSpaceAfter.X), this._destRect.Height), spaceColor.$clone());
                }
                if (this.SpaceAfter.Y > 0) {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, new Microsoft.Xna.Framework.Rectangle.$ctor2(this._destRect.X, this._destRect.Bottom, this._destRect.Width, Bridge.Int.clip32(this._scaledSpaceAfter.Y)), spaceColor.$clone());
                }

                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$End();
            },
            /**
             * Draw all children.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch
             * @return  {void}
             */
            DrawChildren: function (spriteBatch) {
                var $t;
                // do stuff before drawing children
                this.BeforeDrawChildren(spriteBatch);

                // get sorted children list
                var childrenSorted = this.GetSortedChildren();

                // draw all children
                $t = Bridge.getEnumerator(childrenSorted);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        child.Draw(spriteBatch);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // do stuff after drawing children
                this.AfterDrawChildren(spriteBatch);
            },
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                var $t, $t1;
                // fix children parent
                var temp = this._children;
                this._children = new (System.Collections.Generic.List$1(FaceUI.Entities.Entity)).ctor();
                $t = Bridge.getEnumerator(temp);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        child._parent = null;
                        this.AddChild(child, child.InheritParentState);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // mark as dirty
                this.MarkAsDirty();

                // update all children
                $t1 = Bridge.getEnumerator(this._children);
                try {
                    while ($t1.moveNext()) {
                        var child1 = $t1.Current;
                        child1.InitAfterDeserialize();
                    }
                } finally {
                    if (Bridge.is($t1, System.IDisposable)) {
                        $t1.System$IDisposable$Dispose();
                    }
                }
            },
            /**
             * Create and return a dictionary of entities, where key is Identifier and value is the entity. 
             This will include self + all children (and their children), and will only include entities that have Identifier property defined.
             Note: if multiple entities share the same identifier, the deepest entity in hirarchy will end up in dict.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {System.Collections.Generic.Dictionary$2}        Dictionary with entities by their identifiers.
             */
            ToEntitiesDictionary: function () {
                var ret = { v : new (System.Collections.Generic.Dictionary$2(System.String,FaceUI.Entities.Entity))() };
                this.PopulateDict(ret);
                return ret.v;
            },
            /**
             * Put all entities that have identifier property in a dictionary.
             Note: if multiple entities share the same identifier, the deepest entity in hirarchy will end up in dict.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {System.Collections.Generic.Dictionary}    dict    Dictionary to put entities into.
             * @return  {void}
             */
            PopulateDict: function (dict) {
                var $t;
                // add self if got identifier
                if (this.Identifier != null && this.Identifier.length > 0) {
                    dict.v.set(this.Identifier, this);
                }

                // iterate children
                $t = Bridge.getEnumerator(this._children);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        child.PopulateDict(dict);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /**
             * Called before drawing child entities of this entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch used to draw entities.
             * @return  {void}
             */
            BeforeDrawChildren: function (spriteBatch) { },
            /**
             * Called after drawing child entities of this entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch used to draw entities.
             * @return  {void}
             */
            AfterDrawChildren: function (spriteBatch) { },
            /**
             * Draw entity shadow (if defined shadow).
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @return  {void}
             */
            DrawEntityShadow: function (spriteBatch) {
                // store current 'is-dirty' flag, because it changes internally while drawing shadow
                var isDirty = this._isDirty;

                // get current shadow color and if transparent skip
                var shadowColor = this.ShadowColor.$clone();
                if (shadowColor.A === 0) {
                    return;
                }

                // get shadow scale
                var shadowScale = this.ShadowScale;

                // update position to draw shadow
                this._destRect.X = (this._destRect.X + Bridge.Int.clip32(this.ShadowOffset.X)) | 0;
                this._destRect.Y = (this._destRect.Y + Bridge.Int.clip32(this.ShadowOffset.Y)) | 0;

                // store previous state and colors
                var oldFill = this.FillColor.$clone();
                var oldOutline = this.OutlineColor.$clone();
                var oldScale = this.Scale;
                var oldOutlineWidth = this.OutlineWidth;
                var oldState = this._entityState;

                // set default colors and state for shadow pass
                this.FillColor = shadowColor.$clone();
                this.OutlineColor = Microsoft.Xna.Framework.Color.Transparent.$clone();
                this.OutlineWidth = 0;
                this.Scale = shadowScale;
                this._entityState = FaceUI.Entities.EntityState.Default;

                // if disabled, turn color into greyscale
                if (this._isCurrentlyDisabled) {
                    this.FillColor = new Microsoft.Xna.Framework.Color.$ctor1(Microsoft.Xna.Framework.Color.op_Multiply(Microsoft.Xna.Framework.Color.White.$clone(), (((((((shadowColor.R + shadowColor.G) | 0) + shadowColor.B) | 0)) / 3.0) / 255.0)), shadowColor.A);
                }

                // draw with shadow effect
                FaceUI.UserInterface.Active.DrawUtils.StartDrawSilhouette(spriteBatch);
                this.DrawEntity(spriteBatch, FaceUI.Entities.DrawPhase.Shadow);
                FaceUI.UserInterface.Active.DrawUtils.EndDraw(spriteBatch);

                // return position and colors back to what they were
                this._destRect.X = (this._destRect.X - Bridge.Int.clip32(this.ShadowOffset.X)) | 0;
                this._destRect.Y = (this._destRect.Y - Bridge.Int.clip32(this.ShadowOffset.Y)) | 0;
                this.FillColor = oldFill.$clone();
                this.Scale = oldScale;
                this.OutlineColor = oldOutline.$clone();
                this.OutlineWidth = oldOutlineWidth;
                this._entityState = oldState;

                // restore is-dirty flag
                this._isDirty = isDirty;
            },
            /**
             * Draw entity outline.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @return  {void}
             */
            DrawEntityOutline: function (spriteBatch) {
                // get outline width and if 0 return
                var outlineWidth = this.OutlineWidth;
                if (this.OutlineWidth === 0) {
                    return;
                }

                // get outline color
                var outlineColor = this.OutlineColor.$clone();

                // if disabled, turn outline to grey
                if (this._isCurrentlyDisabled) {
                    outlineColor = new Microsoft.Xna.Framework.Color.$ctor1(Microsoft.Xna.Framework.Color.op_Multiply(Microsoft.Xna.Framework.Color.White.$clone(), (((((((outlineColor.R + outlineColor.G) | 0) + outlineColor.B) | 0)) / 3.0) / 255.0)), outlineColor.A);
                }

                // store previous fill color
                var oldFill = this.FillColor.$clone();

                // store original destination rect
                var originalDest = this._destRect.$clone();
                var originalIntDest = this._destRectInternal.$clone();

                // store entity previous state
                var oldState = this._entityState;

                // set fill color
                this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.FillColor, new FaceUI.DataTypes.StyleProperty.$ctor1(outlineColor.$clone()), oldState, false);

                // draw the entity outline
                FaceUI.UserInterface.Active.DrawUtils.StartDrawSilhouette(spriteBatch);
                this._destRect.Location = Microsoft.Xna.Framework.Point.op_Addition(originalDest.Location.$clone(), new Microsoft.Xna.Framework.Point.$ctor2(((-outlineWidth) | 0), 0));
                this.DrawEntity(spriteBatch, FaceUI.Entities.DrawPhase.Outline);
                this._destRect.Location = Microsoft.Xna.Framework.Point.op_Addition(originalDest.Location.$clone(), new Microsoft.Xna.Framework.Point.$ctor2(0, ((-outlineWidth) | 0)));
                this.DrawEntity(spriteBatch, FaceUI.Entities.DrawPhase.Outline);
                this._destRect.Location = Microsoft.Xna.Framework.Point.op_Addition(originalDest.Location.$clone(), new Microsoft.Xna.Framework.Point.$ctor2(outlineWidth, 0));
                this.DrawEntity(spriteBatch, FaceUI.Entities.DrawPhase.Outline);
                this._destRect.Location = Microsoft.Xna.Framework.Point.op_Addition(originalDest.Location.$clone(), new Microsoft.Xna.Framework.Point.$ctor2(0, outlineWidth));
                this.DrawEntity(spriteBatch, FaceUI.Entities.DrawPhase.Outline);
                FaceUI.UserInterface.Active.DrawUtils.EndDraw(spriteBatch);

                // turn back to previous fill color
                this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.FillColor, new FaceUI.DataTypes.StyleProperty.$ctor1(oldFill.$clone()), oldState, false);

                // return to the original destination rect
                this._destRect = originalDest.$clone();
                this._destRectInternal = originalIntDest.$clone();
            },
            /**
             * The internal function to draw the entity itself.
             Implemented by inheriting entity types.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) { },
            /**
             * Called every frame after drawing is done.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            OnAfterDraw: function (spriteBatch) {
                !Bridge.staticEquals(this.AfterDraw, null) ? this.AfterDraw(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.AfterDraw, null) ? FaceUI.UserInterface.Active.AfterDraw(this) : null;
            },
            /**
             * Called every frame before drawing is done.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            OnBeforeDraw: function (spriteBatch) {
                !Bridge.staticEquals(this.BeforeDraw, null) ? this.BeforeDraw(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.BeforeDraw, null) ? FaceUI.UserInterface.Active.BeforeDraw(this) : null;
            },
            /**
             * Add a child entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Entity}    child                 Entity to add as child.
             * @param   {boolean}                   inheritParentState    If true, this entity will inherit the parent's state (set InheritParentState property).
             * @param   {number}                    index                 If provided, will be the index in the children array to push the new entity.
             * @return  {FaceUI.Entities.Entity}                          The newly added entity.
             */
            AddChild: function (child, inheritParentState, index) {
                if (inheritParentState === void 0) { inheritParentState = false; }
                if (index === void 0) { index = -1; }
                // make sure don't already have a parent
                if (child._parent != null) {
                    if (FaceUI.UserInterface.Active.SilentSoftErrors) {
                        return child;
                    }
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Child element to add already got a parent!");
                }

                // need to sort children
                this._needToSortChildren = true;

                // set inherit parent mode
                child.InheritParentState = inheritParentState;

                // set child's new parent
                child._parent = this;

                // if index is -1 or out of range, set to last item in childrens list
                if (index === -1 || index >= this._children.Count) {
                    index = this._children.Count;
                }

                // add child at index
                child._indexInParent = index;
                this._children.insert(index, child);

                // update any siblings which need their index updating
                for (var i = (index + 1) | 0; i < this._children.Count; i = (i + 1) | 0) {
                    this._children.getItem(i)._indexInParent = (this._children.getItem(i)._indexInParent + 1) | 0;
                }

                // reset child parent dest rect version
                child._parentLastDestRectVersion = (this._destRectVersion - 1) >>> 0;

                // mark child as dirty
                child.MarkAsDirty();
                this.MarkAsDirty();
                return child;
            },
            /**
             * Bring this entity to be on front (inside its parent).
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            BringToFront: function () {
                var parent = this._parent;
                parent.RemoveChild(this);
                parent.AddChild(this, this.InheritParentState);
            },
            /**
             * Push this entity to the back (inside its parent).
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            SendToBack: function () {
                var parent = this._parent;
                parent.RemoveChild(this);
                parent.AddChild(this, this.InheritParentState, 0);
            },
            /**
             * Remove child entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Entity}    child    Entity to remove.
             * @return  {void}
             */
            RemoveChild: function (child) {
                var $t;
                // make sure don't already have a parent
                if (!Bridge.referenceEquals(child._parent, this)) {
                    if (FaceUI.UserInterface.Active.SilentSoftErrors) {
                        return;
                    }
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Child element to remove does not belong to this entity!");
                }

                // need to sort children
                this._needToSortChildren = true;

                // set parent to null and remove
                child._parent = null;
                child._indexInParent = -1;
                this._children.remove(child);

                // reset index for all children
                var index = 0;
                $t = Bridge.getEnumerator(this._children);
                try {
                    while ($t.moveNext()) {
                        var itrChild = $t.Current;
                        itrChild._indexInParent = Bridge.identity(index, (index = (index + 1) | 0));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // mark child and self as dirty
                child.MarkAsDirty();
                this.MarkAsDirty();
            },
            /**
             * Remove all children entities.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            ClearChildren: function () {
                var $t;
                // remove all children
                $t = Bridge.getEnumerator(this._children);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        child._parent = null;
                        child._indexInParent = -1;
                        child.MarkAsDirty();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                this._children.clear();

                // mark self as dirty
                this._needToSortChildren = true;
                this.MarkAsDirty();
            },
            /**
             * Calculate and return the internal destination rectangle (note: this relay on the dest rect having a valid value first).
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {Microsoft.Xna.Framework.Rectangle}        Internal destination rectangle.
             */
            CalcInternalRect: function () {
                // calculate the internal destination rect, eg after padding
                var padding = this._scaledPadding.$clone();
                this._destRectInternal = this.GetActualDestRect();
                this._destRectInternal.X = (this._destRectInternal.X + Bridge.Int.clip32(padding.X)) | 0;
                this._destRectInternal.Y = (this._destRectInternal.Y + Bridge.Int.clip32(padding.Y)) | 0;
                this._destRectInternal.Width = (this._destRectInternal.Width - (Bridge.Int.mul(Bridge.Int.clip32(padding.X), 2))) | 0;
                this._destRectInternal.Height = (this._destRectInternal.Height - (Bridge.Int.mul(Bridge.Int.clip32(padding.Y), 2))) | 0;
                return this._destRectInternal.$clone();
            },
            /**
             * Add animator to this entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Animators.IAnimator}    animator    Animator to attach.
             * @return  {FaceUI.Animators.IAnimator}
             */
            AttachAnimator: function (animator) {
                animator.SetTargetEntity(this);
                this._animators.add(animator);
                return animator;
            },
            /**
             * Remove animator from entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Animators.IAnimator}    animator    Animator to remove.
             * @return  {void}
             */
            RemoveAnimator: function (animator) {
                if (this._animators.remove(animator)) {
                    animator.SetTargetEntity(null);
                }
            },
            /**
             * Takes a size value in vector, that can be in percents or units, and convert it to absolute
             size in pixels. For example, if given size is 0.5f this will calculate it to be half its parent
             size, as it should be.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {Microsoft.Xna.Framework.Vector2}    size    Size to calculate.
             * @return  {Microsoft.Xna.Framework.Point}              Actual size in pixels.
             */
            CalcActualSizeInPixels: function (size) {
                // simple case: if size is not in percents, just return as-is
                if (size.X > 1.0 && size.Y > 1.0) {
                    return size.ToPoint();
                }

                // get parent internal destination rectangle
                var parentDest = FaceUI.UserInterface.Active.Root._destRect.$clone();
                if (this._parent != null) {
                    this._parent.UpdateDestinationRectsIfDirty();
                    parentDest = this._parent._destRectInternal.$clone();
                }

                // calc and return size
                return new Microsoft.Xna.Framework.Point.$ctor2((size.X === 0.0 ? parentDest.Width : (size.X > 0.0 && size.X < 1.0 ? Bridge.Int.clip32(parentDest.Width * size.X) : Bridge.Int.clip32(size.X))), (size.Y === 0.0 ? parentDest.Height : (size.Y > 0.0 && size.Y < 1.0 ? Bridge.Int.clip32(parentDest.Height * size.Y) : Bridge.Int.clip32(size.Y))));
            },
            /**
             * Calculate and return the destination rectangle, eg the space this entity is rendered on.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {Microsoft.Xna.Framework.Rectangle}        Destination rectangle.
             */
            CalcDestRect: function () {
                // create new rectangle
                var ret = new Microsoft.Xna.Framework.Rectangle.ctor();

                // no parent? assume active interface root as parent
                var parent = this._parent;
                if (parent == null) {
                    parent = FaceUI.UserInterface.Active.Root;
                }

                // set default size
                var originSize = this._size.$clone();
                if (this._size.X === -1 || this._size.Y === -1) {
                    var defaultSize = this.EntityDefaultSize.$clone();
                    if (this._size.X === -1) {
                        this._size.X = defaultSize.X;
                    }
                    if (this._size.Y === -1) {
                        this._size.Y = defaultSize.Y;
                    }
                }

                // get parent internal destination rectangle
                parent.UpdateDestinationRectsIfDirty();
                var parentDest = parent._destRectInternal.$clone();

                // set size:
                // 0: takes whole parent size.
                // 0.0 - 1.0: takes percent of parent size.
                // > 1.0: size in pixels.
                var size = this._scaledSize.$clone();
                var sizeInPixels = this.CalcActualSizeInPixels(size.$clone());
                this._size = originSize.$clone();

                // apply min size
                if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.MinSize), null)) {
                    var minInPixels = this.CalcActualSizeInPixels(System.Nullable.getValue(this.MinSize).$clone());
                    sizeInPixels.X = Math.max(minInPixels.X, sizeInPixels.X);
                    sizeInPixels.Y = Math.max(minInPixels.Y, sizeInPixels.Y);
                }
                // apply max size
                if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.MaxSize), null)) {
                    var maxInPixels = this.CalcActualSizeInPixels(System.Nullable.getValue(this.MaxSize).$clone());
                    sizeInPixels.X = Math.min(maxInPixels.X, sizeInPixels.X);
                    sizeInPixels.Y = Math.min(maxInPixels.Y, sizeInPixels.Y);
                }

                // set return rect size
                ret.Width = sizeInPixels.X;
                ret.Height = sizeInPixels.Y;

                // make sure its a legal size
                if (ret.Width < 1) {
                    ret.Width = 1;
                }
                if (ret.Height < 1) {
                    ret.Height = 1;
                }

                // first calc some helpers
                var parent_left = parentDest.X;
                var parent_top = parentDest.Y;
                var parent_right = (parent_left + parentDest.Width) | 0;
                var parent_bottom = (parent_top + parentDest.Height) | 0;
                var parent_center_x = (parent_left + ((Bridge.Int.div(parentDest.Width, 2)) | 0)) | 0;
                var parent_center_y = (parent_top + ((Bridge.Int.div(parentDest.Height, 2)) | 0)) | 0;

                // get anchor and offset
                var anchor = this._anchor;
                var offset = this._scaledOffset.$clone();

                // if we are in dragging mode we do a little hack to use top-left anchor with the dragged offset
                // note: but only if drag offset was previously set.
                if (this._draggable && !this._needToSetDragOffset) {
                    anchor = FaceUI.Entities.Anchor.TopLeft;
                    offset = this._dragOffset.$clone();
                }

                // calculate position based on anchor, parent and offset
                switch (anchor) {
                    case FaceUI.Entities.Anchor.Auto: 
                    case FaceUI.Entities.Anchor.AutoInline: 
                    case FaceUI.Entities.Anchor.AutoInlineNoBreak: 
                    case FaceUI.Entities.Anchor.TopLeft: 
                        ret.X = (parent_left + Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (parent_top + Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.TopRight: 
                        ret.X = (((parent_right - ret.Width) | 0) - Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (parent_top + Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.TopCenter: 
                    case FaceUI.Entities.Anchor.AutoCenter: 
                        ret.X = (((parent_center_x - ((Bridge.Int.div(ret.Width, 2)) | 0)) | 0) + Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (parent_top + Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.BottomLeft: 
                        ret.X = (parent_left + Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (((parent_bottom - ret.Height) | 0) - Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.BottomRight: 
                        ret.X = (((parent_right - ret.Width) | 0) - Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (((parent_bottom - ret.Height) | 0) - Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.BottomCenter: 
                        ret.X = (((parent_center_x - ((Bridge.Int.div(ret.Width, 2)) | 0)) | 0) + Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (((parent_bottom - ret.Height) | 0) - Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.CenterLeft: 
                        ret.X = (parent_left + Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (((parent_center_y - ((Bridge.Int.div(ret.Height, 2)) | 0)) | 0) + Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.CenterRight: 
                        ret.X = (((parent_right - ret.Width) | 0) - Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (((parent_center_y - ((Bridge.Int.div(ret.Height, 2)) | 0)) | 0) + Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                    case FaceUI.Entities.Anchor.Center: 
                        ret.X = (((parent_center_x - ((Bridge.Int.div(ret.Width, 2)) | 0)) | 0) + Bridge.Int.clip32(offset.X)) | 0;
                        ret.Y = (((parent_center_y - ((Bridge.Int.div(ret.Height, 2)) | 0)) | 0) + Bridge.Int.clip32(offset.Y)) | 0;
                        break;
                }

                // special case for auto anchors
                if ((anchor === FaceUI.Entities.Anchor.Auto || anchor === FaceUI.Entities.Anchor.AutoInline || anchor === FaceUI.Entities.Anchor.AutoCenter || anchor === FaceUI.Entities.Anchor.AutoInlineNoBreak)) {
                    // get previous entity before this
                    var prevEntity = this.GetPreviousEntity(true);

                    // if found entity before this one, align based on it
                    if (prevEntity != null) {
                        // make sure sibling is up-to-date
                        prevEntity.UpdateDestinationRectsIfDirty();

                        // handle inline align
                        if (anchor === FaceUI.Entities.Anchor.AutoInline || anchor === FaceUI.Entities.Anchor.AutoInlineNoBreak) {
                            ret.X = (prevEntity._destRect.Right + Bridge.Int.clip32((offset.X + prevEntity._scaledSpaceAfter.X + this._scaledSpaceBefore.X))) | 0;
                            ret.Y = prevEntity._destRect.Y;
                        }

                        // handle inline align that ran out of width / or auto anchor not inline
                        if ((anchor === FaceUI.Entities.Anchor.AutoInline && ret.Right > parent._destRectInternal.Right) || (anchor === FaceUI.Entities.Anchor.Auto || anchor === FaceUI.Entities.Anchor.AutoCenter)) {
                            // align x
                            if (anchor !== FaceUI.Entities.Anchor.AutoCenter) {
                                ret.X = (parent_left + Bridge.Int.clip32(offset.X)) | 0;
                            }

                            // align y
                            ret.Y = (prevEntity.GetDestRectForAutoAnchors().Bottom + Bridge.Int.clip32((offset.Y + prevEntity._scaledSpaceAfter.Y + this._scaledSpaceBefore.Y))) | 0;
                        }
                    } else {
                        ret.X = (ret.X + Bridge.Int.clip32(this._scaledSpaceBefore.X)) | 0;
                        ret.Y = (ret.Y + Bridge.Int.clip32(this._scaledSpaceBefore.Y)) | 0;
                    }
                }

                // some extra logic for draggables
                if (this._draggable) {
                    // if need to init dragged offset, set it
                    // this trick is used so if an object is draggable, we first evaluate its position based on anchor etc, and we use that
                    // position as starting point for the dragging
                    if (this._needToSetDragOffset) {
                        this._dragOffset.X = (ret.X - parent_left) | 0;
                        this._dragOffset.Y = (ret.Y - parent_top) | 0;
                        this._needToSetDragOffset = false;
                    }

                    // if draggable and need to be contained inside parent, validate it
                    if (this.LimitDraggingToParentBoundaries) {
                        if (ret.X < parent_left) {
                            ret.X = parent_left;
                            this._dragOffset.X = 0;
                        }
                        if (ret.Y < parent_top) {
                            ret.Y = parent_top;
                            this._dragOffset.Y = 0;
                        }
                        if (ret.Right > parent_right) {
                            this._dragOffset.X -= (ret.Right - parent_right) | 0;
                            ;
                            ret.X = (ret.X - (((ret.Right - parent_right) | 0))) | 0;
                        }
                        if (ret.Bottom > parent_bottom) {
                            this._dragOffset.Y -= (ret.Bottom - parent_bottom) | 0;
                            ret.Y = (ret.Y - (((ret.Bottom - parent_bottom) | 0))) | 0;
                        }
                    }
                }

                // return the newly created rectangle
                this._destRect = ret.$clone();
                return ret.$clone();
            },
            /**
             * Return actual destination rectangle.
             This can be override and implemented by things like Paragraph, where the actual destination rect is based on
             text content, font and word-wrap.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {Microsoft.Xna.Framework.Rectangle}        The actual destination rectangle.
             */
            GetActualDestRect: function () {
                return this._destRect.$clone();
            },
            /**
             * Return the actual dest rect for auto-anchoring purposes.
             This is useful for things like DropDown, that when opened they take a larger part of the screen, but we don't
             want it to push down other entities.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {Microsoft.Xna.Framework.Rectangle}
             */
            GetDestRectForAutoAnchors: function () {
                return this.GetActualDestRect();
            },
            /**
             * Remove this entity from its parent.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            RemoveFromParent: function () {
                if (this._parent != null) {
                    this._parent.RemoveChild(this);
                }
            },
            /**
             * Propagate all events trigger by this entity to a given other entity.
             For example, if "OnClick" will be called on this entity, it will trigger OnClick on 'other' as well.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Entity}    other    Entity to propagate events to.
             * @return  {void}
             */
            PropagateEventsTo: function (other) {
                this.OnMouseDown = Bridge.fn.combine(this.OnMouseDown, function (entity) {
                    !Bridge.staticEquals(other.OnMouseDown, null) ? other.OnMouseDown(other) : null;
                });
                this.OnRightMouseDown = Bridge.fn.combine(this.OnRightMouseDown, function (entity) {
                    !Bridge.staticEquals(other.OnRightMouseDown, null) ? other.OnRightMouseDown(other) : null;
                });
                this.OnMouseReleased = Bridge.fn.combine(this.OnMouseReleased, function (entity) {
                    !Bridge.staticEquals(other.OnMouseReleased, null) ? other.OnMouseReleased(other) : null;
                });
                this.WhileMouseDown = Bridge.fn.combine(this.WhileMouseDown, function (entity) {
                    !Bridge.staticEquals(other.WhileMouseDown, null) ? other.WhileMouseDown(other) : null;
                });
                this.WhileRightMouseDown = Bridge.fn.combine(this.WhileRightMouseDown, function (entity) {
                    !Bridge.staticEquals(other.WhileRightMouseDown, null) ? other.WhileRightMouseDown(other) : null;
                });
                this.WhileMouseHover = Bridge.fn.combine(this.WhileMouseHover, function (entity) {
                    !Bridge.staticEquals(other.WhileMouseHover, null) ? other.WhileMouseHover(other) : null;
                });
                this.WhileMouseHoverOrDown = Bridge.fn.combine(this.WhileMouseHoverOrDown, function (entity) {
                    !Bridge.staticEquals(other.WhileMouseHoverOrDown, null) ? other.WhileMouseHoverOrDown(other) : null;
                });
                this.OnRightClick = Bridge.fn.combine(this.OnRightClick, function (entity) {
                    !Bridge.staticEquals(other.OnRightClick, null) ? other.OnRightClick(other) : null;
                });
                this.OnClick = Bridge.fn.combine(this.OnClick, function (entity) {
                    !Bridge.staticEquals(other.OnClick, null) ? other.OnClick(other) : null;
                });
                this.OnValueChange = Bridge.fn.combine(this.OnValueChange, function (entity) {
                    !Bridge.staticEquals(other.OnValueChange, null) ? other.OnValueChange(other) : null;
                });
                this.OnMouseEnter = Bridge.fn.combine(this.OnMouseEnter, function (entity) {
                    !Bridge.staticEquals(other.OnMouseEnter, null) ? other.OnMouseEnter(other) : null;
                });
                this.OnMouseLeave = Bridge.fn.combine(this.OnMouseLeave, function (entity) {
                    !Bridge.staticEquals(other.OnMouseLeave, null) ? other.OnMouseLeave(other) : null;
                });
                this.OnMouseWheelScroll = Bridge.fn.combine(this.OnMouseWheelScroll, function (entity) {
                    !Bridge.staticEquals(other.OnMouseWheelScroll, null) ? other.OnMouseWheelScroll(other) : null;
                });
                this.OnStartDrag = Bridge.fn.combine(this.OnStartDrag, function (entity) {
                    !Bridge.staticEquals(other.OnStartDrag, null) ? other.OnStartDrag(other) : null;
                });
                this.OnStopDrag = Bridge.fn.combine(this.OnStopDrag, function (entity) {
                    !Bridge.staticEquals(other.OnStopDrag, null) ? other.OnStopDrag(other) : null;
                });
                this.WhileDragging = Bridge.fn.combine(this.WhileDragging, function (entity) {
                    !Bridge.staticEquals(other.WhileDragging, null) ? other.WhileDragging(other) : null;
                });
                this.BeforeDraw = Bridge.fn.combine(this.BeforeDraw, function (entity) {
                    !Bridge.staticEquals(other.BeforeDraw, null) ? other.BeforeDraw(other) : null;
                });
                this.AfterDraw = Bridge.fn.combine(this.AfterDraw, function (entity) {
                    !Bridge.staticEquals(other.AfterDraw, null) ? other.AfterDraw(other) : null;
                });
                this.BeforeUpdate = Bridge.fn.combine(this.BeforeUpdate, function (entity) {
                    !Bridge.staticEquals(other.BeforeUpdate, null) ? other.BeforeUpdate(other) : null;
                });
                this.AfterUpdate = Bridge.fn.combine(this.AfterUpdate, function (entity) {
                    !Bridge.staticEquals(other.AfterUpdate, null) ? other.AfterUpdate(other) : null;
                });
            },
            /**
             * Return the relative offset, in pixels, from parent top-left corner.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {Microsoft.Xna.Framework.Vector2}        Calculated offset from parent top-left corner.
             */
            GetRelativeOffset: function () {
                var dest = this.GetActualDestRect();
                var parentDest = this._parent.GetActualDestRect();
                return new Microsoft.Xna.Framework.Vector2.$ctor2(((dest.X - parentDest.X) | 0), ((dest.Y - parentDest.Y) | 0));
            },
            /**
             * Return the entity before this one in parent container, aka the next older sibling.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {boolean}                   skipInvisibles    If true, will skip invisible entities, eg will return the first visible older sibling.
             * @return  {FaceUI.Entities.Entity}                      Entity before this in parent, or null if first in parent or if orphan entity.
             */
            GetPreviousEntity: function (skipInvisibles) {
                var $t;
                if (skipInvisibles === void 0) { skipInvisibles = false; }
                // no parent? skip
                if (this._parent == null) {
                    return null;
                }

                // get siblings and iterate them
                var siblings = this._parent._children;
                var prev = null;
                $t = Bridge.getEnumerator(siblings);
                try {
                    while ($t.moveNext()) {
                        var sibling = $t.Current;
                        // when getting to self, break the loop
                        if (Bridge.referenceEquals(sibling, this)) {
                            break;
                        }

                        // if older sibling is invisible, skip it
                        if (skipInvisibles && !sibling.Visible) {
                            continue;
                        }

                        // set prev
                        prev = sibling;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // return the previous entity (or null if wasn't found)
                return prev;
            },
            /**
             * Handle mouse down event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnMouseDown: function () {
                !Bridge.staticEquals(this.OnMouseDown, null) ? this.OnMouseDown(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnMouseDown, null) ? FaceUI.UserInterface.Active.OnMouseDown(this) : null;
            },
            /**
             * Handle mouse up event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnMouseReleased: function () {
                !Bridge.staticEquals(this.OnMouseReleased, null) ? this.OnMouseReleased(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnMouseReleased, null) ? FaceUI.UserInterface.Active.OnMouseReleased(this) : null;
            },
            /**
             * Handle mouse click event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnClick: function () {
                !Bridge.staticEquals(this.OnClick, null) ? this.OnClick(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnClick, null) ? FaceUI.UserInterface.Active.OnClick(this) : null;
            },
            /**
             * Handle mouse down event, called every frame while down.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoWhileMouseDown: function () {
                !Bridge.staticEquals(this.WhileMouseDown, null) ? this.WhileMouseDown(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.WhileMouseDown, null) ? FaceUI.UserInterface.Active.WhileMouseDown(this) : null;
            },
            /**
             * Handle mouse hover event, called every frame while hover.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoWhileMouseHover: function () {
                !Bridge.staticEquals(this.WhileMouseHover, null) ? this.WhileMouseHover(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.WhileMouseHover, null) ? FaceUI.UserInterface.Active.WhileMouseHover(this) : null;
            },
            /**
             * Handle mouse hover or down event, called every frame while hover.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoWhileMouseHoverOrDown: function () {
                // invoke callback and global callback
                !Bridge.staticEquals(this.WhileMouseHoverOrDown, null) ? this.WhileMouseHoverOrDown(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.WhileMouseHoverOrDown, null) ? FaceUI.UserInterface.Active.WhileMouseHoverOrDown(this) : null;

                // do right mouse click event
                if (this.MouseInput.FaceUI$IMouseInput$MouseButtonClick(FaceUI.MouseButton.Right)) {
                    !Bridge.staticEquals(this.OnRightClick, null) ? this.OnRightClick(this) : null;
                    !Bridge.staticEquals(FaceUI.UserInterface.Active.OnRightClick, null) ? FaceUI.UserInterface.Active.OnRightClick(this) : null;
                } else if (this.MouseInput.FaceUI$IMouseInput$MouseButtonPressed(FaceUI.MouseButton.Right)) {
                    !Bridge.staticEquals(this.OnRightMouseDown, null) ? this.OnRightMouseDown(this) : null;
                    !Bridge.staticEquals(FaceUI.UserInterface.Active.OnRightMouseDown, null) ? FaceUI.UserInterface.Active.OnRightMouseDown(this) : null;
                } else if (this.MouseInput.FaceUI$IMouseInput$MouseButtonDown(FaceUI.MouseButton.Right)) {
                    !Bridge.staticEquals(this.WhileRightMouseDown, null) ? this.WhileRightMouseDown(this) : null;
                    !Bridge.staticEquals(FaceUI.UserInterface.Active.WhileRightMouseDown, null) ? FaceUI.UserInterface.Active.WhileRightMouseDown(this) : null;
                }
            },
            /**
             * Handle value change event (for entities with value).
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnValueChange: function () {
                !Bridge.staticEquals(this.OnValueChange, null) ? this.OnValueChange(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnValueChange, null) ? FaceUI.UserInterface.Active.OnValueChange(this) : null;
            },
            /**
             * Handle mouse enter event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnMouseEnter: function () {
                !Bridge.staticEquals(this.OnMouseEnter, null) ? this.OnMouseEnter(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnMouseEnter, null) ? FaceUI.UserInterface.Active.OnMouseEnter(this) : null;
            },
            /**
             * Handle mouse leave event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnMouseLeave: function () {
                !Bridge.staticEquals(this.OnMouseLeave, null) ? this.OnMouseLeave(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnMouseLeave, null) ? FaceUI.UserInterface.Active.OnMouseLeave(this) : null;
            },
            /**
             * Handle start dragging event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnStartDrag: function () {
                !Bridge.staticEquals(this.OnStartDrag, null) ? this.OnStartDrag(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnStartDrag, null) ? FaceUI.UserInterface.Active.OnStartDrag(this) : null;
            },
            /**
             * Handle end dragging event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnStopDrag: function () {
                !Bridge.staticEquals(this.OnStopDrag, null) ? this.OnStopDrag(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnStopDrag, null) ? FaceUI.UserInterface.Active.OnStopDrag(this) : null;
            },
            /**
             * Handle the while-dragging event.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoWhileDragging: function () {
                !Bridge.staticEquals(this.WhileDragging, null) ? this.WhileDragging(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.WhileDragging, null) ? FaceUI.UserInterface.Active.WhileDragging(this) : null;
            },
            /**
             * Handle when mouse wheel scroll and this entity is the active entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnMouseWheelScroll: function () {
                !Bridge.staticEquals(this.OnMouseWheelScroll, null) ? this.OnMouseWheelScroll(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnMouseWheelScroll, null) ? FaceUI.UserInterface.Active.OnMouseWheelScroll(this) : null;
            },
            /**
             * Called every frame after update.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoAfterUpdate: function () {
                !Bridge.staticEquals(this.AfterUpdate, null) ? this.AfterUpdate(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.AfterUpdate, null) ? FaceUI.UserInterface.Active.AfterUpdate(this) : null;
            },
            /**
             * Called every time the visibility property of this entity changes.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnVisibilityChange: function () {
                // invoke callbacks
                !Bridge.staticEquals(this.OnVisiblityChange, null) ? this.OnVisiblityChange(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnVisiblityChange, null) ? FaceUI.UserInterface.Active.OnVisiblityChange(this) : null;
            },
            /**
             * Called every frame before update.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoBeforeUpdate: function () {
                !Bridge.staticEquals(this.BeforeUpdate, null) ? this.BeforeUpdate(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.BeforeUpdate, null) ? FaceUI.UserInterface.Active.BeforeUpdate(this) : null;
            },
            /**
             * Called every time this entity is focused / unfocused.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            DoOnFocusChange: function () {
                !Bridge.staticEquals(this.OnFocusChange, null) ? this.OnFocusChange(this) : null;
                !Bridge.staticEquals(FaceUI.UserInterface.Active.OnFocusChange, null) ? FaceUI.UserInterface.Active.OnFocusChange(this) : null;
            },
            /**
             * Test if a given point is inside entity's boundaries.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {Microsoft.Xna.Framework.Vector2}    point    Point to test.
             * @return  {boolean}                                     True if point is in entity's boundaries (destination rectangle)
             */
            IsTouching: function (point) {
                // adjust scrolling
                point = Microsoft.Xna.Framework.Vector2.op_Addition(point.$clone(), this._lastScrollVal.ToVector2());

                // get rectangle for the test
                var rect = this.UseActualSizeForCollision ? this.GetActualDestRect() : this._destRect;

                // now test detection
                return (point.X >= ((rect.Left - this.ExtraMargin.X) | 0) && point.X <= ((rect.Right + this.ExtraMargin.X) | 0) && point.Y >= ((rect.Top - this.ExtraMargin.Y) | 0) && point.Y <= ((rect.Bottom + this.ExtraMargin.Y) | 0));
            },
            /**
             * Return true if this entity is naturally interactable, like buttons, lists, etc.
             Entities that are not naturally interactable are things like paragraph, colored rectangle, icon, etc.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {boolean}        True if entity is naturally interactable.
             */
            IsNaturallyInteractable: function () {
                return false;
            },
            /**
             * Update all animators attached to this entity.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {boolean}    recursive    If true, will also update children's animators
             * @return  {void}
             */
            UpdateAnimators: function (recursive) {
                var $t, $t1;
                // update animators
                $t = Bridge.getEnumerator(this._animators);
                try {
                    while ($t.moveNext()) {
                        var animator = $t.Current;
                        if (animator.Enabled) {
                            animator.Update();
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // remove animators that are done
                this._animators.RemoveAll($asm.$.FaceUI.Entities.Entity.f2);

                // update children animations
                if (recursive) {
                    $t1 = Bridge.getEnumerator(this._children);
                    try {
                        while ($t1.moveNext()) {
                            var child = $t1.Current;
                            child.UpdateAnimators(true);
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
                }
            },
            /**
             * Mark that this entity boundaries or style changed and it need to recalculate cached destination rect and other things.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @return  {void}
             */
            MarkAsDirty: function () {
                this._isDirty = true;
            },
            /**
             * Remove the IsDirty flag.
             *
             * @instance
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {boolean}    updateChildren    If true, will set a flag that will still make children update.
             * @return  {void}
             */
            ClearDirtyFlag: function (updateChildren) {
                if (updateChildren === void 0) { updateChildren = false; }
                this._isDirty = false;
                if (updateChildren) {
                    this._destRectVersion = (this._destRectVersion + 1) >>> 0;
                }
            },
            /**
             * Called every frame to update the children of this entity.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Entity}           targetEntity        The deepest child entity with highest priority that we point on and can be interacted with.
             * @param   {FaceUI.Entities.Entity}           dragTargetEntity    The deepest child dragable entity with highest priority that we point on and can be drag if mouse down.
             * @param   {System.Boolean}                   wasEventHandled     Set to true if current event was already handled by a deeper child.
             * @param   {Microsoft.Xna.Framework.Point}    scrollVal           Combined scrolling value (panels with scrollbar etc) of all parents.
             * @return  {void}
             */
            UpdateChildren: function (targetEntity, dragTargetEntity, wasEventHandled, scrollVal) {
                // update all children (note: we go in reverse order so that entities on front will receive events before entites on back.
                var childrenSorted = this.GetSortedChildren();
                for (var i = (childrenSorted.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    childrenSorted.getItem(i).Update(targetEntity, dragTargetEntity, wasEventHandled, scrollVal.$clone());
                }
            },
            /**
             * Called every frame to update entity state and call events.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Entity
             * @memberof FaceUI.Entities.Entity
             * @param   {FaceUI.Entities.Entity}           targetEntity        The deepest child entity with highest priority that we point on and can be interacted with.
             * @param   {FaceUI.Entities.Entity}           dragTargetEntity    The deepest child dragable entity with highest priority that we point on and can be drag if mouse down.
             * @param   {System.Boolean}                   wasEventHandled     Set to true if current event was already handled by a deeper child.
             * @param   {Microsoft.Xna.Framework.Point}    scrollVal           Combined scrolling value (panels with scrollbar etc) of all parents.
             * @return  {void}
             */
            Update: function (targetEntity, dragTargetEntity, wasEventHandled, scrollVal) {
                // set last scroll var
                this._lastScrollVal = scrollVal.$clone();

                // update animations
                this.UpdateAnimators(false);

                // check if should invoke the spawn effect
                if (this._isFirstUpdate) {
                    this.DoOnFirstUpdate();
                    this._isFirstUpdate = false;
                }

                // if inherit parent state just copy it and stop
                if (this.InheritParentState) {
                    this._entityState = this._parent._entityState;
                    this._isMouseOver = this._parent._isMouseOver;
                    this.IsFocused = this._parent.IsFocused;
                    this._isCurrentlyDisabled = this._parent._isCurrentlyDisabled;
                    return;
                }

                // get mouse position
                var mousePos = this.GetMousePos();

                // add our own scroll value to the combined scroll val before updating children
                scrollVal = Microsoft.Xna.Framework.Point.op_Addition(scrollVal.$clone(), this.OverflowScrollVal.$clone());

                // get if disabled
                this._isCurrentlyDisabled = this.IsDisabled();

                // if disabled, invisible, or locked - skip
                if (this._isCurrentlyDisabled || this.IsLocked() || !this.IsVisible()) {
                    // if this very entity is locked (eg not locked due to parent being locked),
                    // iterate children and invoke those with DoEventsIfDirectParentIsLocked setting
                    if (this.Locked) {
                        for (var i = (this._children.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                            if (this._children.getItem(i).DoEventsIfDirectParentIsLocked) {
                                this._children.getItem(i).Update(targetEntity, dragTargetEntity, wasEventHandled, scrollVal.$clone());
                            }
                        }
                    }

                    // if was previously interactable, we might need to trigger some events
                    if (this._isInteractable) {
                        // if mouse was over, trigger mouse leave event
                        if (this._entityState === FaceUI.Entities.EntityState.MouseHover) {
                            this.DoOnMouseLeave();
                        } else if (this._entityState === FaceUI.Entities.EntityState.MouseDown) {
                            this.DoOnMouseReleased();
                            this.DoOnMouseLeave();
                        }
                    }

                    // set to default and return
                    this._isInteractable = false;
                    this._entityState = FaceUI.Entities.EntityState.Default;
                    return;
                }

                // if click-through is true, update children and stop here
                if (this.ClickThrough) {
                    this.UpdateChildren(targetEntity, dragTargetEntity, wasEventHandled, scrollVal.$clone());
                    return;
                }

                // update dest rect if needed (dest rect is calculated before draw, but is used for mouse collision detection as well,
                // so its better to calculate it here too in case something changed).
                this.UpdateDestinationRectsIfDirty();

                // set if interactable
                this._isInteractable = true;

                // do before update event
                this.DoBeforeUpdate();

                // store previous state
                var prevState = this._entityState;

                // store previous mouse-over state
                var prevMouseOver = this._isMouseOver;

                // STEP 1: FIRST WE CALCULATE ENTITY STATE (EG MOUST HOVER / MOUSE DOWN / ..)

                // only if event was not already catched by another entity, check for events
                if (!wasEventHandled.v) {
                    // if need to calculate state locally:
                    if (!this.InheritParentState) {
                        // reset the mouse-over flag
                        this._isMouseOver = false;
                        this._entityState = FaceUI.Entities.EntityState.Default;

                        // set mouse state
                        if (this.IsTouching(mousePos.$clone())) {
                            // set self as the current target, unless a sibling got the event first
                            if (targetEntity.v == null || !Bridge.referenceEquals(targetEntity.v._parent, this._parent)) {
                                targetEntity.v = this;
                            }

                            // mouse is over entity
                            this._isMouseOver = true;

                            // update mouse state
                            this._entityState = (this.IsFocused || this.PromiscuousClicksMode || this.MouseInput.FaceUI$IMouseInput$MouseButtonPressed(0)) && this.MouseInput.FaceUI$IMouseInput$MouseButtonDown(0) ? FaceUI.Entities.EntityState.MouseDown : FaceUI.Entities.EntityState.MouseHover;
                        }
                    }

                    // set if focused
                    if (this.MouseInput.FaceUI$IMouseInput$MouseButtonPressed(0)) {
                        this.IsFocused = this._isMouseOver;
                    }
                } else if (this.MouseInput.FaceUI$IMouseInput$MouseButtonClick(0)) {
                    this.IsFocused = false;
                }

                // STEP 2: NOW WE CALL ALL CHILDREN'S UPDATE

                // update all children
                this.UpdateChildren(targetEntity, dragTargetEntity, wasEventHandled, scrollVal.$clone());

                // check dragging after children so that the most nested entity gets priority
                if ((this._draggable || this.IsNaturallyInteractable()) && dragTargetEntity.v == null && this._isMouseOver && this.MouseInput.FaceUI$IMouseInput$MouseButtonPressed(FaceUI.MouseButton.Left)) {
                    dragTargetEntity.v = this;
                }

                // STEP 3: CALL EVENTS

                // if selected target is this
                if (Bridge.referenceEquals(targetEntity.v, this)) {
                    // handled events
                    wasEventHandled.v = true;

                    // call the while-mouse-hover-or-down handler
                    this.DoWhileMouseHoverOrDown();

                    // set mouse enter / mouse leave
                    if (this._isMouseOver && !prevMouseOver) {
                        this.DoOnMouseEnter();
                    }

                    // generate events
                    if (prevState !== this._entityState) {
                        // mouse down
                        if (this.MouseInput.FaceUI$IMouseInput$MouseButtonPressed(0)) {
                            this.DoOnMouseDown();
                        }
                        // mouse up
                        if (this.MouseInput.FaceUI$IMouseInput$MouseButtonReleased(0)) {
                            this.DoOnMouseReleased();
                        }
                        // mouse click
                        if (this.MouseInput.FaceUI$IMouseInput$MouseButtonClick(0)) {
                            this.DoOnClick();
                        }
                    }

                    // call the while-mouse-down / while-mouse-hover events
                    if (this._entityState === FaceUI.Entities.EntityState.MouseDown) {
                        this.DoWhileMouseDown();
                    } else {
                        this.DoWhileMouseHover();
                    }
                } else {
                    this._entityState = FaceUI.Entities.EntityState.Default;
                }

                // mouse leave events
                if (!this._isMouseOver && prevMouseOver) {
                    this.DoOnMouseLeave();
                }

                // handle mouse wheel scroll over this entity
                if (Bridge.referenceEquals(targetEntity.v, this) || Bridge.referenceEquals(FaceUI.UserInterface.Active.ActiveEntity, this)) {
                    if (this.MouseInput.FaceUI$IMouseInput$MouseWheelChange !== 0) {
                        this.DoOnMouseWheelScroll();
                    }
                }

                // STEP 4: HANDLE DRAGGING FOR DRAGABLES

                // if draggable, and after calling all the children target is self, it means we are being dragged!
                if (this._draggable && (Bridge.referenceEquals(dragTargetEntity.v, this)) && this.IsFocused) {
                    // check if we need to start dragging the entity that was not dragged before
                    if (!this._isBeingDragged && this.MouseInput.FaceUI$IMouseInput$MousePositionDiff.Length() !== 0) {
                        // remove self from parent and add again. this trick is to keep the dragged entity always on-top
                        var parent = this._parent;
                        this.RemoveFromParent();
                        parent.AddChild(this);

                        // set dragging mode = true, and call the do-start-dragging event
                        this._isBeingDragged = true;
                        this.DoOnStartDrag();
                    }

                    // if being dragged..
                    if (this._isBeingDragged) {
                        // update drag offset and call the dragging event
                        this._dragOffset = Microsoft.Xna.Framework.Vector2.op_Addition(this._dragOffset.$clone(), this.MouseInput.FaceUI$IMouseInput$MousePositionDiff.$clone());
                        this.DoWhileDragging();
                    }
                } else if (this._isBeingDragged) {
                    this._isBeingDragged = false;
                    this.DoOnStopDrag();
                    this.MarkAsDirty();
                }

                // if being dragged, mark as dirty
                if (this._isBeingDragged) {
                    this.MarkAsDirty();
                }

                // do after-update events
                this.DoAfterUpdate();
            }
        }
    });

    Bridge.ns("FaceUI.Entities.Entity", $asm.$);

    Bridge.apply($asm.$.FaceUI.Entities.Entity, {
        f1: function (x, y) {
            return Bridge.compare(x.Priority, y.Priority);
        },
        f2: function (x) {
            return x.IsDone && x.ShouldRemoveWhenDone;
        }
    });

    /**
     * Button skins.
     *
     * @public
     * @class FaceUI.Entities.ButtonSkin
     */
    Bridge.define("FaceUI.Entities.ButtonSkin", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * The default button skin.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ButtonSkin
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.ButtonSkin
                 */
                Default: 0,
                /**
                 * Alternative button skin.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ButtonSkin
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.ButtonSkin
                 */
                Alternative: 1,
                /**
                 * Fancy button skin.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ButtonSkin
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.ButtonSkin
                 */
                Fancy: 2
            }
        }
    });

    /**
     * Different draw phases of the entity.
     *
     * @public
     * @class FaceUI.Entities.DrawPhase
     */
    Bridge.define("FaceUI.Entities.DrawPhase", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Drawing the entity itself.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DrawPhase
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.DrawPhase
                 */
                Base: 0,
                /**
                 * Drawing entity outline.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DrawPhase
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.DrawPhase
                 */
                Outline: 1,
                /**
                 * Drawing entity's shadow.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DrawPhase
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.DrawPhase
                 */
                Shadow: 2
            }
        }
    });

    /**
     * Possible entity states and interactions with user.
     *
     * @public
     * @class FaceUI.Entities.EntityState
     */
    Bridge.define("FaceUI.Entities.EntityState", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Default state, eg currently not interacting.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.EntityState
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.EntityState
                 */
                Default: 0,
                /**
                 * Mouse is hovering over this entity.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.EntityState
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.EntityState
                 */
                MouseHover: 1,
                /**
                 * Mouse button is pressed down over this entity.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.EntityState
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.EntityState
                 */
                MouseDown: 2
            }
        }
    });

    /**
     * Font styles.
     *
     * @public
     * @class FaceUI.Entities.FontStyle
     */
    Bridge.define("FaceUI.Entities.FontStyle", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Regular font.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.FontStyle
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.FontStyle
                 */
                Regular: 0,
                /**
                 * Bold font.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.FontStyle
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.FontStyle
                 */
                Bold: 1,
                /**
                 * Italic font.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.FontStyle
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.FontStyle
                 */
                Italic: 2
            }
        }
    });

    /**
     * Pre-defined icons you can use.
     *
     * @public
     * @class FaceUI.Entities.IconType
     */
    Bridge.define("FaceUI.Entities.IconType", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * 'Sword' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.IconType
                 */
                Sword: 0,
                /**
                 * 'Shield' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.IconType
                 */
                Shield: 1,
                /**
                 * 'Armor' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.IconType
                 */
                Armor: 2,
                /**
                 * 'Ring' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 3
                 * @type FaceUI.Entities.IconType
                 */
                Ring: 3,
                /**
                 * 'RingRuby' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 4
                 * @type FaceUI.Entities.IconType
                 */
                RingRuby: 4,
                /**
                 * 'RingGold' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 5
                 * @type FaceUI.Entities.IconType
                 */
                RingGold: 5,
                /**
                 * 'RingGoldRuby' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 6
                 * @type FaceUI.Entities.IconType
                 */
                RingGoldRuby: 6,
                /**
                 * 'Heart' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 7
                 * @type FaceUI.Entities.IconType
                 */
                Heart: 7,
                /**
                 * 'Apple' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 8
                 * @type FaceUI.Entities.IconType
                 */
                Apple: 8,
                /**
                 * 'MagicWand' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 9
                 * @type FaceUI.Entities.IconType
                 */
                MagicWand: 9,
                /**
                 * 'Book' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 10
                 * @type FaceUI.Entities.IconType
                 */
                Book: 10,
                /**
                 * 'Key' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 11
                 * @type FaceUI.Entities.IconType
                 */
                Key: 11,
                /**
                 * 'Scroll' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 12
                 * @type FaceUI.Entities.IconType
                 */
                Scroll: 12,
                /**
                 * 'Skull' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 13
                 * @type FaceUI.Entities.IconType
                 */
                Skull: 13,
                /**
                 * 'Bone' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 14
                 * @type FaceUI.Entities.IconType
                 */
                Bone: 14,
                /**
                 * 'RubyPink' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 15
                 * @type FaceUI.Entities.IconType
                 */
                RubyPink: 15,
                /**
                 * 'RubyBlue' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 16
                 * @type FaceUI.Entities.IconType
                 */
                RubyBlue: 16,
                /**
                 * 'RubyGreen' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 17
                 * @type FaceUI.Entities.IconType
                 */
                RubyGreen: 17,
                /**
                 * 'RubyRed' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 18
                 * @type FaceUI.Entities.IconType
                 */
                RubyRed: 18,
                /**
                 * 'RubyPurple' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 19
                 * @type FaceUI.Entities.IconType
                 */
                RubyPurple: 19,
                /**
                 * 'Diamond' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 20
                 * @type FaceUI.Entities.IconType
                 */
                Diamond: 20,
                /**
                 * 'Helmet' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 21
                 * @type FaceUI.Entities.IconType
                 */
                Helmet: 21,
                /**
                 * 'Shovel' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 22
                 * @type FaceUI.Entities.IconType
                 */
                Shovel: 22,
                /**
                 * 'Explanation' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 23
                 * @type FaceUI.Entities.IconType
                 */
                Explanation: 23,
                /**
                 * 'Sack' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 24
                 * @type FaceUI.Entities.IconType
                 */
                Sack: 24,
                /**
                 * 'GoldCoins' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 25
                 * @type FaceUI.Entities.IconType
                 */
                GoldCoins: 25,
                /**
                 * 'MagicBook' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 26
                 * @type FaceUI.Entities.IconType
                 */
                MagicBook: 26,
                /**
                 * 'Map' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 27
                 * @type FaceUI.Entities.IconType
                 */
                Map: 27,
                /**
                 * 'Feather' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 28
                 * @type FaceUI.Entities.IconType
                 */
                Feather: 28,
                /**
                 * 'ShieldAndSword' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 29
                 * @type FaceUI.Entities.IconType
                 */
                ShieldAndSword: 29,
                /**
                 * 'Cubes' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 30
                 * @type FaceUI.Entities.IconType
                 */
                Cubes: 30,
                /**
                 * 'FloppyDisk' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 31
                 * @type FaceUI.Entities.IconType
                 */
                FloppyDisk: 31,
                /**
                 * 'BloodySword' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 32
                 * @type FaceUI.Entities.IconType
                 */
                BloodySword: 32,
                /**
                 * 'Axe' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 33
                 * @type FaceUI.Entities.IconType
                 */
                Axe: 33,
                /**
                 * 'PotionRed' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 34
                 * @type FaceUI.Entities.IconType
                 */
                PotionRed: 34,
                /**
                 * 'PotionYellow' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 35
                 * @type FaceUI.Entities.IconType
                 */
                PotionYellow: 35,
                /**
                 * 'PotionPurple' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 36
                 * @type FaceUI.Entities.IconType
                 */
                PotionPurple: 36,
                /**
                 * 'PotionBlue' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 37
                 * @type FaceUI.Entities.IconType
                 */
                PotionBlue: 37,
                /**
                 * 'PotionCyan' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 38
                 * @type FaceUI.Entities.IconType
                 */
                PotionCyan: 38,
                /**
                 * 'PotionGreen' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 39
                 * @type FaceUI.Entities.IconType
                 */
                PotionGreen: 39,
                /**
                 * 'Pistol' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 40
                 * @type FaceUI.Entities.IconType
                 */
                Pistol: 40,
                /**
                 * 'SilverShard' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 41
                 * @type FaceUI.Entities.IconType
                 */
                SilverShard: 41,
                /**
                 * 'GoldShard' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 42
                 * @type FaceUI.Entities.IconType
                 */
                GoldShard: 42,
                /**
                 * 'OrbRed' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 43
                 * @type FaceUI.Entities.IconType
                 */
                OrbRed: 43,
                /**
                 * 'OrbBlue' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 44
                 * @type FaceUI.Entities.IconType
                 */
                OrbBlue: 44,
                /**
                 * 'OrbGreen' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 45
                 * @type FaceUI.Entities.IconType
                 */
                OrbGreen: 45,
                /**
                 * 'ZoomIn' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 46
                 * @type FaceUI.Entities.IconType
                 */
                ZoomIn: 46,
                /**
                 * 'ZoomOut' Icon.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 47
                 * @type FaceUI.Entities.IconType
                 */
                ZoomOut: 47,
                /**
                 * Special icon that is just an empty texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.IconType
                 * @constant
                 * @default 48
                 * @type FaceUI.Entities.IconType
                 */
                None: 48
            }
        }
    });

    /**
     * Image drawing modes, eg how to draw the image and fill the destination rectangle with its texture.
     *
     * @public
     * @class FaceUI.Entities.ImageDrawMode
     */
    Bridge.define("FaceUI.Entities.ImageDrawMode", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * With this mode texture will just stretch over the entire size of the destination rectangle.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ImageDrawMode
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.ImageDrawMode
                 */
                Stretch: 0,
                /**
                 * With this mode texture will be tiled and drawed with a frame, just like panels.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ImageDrawMode
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.ImageDrawMode
                 */
                Panel: 1
            }
        }
    });

    /**
     * How to treat entities that overflow panel boundaries.
     *
     * @public
     * @class FaceUI.Entities.PanelOverflowBehavior
     */
    Bridge.define("FaceUI.Entities.PanelOverflowBehavior", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Entity will be rendered as usual outside the panel boundaries.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelOverflowBehavior
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.PanelOverflowBehavior
                 */
                Overflow: 0,
                /**
                 * Entities that exceed panel boundaries will be clipped.
                 Note: Requires render targets.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelOverflowBehavior
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.PanelOverflowBehavior
                 */
                Clipped: 1,
                /**
                 * Entities that exceed panel on Y axis will create a scrollbar. Exceeding on X axis will be hidden.
                 Note: Requires render targets.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelOverflowBehavior
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.PanelOverflowBehavior
                 */
                VerticalScroll: 2
            }
        }
    });

    /**
     * Different panel textures you can use.
     *
     * @public
     * @class FaceUI.Entities.PanelSkin
     */
    Bridge.define("FaceUI.Entities.PanelSkin", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * No skin, the panel itself is invisible.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelSkin
                 * @constant
                 * @default -1
                 * @type FaceUI.Entities.PanelSkin
                 */
                None: -1,
                /**
                 * Default panel texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelSkin
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.PanelSkin
                 */
                Default: 0,
                /**
                 * Alternative more decorated panel texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelSkin
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.PanelSkin
                 */
                Fancy: 1,
                /**
                 * Simple, grey panel. Useful for internal frames, eg when inside another panel.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelSkin
                 * @constant
                 * @default 2
                 * @type FaceUI.Entities.PanelSkin
                 */
                Simple: 2,
                /**
                 * Shiny golden panel.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelSkin
                 * @constant
                 * @default 3
                 * @type FaceUI.Entities.PanelSkin
                 */
                Golden: 3,
                /**
                 * Special panel skin used for lists and input background.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelSkin
                 * @constant
                 * @default 4
                 * @type FaceUI.Entities.PanelSkin
                 */
                ListBackground: 4
            }
        }
    });

    Bridge.define("FaceUI.Entities.ParagraphData", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new FaceUI.Entities.ParagraphData(); }
            }
        },
        fields: {
            list: null,
            relativeIndex: 0
        },
        ctors: {
            $ctor1: function (_list, _relativeIndex) {
                this.$initialize();
                this.list = _list;
                this.relativeIndex = _relativeIndex;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([5472852096, this.list, this.relativeIndex]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, FaceUI.Entities.ParagraphData)) {
                    return false;
                }
                return Bridge.equals(this.list, o.list) && Bridge.equals(this.relativeIndex, o.relativeIndex);
            },
            $clone: function (to) {
                var s = to || new FaceUI.Entities.ParagraphData();
                s.list = this.list;
                s.relativeIndex = this.relativeIndex;
                return s;
            }
        }
    });

    /**
     * Hold style changes instructions for rich paragraphs.
     *
     * @public
     * @class FaceUI.Entities.RichParagraphStyleInstruction
     */
    Bridge.define("FaceUI.Entities.RichParagraphStyleInstruction", {
        $kind: "struct",
        statics: {
            fields: {
                /**
                 * Dictionary with all available rich paragraph style instructions.
                 *
                 * @static
                 * @memberof FaceUI.Entities.RichParagraphStyleInstruction
                 * @type System.Collections.Generic.Dictionary$2
                 */
                _instructions: null,
                _styleInstructionsRegex: null,
                _styleInstructionsOpening: null,
                _styleInstructionsClosing: null
            },
            ctors: {
                init: function () {
                    this._instructions = new (System.Collections.Generic.Dictionary$2(System.String,FaceUI.Entities.RichParagraphStyleInstruction))();
                },
                ctor: function () {
                    // set style instructions denotes
                    FaceUI.Entities.RichParagraphStyleInstruction.SetStyleInstructionsDenotes("{{", "}}");

                    // reset all properties
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("DEFAULT", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(void 0, void 0, void 0, void 0, true));

                    // add color-changing instructions
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("RED", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Red, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("BLUE", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Blue, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("GREEN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Green, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("YELLOW", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Yellow, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("BROWN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Brown, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("BLACK", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Black, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("WHITE", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.White, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("CYAN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Cyan, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("PINK", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Pink, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("GRAY", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Gray, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("MAGENTA", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Magenta, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("ORANGE", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Orange, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("PURPLE", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Purple, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("SILVER", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Silver, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("GOLD", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Gold, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("TEAL", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Teal, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("NAVY", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.Navy, void 0, void 0, void 0, false));

                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_RED", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.PaleVioletRed, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_BLUE", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.AliceBlue, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_GREEN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.LawnGreen, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_YELLOW", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.LightYellow, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_BROWN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.RosyBrown, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_CYAN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.LightCyan, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_PINK", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.LightPink, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_GRAY", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.LightGray, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("L_GOLD", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.LightGoldenrodYellow, void 0, void 0, void 0, false));

                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_RED", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.DarkRed, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_BLUE", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.DarkBlue, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_GREEN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.ForestGreen, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_YELLOW", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.GreenYellow, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_BROWN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.SaddleBrown, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_CYAN", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.DarkCyan, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_PINK", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.DeepPink, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_GRAY", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.DarkGray, void 0, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("D_GOLD", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(Microsoft.Xna.Framework.Color.DarkGoldenrod, void 0, void 0, void 0, false));

                    // add font style change instructions
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("BOLD", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(void 0, FaceUI.Entities.FontStyle.Bold, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("REGULAR", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(void 0, FaceUI.Entities.FontStyle.Regular, void 0, void 0, false));
                    FaceUI.Entities.RichParagraphStyleInstruction.AddInstruction("ITALIC", new FaceUI.Entities.RichParagraphStyleInstruction.$ctor1(void 0, FaceUI.Entities.FontStyle.Italic, void 0, void 0, false));
                }
            },
            methods: {
                /**
                 * Add a style insturctions you could later use in rich paragraphs.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Entities.RichParagraphStyleInstruction
                 * @memberof FaceUI.Entities.RichParagraphStyleInstruction
                 * @param   {string}                                           key            Key to invoke this style change.
                 * @param   {FaceUI.Entities.RichParagraphStyleInstruction}    instruction    Style change data.
                 * @return  {void}
                 */
                AddInstruction: function (key, instruction) {
                    FaceUI.Entities.RichParagraphStyleInstruction._instructions.set(key, instruction.$clone());
                },
                /**
                 * Set the instructions denote to use, ie symbols that tells us the in-between text is a style-change instruction.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Entities.RichParagraphStyleInstruction
                 * @memberof FaceUI.Entities.RichParagraphStyleInstruction
                 * @param   {string}    opening    Opening denote string.
                 * @param   {string}    closing    Closing denote string.
                 * @return  {void}
                 */
                SetStyleInstructionsDenotes: function (opening, closing) {
                    FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsRegex = new System.Text.RegularExpressions.Regex.ctor((opening || "") + "[^{}]*" + (closing || ""));
                    FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsOpening = opening;
                    FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsClosing = closing;
                },
                getDefaultValue: function () { return new FaceUI.Entities.RichParagraphStyleInstruction(); }
            }
        },
        props: {
            /**
             * Will change text fill color.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraphStyleInstruction
             * @function FillColor
             * @type ?Microsoft.Xna.Framework.Color
             */
            FillColor: null,
            /**
             * Will change font style.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraphStyleInstruction
             * @function FontStyle
             * @type ?FaceUI.Entities.FontStyle
             */
            FontStyle: null,
            /**
             * Will change outline width.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraphStyleInstruction
             * @function OutlineWidth
             * @type ?number
             */
            OutlineWidth: null,
            /**
             * Will change text outline color.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraphStyleInstruction
             * @function OutlineColor
             * @type ?Microsoft.Xna.Framework.Color
             */
            OutlineColor: null,
            /**
             * If true, will reset all custom styles before applying this instruction.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraphStyleInstruction
             * @function ResetStyles
             * @type boolean
             */
            ResetStyles: false
        },
        ctors: {
            /**
             * Create a rich paragraph style instruction to change font style, color, or other properties.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RichParagraphStyleInstruction
             * @memberof FaceUI.Entities.RichParagraphStyleInstruction
             * @param   {?Microsoft.Xna.Framework.Color}    fillColor       Set fill color.
             * @param   {?FaceUI.Entities.FontStyle}        fontStyle       Set font style.
             * @param   {?number}                           outlineWidth    Set outline width.
             * @param   {?Microsoft.Xna.Framework.Color}    outlineColor    Set outline color.
             * @param   {boolean}                           resetStyles     If true will reset all style properties to defaults.
             * @return  {void}
             */
            $ctor1: function (fillColor, fontStyle, outlineWidth, outlineColor, resetStyles) {
                if (fillColor === void 0) { fillColor = null; }
                if (fontStyle === void 0) { fontStyle = null; }
                if (outlineWidth === void 0) { outlineWidth = null; }
                if (outlineColor === void 0) { outlineColor = null; }
                if (resetStyles === void 0) { resetStyles = false; }

                this.$initialize();
                this.ResetStyles = resetStyles;
                this.FillColor = System.Nullable.lift1("$clone", fillColor);
                this.FontStyle = fontStyle;
                this.OutlineWidth = outlineWidth;
                this.OutlineColor = System.Nullable.lift1("$clone", outlineColor);
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([12999253793, this.FillColor, this.FontStyle, this.OutlineWidth, this.OutlineColor, this.ResetStyles]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, FaceUI.Entities.RichParagraphStyleInstruction)) {
                    return false;
                }
                return Bridge.equals(this.FillColor, o.FillColor) && Bridge.equals(this.FontStyle, o.FontStyle) && Bridge.equals(this.OutlineWidth, o.OutlineWidth) && Bridge.equals(this.OutlineColor, o.OutlineColor) && Bridge.equals(this.ResetStyles, o.ResetStyles);
            },
            $clone: function (to) {
                var s = to || new FaceUI.Entities.RichParagraphStyleInstruction();
                s.FillColor = System.Nullable.lift1("$clone", this.FillColor);
                s.FontStyle = this.FontStyle;
                s.OutlineWidth = this.OutlineWidth;
                s.OutlineColor = System.Nullable.lift1("$clone", this.OutlineColor);
                s.ResetStyles = this.ResetStyles;
                return s;
            }
        }
    });

    /**
     * Different sliders skins (textures).
     *
     * @public
     * @class FaceUI.Entities.SliderSkin
     */
    Bridge.define("FaceUI.Entities.SliderSkin", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Default, thin slider skin.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.SliderSkin
                 * @constant
                 * @default 0
                 * @type FaceUI.Entities.SliderSkin
                 */
                Default: 0,
                /**
                 * More fancy, thicker slider skin.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.SliderSkin
                 * @constant
                 * @default 1
                 * @type FaceUI.Entities.SliderSkin
                 */
                Fancy: 1
            }
        }
    });

    /**
     * Static strings with all common style property names, to reduce string creations.
     *
     * @static
     * @abstract
     * @class FaceUI.Entities.StylePropertyIds
     */
    Bridge.define("FaceUI.Entities.StylePropertyIds", {
        statics: {
            fields: {
                SpaceAfter: null,
                SpaceBefore: null,
                FillColor: null,
                Scale: null,
                Padding: null,
                ShadowColor: null,
                ShadowScale: null,
                ShadowOffset: null,
                OutlineColor: null,
                OutlineWidth: null,
                DefaultSize: null
            },
            ctors: {
                init: function () {
                    this.SpaceAfter = "SpaceAfter";
                    this.SpaceBefore = "SpaceBefore";
                    this.FillColor = "FillColor";
                    this.Scale = "Scale";
                    this.Padding = "Padding";
                    this.ShadowColor = "ShadowColor";
                    this.ShadowScale = "ShadowScale";
                    this.ShadowOffset = "ShadowOffset";
                    this.OutlineColor = "OutlineColor";
                    this.OutlineWidth = "OutlineWidth";
                    this.DefaultSize = "DefaultSize";
                }
            }
        }
    });

    /**
     * Contains the button and panel of a single tab in the PanelTabs.
     *
     * @public
     * @class FaceUI.Entities.TabData
     */
    Bridge.define("FaceUI.Entities.TabData", {
        fields: {
            /**
             * The tab panel.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TabData
             * @type FaceUI.Entities.Panel
             */
            panel: null,
            /**
             * The tab top button.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TabData
             * @type FaceUI.Entities.Button
             */
            button: null,
            /**
             * Tab identifier / name.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.TabData
             * @type string
             */
            name: null
        },
        ctors: {
            /**
             * Create the new tab type.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TabData
             * @memberof FaceUI.Entities.TabData
             * @param   {string}                    tabName      Tab name / identifier.
             * @param   {FaceUI.Entities.Panel}     tabPanel     Tab panel.
             * @param   {FaceUI.Entities.Button}    tabButton    Tab button.
             * @return  {void}
             */
            ctor: function (tabName, tabPanel, tabButton) {
                this.$initialize();
                // store name, panel and button
                this.name = tabName;
                this.panel = tabPanel;
                this.button = tabButton;
            }
        }
    });

    /** @namespace FaceUI.Entities.TextValidators */

    /**
     * A class that validates text input to make sure its valid.
     These classes can be added to any TextInput to limit the type of input the user can enter.
     Note: this cannot be an interface due to serialization.
     *
     * @public
     * @class FaceUI.Entities.TextValidators.ITextValidator
     */
    Bridge.define("FaceUI.Entities.TextValidators.ITextValidator", {
        methods: {
            /**
             * Get the new text input value and return true if valid.
             This function can either return false to scrap input changes, or change the text and return true.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.ITextValidator
             * @memberof FaceUI.Entities.TextValidators.ITextValidator
             * @param   {System.String}    text       New text input value.
             * @param   {string}           oldText    Previous text input value.
             * @return  {boolean}                     If TextInput value is legal.
             */
            ValidateText: function (text, oldText) {
                return true;
            }
        }
    });

    /** @namespace FaceUI.Exceptions */

    /**
     * Thrown when the user tries to perform an action but the object / UI state does not allow it.
     *
     * @public
     * @class FaceUI.Exceptions.InvalidStateException
     * @augments System.Exception
     */
    Bridge.define("FaceUI.Exceptions.InvalidStateException", {
        inherits: [System.Exception],
        ctors: {
            /**
             * Create the exception without message.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.InvalidStateException
             * @memberof FaceUI.Exceptions.InvalidStateException
             * @return  {void}
             */
            ctor: function () {
                this.$initialize();
                System.Exception.ctor.call(this);
            },
            /**
             * Create the exception with message.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.InvalidStateException
             * @memberof FaceUI.Exceptions.InvalidStateException
             * @param   {string}    message
             * @return  {void}
             */
            $ctor1: function (message) {
                this.$initialize();
                System.Exception.ctor.call(this, message);
            },
            /**
             * Create the exception with message and inner exception.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.InvalidStateException
             * @memberof FaceUI.Exceptions.InvalidStateException
             * @param   {string}              message    
             * @param   {System.Exception}    inner
             * @return  {void}
             */
            $ctor2: function (message, inner) {
                this.$initialize();
                System.Exception.ctor.call(this, message, inner);
            }
        }
    });

    /**
     * Thrown when the user provides an invalid value.
     *
     * @public
     * @class FaceUI.Exceptions.InvalidValueException
     * @augments System.Exception
     */
    Bridge.define("FaceUI.Exceptions.InvalidValueException", {
        inherits: [System.Exception],
        ctors: {
            /**
             * Create the exception without message.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.InvalidValueException
             * @memberof FaceUI.Exceptions.InvalidValueException
             * @return  {void}
             */
            ctor: function () {
                this.$initialize();
                System.Exception.ctor.call(this);
            },
            /**
             * Create the exception with message.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.InvalidValueException
             * @memberof FaceUI.Exceptions.InvalidValueException
             * @param   {string}    message
             * @return  {void}
             */
            $ctor1: function (message) {
                this.$initialize();
                System.Exception.ctor.call(this, message);
            },
            /**
             * Create the exception with message and inner exception.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.InvalidValueException
             * @memberof FaceUI.Exceptions.InvalidValueException
             * @param   {string}              message    
             * @param   {System.Exception}    inner
             * @return  {void}
             */
            $ctor2: function (message, inner) {
                this.$initialize();
                System.Exception.ctor.call(this, message, inner);
            }
        }
    });

    /**
     * Thrown when something is not found (key, value, index, etc.)
     *
     * @public
     * @class FaceUI.Exceptions.NotFoundException
     * @augments System.Exception
     */
    Bridge.define("FaceUI.Exceptions.NotFoundException", {
        inherits: [System.Exception],
        ctors: {
            /**
             * Create the exception without message.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.NotFoundException
             * @memberof FaceUI.Exceptions.NotFoundException
             * @return  {void}
             */
            ctor: function () {
                this.$initialize();
                System.Exception.ctor.call(this);
            },
            /**
             * Create the exception with message.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.NotFoundException
             * @memberof FaceUI.Exceptions.NotFoundException
             * @param   {string}    message
             * @return  {void}
             */
            $ctor1: function (message) {
                this.$initialize();
                System.Exception.ctor.call(this, message);
            },
            /**
             * Create the exception with message and inner exception.
             *
             * @instance
             * @public
             * @this FaceUI.Exceptions.NotFoundException
             * @memberof FaceUI.Exceptions.NotFoundException
             * @param   {string}              message    
             * @param   {System.Exception}    inner
             * @return  {void}
             */
            $ctor2: function (message, inner) {
                this.$initialize();
                System.Exception.ctor.call(this, message, inner);
            }
        }
    });

    /**
     * Mouse buttons.
     *
     * @public
     * @class FaceUI.MouseButton
     */
    Bridge.define("FaceUI.MouseButton", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Left mouse button.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.MouseButton
                 * @constant
                 * @default 0
                 * @type FaceUI.MouseButton
                 */
                Left: 0,
                /**
                 * Right mouse button.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.MouseButton
                 * @constant
                 * @default 1
                 * @type FaceUI.MouseButton
                 */
                Right: 1,
                /**
                 * Middle mouse button (scrollwheel when clicked).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.MouseButton
                 * @constant
                 * @default 2
                 * @type FaceUI.MouseButton
                 */
                Middle: 2
            }
        }
    });

    /**
     * A static class to init and store all UI resources (textures, effects, fonts, etc.)
     *
     * @static
     * @abstract
     * @public
     * @class FaceUI.Resources
     */
    Bridge.define("FaceUI.Resources", {
        statics: {
            fields: {
                /**
                 * Lookup for char &gt; string conversion
                 *
                 * @static
                 * @private
                 * @memberof FaceUI.Resources
                 * @type System.Collections.Generic.Dictionary$2
                 */
                charStringDict: null,
                /**
                 * Just a plain white texture, used internally.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                WhiteTexture: null,
                /**
                 * Cursor textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                Cursors: null,
                /**
                 * Metadata about cursor textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Array.<FaceUI.DataTypes.CursorTextureData>
                 */
                CursorsData: null,
                /**
                 * All panel skin textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                PanelTextures: null,
                /**
                 * Metadata about panel textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Array.<FaceUI.DataTypes.TextureData>
                 */
                PanelData: null,
                /**
                 * Button textures (accessed as [skin, state]).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                ButtonTextures: null,
                /**
                 * Metadata about button textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Array.<FaceUI.DataTypes.TextureData>
                 */
                ButtonData: null,
                /**
                 * CheckBox textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                CheckBoxTextures: null,
                /**
                 * Radio button textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                RadioTextures: null,
                /**
                 * ProgressBar texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                ProgressBarTexture: null,
                /**
                 * Metadata about progressbar texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.DataTypes.TextureData
                 */
                ProgressBarData: null,
                /**
                 * ProgressBar fill texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                ProgressBarFillTexture: null,
                /**
                 * HorizontalLine texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                HorizontalLineTexture: null,
                /**
                 * Sliders base textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                SliderTextures: null,
                /**
                 * Sliders mark textures (the sliding piece that shows current value).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                SliderMarkTextures: null,
                /**
                 * Metadata about slider textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Array.<FaceUI.DataTypes.TextureData>
                 */
                SliderData: null,
                /**
                 * All icon textures.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.TexturesGetter$1
                 */
                IconTextures: null,
                /**
                 * Icons inventory background texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                IconBackgroundTexture: null,
                /**
                 * Vertical scrollbar base texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                VerticalScrollbarTexture: null,
                /**
                 * Vertical scrollbar mark texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                VerticalScrollbarMarkTexture: null,
                /**
                 * Metadata about scrollbar texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type FaceUI.DataTypes.TextureData
                 */
                VerticalScrollbarData: null,
                /**
                 * Arrow-down texture (used in dropdown).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                ArrowDown: null,
                /**
                 * Arrow-up texture (used in dropdown).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Texture2D
                 */
                ArrowUp: null,
                /**
                 * Default font types.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Array.<Microsoft.Xna.Framework.Graphics.SpriteFont>
                 */
                Fonts: null,
                /**
                 * Effect for disabled entities (greyscale).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Effect
                 */
                DisabledEffect: null,
                /**
                 * An effect to draw just a silhouette of the texture.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Graphics.Effect
                 */
                SilhouetteEffect: null,
                /**
                 * Store the content manager instance
                 *
                 * @static
                 * @memberof FaceUI.Resources
                 * @type Microsoft.Xna.Framework.Content.ContentManager
                 */
                _content: null,
                /**
                 * Root for FaceUI content
                 *
                 * @static
                 * @memberof FaceUI.Resources
                 * @type string
                 */
                _root: null
            },
            ctors: {
                init: function () {
                    this.charStringDict = new (System.Collections.Generic.Dictionary$2(System.Char,System.String))();
                    this.Cursors = new (FaceUI.TexturesGetter$1(FaceUI.CursorType))("textures/cursor_");
                    this.PanelTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.PanelSkin))("textures/panel_");
                    this.ButtonTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.ButtonSkin))("textures/button_");
                    this.CheckBoxTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.EntityState))("textures/checkbox");
                    this.RadioTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.EntityState))("textures/radio");
                    this.SliderTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.SliderSkin))("textures/slider_");
                    this.SliderMarkTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.SliderSkin))("textures/slider_", "_mark");
                    this.IconTextures = new (FaceUI.TexturesGetter$1(FaceUI.Entities.IconType))("textures/icons/");
                }
            },
            methods: {
                /**
                 * Load all FaceUI resources.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Resources
                 * @memberof FaceUI.Resources
                 * @param   {Microsoft.Xna.Framework.Content.ContentManager}    content    Content manager to use.
                 * @param   {string}                                            theme      Which theme to load resources from.
                 * @return  {void}
                 */
                LoadContent: function (content, theme) {
                    var $t, $t1, $t2, $t3, $t4;
                    if (theme === void 0) { theme = "default"; }
                    FaceUI.Resources.InitialiseCharStringDict();

                    // set resources root path and store content manager
                    FaceUI.Resources._root = "FaceUI/themes/" + (theme || "") + "/";
                    FaceUI.Resources._content = content;

                    // set Texture2D static fields
                    FaceUI.Resources.HorizontalLineTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/horizontal_line");
                    FaceUI.Resources.WhiteTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/white_texture");
                    FaceUI.Resources.IconBackgroundTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/icons/background");
                    FaceUI.Resources.VerticalScrollbarTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/scrollbar");
                    FaceUI.Resources.VerticalScrollbarMarkTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/scrollbar_mark");
                    FaceUI.Resources.ArrowDown = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/arrow_down");
                    FaceUI.Resources.ArrowUp = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/arrow_up");
                    FaceUI.Resources.ProgressBarTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/progressbar");
                    FaceUI.Resources.ProgressBarFillTexture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, (FaceUI.Resources._root || "") + "textures/progressbar_fill");

                    // load cursors metadata
                    FaceUI.Resources.CursorsData = System.Array.init(System.Enum.getValues(FaceUI.CursorType).length, null, FaceUI.DataTypes.CursorTextureData);
                    $t = Bridge.getEnumerator(System.Enum.getValues(FaceUI.CursorType));
                    try {
                        while ($t.moveNext()) {
                            var cursor = Bridge.cast($t.Current, FaceUI.CursorType);
                            var cursorName = System.Enum.getName(FaceUI.CursorType, Bridge.box(cursor, FaceUI.CursorType, System.Enum.toStringFn(FaceUI.CursorType))).toLowerCase();
                            FaceUI.Resources.CursorsData[System.Array.index(cursor, FaceUI.Resources.CursorsData)] = content.Load(FaceUI.DataTypes.CursorTextureData, (FaceUI.Resources._root || "") + "textures/cursor_" + (cursorName || "") + "_md");
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    // load panels
                    FaceUI.Resources.PanelData = System.Array.init(System.Enum.getValues(FaceUI.Entities.PanelSkin).length, null, FaceUI.DataTypes.TextureData);
                    $t1 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.PanelSkin));
                    try {
                        while ($t1.moveNext()) {
                            var skin = Bridge.cast($t1.Current, FaceUI.Entities.PanelSkin);
                            // skip none panel skin
                            if (skin === FaceUI.Entities.PanelSkin.None) {
                                continue;
                            }

                            // load panels metadata
                            var skinName = System.Enum.toString(FaceUI.Entities.PanelSkin, skin).toLowerCase();
                            FaceUI.Resources.PanelData[System.Array.index(skin, FaceUI.Resources.PanelData)] = content.Load(FaceUI.DataTypes.TextureData, (FaceUI.Resources._root || "") + "textures/panel_" + (skinName || "") + "_md");
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }

                    // load scrollbar metadata
                    FaceUI.Resources.VerticalScrollbarData = content.Load(FaceUI.DataTypes.TextureData, (FaceUI.Resources._root || "") + "textures/scrollbar_md");

                    // load slider metadata
                    FaceUI.Resources.SliderData = System.Array.init(System.Enum.getValues(FaceUI.Entities.SliderSkin).length, null, FaceUI.DataTypes.TextureData);
                    $t2 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.SliderSkin));
                    try {
                        while ($t2.moveNext()) {
                            var skin1 = Bridge.cast($t2.Current, FaceUI.Entities.SliderSkin);
                            var skinName1 = System.Enum.toString(FaceUI.Entities.SliderSkin, skin1).toLowerCase();
                            FaceUI.Resources.SliderData[System.Array.index(skin1, FaceUI.Resources.SliderData)] = content.Load(FaceUI.DataTypes.TextureData, (FaceUI.Resources._root || "") + "textures/slider_" + (skinName1 || "") + "_md");
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }

                    // load fonts
                    FaceUI.Resources.Fonts = System.Array.init(System.Enum.getValues(FaceUI.Entities.FontStyle).length, null, Microsoft.Xna.Framework.Graphics.SpriteFont);
                    $t3 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.FontStyle));
                    try {
                        while ($t3.moveNext()) {
                            var style = Bridge.cast($t3.Current, FaceUI.Entities.FontStyle);
                            FaceUI.Resources.Fonts[System.Array.index(style, FaceUI.Resources.Fonts)] = content.Load(Microsoft.Xna.Framework.Graphics.SpriteFont, (FaceUI.Resources._root || "") + "fonts/" + (System.Enum.toString(FaceUI.Entities.FontStyle, style) || ""));
                            FaceUI.Resources.Fonts[System.Array.index(style, FaceUI.Resources.Fonts)].LineSpacing = (FaceUI.Resources.Fonts[System.Array.index(style, FaceUI.Resources.Fonts)].LineSpacing + 2) | 0;
                        }
                    } finally {
                        if (Bridge.is($t3, System.IDisposable)) {
                            $t3.System$IDisposable$Dispose();
                        }
                    }

                    // load buttons metadata
                    FaceUI.Resources.ButtonData = System.Array.init(System.Enum.getValues(FaceUI.Entities.ButtonSkin).length, null, FaceUI.DataTypes.TextureData);
                    $t4 = Bridge.getEnumerator(System.Enum.getValues(FaceUI.Entities.ButtonSkin));
                    try {
                        while ($t4.moveNext()) {
                            var skin2 = Bridge.cast($t4.Current, FaceUI.Entities.ButtonSkin);
                            var skinName2 = System.Enum.toString(FaceUI.Entities.ButtonSkin, skin2).toLowerCase();
                            FaceUI.Resources.ButtonData[System.Array.index(skin2, FaceUI.Resources.ButtonData)] = content.Load(FaceUI.DataTypes.TextureData, (FaceUI.Resources._root || "") + "textures/button_" + (skinName2 || "") + "_md");
                        }
                    } finally {
                        if (Bridge.is($t4, System.IDisposable)) {
                            $t4.System$IDisposable$Dispose();
                        }
                    }

                    // load progress bar metadata
                    FaceUI.Resources.ProgressBarData = content.Load(FaceUI.DataTypes.TextureData, (FaceUI.Resources._root || "") + "textures/progressbar_md");

                    // load effects
                    FaceUI.Resources.DisabledEffect = content.Load(Microsoft.Xna.Framework.Graphics.Effect, (FaceUI.Resources._root || "") + "effects/disabled");
                    FaceUI.Resources.SilhouetteEffect = content.Load(Microsoft.Xna.Framework.Graphics.Effect, (FaceUI.Resources._root || "") + "effects/silhouette");

                    // load default styleSheets
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Entity, "DefaultStyle"), "Entity", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Paragraph, "DefaultStyle"), "Paragraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Button, "DefaultStyle"), "Button", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Button, "DefaultParagraphStyle"), "ButtonParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.CheckBox, "DefaultStyle"), "CheckBox", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.CheckBox, "DefaultParagraphStyle"), "CheckBoxParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.ColoredRectangle, "DefaultStyle"), "ColoredRectangle", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.DropDown, "DefaultStyle"), "DropDown", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.DropDown, "DefaultParagraphStyle"), "DropDownParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.DropDown, "DefaultSelectedParagraphStyle"), "DropDownSelectedParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Header, "DefaultStyle"), "Header", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.HorizontalLine, "DefaultStyle"), "HorizontalLine", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Icon, "DefaultStyle"), "Icon", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Image, "DefaultStyle"), "Image", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Label, "DefaultStyle"), "Label", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Panel, "DefaultStyle"), "Panel", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.ProgressBar, "DefaultStyle"), "ProgressBar", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.ProgressBar, "DefaultFillStyle"), "ProgressBarFill", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.RadioButton, "DefaultStyle"), "RadioButton", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.RadioButton, "DefaultParagraphStyle"), "RadioButtonParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.SelectList, "DefaultStyle"), "SelectList", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.SelectList, "DefaultParagraphStyle"), "SelectListParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.Slider, "DefaultStyle"), "Slider", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.TextInput, "DefaultStyle"), "TextInput", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.TextInput, "DefaultParagraphStyle"), "TextInputParagraph", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.TextInput, "DefaultPlaceholderStyle"), "TextInputPlaceholder", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.VerticalScrollbar, "DefaultStyle"), "VerticalScrollbar", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.PanelTabs, "DefaultButtonStyle"), "PanelTabsButton", FaceUI.Resources._root, content);
                    FaceUI.Resources.LoadDefaultStyles(Bridge.ref(FaceUI.Entities.PanelTabs, "DefaultButtonParagraphStyle"), "PanelTabsButtonParagraph", FaceUI.Resources._root, content);
                },
                /**
                 * Creates Dictionary containing char &gt; string lookup
                 *
                 * @static
                 * @private
                 * @this FaceUI.Resources
                 * @memberof FaceUI.Resources
                 * @return  {void}
                 */
                InitialiseCharStringDict: function () {
                    FaceUI.Resources.charStringDict.clear();

                    var asciiValues = System.Linq.Enumerable.range(1, 127).ToArray(System.Int32);

                    for (var i = 0; i < asciiValues.length; i = (i + 1) | 0) {
                        var c = (asciiValues[System.Array.index(i, asciiValues)]) & 65535;
                        FaceUI.Resources.charStringDict.add(c, String.fromCharCode(c));
                    }
                },
                /**
                 * Returns string from char &gt; string lookup
                 *
                 * @static
                 * @public
                 * @this FaceUI.Resources
                 * @memberof FaceUI.Resources
                 * @param   {number}    c
                 * @return  {string}
                 */
                GetStringForChar: function (c) {
                    if (!FaceUI.Resources.charStringDict.containsKey(c)) {
                        return String.fromCharCode(c);
                    }
                    return FaceUI.Resources.charStringDict.get(c);
                },
                /**
                 * Load default stylesheets for a given entity name and put values inside the sheet.
                 *
                 * @static
                 * @private
                 * @this FaceUI.Resources
                 * @memberof FaceUI.Resources
                 * @param   {FaceUI.Entities.StyleSheet}                        sheet         StyleSheet to load.
                 * @param   {string}                                            entityName    Entity unique identifier for file names.
                 * @param   {string}                                            themeRoot     Path of the current theme root directory.
                 * @param   {Microsoft.Xna.Framework.Content.ContentManager}    content       Content manager to allow us to load xmls.
                 * @return  {void}
                 */
                LoadDefaultStyles: function (sheet, entityName, themeRoot, content) {
                    var $t, $t1;
                    // get stylesheet root path (eg everything before the state part)
                    var stylesheetBase = (themeRoot || "") + "styles/" + (entityName || "");
                    var styles = content.Load(FaceUI.DataTypes.DefaultStylesList, stylesheetBase);
                    $t = Bridge.getEnumerator(styles.Styles);
                    try {
                        while ($t.moveNext()) {
                            var style = $t.Current;
                            FaceUI.Resources.FillDefaultStyles(sheet, ($t1 = style.State, $t1 != null ? $t1 : FaceUI.Entities.EntityState.Default), style);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                },
                /**
                 * Fill a set of default styles into a given stylesheet.
                 *
                 * @static
                 * @private
                 * @this FaceUI.Resources
                 * @memberof FaceUI.Resources
                 * @param   {FaceUI.Entities.StyleSheet}        sheet     StyleSheet to fill.
                 * @param   {FaceUI.Entities.EntityState}       state     State to fill values for.
                 * @param   {FaceUI.DataTypes.DefaultStyles}    styles    Default styles, as loaded from xml file.
                 * @return  {void}
                 */
                FillDefaultStyles: function (sheet, state, styles) {
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", styles.FillColor), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "FillColor", new FaceUI.DataTypes.StyleProperty.$ctor1(System.Nullable.getValue(styles.FillColor)));
                    }
                    if (styles.FontStyle != null) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "FontStyle", new FaceUI.DataTypes.StyleProperty.$ctor4(System.Nullable.getValue(styles.FontStyle)));
                    }
                    if (styles.ForceAlignCenter != null) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "ForceAlignCenter", new FaceUI.DataTypes.StyleProperty.$ctor3(System.Nullable.getValue(styles.ForceAlignCenter)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", styles.OutlineColor), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "OutlineColor", new FaceUI.DataTypes.StyleProperty.$ctor1(System.Nullable.getValue(styles.OutlineColor)));
                    }
                    if (styles.OutlineWidth != null) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "OutlineWidth", new FaceUI.DataTypes.StyleProperty.$ctor4(System.Nullable.getValue(styles.OutlineWidth)));
                    }
                    if (styles.Scale != null) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "Scale", new FaceUI.DataTypes.StyleProperty.$ctor5(System.Nullable.getValue(styles.Scale)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", styles.SelectedHighlightColor), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "SelectedHighlightColor", new FaceUI.DataTypes.StyleProperty.$ctor1(System.Nullable.getValue(styles.SelectedHighlightColor)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", styles.ShadowColor), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "ShadowColor", new FaceUI.DataTypes.StyleProperty.$ctor1(System.Nullable.getValue(styles.ShadowColor)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", styles.ShadowOffset), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "ShadowOffset", new FaceUI.DataTypes.StyleProperty.$ctor2(System.Nullable.getValue(styles.ShadowOffset)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", styles.Padding), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "Padding", new FaceUI.DataTypes.StyleProperty.$ctor2(System.Nullable.getValue(styles.Padding)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", styles.SpaceBefore), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "SpaceBefore", new FaceUI.DataTypes.StyleProperty.$ctor2(System.Nullable.getValue(styles.SpaceBefore)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", styles.SpaceAfter), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "SpaceAfter", new FaceUI.DataTypes.StyleProperty.$ctor2(System.Nullable.getValue(styles.SpaceAfter)));
                    }
                    if (styles.ShadowScale != null) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "ShadowScale", new FaceUI.DataTypes.StyleProperty.$ctor5(System.Nullable.getValue(styles.ShadowScale)));
                    }
                    if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", styles.DefaultSize), null)) {
                        sheet.v.set((System.Enum.toString(FaceUI.Entities.EntityState, state) || "") + "." + "DefaultSize", new FaceUI.DataTypes.StyleProperty.$ctor2(System.Nullable.getValue(styles.DefaultSize)));
                    }
                }
            }
        }
    });

    /**
     * Some special characters input.
     Note: enum values are based on ascii table values for these special characters.
     *
     * @class FaceUI.SpecialChars
     */
    Bridge.define("FaceUI.SpecialChars", {
        $kind: "enum",
        statics: {
            fields: {
                Null: 0,
                Delete: 127,
                Backspace: 8,
                Space: 32,
                ArrowLeft: 1,
                ArrowRight: 2,
                ArrowUp: 3,
                ArrowDown: 4
            }
        }
    });

    /**
     * A class to get texture with index and constant path part.
     Used internally.
     *
     * @public
     * @class FaceUI.TexturesGetter$1
     */
    Bridge.define("FaceUI.TexturesGetter$1", function (TEnum) { return {
        fields: {
            _loadedTextures: null,
            _basepath: null,
            _suffix: null,
            _usesStates: false,
            _typesCount: 0
        },
        ctors: {
            /**
             * Create the texture getter with base path.
             *
             * @instance
             * @public
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {string}     path          Resource path, under FaceUI content.
             * @param   {string}     suffix        Suffix to add to the texture path after the enum part.
             * @param   {boolean}    usesStates    If true, it means these textures may also use entit states, eg mouse hover / down / default.
             * @return  {void}
             */
            ctor: function (path, suffix, usesStates) {
                if (suffix === void 0) { suffix = null; }
                if (usesStates === void 0) { usesStates = true; }
                var $t;

                this.$initialize();
                this._basepath = path;
                this._suffix = ($t = suffix, $t != null ? $t : "");
                this._usesStates = usesStates;
                this._typesCount = System.Enum.getValues(TEnum).length;
                this._loadedTextures = System.Array.init(usesStates ? Bridge.Int.mul(this._typesCount, 3) : this._typesCount, null, Microsoft.Xna.Framework.Graphics.Texture2D);
            }
        },
        methods: {
            /**
             * Get texture for enum state.
             This is for textures that don't have different states, like mouse hover, down, or default.
             *
             * @instance
             * @public
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {TEnum}                                         i    Texture enum identifier.
             * @return  {Microsoft.Xna.Framework.Graphics.Texture2D}         Loaded texture.
             */
            getItem: function (i) {
                var indx = this.GetIndex(i);
                if (this._loadedTextures[System.Array.index(indx, this._loadedTextures)] == null) {
                    var path = (FaceUI.Resources._root || "") + (this._basepath || "") + (this.EnumToString(i) || "") + (this._suffix || "");
                    this._loadedTextures[System.Array.index(indx, this._loadedTextures)] = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, path);
                }
                return this._loadedTextures[System.Array.index(indx, this._loadedTextures)];
            },
            /**
             * Get texture for enum state.
             This is for textures that don't have different states, like mouse hover, down, or default.
             *
             * @instance
             * @public
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {TEnum}                                         i        Texture enum identifier.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    value
             * @return  {void}                                                   Loaded texture.
             */
            setItem: function (i, value) {
                var indx = this.GetIndex(i);
                this._loadedTextures[System.Array.index(indx, this._loadedTextures)] = value;
            },
            /**
             * Get texture for enum state and entity state.
             This is for textures that don't have different states, like mouse hover, down, or default.
             *
             * @instance
             * @public
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {TEnum}                                         i    Texture enum identifier.
             * @param   {FaceUI.Entities.EntityState}                   s    Entity state to get texture for.
             * @return  {Microsoft.Xna.Framework.Graphics.Texture2D}         Loaded texture.
             */
            getItem$1: function (i, s) {
                var indx = this.GetIndex(i, s);
                if (this._loadedTextures[System.Array.index(indx, this._loadedTextures)] == null) {
                    var path = (FaceUI.Resources._root || "") + (this._basepath || "") + (this.EnumToString(i) || "") + (this._suffix || "") + (this.StateEnumToString(s) || "");
                    this._loadedTextures[System.Array.index(indx, this._loadedTextures)] = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, path);
                }
                return this._loadedTextures[System.Array.index(indx, this._loadedTextures)];
            },
            /**
             * Get texture for enum state and entity state.
             This is for textures that don't have different states, like mouse hover, down, or default.
             *
             * @instance
             * @public
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {TEnum}                                         i        Texture enum identifier.
             * @param   {FaceUI.Entities.EntityState}                   s        Entity state to get texture for.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    value
             * @return  {void}                                                   Loaded texture.
             */
            setItem$1: function (i, s, value) {
                var indx = this.GetIndex(i, s);
                this._loadedTextures[System.Array.index(indx, this._loadedTextures)] = value;
            },
            /**
             * Get index from enum type with optional state.
             *
             * @instance
             * @private
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {TEnum}                           i    
             * @param   {?FaceUI.Entities.EntityState}    s
             * @return  {number}
             */
            GetIndex: function (i, s) {
                if (s === void 0) { s = null; }
                if (s != null) {
                    return ((System.Nullable.getValue(Bridge.cast(Bridge.unbox(i, System.Int32), System.Int32)) + (Bridge.Int.mul(this._typesCount, System.Nullable.getValue(s)))) | 0);
                }
                return System.Nullable.getValue(Bridge.cast(Bridge.unbox(i, System.Int32), System.Int32));
            },
            /**
             * Convert enum to its string for filename.
             *
             * @instance
             * @private
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {TEnum}     e
             * @return  {string}
             */
            EnumToString: function (e) {
                // entity state enum
                if (Bridge.referenceEquals(TEnum, FaceUI.Entities.EntityState)) {
                    return this.StateEnumToString(System.Nullable.getValue(Bridge.cast(Bridge.unbox(e, FaceUI.Entities.EntityState), System.Int32)));
                }

                // icon type enum
                if (Bridge.referenceEquals(TEnum, FaceUI.Entities.IconType)) {
                    return System.Enum.getName(TEnum, e);
                }

                // all other type of enums
                return System.Enum.getName(TEnum, e).toLowerCase();
            },
            /**
             * Convert entity state enum to string.
             *
             * @instance
             * @private
             * @this FaceUI.TexturesGetter$1
             * @memberof FaceUI.TexturesGetter$1
             * @param   {FaceUI.Entities.EntityState}    e
             * @return  {string}
             */
            StateEnumToString: function (e) {
                switch (e) {
                    case FaceUI.Entities.EntityState.MouseDown: 
                        return "_down";
                    case FaceUI.Entities.EntityState.MouseHover: 
                        return "_hover";
                    case FaceUI.Entities.EntityState.Default: 
                        return "";
                }
                return null;
            }
        }
    }; });

    /**
     * @memberof FaceUI
     * @callback FaceUI.GenerateTooltipFunc
     * @param   {FaceUI.Entities.Entity}    entity
     * @return  {FaceUI.Entities.Entity}
     */

    /**
     * @memberof FaceUI
     * @callback FaceUI.DefaultParagraphGenerator
     * @param   {string}                              text      
     * @param   {FaceUI.Entities.Anchor}              anchor    
     * @param   {?Microsoft.Xna.Framework.Color}      color     
     * @param   {?number}                             scale     
     * @param   {?Microsoft.Xna.Framework.Vector2}    size      
     * @param   {?Microsoft.Xna.Framework.Vector2}    offset
     * @return  {FaceUI.Entities.Paragraph}
     */

    /**
     * Main FaceUI class that manage and draw all the UI entities.
     This is the main manager you use to update, draw, and add entities to.
     *
     * @public
     * @class FaceUI.UserInterface
     * @implements  System.IDisposable
     */
    Bridge.define("FaceUI.UserInterface", {
        inherits: [System.IDisposable],
        statics: {
            fields: {
                /**
                 * Current FaceUI version identifier.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.UserInterface
                 * @constant
                 * @default "3.4.0.1"
                 * @type string
                 */
                VERSION: null,
                /**
                 * The currently active user interface instance.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.UserInterface
                 * @type FaceUI.UserInterface
                 */
                Active: null,
                _content: null,
                /**
                 * Create a default paragraph instance.
                 FaceUI entities use this method when need to create a paragraph, so you can override this to change which paragraph type the built-in
                 entities will use by-default (for example Buttons text, SelectList items, etc.).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.UserInterface
                 * @type FaceUI.DefaultParagraphGenerator
                 */
                DefaultParagraph: null,
                /**
                 * How long to wait before showing tooltip texts.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.UserInterface
                 * @default 2.0
                 * @type number
                 */
                TimeToShowTooltipText: 0
            },
            ctors: {
                init: function () {
                    this.VERSION = "3.4.0.1";
                    this.DefaultParagraph = $asm.$.FaceUI.UserInterface.f1;
                    this.TimeToShowTooltipText = 2.0;
                }
            },
            methods: {
                /**
                 * Initialize UI manager (mostly load resources and set some defaults).
                 *
                 * @static
                 * @public
                 * @this FaceUI.UserInterface
                 * @memberof FaceUI.UserInterface
                 * @param   {Microsoft.Xna.Framework.Content.ContentManager}    contentManager    Content manager.
                 * @param   {string}                                            theme             Which UI theme to use (see options in Content/FaceUI/themes/). This affect the appearance of all textures and effects.
                 * @return  {void}
                 */
                Initialize$1: function (contentManager, theme) {
                    if (theme === void 0) { theme = "hd"; }
                    // store the content manager
                    FaceUI.UserInterface._content = contentManager;

                    // init resources (textures etc)
                    FaceUI.Resources.LoadContent(FaceUI.UserInterface._content, theme);

                    // create a default active user interface
                    FaceUI.UserInterface.Active = new FaceUI.UserInterface();
                },
                /**
                 * Initialize UI manager (mostly load resources and set some defaults).
                 *
                 * @static
                 * @public
                 * @this FaceUI.UserInterface
                 * @memberof FaceUI.UserInterface
                 * @param   {Microsoft.Xna.Framework.Content.ContentManager}    contentManager    Content manager.
                 * @param   {FaceUI.BuiltinThemes}                              theme             Which UI theme to use. This affect the appearance of all textures and effects.
                 * @return  {void}
                 */
                Initialize: function (contentManager, theme) {
                    FaceUI.UserInterface.Initialize$1(contentManager, System.Enum.toString(FaceUI.BuiltinThemes, theme));
                },
                /**
                 * Default function we use to generate tooltip text entities.
                 *
                 * @static
                 * @private
                 * @this FaceUI.UserInterface
                 * @memberof FaceUI.UserInterface
                 * @param   {FaceUI.Entities.Entity}    source    Source entity.
                 * @return  {FaceUI.Entities.Entity}              Entity to use for tooltip text.
                 */
                DefaultGenerateTooltipFunc: function (source) {
                    // no tooltip text? return null
                    if (source.ToolTipText == null) {
                        return null;
                    }

                    // create tooltip paragraph
                    var tooltip = new FaceUI.Entities.Paragraph.$ctor2(source.ToolTipText, 9, new Microsoft.Xna.Framework.Vector2.$ctor2(500, -1), void 0, void 0);
                    tooltip.BackgroundColor = Microsoft.Xna.Framework.Color.Black.$clone();

                    // add callback to update tooltip position
                    tooltip.BeforeDraw = Bridge.fn.combine(tooltip.BeforeDraw, function (ent) {
                        // get dest rect and calculate tooltip position based on size and mouse position
                        var destRect = tooltip.GetActualDestRect();
                        var position = FaceUI.UserInterface.Active.GetTransformedCursorPos(new Microsoft.Xna.Framework.Vector2.$ctor2(((Bridge.Int.div(((-destRect.Width) | 0), 2)) | 0), ((((-destRect.Height) | 0) - 20) | 0)));

                        // make sure tooltip is not out of screen boundaries
                        var screenBounds = FaceUI.UserInterface.Active.Root.GetActualDestRect();
                        if (position.Y < screenBounds.Top) {
                            position.Y = screenBounds.Top;
                        }
                        if (position.Y > ((screenBounds.Bottom - destRect.Height) | 0)) {
                            position.Y = (screenBounds.Bottom - destRect.Height) | 0;
                        }
                        if (position.X < screenBounds.Left) {
                            position.X = screenBounds.Left;
                        }
                        if (position.X > ((screenBounds.Right - destRect.Width) | 0)) {
                            position.X = (screenBounds.Right - destRect.Width) | 0;
                        }

                        // update tooltip position
                        tooltip.SetAnchorAndOffset(FaceUI.Entities.Anchor.TopLeft, Microsoft.Xna.Framework.Vector2.op_Division$1(position.$clone(), FaceUI.UserInterface.Active.GlobalScale));
                    });
                    tooltip.CalcTextActualRectWithWrap();
                    tooltip.BeforeDraw(tooltip);

                    // return tooltip object
                    return tooltip;
                }
            }
        },
        fields: {
            /**
             * The object that provide mouse input for GeonBit UI.
             By default it uses internal implementation that uses MonoGame mouse input.
             If you want to use things like Touch input, you can override and replace this instance
             with your own object that emulates mouse input from different sources.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.IMouseInput
             */
            MouseInputProvider: null,
            /**
             * The object that provide keyboard and typing input for GeonBit UI.
             By default it uses internal implementation that uses MonoGame keyboard input.
             If you want to use alternative typing methods, you can override and replace this instance
             with your own object that emulates keyboard input.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.IKeyboardInput
             */
            KeyboardInputProvider: null,
            _renderTarget: null,
            _useRenderTarget: false,
            _isDeserializing: false,
            /**
             * If true, FaceUI will not raise exceptions on sanity checks, validations, and errors which are not critical.
             For example, trying to select a value that doesn't exist from a list would do nothing instead of throwing exception.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default false
             * @type boolean
             */
            SilentSoftErrors: false,
            /**
             * If true, will add debug rendering to UI.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default false
             * @type boolean
             */
            DebugDraw: false,
            /**
             * Blend state to use when rendering UI.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type Microsoft.Xna.Framework.Graphics.BlendState
             */
            BlendState: null,
            /**
             * Sampler state to use when rendering UI.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type Microsoft.Xna.Framework.Graphics.SamplerState
             */
            SamplerState: null,
            _dragTarget: null,
            _scale: 0,
            /**
             * Cursor rendering size.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default 1.0
             * @type number
             */
            CursorScale: 0,
            /**
             * Screen width.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default 0
             * @type number
             */
            ScreenWidth: 0,
            /**
             * Screen height.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default 0
             * @type number
             */
            ScreenHeight: 0,
            /**
             * Draw utils helper. Contain general drawing functionality and handle effects replacement.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.DrawUtils
             */
            DrawUtils: null,
            /**
             * Current active entity, eg last entity user interacted with.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.Entities.Entity
             */
            ActiveEntity: null,
            /**
             * Callback to execute when mouse button is pressed over an entity (called once when button is pressed).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnMouseDown: null,
            /**
             * Callback to execute when right mouse button is pressed over an entity (called once when button is pressed).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnRightMouseDown: null,
            /**
             * Callback to execute when mouse button is released over an entity (called once when button is released).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnMouseReleased: null,
            /**
             * Callback to execute every frame while mouse button is pressed over an entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            WhileMouseDown: null,
            /**
             * Callback to execute every frame while right mouse button is pressed over an entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            WhileRightMouseDown: null,
            /**
             * Callback to execute every frame while mouse is hovering over an entity, unless mouse button is down.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            WhileMouseHover: null,
            /**
             * Callback to execute every frame while mouse is hovering over an entity, even if mouse button is down.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            WhileMouseHoverOrDown: null,
            /**
             * Callback to execute when user clicks on an entity (eg release mouse over it).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnClick: null,
            /**
             * Callback to execute when user clicks on an entity with right mouse button (eg release mouse over it).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnRightClick: null,
            /**
             * Callback to execute when any entity value changes (relevant only for entities with value).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnValueChange: null,
            /**
             * Callback to execute when mouse start hovering over an entity (eg enters its region).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnMouseEnter: null,
            /**
             * Callback to execute when mouse stop hovering over an entity (eg leaves its region).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnMouseLeave: null,
            /**
             * Callback to execute when mouse wheel scrolls and an entity is the active entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnMouseWheelScroll: null,
            /**
             * Called when entity starts getting dragged (only if draggable).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnStartDrag: null,
            /**
             * Called when entity stop getting dragged (only if draggable).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnStopDrag: null,
            /**
             * Called every frame while entity is being dragged.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            WhileDragging: null,
            /**
             * Callback to execute every frame before entity update.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            BeforeUpdate: null,
            /**
             * Callback to execute every frame after entity update.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            AfterUpdate: null,
            /**
             * Callback to execute every frame before entity is rendered.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            BeforeDraw: null,
            /**
             * Callback to execute every frame after entity is rendered.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            AfterDraw: null,
            /**
             * Callback to execute every time the visibility property of an entity change.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnVisiblityChange: null,
            /**
             * Callback to execute every time a new entity is spawned (note: spawn = first time Update() is called on this entity).
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnEntitySpawn: null,
            /**
             * Callback to execute every time an entity focus changes.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.EventCallback
             */
            OnFocusChange: null,
            _cursorTexture: null,
            _cursorWidth: 0,
            _cursorOffset: null,
            _timeUntilTooltip: 0,
            _tooltipEntity: null,
            _tooltipTargetEntity: null,
            _defaultSpriteBatchWrapper: null,
            _defaultGraphicDeviceWrapper: null,
            /**
             * Whether or not to draw the cursor.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default true
             * @type boolean
             */
            ShowCursor: false,
            /**
             * Optional transformation matrix to apply when drawing with render targets.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type ?Microsoft.Xna.Framework.Matrix
             */
            RenderTargetTransformMatrix: null,
            /**
             * If using render targets, should the curser be rendered inside of it?
             If false, cursor will draw outside the render target, when presenting it.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @default true
             * @type boolean
             */
            IncludeCursorInRenderTarget: false,
            /**
             * The function used to generate tooltip text on entities.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @type FaceUI.GenerateTooltipFunc
             */
            GenerateTooltipFunc: null
        },
        props: {
            /**
             * Get current game time value.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @function CurrGameTime
             * @type Microsoft.Xna.Framework.GameTime
             */
            CurrGameTime: null,
            /**
             * If true, will draw the UI on a render target before drawing on screen.
             This mode is required for some of the features.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @function UseRenderTarget
             * @type boolean
             */
            UseRenderTarget: {
                get: function () {
                    return this._useRenderTarget;
                },
                set: function (value) {
                    this._useRenderTarget = value;
                    this.DisposeRenderTarget();
                }
            },
            /**
             * Get the main render target all the UI draws on.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.UserInterface
             * @function RenderTarget
             * @type Microsoft.Xna.Framework.Graphics.RenderTarget2D
             */
            RenderTarget: {
                get: function () {
                    return this._renderTarget;
                }
            },
            /**
             * Get the root entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @function Root
             * @type FaceUI.Entities.RootPanel
             */
            Root: null,
            /**
             * Scale the entire UI and all the entities in it. This is useful for smaller device screens.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @function GlobalScale
             * @type number
             */
            GlobalScale: {
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;
                    this.Root.MarkAsDirty();
                }
            },
            /**
             * The current target entity, eg what cursor points on. Can be null if cursor don't point on any entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.UserInterface
             * @function TargetEntity
             * @type FaceUI.Entities.Entity
             */
            TargetEntity: null
        },
        alias: ["Dispose", "System$IDisposable$Dispose"],
        ctors: {
            init: function () {
                this._cursorOffset = new Microsoft.Xna.Framework.Point();
                this._useRenderTarget = false;
                this._isDeserializing = false;
                this.SilentSoftErrors = false;
                this.DebugDraw = false;
                this.BlendState = Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend;
                this.SamplerState = Microsoft.Xna.Framework.Graphics.SamplerState.PointClamp;
                this._scale = 1.0;
                this.CursorScale = 1.0;
                this.ScreenWidth = 0;
                this.ScreenHeight = 0;
                this._cursorWidth = 32;
                this._cursorOffset = Microsoft.Xna.Framework.Point.Zero.$clone();
                this._timeUntilTooltip = 0.0;
                this._defaultSpriteBatchWrapper = new FaceUI.Utils.DefaultSpriteBatchWrapper();
                this._defaultGraphicDeviceWrapper = new FaceUI.Utils.DefaultGraphicDeviceWrapper();
                this.ShowCursor = true;
                this.IncludeCursorInRenderTarget = true;
                this.GenerateTooltipFunc = FaceUI.UserInterface.DefaultGenerateTooltipFunc;
            },
            /**
             * Create the user interface instance.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @return  {void}
             */
            ctor: function () {
                this.$initialize();
                // sanity test
                if (FaceUI.UserInterface._content == null) {
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Cannot create a UserInterface before calling UserInterface.Initialize()!");
                }

                // create default input providers
                this.MouseInputProvider = new FaceUI.DefaultInputProvider();
                this.KeyboardInputProvider = new FaceUI.DefaultInputProvider();

                // create draw utils
                this.DrawUtils = new FaceUI.DrawUtils();

                // create the root panel
                this.Root = new FaceUI.Entities.RootPanel();

                // set default cursor
                this.SetCursor(FaceUI.CursorType.Default);
            }
        },
        methods: {
            /**
             * Dispose unmanaged resources of this user interface.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @return  {void}
             */
            Dispose: function () {
                this.DisposeRenderTarget();
            },
            /**
             * Set cursor style.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {FaceUI.CursorType}    type    What type of cursor to show.
             * @return  {void}
             */
            SetCursor: function (type) {
                var data = FaceUI.Resources.CursorsData[System.Array.index(type, FaceUI.Resources.CursorsData)];
                this.SetCursor$1(FaceUI.Resources.Cursors.getItem(type), data.DrawWidth, new Microsoft.Xna.Framework.Point.$ctor2(data.OffsetX, data.OffsetY));
            },
            /**
             * Set cursor graphics from a custom texture.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    texture      Texture to use for cursor.
             * @param   {number}                                        drawWidth    Width, in pixels to draw the cursor. Height will be calculated automatically to fit texture propotions.
             * @param   {?Microsoft.Xna.Framework.Point}                offset       Cursor offset from mouse position (if not provided will draw cursor with top-left corner on mouse position).
             * @return  {void}
             */
            SetCursor$1: function (texture, drawWidth, offset) {
                var $t;
                if (drawWidth === void 0) { drawWidth = 32; }
                if (offset === void 0) { offset = null; }
                this._cursorTexture = texture;
                this._cursorWidth = drawWidth;
                this._cursorOffset = ($t = offset, $t != null ? $t : Microsoft.Xna.Framework.Point.Zero);
            },
            /**
             * Draw the cursor.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {Microsoft.Xna.Framework.Graphics.SpriteBatch}    spriteBatch    SpriteBatch to draw the cursor.
             * @return  {void}
             */
            DrawCursor$1: function (spriteBatch) {
                this._defaultSpriteBatchWrapper.Spritebatch = spriteBatch;
                this.DrawCursor(this._defaultSpriteBatchWrapper);
            },
            /**
             * Draw the cursor.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw the cursor.
             * @return  {void}
             */
            DrawCursor: function (spriteBatch) {
                // start drawing for cursor
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Deferred, this.BlendState, this.SamplerState, Microsoft.Xna.Framework.Graphics.DepthStencilState.None, Microsoft.Xna.Framework.Graphics.RasterizerState.CullCounterClockwise, void 0, void 0);

                // calculate cursor size
                var cursorSize = this.CursorScale * this.GlobalScale * (this._cursorWidth / this._cursorTexture.Width);

                // get cursor position and draw it
                var cursorPos = this.MouseInputProvider.FaceUI$IMouseInput$MousePosition.$clone();
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(this._cursorTexture, new Microsoft.Xna.Framework.Rectangle.$ctor2(Bridge.Int.clip32(cursorPos.X + this._cursorOffset.X * cursorSize), Bridge.Int.clip32(cursorPos.Y + this._cursorOffset.Y * cursorSize), Bridge.Int.clip32(this._cursorTexture.Width * cursorSize), Bridge.Int.clip32(this._cursorTexture.Height * cursorSize)), Microsoft.Xna.Framework.Color.White.$clone());

                // end drawing
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$End();
            },
            /**
             * Add an entity to screen.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {FaceUI.Entities.Entity}    entity    Entity to add.
             * @return  {FaceUI.Entities.Entity}
             */
            AddEntity: function (entity) {
                return this.Root.AddChild(entity);
            },
            /**
             * Remove an entity from screen.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {FaceUI.Entities.Entity}    entity    Entity to remove.
             * @return  {void}
             */
            RemoveEntity: function (entity) {
                this.Root.RemoveChild(entity);
            },
            /**
             * Remove all entities from screen.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @return  {void}
             */
            Clear: function () {
                this.Root.ClearChildren();
            },
            /**
             * Update the UI manager. This function should be called from your Game 'Update()' function, as early as possible (eg before you update your game state).
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {Microsoft.Xna.Framework.GameTime}    gameTime    Current game time.
             * @return  {void}
             */
            Update: function (gameTime) {
                // store current time
                this.CurrGameTime = gameTime;

                // update input managers
                this.MouseInputProvider.FaceUI$IMouseInput$Update(gameTime);
                if (!Bridge.referenceEquals(this.MouseInputProvider, this.KeyboardInputProvider)) {
                    this.KeyboardInputProvider.FaceUI$IKeyboardInput$Update(gameTime);
                }

                // unset the drag target if the mouse was released
                if (this._dragTarget != null && !this.MouseInputProvider.FaceUI$IMouseInput$MouseButtonDown(FaceUI.MouseButton.Left)) {
                    this._dragTarget = null;
                }

                // update root panel
                var target = { v : null };
                var wasEventHandled = { v : false };
                this.Root.Update(target, Bridge.ref(this, "_dragTarget"), wasEventHandled, Microsoft.Xna.Framework.Point.Zero.$clone());

                // set active entity
                if (this.MouseInputProvider.FaceUI$IMouseInput$MouseButtonDown(FaceUI.MouseButton.Left)) {
                    this.ActiveEntity = target.v;
                }

                // update tooltip
                this.UpdateTooltipText(gameTime, target.v);

                // default active entity is root panel
                this.ActiveEntity = this.ActiveEntity || this.Root;

                // set current target entity
                this.TargetEntity = target.v;
            },
            /**
             * Update tooltip text related stuff.
             *
             * @instance
             * @private
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {Microsoft.Xna.Framework.GameTime}    gameTime    Current game time.
             * @param   {FaceUI.Entities.Entity}              target      Current target entity.
             * @return  {void}
             */
            UpdateTooltipText: function (gameTime, target) {
                // fix tooltip target to be an actual entity
                while (target != null && target._hiddenInternalEntity) {
                    target = target.Parent;
                }

                // if target entity changed, zero time to show tooltip text
                if (!Bridge.referenceEquals(this._tooltipTargetEntity, target) || target == null) {
                    // zero time until showing tooltip text
                    this._timeUntilTooltip = 0.0;

                    // if we currently have a tooltip we show, remove it
                    if (this._tooltipEntity != null && this._tooltipEntity.Parent != null) {
                        this._tooltipEntity.RemoveFromParent();
                        this._tooltipEntity = null;
                    }
                }

                // set current tooltip target
                this._tooltipTargetEntity = target;

                // if we currently not showing any tooltip entity
                if (this._tooltipEntity == null) {
                    // decrease time until showing tooltip
                    this._timeUntilTooltip += gameTime.ElapsedGameTime.getTotalSeconds();

                    // if its time to show tooltip text, create it.
                    // note: we create even if the target have no tooltip text, to allow our custom function to create default tooltip or generate based on entity type.
                    // if the entity should not show tooltip text, the function to generate it should just return null.
                    if (this._timeUntilTooltip > FaceUI.UserInterface.TimeToShowTooltipText) {
                        // create tooltip text entity
                        this._tooltipEntity = this.GenerateTooltipFunc(this._tooltipTargetEntity);

                        // if got a result lock it and add to UI
                        if (this._tooltipEntity != null) {
                            this._tooltipEntity.Locked = true;
                            this._tooltipEntity.ClickThrough = true;
                            this.AddEntity(this._tooltipEntity);
                        }
                    }
                }
            },
            /**
             * Dispose the render target (only if use) and set it to null.
             *
             * @instance
             * @private
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @return  {void}
             */
            DisposeRenderTarget: function () {
                if (this._renderTarget != null) {
                    this._renderTarget.Dispose();
                    this._renderTarget = null;
                }
            },
            /**
             * Draw the UI. This function should be called from your Game 'Draw()' function.
             Note: if UseRenderTarget is true, this function should be called FIRST in your draw function.
             If UseRenderTarget is false, this function should be called LAST in your draw function.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {Microsoft.Xna.Framework.Graphics.SpriteBatch}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            Draw$1: function (spriteBatch) {
                this._defaultSpriteBatchWrapper.Spritebatch = spriteBatch;
                this._defaultSpriteBatchWrapper.GraphicsDevice = this._defaultGraphicDeviceWrapper;
                this._defaultGraphicDeviceWrapper.GraphicDevice = spriteBatch.GraphicsDevice;
                this.Draw(this._defaultSpriteBatchWrapper);
            },
            /**
             * Draw the UI. This function should be called from your Game 'Draw()' function.
             Note: if UseRenderTarget is true, this function should be called FIRST in your draw function.
             If UseRenderTarget is false, this function should be called LAST in your draw function.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            Draw: function (spriteBatch) {
                var newScreenWidth = spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.Viewport.Width;
                var newScreenHeight = spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.Viewport.Height;

                // update screen size
                if (this.ScreenWidth !== newScreenWidth || this.ScreenHeight !== newScreenHeight) {
                    this.ScreenWidth = newScreenWidth;
                    this.ScreenHeight = newScreenHeight;
                    this.Root.MarkAsDirty();
                }

                // if using rendering targets
                if (this.UseRenderTarget) {
                    // check if screen size changed or don't have a render target yet. if so, create the render target.
                    if (this._renderTarget == null || this._renderTarget.Width !== this.ScreenWidth || this._renderTarget.Height !== this.ScreenHeight) {
                        // recreate render target
                        this.DisposeRenderTarget();
                        this._renderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(FaceUI.Utils.GraphicDeviceWrapper.op_Implicit(spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice), this.ScreenWidth, this.ScreenHeight, false, spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.PresentationParameters.BackBufferFormat, spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.PresentationParameters.DepthStencilFormat, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
                    } else {
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.SetRenderTarget(this._renderTarget);
                        spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.Clear(Microsoft.Xna.Framework.Color.Transparent.$clone());
                    }
                }

                // draw root panel
                this.Root.Draw(spriteBatch);

                // draw cursor (unless using render targets and should draw cursor outside of it)
                if (this.ShowCursor && (this.IncludeCursorInRenderTarget || !this.UseRenderTarget)) {
                    this.DrawCursor(spriteBatch);
                }

                // reset render target
                if (this.UseRenderTarget) {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.SetRenderTarget(null);
                }
            },
            /**
             * Finalize the draw frame and draw all the UI on screen.
             This function only works if we are in UseRenderTarget mode.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {Microsoft.Xna.Framework.Graphics.SpriteBatch}    spriteBatch    Sprite batch to draw on.
             * @return  {void}
             */
            DrawMainRenderTarget$1: function (spriteBatch) {
                this._defaultSpriteBatchWrapper.Spritebatch = spriteBatch;
                this.DrawMainRenderTarget(this._defaultSpriteBatchWrapper);
            },
            /**
             * Finalize the draw frame and draw all the UI on screen.
             This function only works if we are in UseRenderTarget mode.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @return  {void}
             */
            DrawMainRenderTarget: function (spriteBatch) {
                // draw the main render target
                if (this.RenderTarget != null && !this.RenderTarget.IsDisposed) {
                    // draw render target
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Begin(Microsoft.Xna.Framework.Graphics.SpriteSortMode.Immediate, Microsoft.Xna.Framework.Graphics.BlendState.AlphaBlend, void 0, void 0, void 0, void 0, this.RenderTargetTransformMatrix);
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(this.RenderTarget, new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, this.ScreenWidth, this.ScreenHeight), Microsoft.Xna.Framework.Color.White.$clone());
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$End();
                }

                // draw cursor
                if (this.ShowCursor && !this.IncludeCursorInRenderTarget) {
                    this.DrawCursor(spriteBatch);
                }
            },
            /**
             * Get transformed cursoer position for collision detection.
             If have transform matrix and curser is included in render target, will transform cursor position too.
             If don't use transform matrix or drawing cursor outside, will not transform cursor position.
             *
             * @instance
             * @public
             * @this FaceUI.UserInterface
             * @memberof FaceUI.UserInterface
             * @param   {?Microsoft.Xna.Framework.Vector2}    addVector
             * @return  {Microsoft.Xna.Framework.Vector2}                  Transformed cursor position.
             */
            GetTransformedCursorPos: function (addVector) {
                var $t;
                // default add vector
                addVector = ($t = addVector, $t != null ? $t : Microsoft.Xna.Framework.Vector2.Zero);

                // return transformed cursor position
                if (this.UseRenderTarget && System.Nullable.liftne(Microsoft.Xna.Framework.Matrix.op_Inequality, System.Nullable.lift1("$clone", this.RenderTargetTransformMatrix), null) && !this.IncludeCursorInRenderTarget) {
                    var matrix = Microsoft.Xna.Framework.Matrix.Invert(System.Nullable.getValue(this.RenderTargetTransformMatrix).$clone());
                    return Microsoft.Xna.Framework.Vector2.op_Addition(this.MouseInputProvider.FaceUI$IMouseInput$TransformMousePosition(matrix.$clone()), Microsoft.Xna.Framework.Vector2.Transform(System.Nullable.getValue(addVector).$clone(), matrix.$clone()));
                }

                // return raw cursor pos
                return Microsoft.Xna.Framework.Vector2.op_Addition(this.MouseInputProvider.FaceUI$IMouseInput$MousePosition.$clone(), System.Nullable.getValue(addVector).$clone());
            }
        }
    });

    Bridge.ns("FaceUI.UserInterface", $asm.$);

    Bridge.apply($asm.$.FaceUI.UserInterface, {
        f1: function (text, anchor, color, scale, size, offset) {
            if (System.Nullable.liftne(Microsoft.Xna.Framework.Color.op_Inequality, System.Nullable.lift1("$clone", color), null)) {
                return new FaceUI.Entities.RichParagraph.$ctor1(text, anchor, System.Nullable.getValue(color).$clone(), scale, System.Nullable.lift1("$clone", size), System.Nullable.lift1("$clone", offset));
            }
            return new FaceUI.Entities.RichParagraph.$ctor2(text, anchor, System.Nullable.lift1("$clone", size), System.Nullable.lift1("$clone", offset), scale);
        }
    });

    /** @namespace FaceUI.Utils */

    /**
     * @abstract
     * @public
     * @class FaceUI.Utils.GraphicDeviceWrapper
     */
    Bridge.define("FaceUI.Utils.GraphicDeviceWrapper", {
        statics: {
            methods: {
                /**
                 * @static
                 * @public
                 * @this FaceUI.Utils.GraphicDeviceWrapper
                 * @memberof FaceUI.Utils.GraphicDeviceWrapper
                 * @param   {FaceUI.Utils.GraphicDeviceWrapper}                  instance
                 * @return  {Microsoft.Xna.Framework.Graphics.GraphicsDevice}
                 */
                op_Implicit: function (instance) {
                    return instance.GraphicsDevice;
                }
            }
        }
    });

    /**
     * Wrapper for sprite batch to draw in a way you may want
     *
     * @abstract
     * @public
     * @class FaceUI.Utils.ISpriteBatchWrapper
     */
    Bridge.define("FaceUI.Utils.ISpriteBatchWrapper", {
        $kind: "interface"
    });

    /** @namespace FaceUI.Utils.Forms */

    /**
     * Form instance.
     *
     * @public
     * @class FaceUI.Utils.Forms.Form
     */
    Bridge.define("FaceUI.Utils.Forms.Form", {
        statics: {
            fields: {
                /**
                 * Extra space to set between fields.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.Form
                 * @default 10
                 * @type number
                 */
                ExtraSpaceBetweenFields: 0
            },
            ctors: {
                init: function () {
                    this.ExtraSpaceBetweenFields = 10;
                }
            }
        },
        fields: {
            _fieldsData: null,
            _entities: null,
            /**
             * Form's root panel.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.Form
             * @type FaceUI.Entities.Panel
             */
            FormPanel: null
        },
        ctors: {
            init: function () {
                this._fieldsData = new (System.Collections.Generic.Dictionary$2(System.String,FaceUI.Utils.Forms.FormFieldData))();
                this._entities = new (System.Collections.Generic.Dictionary$2(System.String,FaceUI.Entities.Entity))();
            },
            /**
             * Create the form from a list of fields data.
             Note: the returned form will be inside an invisible panel without padding and 100% size. This means
             that you need to provide a panel of your own to put the form inside.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {System.Collections.Generic.IEnumerable$1}    fields    Fields to generate form from.
             * @param   {FaceUI.Entities.Panel}                       parent    Optional panel to contain the result form.
             * @return  {void}
             */
            ctor: function (fields, parent) {
                var $t;
                this.$initialize();
                // create root panel
                this.FormPanel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, -1), FaceUI.Entities.PanelSkin.None, FaceUI.Entities.Anchor.Auto);
                this.FormPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();

                // create fields
                $t = Bridge.getEnumerator(fields, FaceUI.Utils.Forms.FormFieldData);
                try {
                    while ($t.moveNext()) {
                        var field = { v : $t.Current };
                        // store field data
                        this._fieldsData.set(field.v.FieldId, field.v);

                        // field entity to create and do we need a label for it
                        var fieldEntity = { };
                        var needLabel = { v : true };

                        // create entity based on type
                        fieldEntity.v = this.CreateEntityForField(field.v, needLabel);
                        fieldEntity.v.Identifier = "form-entity-" + (field.v.FieldId || "");
                        fieldEntity.v.SpaceAfter = Microsoft.Xna.Framework.Vector2.op_Addition(fieldEntity.v.SpaceAfter.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(0, FaceUI.Utils.Forms.Form.ExtraSpaceBetweenFields));

                        // add label
                        if (needLabel.v) {
                            var label = this.FormPanel.AddChild(new FaceUI.Entities.Label.$ctor1(field.v.FieldLabel));
                            label.Identifier = "form-entity-label-" + (field.v.FieldId || "");
                        }

                        // add entity to form
                        this.FormPanel.AddChild(fieldEntity.v);

                        // set tooltiptext and call custom init function
                        if (!System.String.isNullOrEmpty(field.v.ToolTipText)) {
                            fieldEntity.v.ToolTipText = field.v.ToolTipText;
                        }
                        !Bridge.staticEquals(field.v.OnFieldCreated, null) ? field.v.OnFieldCreated(fieldEntity.v) : null;

                        // store entity in entities dictionary
                        this._entities.set(field.v.FieldId, fieldEntity.v);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // add to parent
                if (parent != null) {
                    parent.AddChild(this.FormPanel);
                }
            }
        },
        methods: {
            /**
             * Create and return an entity for a field type.
             *
             * @instance
             * @protected
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {FaceUI.Utils.Forms.FormFieldData}    fieldData    Field data to generate entity for.
             * @param   {System.Boolean}                      needLabel    Will set if need to generate a label for this entity or not.
             * @return  {FaceUI.Entities.Entity}
             */
            CreateEntityForField: function (fieldData, needLabel) {
                var $t, $t1, $t2;
                // by default need label
                needLabel.v = !System.String.isNullOrEmpty(fieldData.FieldLabel);

                // create entity based on type
                switch (fieldData.Type) {
                    case FaceUI.Utils.Forms.FormFieldType.Checkbox: 
                        needLabel.v = false;
                        return new FaceUI.Entities.CheckBox.$ctor1(fieldData.FieldLabel, 9, void 0, void 0, fieldData.DefaultValue != null && System.Nullable.getValue(Bridge.cast(Bridge.unbox((fieldData.DefaultValue), System.Boolean), System.Boolean)));
                    case FaceUI.Utils.Forms.FormFieldType.DropDown: 
                        // create entity and set choices
                        var dropdown = new FaceUI.Entities.DropDown.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, -1));
                        $t = Bridge.getEnumerator(fieldData.Choices);
                        try {
                            while ($t.moveNext()) {
                                var choice = $t.Current;
                                dropdown.AddItem(choice);
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                        // if got few items adjust height automatically
                        if (dropdown.SelectList.Items.length < 10) {
                            dropdown.SelectList.AdjustHeightAutomatically = true;
                        }
                        // set default value and return
                        if (Bridge.is(fieldData.DefaultValue, System.String)) {
                            dropdown.SelectedValue = Bridge.as(fieldData.DefaultValue, System.String);
                        } else if (Bridge.is(fieldData.DefaultValue, System.Int32)) {
                            dropdown.SelectedIndex = System.Nullable.getValue(Bridge.cast(Bridge.unbox(fieldData.DefaultValue, System.Int32), System.Int32));
                        }
                        return dropdown;
                    case FaceUI.Utils.Forms.FormFieldType.MultilineTextInput: 
                        var multiText = new FaceUI.Entities.TextInput.$ctor1(true);
                        multiText.Value = Bridge.as(fieldData.DefaultValue, System.String);
                        return multiText;
                    case FaceUI.Utils.Forms.FormFieldType.TextInput: 
                        var text = new FaceUI.Entities.TextInput.$ctor1(false);
                        if (fieldData.DefaultValue != null) {
                            text.Value = Bridge.as(fieldData.DefaultValue, System.String);
                        }
                        return text;
                    case FaceUI.Utils.Forms.FormFieldType.Slider: 
                        var slider = new FaceUI.Entities.Slider.$ctor1((fieldData.Min >>> 0), (fieldData.Max >>> 0));
                        if (Bridge.is(fieldData.DefaultValue, System.Int32)) {
                            slider.Value = System.Nullable.getValue(Bridge.cast(Bridge.unbox(fieldData.DefaultValue, System.Int32), System.Int32));
                        }
                        return slider;
                    case FaceUI.Utils.Forms.FormFieldType.SelectList: 
                        // create the entity itself
                        var selectlist = new FaceUI.Entities.SelectList.$ctor2(new Microsoft.Xna.Framework.Vector2.$ctor2(0, -1));
                        $t1 = Bridge.getEnumerator(fieldData.Choices);
                        try {
                            while ($t1.moveNext()) {
                                var choice1 = $t1.Current;
                                selectlist.AddItem(choice1);
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                        // if got few items set height automatically
                        if (selectlist.Items.length < 10) {
                            selectlist.AdjustHeightAutomatically = true;
                        }
                        // set default value and return
                        if (Bridge.is(fieldData.DefaultValue, System.String)) {
                            selectlist.SelectedValue = Bridge.as(fieldData.DefaultValue, System.String);
                        } else if (Bridge.is(fieldData.DefaultValue, System.Int32)) {
                            selectlist.SelectedIndex = System.Nullable.getValue(Bridge.cast(Bridge.unbox(fieldData.DefaultValue, System.Int32), System.Int32));
                        }
                        return selectlist;
                    case FaceUI.Utils.Forms.FormFieldType.RadioButtons: 
                        var radiosPanel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, -1), FaceUI.Entities.PanelSkin.None, FaceUI.Entities.Anchor.Auto);
                        radiosPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                        $t2 = Bridge.getEnumerator(fieldData.Choices);
                        try {
                            while ($t2.moveNext()) {
                                var choice2 = $t2.Current;
                                var radio = new FaceUI.Entities.RadioButton.$ctor1(choice2, 9, void 0, void 0, Bridge.referenceEquals((Bridge.as(fieldData.DefaultValue, System.String)), choice2));
                                radiosPanel.AddChild(radio);
                            }
                        } finally {
                            if (Bridge.is($t2, System.IDisposable)) {
                                $t2.System$IDisposable$Dispose();
                            }
                        }
                        return radiosPanel;
                    case FaceUI.Utils.Forms.FormFieldType.Section: 
                        var containerPanel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, -1), FaceUI.Entities.PanelSkin.None, FaceUI.Entities.Anchor.Auto);
                        containerPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                        if (needLabel.v) {
                            containerPanel.AddChild(new FaceUI.Entities.Paragraph.$ctor2(fieldData.FieldLabel));
                        }
                        containerPanel.AddChild(new FaceUI.Entities.HorizontalLine.ctor());
                        needLabel.v = false;
                        return containerPanel;
                    default: 
                        throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Unknown field type!");
                }
            },
            /**
             * Remove this form from its parent.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @return  {void}
             */
            Remove: function () {
                this.FormPanel.RemoveFromParent();
            },
            /**
             * Get entity for field.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {string}                    fieldId    Field id to get entity for.
             * @return  {FaceUI.Entities.Entity}               Field's root entity.
             */
            GetEntity: function (fieldId) {
                return this._entities.get(fieldId);
            },
            /**
             * Get field's value.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {string}           fieldId       Field to get.
             * @param   {System.Object}    defaultVal    Default value to return if value to get is null, unselected, or empty string.
             * @return  {System.Object}                  Field's value.
             */
            GetValue: function (fieldId, defaultVal) {
                var $t;
                if (defaultVal === void 0) { defaultVal = null; }
                // get field data and entity
                var fieldData = this._fieldsData.get(fieldId);
                var entity = this._entities.get(fieldId);

                // anonymous function to return default value if value from form is null or empty
                var ApplyDefaultVal = function (val) {
                    if (defaultVal != null && (val == null || System.String.isNullOrEmpty(Bridge.toString(val)))) {
                        return defaultVal;
                    }
                    return val;
                };

                // return value based on type
                switch (fieldData.Type) {
                    case FaceUI.Utils.Forms.FormFieldType.Checkbox: 
                        return ApplyDefaultVal(Bridge.box(Bridge.cast((entity), FaceUI.Entities.CheckBox).Checked, System.Boolean, System.Boolean.toString));
                    case FaceUI.Utils.Forms.FormFieldType.DropDown: 
                        return ApplyDefaultVal(Bridge.cast((entity), FaceUI.Entities.DropDown).SelectedValue);
                    case FaceUI.Utils.Forms.FormFieldType.MultilineTextInput: 
                        return ApplyDefaultVal(Bridge.cast((entity), FaceUI.Entities.TextInput).Value);
                    case FaceUI.Utils.Forms.FormFieldType.TextInput: 
                        return ApplyDefaultVal(Bridge.cast((entity), FaceUI.Entities.TextInput).Value);
                    case FaceUI.Utils.Forms.FormFieldType.Slider: 
                        return ApplyDefaultVal(Bridge.box(Bridge.cast((entity), FaceUI.Entities.Slider).Value, System.Int32));
                    case FaceUI.Utils.Forms.FormFieldType.SelectList: 
                        return ApplyDefaultVal(Bridge.cast((entity), FaceUI.Entities.SelectList).SelectedValue);
                    case FaceUI.Utils.Forms.FormFieldType.RadioButtons: 
                        $t = Bridge.getEnumerator(Bridge.cast((entity), FaceUI.Entities.Panel).Children, FaceUI.Entities.Entity);
                        try {
                            while ($t.moveNext()) {
                                var child = $t.Current;
                                if (Bridge.is(child, FaceUI.Entities.RadioButton) && Bridge.cast(child, FaceUI.Entities.RadioButton).Checked) {
                                    return ApplyDefaultVal((Bridge.as(child, FaceUI.Entities.RadioButton)).TextParagraph.Text);
                                }
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                        return ApplyDefaultVal(null);
                    case FaceUI.Utils.Forms.FormFieldType.Section: 
                        return ApplyDefaultVal(null);
                    default: 
                        throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Unknown field type!");
                }
            },
            /**
             * Get field value as a trimmed string.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {string}    fieldId       Field to get.
             * @param   {string}    defaultVal    Default value to return if value to get is null, unselected, or empty string.
             * @return  {string}                  Field's value.
             */
            GetValueString: function (fieldId, defaultVal) {
                if (defaultVal === void 0) { defaultVal = null; }
                var ret = this.GetValue(fieldId, defaultVal);
                return Bridge.toString(ret).trim();
            },
            /**
             * Get field value as boolean.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {string}      fieldId       Field to get.
             * @param   {?boolean}    defaultVal    Default value to return if value to get is null, unselected, or empty string.
             * @return  {boolean}                   Field's value.
             */
            GetValueBool: function (fieldId, defaultVal) {
                if (defaultVal === void 0) { defaultVal = null; }
                var ret = this.GetValue(fieldId, Bridge.box(defaultVal, System.Boolean, System.Nullable.toStringFn(System.Boolean.toString), System.Nullable.getHashCode));
                return System.Boolean.parse(Bridge.toString(ret));
            },
            /**
             * Get field value as integer.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {string}     fieldId       Field to get.
             * @param   {?number}    defaultVal    Default value to return if value to get is null, unselected, or empty string.
             * @return  {number}                   Field's value.
             */
            GetValueInt: function (fieldId, defaultVal) {
                if (defaultVal === void 0) { defaultVal = null; }
                var ret = this.GetValue(fieldId, Bridge.box(defaultVal, System.Int32, System.Nullable.toString, System.Nullable.getHashCode));
                return System.Int32.parse(Bridge.toString(ret));
            },
            /**
             * Get field value as float.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.Form
             * @memberof FaceUI.Utils.Forms.Form
             * @param   {string}     fieldId       Field to get.
             * @param   {?number}    defaultVal    Default value to return if value to get is null, unselected, or empty string.
             * @return  {number}                   Field's value.
             */
            GetValueFloat: function (fieldId, defaultVal) {
                if (defaultVal === void 0) { defaultVal = null; }
                var ret = this.GetValue(fieldId, Bridge.box(defaultVal, System.Single, System.Nullable.toStringFn(System.Single.format), System.Nullable.getHashCodeFn(System.Single.getHashCode)));
                return System.Single.parse(Bridge.toString(ret));
            }
        }
    });

    /** @namespace System */

    /**
     * @memberof System
     * @callback System.Action
     * @param   {FaceUI.Entities.Entity}    arg
     * @return  {void}
     */

    /**
     * Form field data.
     *
     * @public
     * @class FaceUI.Utils.Forms.FormFieldData
     */
    Bridge.define("FaceUI.Utils.Forms.FormFieldData", {
        fields: {
            /**
             * Field type.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type FaceUI.Utils.Forms.FormFieldType
             */
            Type: 0,
            /**
             * Field unique identifier.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type string
             */
            FieldId: null,
            /**
             * Label to show above field.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type string
             */
            FieldLabel: null,
            /**
             * Default value to start with.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type System.Object
             */
            DefaultValue: null,
            /**
             * Choices of this field, used for fields like dropdown, radio buttons, etc.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type Array.<string>
             */
            Choices: null,
            /**
             * Min value (when input is integer field like slider).
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type number
             */
            Min: 0,
            /**
             * Max value (when input is integer field like slider).
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type number
             */
            Max: 0,
            /**
             * Tooltip text to assign to the field entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type string
             */
            ToolTipText: null,
            /**
             * Custom initialize function that will be called when the field's entity is created.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @type System.Action
             */
            OnFieldCreated: null
        },
        ctors: {
            /**
             * Create form field data.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.Forms.FormFieldData
             * @memberof FaceUI.Utils.Forms.FormFieldData
             * @param   {FaceUI.Utils.Forms.FormFieldType}    type     Field type.
             * @param   {string}                              id       Field unique id.
             * @param   {string}                              label    Optional label.
             * @return  {void}
             */
            ctor: function (type, id, label) {
                if (label === void 0) { label = null; }

                this.$initialize();
                this.Type = type;
                this.FieldId = id;
                this.FieldLabel = label;
            }
        }
    });

    /**
     * Form field types.
     *
     * @public
     * @class FaceUI.Utils.Forms.FormFieldType
     */
    Bridge.define("FaceUI.Utils.Forms.FormFieldType", {
        $kind: "enum",
        statics: {
            fields: {
                /**
                 * Checkbox field.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 0
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                Checkbox: 0,
                /**
                 * Radio buttons (require choices).
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 1
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                RadioButtons: 1,
                /**
                 * Inline text input.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 2
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                TextInput: 2,
                /**
                 * Multiline text input.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 3
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                MultilineTextInput: 3,
                /**
                 * Select list.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 4
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                SelectList: 4,
                /**
                 * Dropdown choices.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 5
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                DropDown: 5,
                /**
                 * Slider field.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 6
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                Slider: 6,
                /**
                 * Start a new form section, with a header and horizontal line.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.Forms.FormFieldType
                 * @constant
                 * @default 7
                 * @type FaceUI.Utils.Forms.FormFieldType
                 */
                Section: 7
            }
        }
    });

    /**
     * Helper class to generate message boxes and prompts.
     *
     * @static
     * @abstract
     * @public
     * @class FaceUI.Utils.MessageBox
     */
    Bridge.define("FaceUI.Utils.MessageBox", {
        statics: {
            fields: {
                /**
                 * Default size to use for message boxes.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.MessageBox
                 * @type Microsoft.Xna.Framework.Vector2
                 */
                DefaultMsgBoxSize: null,
                /**
                 * Default text for OK button.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.MessageBox
                 * @default "OK"
                 * @type string
                 */
                DefaultOkButtonText: null,
                /**
                 * Will block and fade background with this color while messages are opened.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.MessageBox
                 * @type Microsoft.Xna.Framework.Color
                 */
                BackgroundFaderColor: null
            },
            props: {
                /**
                 * Count currently opened message boxes.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Utils.MessageBox
                 * @function OpenedMsgBoxesCount
                 * @type number
                 */
                OpenedMsgBoxesCount: 0,
                /**
                 * Get if there's a message box currently opened.
                 *
                 * @static
                 * @public
                 * @readonly
                 * @memberof FaceUI.Utils.MessageBox
                 * @function IsMsgBoxOpened
                 * @type boolean
                 */
                IsMsgBoxOpened: {
                    get: function () {
                        return FaceUI.Utils.MessageBox.OpenedMsgBoxesCount > 0;
                    }
                }
            },
            ctors: {
                init: function () {
                    this.DefaultMsgBoxSize = new Microsoft.Xna.Framework.Vector2();
                    this.BackgroundFaderColor = new Microsoft.Xna.Framework.Color();
                    this.DefaultMsgBoxSize = new Microsoft.Xna.Framework.Vector2.$ctor2(480, -1);
                    this.DefaultOkButtonText = "OK";
                    this.BackgroundFaderColor = new Microsoft.Xna.Framework.Color.$ctor7(0, 0, 0, 100);
                    this.OpenedMsgBoxesCount = 0;
                }
            },
            methods: {
                /**
                 * Show a message box with custom buttons and callbacks.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Utils.MessageBox
                 * @memberof FaceUI.Utils.MessageBox
                 * @param   {string}                                          header           Messagebox header.
                 * @param   {string}                                          text             Main text.
                 * @param   {Array.<FaceUI.Utils.MessageBox.MsgBoxOption>}    options          Msgbox response options.
                 * @param   {Array.<FaceUI.Entities.Entity>}                  extraEntities    Optional array of entities to add to msg box under the text and above the buttons.
                 * @param   {?Microsoft.Xna.Framework.Vector2}                size             Alternative size to use.
                 * @param   {FaceUI.Entities.Entity}                          parent           Parent to add message box to (if not defined will use root)
                 * @return  {FaceUI.Utils.MessageBox.MessageBoxHandle}                         Message box handle.
                 */
                BuildMessageBox: function (header, text, options, extraEntities, size, parent) {
                    var $t, $t1, $t2;
                    if (extraEntities === void 0) { extraEntities = null; }
                    if (size === void 0) { size = null; }
                    if (parent === void 0) { parent = null; }
                    // object to return
                    var ret = new FaceUI.Utils.MessageBox.MessageBoxHandle();
                    // create panel for messagebox
                    size = ($t = size, $t != null ? $t : FaceUI.Utils.MessageBox.DefaultMsgBoxSize);
                    var panel = new FaceUI.Entities.Panel.$ctor1(System.Nullable.getValue(size).$clone());
                    ret.Panel = panel;
                    if (!System.String.isNullOrWhiteSpace(header)) {
                        panel.AddChild(new FaceUI.Entities.Header.$ctor1(header));
                        panel.AddChild(new FaceUI.Entities.HorizontalLine.ctor());
                    }

                    if (!System.String.isNullOrWhiteSpace(text)) {
                        panel.AddChild(new FaceUI.Entities.RichParagraph.$ctor2(text));
                    }

                    // add rectangle to hide and lock background
                    if (FaceUI.Utils.MessageBox.BackgroundFaderColor.A !== 0) {
                        var fader = new FaceUI.Entities.ColoredRectangle.$ctor4(Microsoft.Xna.Framework.Vector2.Zero.$clone(), FaceUI.Entities.Anchor.Center);
                        fader.FillColor = new Microsoft.Xna.Framework.Color.$ctor7(0, 0, 0, 100);
                        fader.OutlineWidth = 0;
                        fader.ClickThrough = false;
                        ret.BackgroundFader = fader;
                    }

                    // add custom appended entities
                    if (extraEntities != null) {
                        $t1 = Bridge.getEnumerator(extraEntities);
                        try {
                            while ($t1.moveNext()) {
                                var entity = $t1.Current;
                                panel.AddChild(entity);
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }

                    // add bottom buttons panel
                    var buttonsPanel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, 70), FaceUI.Entities.PanelSkin.None, System.Nullable.getValue(size).Y === -1 ? FaceUI.Entities.Anchor.Auto : FaceUI.Entities.Anchor.BottomCenter);
                    buttonsPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                    panel.AddChild(buttonsPanel);
                    buttonsPanel.PriorityBonus = -10;

                    // add all option buttons
                    var btnSize = new Microsoft.Xna.Framework.Vector2.$ctor2(options.length === 1 ? 0.0 : (1.0 / options.length), 60);
                    $t2 = Bridge.getEnumerator(options);
                    try {
                        while ($t2.moveNext()) {
                            var option = { v : $t2.Current };
                            // add button entity
                            var button = new FaceUI.Entities.Button.$ctor1(option.v.Title, 0, FaceUI.Entities.Anchor.AutoInline, btnSize, void 0);

                            // set click event
                            button.OnClick = Bridge.fn.combine(button.OnClick, (function ($me, option) {
                                return function (ent) {
                                    // if need to close message box after clicking this button, close it:
                                    if (Bridge.staticEquals(option.v.Callback, null) || option.v.Callback()) {
                                        ret.Close();
                                    }
                                };
                            })(this, option));

                            // add button to buttons panel
                            buttonsPanel.AddChild(button);
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }

                    ret.Parent = parent;

                    return ret;
                },
                /**
                 * Show a message box with just "OK".
                 *
                 * @static
                 * @public
                 * @this FaceUI.Utils.MessageBox
                 * @memberof FaceUI.Utils.MessageBox
                 * @param   {string}                                      header            Message box title.
                 * @param   {string}                                      text              Main text to write on the message box.
                 * @param   {string}                                      closeButtonTxt    Text for the closing button (if not provided will use default).
                 * @param   {?Microsoft.Xna.Framework.Vector2}            size              Message box size (if not provided will use default).
                 * @param   {Array.<FaceUI.Entities.Entity>}              extraEntities     Optional array of entities to add to msg box under the text and above the buttons.
                 * @return  {FaceUI.Utils.MessageBox.MessageBoxHandle}                      Message box panel.
                 */
                BuildMessageBox$1: function (header, text, closeButtonTxt, size, extraEntities) {
                    var $t, $t1;
                    if (closeButtonTxt === void 0) { closeButtonTxt = null; }
                    if (size === void 0) { size = null; }
                    if (extraEntities === void 0) { extraEntities = null; }
                    return FaceUI.Utils.MessageBox.BuildMessageBox(header, text, System.Array.init([new FaceUI.Utils.MessageBox.MsgBoxOption(($t = closeButtonTxt, $t != null ? $t : FaceUI.Utils.MessageBox.DefaultOkButtonText), null)], FaceUI.Utils.MessageBox.MsgBoxOption), extraEntities, ($t1 = size, $t1 != null ? $t1 : FaceUI.Utils.MessageBox.DefaultMsgBoxSize), void 0);
                }
            }
        }
    });

    /**
     * Return object containing all the data of a message box instance.
     *
     * @public
     * @class FaceUI.Utils.MessageBox.MessageBoxHandle
     */
    Bridge.define("FaceUI.Utils.MessageBox.MessageBoxHandle", {
        $kind: "nested class",
        fields: {
            /**
             * Message box panel.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.MessageBox.MessageBoxHandle
             * @type FaceUI.Entities.Panel
             */
            Panel: null,
            /**
             * Object used to fade out the background.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.MessageBox.MessageBoxHandle
             * @type FaceUI.Entities.Entity
             */
            BackgroundFader: null
        },
        props: {
            Parent: null,
            OnShow: null,
            OnDone: null
        },
        methods: {
            /**
             * Hide / close the message box.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.MessageBox.MessageBoxHandle
             * @memberof FaceUI.Utils.MessageBox.MessageBoxHandle
             * @return  {void}
             */
            Close: function () {
                var $t;
                if (this.Panel.Parent == null) {
                    return;
                }

                this.Panel.RemoveFromParent();
                this.BackgroundFader != null ? this.BackgroundFader.RemoveFromParent() : null;
                FaceUI.Utils.MessageBox.OpenedMsgBoxesCount = (FaceUI.Utils.MessageBox.OpenedMsgBoxesCount - 1) | 0;
                !Bridge.staticEquals(($t = this.OnDone), null) ? $t(this.Panel) : null;
            },
            Show: function () {
                var $t;
                if (this.Panel.Parent != null) {
                    return;
                }

                if (this.BackgroundFader != null) {
                    FaceUI.UserInterface.Active.AddEntity(this.BackgroundFader);
                    this.BackgroundFader.OnClick = Bridge.fn.bind(this, $asm.$.FaceUI.Utils.MessageBox.MessageBoxHandle.f1);
                }

                if (this.Parent != null) {
                    this.Parent.AddChild(this.Panel);
                } else {
                    FaceUI.UserInterface.Active.AddEntity(this.Panel);
                }

                FaceUI.Utils.MessageBox.OpenedMsgBoxesCount = (FaceUI.Utils.MessageBox.OpenedMsgBoxesCount + 1) | 0;

                !Bridge.staticEquals(($t = this.OnShow), null) ? $t(this.Panel) : null;
            }
        }
    });

    Bridge.ns("FaceUI.Utils.MessageBox.MessageBoxHandle", $asm.$);

    Bridge.apply($asm.$.FaceUI.Utils.MessageBox.MessageBoxHandle, {
        f1: function (b) {
            this.Close();
        }
    });

    /**
     * @memberof System
     * @callback System.Func
     * @return  {boolean}
     */

    /**
     * A button / option for a message box.
     *
     * @public
     * @class FaceUI.Utils.MessageBox.MsgBoxOption
     */
    Bridge.define("FaceUI.Utils.MessageBox.MsgBoxOption", {
        $kind: "nested class",
        fields: {
            /**
             * Option title (for the button).
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.MessageBox.MsgBoxOption
             * @type string
             */
            Title: null,
            /**
             * Callback to run when clicked. Return false to leave message box opened (true will close it).
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.MessageBox.MsgBoxOption
             * @type System.Func
             */
            Callback: null
        },
        ctors: {
            /**
             * Create the message box option.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.MessageBox.MsgBoxOption
             * @memberof FaceUI.Utils.MessageBox.MsgBoxOption
             * @param   {string}         title       Text to write on the button.
             * @param   {System.Func}    callback    Action when clicked. Return false if you want to abort and leave the message opened, return true to close it.
             * @return  {void}
             */
            ctor: function (title, callback) {
                this.$initialize();
                this.Title = title;
                this.Callback = callback;
            }
        }
    });

    /**
     * Helper class to generate grid-like structure of panels.
     *
     * @static
     * @abstract
     * @public
     * @class FaceUI.Utils.PanelsGrid
     */
    Bridge.define("FaceUI.Utils.PanelsGrid", {
        statics: {
            methods: {
                /**
                 * Generate and return a set of panels aligned next to each other with a constant size.
                 This is useful for cases like when you want to divide your panel into 3 colums.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Utils.PanelsGrid
                 * @memberof FaceUI.Utils.PanelsGrid
                 * @param   {number}                              amount        How many panels to create.
                 * @param   {FaceUI.Entities.Entity}              parent        Optional parent entity to add panels to.
                 * @param   {?Microsoft.Xna.Framework.Vector2}    columnSize    Size of every column. If not set will be 1f / amount with auto-set height.
                 * @param   {FaceUI.Entities.PanelSkin}           skin          Panels skin to use (default to None, making them invisible.
                 * @return  {Array.<FaceUI.Entities.Panel>}                     Array with generated panels.
                 */
                GenerateColums$1: function (amount, parent, columnSize, skin) {
                    var $t;
                    if (columnSize === void 0) { columnSize = null; }
                    if (skin === void 0) { skin = -1; }
                    // list of panels to return
                    var retList = new (System.Collections.Generic.List$1(FaceUI.Entities.Panel)).ctor();

                    // default column size
                    columnSize = ($t = columnSize, $t != null ? $t : new Microsoft.Xna.Framework.Vector2.$ctor2(1.0 / amount, -1));

                    // create panels
                    for (var i = 0; i < amount; i = (i + 1) | 0) {
                        var currPanel = new FaceUI.Entities.Panel.$ctor1(System.Nullable.getValue(columnSize).$clone(), skin, FaceUI.Entities.Anchor.AutoInlineNoBreak);
                        currPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                        retList.add(currPanel);
                        if (parent != null) {
                            parent.AddChild(currPanel);
                        }
                    }

                    // return result panels
                    return retList.ToArray();
                },
                /**
                 * Generate and return a set of panels aligned next to each other.
                 This is useful for cases like when you want to divide your panel into 3 colums.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Utils.PanelsGrid
                 * @memberof FaceUI.Utils.PanelsGrid
                 * @param   {Array.<Microsoft.Xna.Framework.Vector2>}    panelSizes    Array with panel sizes to generate (also determine how many panels to return).
                 * @param   {FaceUI.Entities.Entity}                     parent        Optional parent entity to add panels to.
                 * @param   {FaceUI.Entities.PanelSkin}                  skin          Panels skin to use (default to None, making them invisible.
                 * @return  {Array.<FaceUI.Entities.Panel>}                            Array with generated panels.
                 */
                GenerateColums: function (panelSizes, parent, skin) {
                    var $t;
                    if (skin === void 0) { skin = -1; }
                    // list of panels to return
                    var retList = new (System.Collections.Generic.List$1(FaceUI.Entities.Panel)).ctor();

                    // create panels
                    $t = Bridge.getEnumerator(panelSizes);
                    try {
                        while ($t.moveNext()) {
                            var currSize = $t.Current.$clone();
                            var currPanel = new FaceUI.Entities.Panel.$ctor1(currSize.$clone(), skin, FaceUI.Entities.Anchor.AutoInlineNoBreak);
                            currPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                            retList.add(currPanel);
                            if (parent != null) {
                                parent.AddChild(currPanel);
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    // return result panels
                    return retList.ToArray();
                }
            }
        }
    });

    /**
     * @public
     * @class FaceUI.Utils.PresentationParametersWrapper
     */
    Bridge.define("FaceUI.Utils.PresentationParametersWrapper", {
        props: {
            /**
             * @instance
             * @public
             * @memberof FaceUI.Utils.PresentationParametersWrapper
             * @function DepthStencilFormat
             * @type Microsoft.Xna.Framework.Graphics.DepthFormat
             */
            DepthStencilFormat: 0,
            /**
             * @instance
             * @public
             * @memberof FaceUI.Utils.PresentationParametersWrapper
             * @function BackBufferFormat
             * @type Microsoft.Xna.Framework.Graphics.SurfaceFormat
             */
            BackBufferFormat: 0
        }
    });

    /**
     * A helper class to generate simple file-menu (top navbar) using panels and dropdown entities.
     *
     * @static
     * @abstract
     * @public
     * @class FaceUI.Utils.SimpleFileMenu
     */
    Bridge.define("FaceUI.Utils.SimpleFileMenu", {
        statics: {
            methods: {
                /**
                 * Create the file menu and return the root panel.
                 The result would be a panel containing a group of dropdown entities, which implement the file menu layout.
                 The id of every dropdown is "menu-[menu-title]".
                 Note: the returned file menu panel comes without parent, you need to add it to your UI tree manually.
                 *
                 * @static
                 * @public
                 * @this FaceUI.Utils.SimpleFileMenu
                 * @memberof FaceUI.Utils.SimpleFileMenu
                 * @param   {FaceUI.Utils.SimpleFileMenu.MenuLayout}    layout    Layout to create file menu for.
                 * @param   {FaceUI.Entities.PanelSkin}                 skin      Skin to use for panels and dropdown of this file menu.
                 * @return  {FaceUI.Entities.Panel}                               Menu root panel.
                 */
                Create: function (layout, skin) {
                    var $t, $t1;
                    if (skin === void 0) { skin = 2; }
                    // create the root panel
                    var rootPanel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, FaceUI.Entities.DropDown.SelectedPanelHeight), skin, FaceUI.Entities.Anchor.TopLeft);
                    rootPanel.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();

                    // create menus
                    $t = Bridge.getEnumerator(layout.Layout);
                    try {
                        while ($t.moveNext()) {
                            var menu = $t.Current;
                            // create dropdown and all its items
                            var dropdown = new FaceUI.Entities.DropDown.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(menu.Width, -1), FaceUI.Entities.Anchor.AutoInline, null, FaceUI.Entities.PanelSkin.None, skin, false);
                            rootPanel.AddChild(dropdown);
                            $t1 = Bridge.getEnumerator(menu.Items);
                            try {
                                while ($t1.moveNext()) {
                                    var item = $t1.Current;
                                    dropdown.AddItem(item);
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }
                            dropdown.AutoSetListHeight = true;

                            // set menu title and id
                            dropdown.DefaultText = menu.Title;
                            dropdown.Identifier = "menu-" + (menu.Title || "");

                            // disable dropdown selection (will only trigger event and unselect)
                            dropdown.DontKeepSelection = true;

                            // set callbacks
                            for (var i = 0; i < menu.Items.Count; i = (i + 1) | 0) {
                                var callback = menu.Actions.getItem(i);
                                if (!Bridge.staticEquals(callback, null)) {
                                    dropdown.OnSelectedSpecificItem(menu.Items.getItem(i), callback);
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    // return the root panel
                    return rootPanel;
                }
            }
        }
    });

    /**
     * Class used to define the file menu layout.
     *
     * @public
     * @class FaceUI.Utils.SimpleFileMenu.MenuLayout
     */
    Bridge.define("FaceUI.Utils.SimpleFileMenu.MenuLayout", {
        $kind: "nested class",
        props: {
            /**
             * Menus layout.
             *
             * @instance
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout
             * @function Layout
             * @type System.Collections.Generic.List$1
             */
            Layout: null
        },
        ctors: {
            init: function () {
                this.Layout = new (System.Collections.Generic.List$1(FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu)).ctor();
            }
        },
        methods: {
            /**
             * Add a top menu.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.SimpleFileMenu.MenuLayout
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout
             * @param   {string}    title    Menu title.
             * @param   {number}    width    Menu width.
             * @return  {void}
             */
            AddMenu: function (title, width) {
                var $t;
                var newMenu = ($t = new FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu(), $t.Title = title, $t.Width = width, $t);
                this.Layout.add(newMenu);
            },
            /**
             * Adds an item to a menu.
             *
             * @instance
             * @public
             * @this FaceUI.Utils.SimpleFileMenu.MenuLayout
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout
             * @param   {string}           menuTitle    Menu title to add item to.
             * @param   {string}           item         Item text.
             * @param   {System.Action}    onClick      On-click action.
             * @return  {void}
             */
            AddItemToMenu: function (menuTitle, item, onClick) {
                var $t;
                $t = Bridge.getEnumerator(this.Layout);
                try {
                    while ($t.moveNext()) {
                        var menu = $t.Current;
                        if (Bridge.referenceEquals(menu.Title, menuTitle)) {
                            menu.Items.add(item);
                            menu.Actions.add(onClick);
                            return;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                throw new FaceUI.Exceptions.NotFoundException.$ctor1("Menu with title '" + (menuTitle || "") + "' is not defined!");
            }
        }
    });

    /**
     * A single menu in the file menu navbar.
     *
     * @class FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu
     */
    Bridge.define("FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu", {
        $kind: "nested class",
        fields: {
            /**
             * Menu title.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu
             * @type string
             */
            Title: null,
            /**
             * Menu width.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu
             * @type number
             */
            Width: 0,
            /**
             * Items under this menu.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu
             * @type System.Collections.Generic.List$1
             */
            Items: null,
            /**
             * Actions attached to menu.
             *
             * @instance
             * @public
             * @memberof FaceUI.Utils.SimpleFileMenu.MenuLayout.Menu
             * @type System.Collections.Generic.List$1
             */
            Actions: null
        },
        ctors: {
            init: function () {
                this.Items = new (System.Collections.Generic.List$1(System.String)).ctor();
                this.Actions = new (System.Collections.Generic.List$1(Function)).ctor();
            }
        }
    });

    /**
     * An animator that makes an entity fade out.
     Note: this animator override the Opacity property.
     *
     * @public
     * @class FaceUI.Animators.FadeOutAnimator
     * @augments FaceUI.Animators.IAnimator
     */
    Bridge.define("FaceUI.Animators.FadeOutAnimator", {
        inherits: [FaceUI.Animators.IAnimator],
        fields: {
            _timeLeft: 0,
            /**
             * Fading animation speed.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.FadeOutAnimator
             * @default 1.0
             * @type number
             */
            SpeedFactor: 0
        },
        props: {
            /**
             * Did this animator finish?
             *
             * @instance
             * @public
             * @override
             * @readonly
             * @memberof FaceUI.Animators.FadeOutAnimator
             * @function IsDone
             * @type boolean
             */
            IsDone: {
                get: function () {
                    return this._timeLeft <= 0.0;
                }
            }
        },
        ctors: {
            init: function () {
                this._timeLeft = 1.0;
                this.SpeedFactor = 1.0;
            }
        },
        methods: {
            /**
             * Do animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.FadeOutAnimator
             * @memberof FaceUI.Animators.FadeOutAnimator
             * @return  {void}
             */
            Update: function () {
                // update animation and calc new opacity
                var dt = FaceUI.UserInterface.Active.CurrGameTime.ElapsedGameTime.getTotalSeconds();
                this._timeLeft -= dt * this.SpeedFactor;
                var newOpacity = Math.max(0.0, this._timeLeft);

                // update target entity
                this.TargetEntity.Opacity = Bridge.Int.clipu8(newOpacity * 255.0);
            },
            /**
             * Reset animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.FadeOutAnimator
             * @memberof FaceUI.Animators.FadeOutAnimator
             * @return  {void}
             */
            Reset: function () {
                this._timeLeft = 1.0;
            }
        }
    });

    /**
     * An animator that makes an entity float up and down.
     Note: this animator override the SpaceBefore and SpaceAfter properties.
     *
     * @public
     * @class FaceUI.Animators.FloatUpDownAnimator
     * @augments FaceUI.Animators.IAnimator
     */
    Bridge.define("FaceUI.Animators.FloatUpDownAnimator", {
        inherits: [FaceUI.Animators.IAnimator],
        fields: {
            _maxDuration: null,
            _timeLeft: null,
            _step: 0,
            /**
             * Floating animation speed.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.FloatUpDownAnimator
             * @default 2.0
             * @type number
             */
            SpeedFactor: 0,
            /**
             * How much the entity moves up and down.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.FloatUpDownAnimator
             * @default 5
             * @type number
             */
            FloatingDistance: 0
        },
        props: {
            /**
             * If set, represent number of seconds for this animator to run.
             When reach 0, will stop animation (and begin slowing down gradually until reaching 0).
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.FloatUpDownAnimator
             * @function Duration
             * @type ?number
             */
            Duration: {
                get: function () {
                    return this._maxDuration;
                },
                set: function (value) {
                    this._maxDuration = (this._timeLeft = value);
                }
            },
            /**
             * Did this animator finish?
             *
             * @instance
             * @public
             * @override
             * @readonly
             * @memberof FaceUI.Animators.FloatUpDownAnimator
             * @function IsDone
             * @type boolean
             */
            IsDone: {
                get: function () {
                    return System.Nullable.hasValue(this._timeLeft) && System.Nullable.getValue(this._timeLeft) <= 0.0;
                }
            }
        },
        ctors: {
            init: function () {
                this.SpeedFactor = 2.0;
                this.FloatingDistance = 5;
            }
        },
        methods: {
            /**
             * Do animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.FloatUpDownAnimator
             * @memberof FaceUI.Animators.FloatUpDownAnimator
             * @return  {void}
             */
            Update: function () {
                // update animation and set floating factor
                var dt = FaceUI.UserInterface.Active.CurrGameTime.ElapsedGameTime.getTotalSeconds();
                this._step += dt * this.SpeedFactor;
                var currVal = Math.sin(this._step) * this.FloatingDistance;

                // apply duration
                if (System.Nullable.hasValue(this._timeLeft)) {
                    this._timeLeft = System.Nullable.sub(this._timeLeft, dt);
                    if (System.Nullable.getValue(this._timeLeft) < 1.0) {
                        currVal *= System.Nullable.getValue(this._timeLeft);
                    }
                }

                // update target entity
                this.TargetEntity.SpaceBefore = new Microsoft.Xna.Framework.Vector2.$ctor2(this.TargetEntity.SpaceBefore.X, currVal);
                this.TargetEntity.SpaceAfter = new Microsoft.Xna.Framework.Vector2.$ctor2(this.TargetEntity.SpaceAfter.X, -currVal);
            },
            /**
             * Reset animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.FloatUpDownAnimator
             * @memberof FaceUI.Animators.FloatUpDownAnimator
             * @return  {void}
             */
            Reset: function () {
                this._step = 0.0;
                this._timeLeft = this._maxDuration;
            }
        }
    });

    /**
     * An animator that add wave animation to rich paragraphs.
     *
     * @public
     * @class FaceUI.Animators.TextWaveAnimator
     * @augments FaceUI.Animators.IAnimator
     */
    Bridge.define("FaceUI.Animators.TextWaveAnimator", {
        inherits: [FaceUI.Animators.IAnimator],
        fields: {
            _currPosition: 0,
            /**
             * Wave movement speed.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @default 10.0
             * @type number
             */
            SpeedFactor: 0,
            /**
             * Wave height factor.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @default 18.0
             * @type number
             */
            WaveHeight: 0,
            /**
             * Wave length / width factor.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @default 3.5
             * @type number
             */
            WaveLengthFactor: 0,
            /**
             * Should play this animation in a loop?
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @default true
             * @type boolean
             */
            Loop: false
        },
        props: {
            /**
             * Did this animator finish?
             *
             * @instance
             * @public
             * @override
             * @readonly
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @function IsDone
             * @type boolean
             */
            IsDone: {
                get: function () {
                    return !this.Loop && Bridge.Int.clip32(this._currPosition) > (Bridge.as(this.TargetEntity, FaceUI.Entities.RichParagraph)).Text.length;
                }
            }
        },
        ctors: {
            init: function () {
                this._currPosition = 0.0;
                this.SpeedFactor = 10.0;
                this.WaveHeight = 18.0;
                this.WaveLengthFactor = 3.5;
                this.Loop = true;
            }
        },
        methods: {
            /**
             * Return if an entity type is compatible with this animator.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.TextWaveAnimator
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @param   {FaceUI.Entities.Entity}    entity    Entity to test.
             * @return  {boolean}                             True if compatible, false otherwise.
             */
            CheckEntityCompatibility: function (entity) {
                return Bridge.is(entity, FaceUI.Entities.RichParagraph);
            },
            /**
             * Do animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.TextWaveAnimator
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @return  {void}
             */
            Update: function () {
                // finished animation? skip
                if (this.IsDone) {
                    return;
                }

                // get target entity as rich paragraph
                var paragraph = Bridge.as(this.TargetEntity, FaceUI.Entities.RichParagraph);

                // update animation
                var dt = FaceUI.UserInterface.Active.CurrGameTime.ElapsedGameTime.getTotalSeconds();
                this._currPosition += dt * this.SpeedFactor;

                // wrap position
                if (this._currPosition > paragraph.Text.length + this.WaveLengthFactor * 5) {
                    this.Reset();
                }
            },
            /**
             * Called after attached to an entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Animators.TextWaveAnimator
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @return  {void}
             */
            OnAttached: function () {
                (Bridge.as(this.TargetEntity, FaceUI.Entities.RichParagraph)).PerCharacterManipulators = Bridge.fn.combine((Bridge.as(this.TargetEntity, FaceUI.Entities.RichParagraph)).PerCharacterManipulators, Bridge.fn.cacheBind(this, this.PerCharacterManipulationFunc));
                this.Reset();
            },
            /**
             * Called right before detached from an entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Animators.TextWaveAnimator
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @return  {void}
             */
            OnDetach: function () {
                (Bridge.as(this.TargetEntity, FaceUI.Entities.RichParagraph)).PerCharacterManipulators = Bridge.fn.remove((Bridge.as(this.TargetEntity, FaceUI.Entities.RichParagraph)).PerCharacterManipulators, Bridge.fn.cacheBind(this, this.PerCharacterManipulationFunc));
            },
            /**
             * Reset animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.TextWaveAnimator
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @return  {void}
             */
            Reset: function () {
                this._currPosition = -this.WaveLengthFactor * 5;
            },
            /**
             * The function we register as per-character manipulator to apply this animator.
             *
             * @instance
             * @private
             * @this FaceUI.Animators.TextWaveAnimator
             * @memberof FaceUI.Animators.TextWaveAnimator
             * @param   {FaceUI.Entities.RichParagraph}      paragraph       
             * @param   {number}                             currChar        
             * @param   {number}                             index           
             * @param   {Microsoft.Xna.Framework.Color}      fillColor       
             * @param   {Microsoft.Xna.Framework.Color}      outlineColor    
             * @param   {System.Int32}                       outlineWidth    
             * @param   {Microsoft.Xna.Framework.Vector2}    offset          
             * @param   {System.Single}                      scale
             * @return  {void}
             */
            PerCharacterManipulationFunc: function (paragraph, currChar, index, fillColor, outlineColor, outlineWidth, offset, scale) {
                var distance = Math.abs(index - this._currPosition);
                offset.v.Y = -this.WaveHeight / (1.0 + ((distance * distance) / this.WaveLengthFactor));
            }
        }
    });

    /**
     * An animator that makes an entity types text into Paragraph over time.
     Note: this animator override the Text property.
     *
     * @public
     * @class FaceUI.Animators.TypeWriterAnimator
     * @augments FaceUI.Animators.IAnimator
     */
    Bridge.define("FaceUI.Animators.TypeWriterAnimator", {
        inherits: [FaceUI.Animators.IAnimator],
        fields: {
            _text: null,
            _currPosition: 0,
            _timeForNextChar: 0,
            /**
             * Typing animation speed. 
             If value = 1f it means it will take a second to type each character.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.TypeWriterAnimator
             * @default 10.0
             * @type number
             */
            SpeedFactor: 0
        },
        props: {
            /**
             * Text to type.
             Changing it will reset animation.
             *
             * @instance
             * @public
             * @memberof FaceUI.Animators.TypeWriterAnimator
             * @function TextToType
             * @type string
             */
            TextToType: {
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    this._text = value;
                    this.Reset();
                }
            },
            /**
             * Did this animator finish?
             *
             * @instance
             * @public
             * @override
             * @readonly
             * @memberof FaceUI.Animators.TypeWriterAnimator
             * @function IsDone
             * @type boolean
             */
            IsDone: {
                get: function () {
                    return this._currPosition >= this._text.length;
                }
            }
        },
        ctors: {
            init: function () {
                this._timeForNextChar = 1.0;
                this.SpeedFactor = 10.0;
            }
        },
        methods: {
            /**
             * Return if an entity type is compatible with this animator.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.TypeWriterAnimator
             * @memberof FaceUI.Animators.TypeWriterAnimator
             * @param   {FaceUI.Entities.Entity}    entity    Entity to test.
             * @return  {boolean}                             True if compatible, false otherwise.
             */
            CheckEntityCompatibility: function (entity) {
                return Bridge.is(entity, FaceUI.Entities.Paragraph);
            },
            /**
             * Do animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.TypeWriterAnimator
             * @memberof FaceUI.Animators.TypeWriterAnimator
             * @return  {void}
             */
            Update: function () {
                // nothing to type? don't do anything
                if (this._text == null) {
                    return;
                }

                // finished animation? skip
                if (this.IsDone) {
                    return;
                }

                // update animation and calc new position
                var dt = FaceUI.UserInterface.Active.CurrGameTime.ElapsedGameTime.getTotalSeconds();
                this._timeForNextChar -= dt * this.SpeedFactor;
                if (this._timeForNextChar <= 0.0) {
                    // reset time for next character and update current position
                    this._timeForNextChar = 1.0;
                    this._currPosition = (this._currPosition + 1) | 0;

                    // special case - if its rich paragraph and we started style instruction, complete the command
                    if (Bridge.is(this.TargetEntity, FaceUI.Entities.RichParagraph)) {
                        var openingDenote = FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsOpening;
                        var closingDenote = FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsClosing;
                        if (((this._currPosition + openingDenote.length) | 0) < this._text.length && Bridge.referenceEquals(this._text.substr(this._currPosition, openingDenote.length), openingDenote)) {
                            var closingPosition = System.String.indexOf(this._text, closingDenote, this._currPosition);
                            if (closingPosition !== -1) {
                                this._currPosition = (closingPosition + closingDenote.length) | 0;
                            }
                        }
                    }
                }

                // update target entity text
                Bridge.cast((this.TargetEntity), FaceUI.Entities.Paragraph).Text = this._text.substr(0, this._currPosition);
            },
            /**
             * Reset animation.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Animators.TypeWriterAnimator
             * @memberof FaceUI.Animators.TypeWriterAnimator
             * @return  {void}
             */
            Reset: function () {
                this._currPosition = 0;
                this._timeForNextChar = 1.0;
            }
        }
    });

    /**
     * Implement Mouse Input and Keyboard Input for FaceUI + provide some helpful utils you can use externally.
     This is the object we provide to FaceUI by default, if no other input providers were set by user.
     *
     * @public
     * @class FaceUI.DefaultInputProvider
     * @implements  FaceUI.IMouseInput
     * @implements  FaceUI.IKeyboardInput
     */
    Bridge.define("FaceUI.DefaultInputProvider", {
        inherits: [FaceUI.IMouseInput,FaceUI.IKeyboardInput],
        fields: {
            _newKeyboardState: null,
            _oldKeyboardState: null,
            _newMouseState: null,
            _oldMouseState: null,
            _newMousePos: null,
            _oldMousePos: null,
            _currTime: null,
            _allKeyValues: null,
            /**
             * An artificial "lag" after a key is pressed when typing text input, to prevent mistake duplications.
             *
             * @instance
             * @public
             * @memberof FaceUI.DefaultInputProvider
             * @default 0.6
             * @type number
             */
            KeysTypeCooldown: 0,
            _currCharacterInput: 0,
            _currCharacterInputKey: 0,
            _keyboardInputCooldown: 0,
            _newKeyIsPressed: false,
            _capslock: false
        },
        props: {
            /**
             * Current mouse wheel value.
             *
             * @instance
             * @public
             * @memberof FaceUI.DefaultInputProvider
             * @function MouseWheel
             * @type number
             */
            MouseWheel: 0,
            /**
             * Mouse wheel change sign (eg 0, 1 or -1) since last frame.
             *
             * @instance
             * @public
             * @memberof FaceUI.DefaultInputProvider
             * @function MouseWheelChange
             * @type number
             */
            MouseWheelChange: 0,
            /**
             * Current frame game time.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.DefaultInputProvider
             * @function CurrGameTime
             * @type Microsoft.Xna.Framework.GameTime
             */
            CurrGameTime: {
                get: function () {
                    return this._currTime;
                }
            },
            /**
             * Get current mouse poisition.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.DefaultInputProvider
             * @function MousePosition
             * @type Microsoft.Xna.Framework.Vector2
             */
            MousePosition: {
                get: function () {
                    return this._newMousePos.$clone();
                }
            },
            /**
             * Get mouse position change since last frame.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.DefaultInputProvider
             * @function MousePositionDiff
             * @type Microsoft.Xna.Framework.Vector2
             */
            MousePositionDiff: {
                get: function () {
                    return Microsoft.Xna.Framework.Vector2.op_Subtraction(this._newMousePos.$clone(), this._oldMousePos.$clone());
                }
            }
        },
        alias: [
            "MouseWheel", "FaceUI$IMouseInput$MouseWheel",
            "MouseWheelChange", "FaceUI$IMouseInput$MouseWheelChange",
            "Update", "FaceUI$IKeyboardInput$Update",
            "Update", "FaceUI$IMouseInput$Update",
            "UpdateMousePosition", "FaceUI$IMouseInput$UpdateMousePosition",
            "TransformMousePosition", "FaceUI$IMouseInput$TransformMousePosition",
            "GetTextInput", "FaceUI$IKeyboardInput$GetTextInput",
            "MousePosition", "FaceUI$IMouseInput$MousePosition",
            "MousePositionDiff", "FaceUI$IMouseInput$MousePositionDiff",
            "MouseButtonDown", "FaceUI$IMouseInput$MouseButtonDown",
            "AnyMouseButtonDown", "FaceUI$IMouseInput$AnyMouseButtonDown",
            "MouseButtonReleased", "FaceUI$IMouseInput$MouseButtonReleased",
            "AnyMouseButtonReleased", "FaceUI$IMouseInput$AnyMouseButtonReleased",
            "MouseButtonPressed", "FaceUI$IMouseInput$MouseButtonPressed",
            "AnyMouseButtonPressed", "FaceUI$IMouseInput$AnyMouseButtonPressed",
            "MouseButtonClick", "FaceUI$IMouseInput$MouseButtonClick",
            "AnyMouseButtonClicked", "FaceUI$IMouseInput$AnyMouseButtonClicked"
        ],
        ctors: {
            init: function () {
                this._newKeyboardState = new Microsoft.Xna.Framework.Input.KeyboardState();
                this._oldKeyboardState = new Microsoft.Xna.Framework.Input.KeyboardState();
                this._newMouseState = new Microsoft.Xna.Framework.Input.MouseState();
                this._oldMouseState = new Microsoft.Xna.Framework.Input.MouseState();
                this._newMousePos = new Microsoft.Xna.Framework.Vector2();
                this._oldMousePos = new Microsoft.Xna.Framework.Vector2();
                this.KeysTypeCooldown = 0.6;
                this._currCharacterInput = FaceUI.SpecialChars.Null;
                this._currCharacterInputKey = Microsoft.Xna.Framework.Input.Keys.Escape;
                this._keyboardInputCooldown = 0.0;
                this._newKeyIsPressed = false;
                this._capslock = false;
            },
            /**
             * Create the input helper.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @return  {void}
             */
            ctor: function () {
                this.$initialize();
                this._allKeyValues = Bridge.cast(System.Enum.getValues(Microsoft.Xna.Framework.Input.Keys), System.Array.type(Microsoft.Xna.Framework.Input.Keys));

                // init keyboard states
                this._newKeyboardState = this._oldKeyboardState.$clone();

                // init mouse states
                this._newMouseState = this._oldMouseState.$clone();
                this._newMousePos = new Microsoft.Xna.Framework.Vector2.$ctor2(this._newMouseState.X, this._newMouseState.Y);

                // call first update to get starting positions
                this.Update(new Microsoft.Xna.Framework.GameTime.ctor());
            }
        },
        methods: {
            /**
             * Update current states.
             If used outside FaceUI, this function should be called first thing inside your game 'Update()' function,
             and before you make any use of this class.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {Microsoft.Xna.Framework.GameTime}    gameTime    Current game time.
             * @return  {void}
             */
            Update: function (gameTime) {
                var $t;
                // store game time
                this._currTime = gameTime;

                // store previous states
                this._oldMouseState = this._newMouseState.$clone();
                this._oldKeyboardState = this._newKeyboardState.$clone();

                // get new states
                this._newMouseState = Microsoft.Xna.Framework.Input.Mouse.GetState();
                this._newKeyboardState = Microsoft.Xna.Framework.Input.Keyboard.GetState();

                // get mouse position
                this._oldMousePos = this._newMousePos.$clone();
                this._newMousePos = new Microsoft.Xna.Framework.Vector2.$ctor2(this._newMouseState.X, this._newMouseState.Y);

                // get mouse wheel state
                var prevMouseWheel = this.MouseWheel;
                this.MouseWheel = this._newMouseState.ScrollWheelValue;
                this.MouseWheelChange = Bridge.Int.sign(this.MouseWheel - prevMouseWheel);

                // update capslock state
                if (this._newKeyboardState.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.CapsLock) && !this._oldKeyboardState.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.CapsLock)) {
                    this._capslock = !this._capslock;
                }

                // decrease keyboard input cooldown time
                if (this._keyboardInputCooldown > 0.0) {
                    this._newKeyIsPressed = false;
                    this._keyboardInputCooldown -= gameTime.ElapsedGameTime.getTotalSeconds();
                }

                // if current text input key is no longer down, reset text input character
                if (this._currCharacterInput !== FaceUI.SpecialChars.Null && !this._newKeyboardState.IsKeyDown(this._currCharacterInputKey)) {
                    this._currCharacterInput = FaceUI.SpecialChars.Null;
                }

                // send key-down events
                $t = Bridge.getEnumerator(this._allKeyValues);
                try {
                    while ($t.moveNext()) {
                        var key = $t.Current;
                        if (this._newKeyboardState.IsKeyDown(key) && !this._oldKeyboardState.IsKeyDown(key)) {
                            this.OnKeyPressed(key);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /**
             * Move the cursor to be at the center of the screen.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {Microsoft.Xna.Framework.Vector2}    pos    New mouse position.
             * @return  {void}
             */
            UpdateMousePosition: function (pos) {
                // move mouse position back to center
                Microsoft.Xna.Framework.Input.Mouse.SetPosition(Bridge.Int.clip32(pos.X), Bridge.Int.clip32(pos.Y));
                this._newMousePos = (this._oldMousePos = pos.$clone());
            },
            /**
             * Calculate and return current cursor position transformed by a matrix.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {?Microsoft.Xna.Framework.Matrix}    transform    Matrix to transform cursor position by.
             * @return  {Microsoft.Xna.Framework.Vector2}                 Cursor position with optional transform applied.
             */
            TransformMousePosition: function (transform) {
                var newMousePos = this._newMousePos.$clone();
                if (System.Nullable.liftne(Microsoft.Xna.Framework.Matrix.op_Inequality, System.Nullable.lift1("$clone", transform), null)) {
                    return Microsoft.Xna.Framework.Vector2.op_Subtraction(Microsoft.Xna.Framework.Vector2.Transform(newMousePos.$clone(), System.Nullable.getValue(transform).$clone()), new Microsoft.Xna.Framework.Vector2.$ctor2(System.Nullable.getValue(transform).Translation.X, System.Nullable.getValue(transform).Translation.Y));
                }
                return newMousePos.$clone();
            },
            /**
             * Called every time a keyboard key is pressed (called once on the frame key was pressed).
             *
             * @instance
             * @protected
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key    Key code that is being pressed on this frame.
             * @return  {void}
             */
            OnKeyPressed: function (key) {
                this.NewKeyTextInput(key);
            },
            /**
             * This update the character the user currently type down, for text input.
             This function called whenever a new key is pressed down, and becomes the current input
             until it is released.
             *
             * @instance
             * @private
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key    Key code that is being pressed down on this frame.
             * @return  {void}
             */
            NewKeyTextInput: function (key) {
                // reset cooldown time and set new key pressed = true
                this._keyboardInputCooldown = this.KeysTypeCooldown;
                this._newKeyIsPressed = true;

                // get if shift is currently down
                var isShiftDown = this._newKeyboardState.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.LeftShift) || this._newKeyboardState.IsKeyDown(Microsoft.Xna.Framework.Input.Keys.RightShift);

                // set curr input key, but also keep the previous key in case we need to revert
                var prevKey = this._currCharacterInputKey;
                this._currCharacterInputKey = key;

                // handle special keys and characters
                switch (key) {
                    case Microsoft.Xna.Framework.Input.Keys.Space: 
                        this._currCharacterInput = FaceUI.SpecialChars.Space;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Left: 
                        this._currCharacterInput = FaceUI.SpecialChars.ArrowLeft;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Right: 
                        this._currCharacterInput = FaceUI.SpecialChars.ArrowRight;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Up: 
                        this._currCharacterInput = FaceUI.SpecialChars.ArrowUp;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Down: 
                        this._currCharacterInput = FaceUI.SpecialChars.ArrowDown;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Delete: 
                        this._currCharacterInput = FaceUI.SpecialChars.Delete;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Back: 
                        this._currCharacterInput = FaceUI.SpecialChars.Backspace;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.CapsLock: 
                    case Microsoft.Xna.Framework.Input.Keys.RightShift: 
                    case Microsoft.Xna.Framework.Input.Keys.LeftShift: 
                        this._newKeyIsPressed = false;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Enter: 
                        this._currCharacterInput = 10;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D0: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad0: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D0) ? 41 : 48;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D9: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad9: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D9) ? 40 : 57;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D8: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad8: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D8) ? 42 : 56;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D7: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad7: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D7) ? 38 : 55;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D6: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad6: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D6) ? 94 : 54;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D5: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad5: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D5) ? 37 : 53;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D4: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad4: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D4) ? 36 : 52;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D3: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad3: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D3) ? 35 : 51;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D2: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad2: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D2) ? 64 : 50;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.D1: 
                    case Microsoft.Xna.Framework.Input.Keys.NumPad1: 
                        this._currCharacterInput = (isShiftDown && key === Microsoft.Xna.Framework.Input.Keys.D1) ? 33 : 49;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemQuestion: 
                        this._currCharacterInput = isShiftDown ? 63 : 47;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemQuotes: 
                        this._currCharacterInput = isShiftDown ? 34 : 39;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemSemicolon: 
                        this._currCharacterInput = isShiftDown ? 58 : 59;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemTilde: 
                        this._currCharacterInput = isShiftDown ? 126 : 96;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemOpenBrackets: 
                        this._currCharacterInput = isShiftDown ? 123 : 91;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemCloseBrackets: 
                        this._currCharacterInput = isShiftDown ? 125 : 93;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemPlus: 
                    case Microsoft.Xna.Framework.Input.Keys.Add: 
                        this._currCharacterInput = (isShiftDown || key === Microsoft.Xna.Framework.Input.Keys.Add) ? 43 : 61;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemMinus: 
                    case Microsoft.Xna.Framework.Input.Keys.Subtract: 
                        this._currCharacterInput = isShiftDown ? 95 : 45;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemPeriod: 
                    case Microsoft.Xna.Framework.Input.Keys.Decimal: 
                        this._currCharacterInput = isShiftDown ? 62 : 46;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Divide: 
                        this._currCharacterInput = isShiftDown ? 63 : 47;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Multiply: 
                        this._currCharacterInput = 42;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemBackslash: 
                        this._currCharacterInput = isShiftDown ? 124 : 92;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.OemComma: 
                        this._currCharacterInput = isShiftDown ? 60 : 44;
                        return;
                    case Microsoft.Xna.Framework.Input.Keys.Tab: 
                        this._currCharacterInput = 32;
                        return;
                    default: 
                        this._currCharacterInputKey = prevKey;
                        break;
                }
                ;

                // get current key thats getting pressed as a string
                var lastCharPressedStr = System.Enum.toString(Microsoft.Xna.Framework.Input.Keys, key);

                // if character is not a valid char but a special key we don't want to handle, skip
                // (note: keys that are characters should have length of 1)
                if (lastCharPressedStr.length > 1) {
                    return;
                }

                // set current key as the current text input key
                this._currCharacterInputKey = key;

                // get current capslock state and invert if shift is down
                var capsLock = this._capslock;
                if (isShiftDown) {
                    capsLock = !capsLock;
                }

                // fix case and set as current char pressed
                this._currCharacterInput = (capsLock ? lastCharPressedStr.toUpperCase() : lastCharPressedStr.toLowerCase()).charCodeAt(0);

            },
            /**
             * Get textual input from keyboard.
             If user enter keys it will push them into string, if delete or backspace will remove chars, etc.
             This also handles keyboard cooldown, to make it feel like windows-input.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {string}          txt          String to push text input into.
             * @param   {number}          lineWidth    How many characters can fit in a line.
             * @param   {System.Int32}    pos          Position to insert / remove characters. -1 to push at the end of string. After done, will contain actual new caret position.
             * @return  {string}                       String after text input applied on it.
             */
            GetTextInput: function (txt, lineWidth, pos) {
                // if need to skip due to cooldown time
                if (!this._newKeyIsPressed && this._keyboardInputCooldown > 0.0) {
                    return txt;
                }

                // if no valid characters are currently input
                if (this._currCharacterInput === FaceUI.SpecialChars.Null) {
                    return txt;
                }

                // get default position
                if (pos.v === -1) {
                    pos.v = txt.length;
                }

                // handle special chars
                switch (this._currCharacterInput) {
                    case FaceUI.SpecialChars.ArrowLeft: 
                        if (((pos.v = (pos.v - 1) | 0)) < 0) {
                            pos.v = 0;
                        }
                        return txt;
                    case FaceUI.SpecialChars.ArrowRight: 
                        if (((pos.v = (pos.v + 1) | 0)) > txt.length) {
                            pos.v = txt.length;
                        }
                        return txt;
                    case FaceUI.SpecialChars.ArrowUp: 
                        pos.v = (pos.v - lineWidth) | 0;
                        if (pos.v < 0) {
                            pos.v = 0;
                        }
                        return txt;
                    case FaceUI.SpecialChars.ArrowDown: 
                        pos.v = (pos.v + lineWidth) | 0;
                        if (pos.v > txt.length) {
                            pos.v = txt.length;
                        }
                        return txt;
                    case FaceUI.SpecialChars.Backspace: 
                        pos.v = (pos.v - 1) | 0;
                        return (pos.v < txt.length && pos.v >= 0 && txt.length > 0) ? System.String.remove(txt, pos.v, 1) : txt;
                    case FaceUI.SpecialChars.Delete: 
                        return (pos.v < txt.length && txt.length > 0) ? System.String.remove(txt, pos.v, 1) : txt;
                }

                // add current character
                return System.String.insert(Bridge.identity(pos.v, (pos.v = (pos.v + 1) | 0)), txt, String.fromCharCode(this._currCharacterInput));
            },
            /**
             * Check if a given mouse button is down.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {FaceUI.MouseButton}    button    Mouse button to check.
             * @return  {boolean}
             */
            MouseButtonDown: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
            },
            /**
             * Return if any of mouse buttons is down.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @return  {boolean}        True if any mouse button is currently down.
             */
            AnyMouseButtonDown: function () {
                return this.MouseButtonDown(FaceUI.MouseButton.Left) || this.MouseButtonDown(FaceUI.MouseButton.Right) || this.MouseButtonDown(FaceUI.MouseButton.Middle);
            },
            /**
             * Check if a given mouse button was released in current frame.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {FaceUI.MouseButton}    button    Mouse button to check.
             * @return  {boolean}
             */
            MouseButtonReleased: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Released && this.GetMousePreviousButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
            },
            /**
             * Return if any mouse button was released this frame.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @return  {boolean}        True if any mouse button was released.
             */
            AnyMouseButtonReleased: function () {
                return this.MouseButtonReleased(FaceUI.MouseButton.Left) || this.MouseButtonReleased(FaceUI.MouseButton.Right) || this.MouseButtonReleased(FaceUI.MouseButton.Middle);
            },
            /**
             * Check if a given mouse button was pressed in current frame.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {FaceUI.MouseButton}    button    Mouse button to check.
             * @return  {boolean}
             */
            MouseButtonPressed: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed && this.GetMousePreviousButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Released;
            },
            /**
             * Return if any mouse button was pressed in current frame.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @return  {boolean}        True if any mouse button was pressed in current frame..
             */
            AnyMouseButtonPressed: function () {
                return this.MouseButtonPressed(FaceUI.MouseButton.Left) || this.MouseButtonPressed(FaceUI.MouseButton.Right) || this.MouseButtonPressed(FaceUI.MouseButton.Middle);
            },
            /**
             * Check if a given mouse button was just clicked (eg released after being pressed down)
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {FaceUI.MouseButton}    button    Mouse button to check.
             * @return  {boolean}
             */
            MouseButtonClick: function (button) {
                if (button === void 0) { button = 0; }
                return this.GetMouseButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Released && this.GetMousePreviousButtonState(button) === Microsoft.Xna.Framework.Input.ButtonState.Pressed;
            },
            /**
             * Return if any of mouse buttons was clicked this frame.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @return  {boolean}        True if any mouse button was clicked.
             */
            AnyMouseButtonClicked: function () {
                return this.MouseButtonClick(FaceUI.MouseButton.Left) || this.MouseButtonClick(FaceUI.MouseButton.Right) || this.MouseButtonClick(FaceUI.MouseButton.Middle);
            },
            /**
             * Return the state of a mouse button (up / down).
             *
             * @instance
             * @private
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {FaceUI.MouseButton}                           button    Button to check.
             * @return  {Microsoft.Xna.Framework.Input.ButtonState}              Mouse button state.
             */
            GetMouseButtonState: function (button) {
                if (button === void 0) { button = 0; }
                switch (button) {
                    case FaceUI.MouseButton.Left: 
                        return this._newMouseState.LeftButton;
                    case FaceUI.MouseButton.Right: 
                        return this._newMouseState.RightButton;
                    case FaceUI.MouseButton.Middle: 
                        return this._newMouseState.MiddleButton;
                }
                return Microsoft.Xna.Framework.Input.ButtonState.Released;
            },
            /**
             * Return the state of a mouse button (up / down), in previous frame.
             *
             * @instance
             * @private
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {FaceUI.MouseButton}                           button    Button to check.
             * @return  {Microsoft.Xna.Framework.Input.ButtonState}              Mouse button state.
             */
            GetMousePreviousButtonState: function (button) {
                if (button === void 0) { button = 0; }
                switch (button) {
                    case FaceUI.MouseButton.Left: 
                        return this._oldMouseState.LeftButton;
                    case FaceUI.MouseButton.Right: 
                        return this._oldMouseState.RightButton;
                    case FaceUI.MouseButton.Middle: 
                        return this._oldMouseState.MiddleButton;
                }
                return Microsoft.Xna.Framework.Input.ButtonState.Released;
            },
            /**
             * Check if a given keyboard key is down.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key    Key button to check.
             * @return  {boolean}
             */
            IsKeyDown: function (key) {
                return this._newKeyboardState.IsKeyDown(key);
            },
            /**
             * Check if a given keyboard key was previously pressed down and now released in this frame.
             *
             * @instance
             * @public
             * @this FaceUI.DefaultInputProvider
             * @memberof FaceUI.DefaultInputProvider
             * @param   {Microsoft.Xna.Framework.Input.Keys}    key    Key button to check.
             * @return  {boolean}
             */
            IsKeyReleased: function (key) {
                return this._oldKeyboardState.IsKeyDown(key) && this._newKeyboardState.IsKeyUp(key);
            }
        }
    });

    /**
     * A clickable button with label on it.
     *
     * @public
     * @class FaceUI.Entities.Button
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.Button", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default styling for the button itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Button
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Default styling for buttons label. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Button
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultParagraphStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultParagraphStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Button);
                }
            }
        },
        fields: {
            _skin: 0,
            /**
             * Button label. Use this if you want to change the button text or font style.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Button
             * @type FaceUI.Entities.Paragraph
             */
            ButtonParagraph: null,
            /**
             * If true, button will behave as a checkbox, meaning when you click on it it will stay pressed and have 'checked' value of true.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Button
             * @default false
             * @type boolean
             */
            ToggleMode: false,
            _checked: false,
            /**
             * Optional custom skin that override's the default theme button textures.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Button
             * @type Array.<Microsoft.Xna.Framework.Graphics.Texture2D>
             */
            _customSkin: null,
            /**
             * Frame width for when using custom skin.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Button
             * @type Microsoft.Xna.Framework.Vector2
             */
            _customFrame: null
        },
        props: {
            /**
             * Set / get current button skin.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Button
             * @function Skin
             * @type FaceUI.Entities.ButtonSkin
             */
            Skin: {
                get: function () {
                    return this._skin;
                },
                set: function (value) {
                    this._skin = value;
                    this._customSkin = null;
                }
            },
            /**
             * Entity fill color opacity - this is just a sugarcoat to access the default fill color alpha style property.
             *
             * @instance
             * @public
             * @override
             * @memberof FaceUI.Entities.Button
             * @function Opacity
             * @type number
             */
            Opacity: {
                get: function () {
                    return Bridge.ensureBaseProperty(this, "Opacity").$FaceUI$Entities$Entity$Opacity;
                },
                set: function (value) {
                    Bridge.ensureBaseProperty(this, "Opacity").$FaceUI$Entities$Entity$Opacity = value;
                    this.ButtonParagraph.Opacity = value;
                }
            },
            /**
             * When button is in Toggle mode, this is the current value (it button checked or not).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Button
             * @function Checked
             * @type boolean
             */
            Checked: {
                get: function () {
                    return this._checked === true;
                },
                set: function (value) {
                    this._checked = value;
                    this.DoOnValueChange();
                }
            }
        },
        ctors: {
            init: function () {
                this._customFrame = new Microsoft.Xna.Framework.Vector2();
                this.ToggleMode = false;
                this._checked = false;
                this._customFrame = Microsoft.Xna.Framework.Vector2.Zero.$clone();
            },
            /**
             * Create the button.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @param   {string}                              text      Text for the button label.
             * @param   {FaceUI.Entities.ButtonSkin}          skin      Button skin (texture to use).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Button size (if not defined will use default size).
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (text, skin, anchor, size, offset) {
                if (skin === void 0) { skin = 0; }
                if (anchor === void 0) { anchor = 9; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                // store style
                this._skin = skin;

                // update styles
                this.UpdateStyle(FaceUI.Entities.Button.DefaultStyle);

                if (!FaceUI.UserInterface.Active._isDeserializing) {
                    // create and set button paragraph
                    this.ButtonParagraph = FaceUI.UserInterface.DefaultParagraph(text, FaceUI.Entities.Anchor.Center, void 0, void 0, void 0, void 0);
                    this.ButtonParagraph._hiddenInternalEntity = true;
                    this.ButtonParagraph.UpdateStyle(FaceUI.Entities.Button.DefaultParagraphStyle);
                    this.ButtonParagraph.Identifier = "_button_caption";
                    this.AddChild(this.ButtonParagraph, true);
                }
            },
            /**
             * Create button with default params and without text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Button.$ctor1.call(this, "");
            }
        },
        methods: {
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.Entity.prototype.InitAfterDeserialize.call(this);
                this.ButtonParagraph = Bridge.as(this.Find$1("_button_caption"), FaceUI.Entities.Paragraph);
                this.ButtonParagraph._hiddenInternalEntity = true;
            },
            /**
             * Override the default theme textures and set a custom skin for this specific button.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    defaultTexture       Texture to use for default state.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    mouseHoverTexture    Texture to use when mouse hover over the button.
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    mouseDownTexture     Texture to use when mouse button is down over this button.
             * @param   {?Microsoft.Xna.Framework.Vector2}              frameWidth           The width of the custom texture's frame, in percents of texture size.
             * @return  {void}
             */
            SetCustomSkin: function (defaultTexture, mouseHoverTexture, mouseDownTexture, frameWidth) {
                var $t;
                if (frameWidth === void 0) { frameWidth = null; }
                this._customSkin = System.Array.init(3, null, Microsoft.Xna.Framework.Graphics.Texture2D);
                this._customSkin[System.Array.index(FaceUI.Entities.EntityState.Default, this._customSkin)] = defaultTexture;
                this._customSkin[System.Array.index(FaceUI.Entities.EntityState.MouseHover, this._customSkin)] = mouseHoverTexture;
                this._customSkin[System.Array.index(FaceUI.Entities.EntityState.MouseDown, this._customSkin)] = mouseDownTexture;
                this._customFrame = ($t = frameWidth, $t != null ? $t : this._customFrame);
            },
            /**
             * Is the button a natrually-interactable entity.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @return  {boolean}        True.
             */
            IsNaturallyInteractable: function () {
                return true;
            },
            /**
             * Handle click events. In button we override this so we can toggle button when in Toggle mode.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @return  {void}
             */
            DoOnClick: function () {
                // toggle value
                if (this.ToggleMode) {
                    this.Checked = !this.Checked;
                }

                // call base handler
                FaceUI.Entities.Entity.prototype.DoOnClick.call(this);
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Button
             * @memberof FaceUI.Entities.Button
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // get mouse state for graphics
                var state = this._entityState;
                if (this.Checked) {
                    state = FaceUI.Entities.EntityState.MouseDown;
                }

                // get texture based on skin and state
                var texture = this._customSkin == null ? FaceUI.Resources.ButtonTextures.getItem$1(this._skin, state) : this._customSkin[System.Array.index(state, this._customSkin)];

                // get frame width
                var data = FaceUI.Resources.ButtonData[System.Array.index(this._skin, FaceUI.Resources.ButtonData)];
                var frameSize = this._customSkin == null ? new Microsoft.Xna.Framework.Vector2.$ctor2(data.FrameWidth, data.FrameHeight) : this._customFrame;

                // draw the button background with frame
                if (frameSize.Length() > 0) {
                    var scale = frameSize.Y > 0 ? this.Scale : 1.0;
                    FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, texture, this._destRect.$clone(), frameSize.$clone(), 1, this.FillColor.$clone(), scale);
                } else {
                    FaceUI.UserInterface.Active.DrawUtils.DrawImage(spriteBatch, texture, this._destRect.$clone(), this.FillColor.$clone(), 1);
                }

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            }
        }
    });

    /**
     * A checkbox entity, eg a label with a square you can mark as checked or uncheck.
     Holds a boolean value.
     *
     * @public
     * @class FaceUI.Entities.CheckBox
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.CheckBox", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                CHECKBOX_SIZE: null,
                /**
                 * Default styling for the checkbox itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.CheckBox
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Default styling for checkbox label. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.CheckBox
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultParagraphStyle: null
            },
            ctors: {
                init: function () {
                    this.CHECKBOX_SIZE = new Microsoft.Xna.Framework.Vector2();
                    this.CHECKBOX_SIZE = new Microsoft.Xna.Framework.Vector2.$ctor2(35, 35);
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultParagraphStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.CheckBox);
                }
            }
        },
        fields: {
            /**
             * CheckBox label. Use this if you want to change the checkbox text or font style.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.CheckBox
             * @type FaceUI.Entities.Paragraph
             */
            TextParagraph: null,
            /**
             * Current checkbox value.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.CheckBox
             * @default false
             * @type boolean
             */
            _value: false
        },
        props: {
            /**
             * CheckBox current value, eg if its checked or unchecked.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.CheckBox
             * @function Checked
             * @type boolean
             */
            Checked: {
                get: function () {
                    return this._value === true;
                },
                set: function (value) {
                    this._value = value;
                    this.DoOnValueChange();
                }
            }
        },
        ctors: {
            init: function () {
                this._value = false;
            },
            /**
             * Create a new checkbox entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @param   {string}                              text         CheckBox label text.
             * @param   {FaceUI.Entities.Anchor}              anchor       Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size         CheckBox size.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset       Offset from anchor position.
             * @param   {boolean}                             isChecked    If true, this checkbox will be created as 'checked'.
             * @return  {void}
             */
            $ctor1: function (text, anchor, size, offset, isChecked) {
                if (anchor === void 0) { anchor = 9; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }
                if (isChecked === void 0) { isChecked = false; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                // update default style
                this.UpdateStyle(FaceUI.Entities.CheckBox.DefaultStyle);

                // create and set checkbox paragraph
                if (!FaceUI.UserInterface.Active._isDeserializing) {
                    this.TextParagraph = FaceUI.UserInterface.DefaultParagraph(text, FaceUI.Entities.Anchor.CenterLeft, void 0, void 0, void 0, void 0);
                    this.TextParagraph.UpdateStyle(FaceUI.Entities.CheckBox.DefaultParagraphStyle);
                    this.TextParagraph.Offset = new Microsoft.Xna.Framework.Vector2.$ctor2(25, 0);
                    this.TextParagraph._hiddenInternalEntity = true;
                    this.TextParagraph.Identifier = "_checkbox_text";
                    this.AddChild(this.TextParagraph, true);
                }

                // checkboxes are promiscuous by default.
                this.PromiscuousClicksMode = true;

                // set value
                this.Checked = isChecked;
            },
            /**
             * Create checkbox without text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.CheckBox.$ctor1.call(this, "");
            }
        },
        methods: {
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.Entity.prototype.InitAfterDeserialize.call(this);
                this.TextParagraph = Bridge.as(this.Find$1("_checkbox_text"), FaceUI.Entities.Paragraph);
                this.TextParagraph._hiddenInternalEntity = true;
            },
            /**
             * Is the checkbox a natrually-interactable entity.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @return  {boolean}        True.
             */
            IsNaturallyInteractable: function () {
                return true;
            },
            /**
             * Helper function to get checkbox texture based on state and current value.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @return  {Microsoft.Xna.Framework.Graphics.Texture2D}        Which texture to use for the checkbox.
             */
            GetTexture: function () {
                var state = this._entityState;
                if (state !== FaceUI.Entities.EntityState.MouseDown && this.Checked) {
                    state = FaceUI.Entities.EntityState.MouseDown;
                }
                return FaceUI.Resources.CheckBoxTextures.getItem(state);
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {

                // get texture based on checkbox / mouse state
                var texture = this.GetTexture();

                // calculate actual size
                var actualSize = Microsoft.Xna.Framework.Vector2.op_Multiply$1(FaceUI.Entities.CheckBox.CHECKBOX_SIZE.$clone(), this.GlobalScale);

                // dest rect
                var dest = new Microsoft.Xna.Framework.Rectangle.$ctor2(this._destRect.X, Bridge.Int.clip32(((this._destRect.Y + ((Bridge.Int.div(this._destRect.Height, 2)) | 0)) | 0) - actualSize.Y / 2), Bridge.Int.clip32(actualSize.X), Bridge.Int.clip32(actualSize.Y));
                dest = FaceUI.UserInterface.Active.DrawUtils.ScaleRect(dest.$clone(), this.Scale);

                // source rect
                var src = new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, texture.Width, texture.Height);

                // draw checkbox
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw$1(texture, dest.$clone(), src.$clone(), this.FillColor.$clone());

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            },
            /**
             * Handle mouse click event. 
             CheckBox entity override this function to handle value toggle.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.CheckBox
             * @memberof FaceUI.Entities.CheckBox
             * @return  {void}
             */
            DoOnClick: function () {
                // toggle value
                this.Checked = !this._value;

                // call base handler
                FaceUI.Entities.Entity.prototype.DoOnClick.call(this);
            }
        }
    });

    /**
     * A colored rectangle with outline.
     *
     * @public
     * @class FaceUI.Entities.ColoredRectangle
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.ColoredRectangle", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default rectangle styling. Override this dictionary to change the way default rectangles appear.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ColoredRectangle
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.ColoredRectangle);
                }
            }
        },
        ctors: {
            /**
             * Create the rectangle with outline and fill color + outline width.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ColoredRectangle
             * @memberof FaceUI.Entities.ColoredRectangle
             * @param   {Microsoft.Xna.Framework.Color}       fillColor       Rectangle fill color.
             * @param   {?Microsoft.Xna.Framework.Color}      outlineColor    Rectangle outline color.
             * @param   {number}                              outlineWidth    Rectangle outline width (0 for no outline).
             * @param   {?Microsoft.Xna.Framework.Vector2}    size            Rectangle size in pixels.
             * @param   {FaceUI.Entities.Anchor}              anchor          Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset          Offset from position anchor.
             * @return  {void}
             */
            $ctor3: function (fillColor, outlineColor, outlineWidth, size, anchor, offset) {
                if (outlineColor === void 0) { outlineColor = null; }
                if (outlineWidth === void 0) { outlineWidth = 1; }
                if (size === void 0) { size = null; }
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }
                var $t;

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                this.UpdateStyle(FaceUI.Entities.ColoredRectangle.DefaultStyle);
                this.FillColor = fillColor.$clone();
                this.OutlineColor = ($t = outlineColor, $t != null ? $t : Microsoft.Xna.Framework.Color.Black);
                this.OutlineWidth = outlineWidth;
            },
            /**
             * Create the rectangle with outline and fill colors.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ColoredRectangle
             * @memberof FaceUI.Entities.ColoredRectangle
             * @param   {Microsoft.Xna.Framework.Color}       fillColor       Rectangle fill color.
             * @param   {Microsoft.Xna.Framework.Color}       outlineColor    Rectangle outline color.
             * @param   {Microsoft.Xna.Framework.Vector2}     size            Rectangle size in pixels.
             * @param   {FaceUI.Entities.Anchor}              anchor          Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset          Offset from position anchor.
             * @return  {void}
             */
            $ctor1: function (fillColor, outlineColor, size, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                this.UpdateStyle(FaceUI.Entities.ColoredRectangle.DefaultStyle);
                this.FillColor = fillColor.$clone();
                this.OutlineColor = outlineColor.$clone();
            },
            /**
             * Create the rectangle with just fill color.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ColoredRectangle
             * @memberof FaceUI.Entities.ColoredRectangle
             * @param   {Microsoft.Xna.Framework.Color}       fillColor    Rectangle fill color.
             * @param   {Microsoft.Xna.Framework.Vector2}     size         Rectangle size in pixels.
             * @param   {FaceUI.Entities.Anchor}              anchor       Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset       Offset from position anchor.
             * @return  {void}
             */
            $ctor2: function (fillColor, size, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                this.UpdateStyle(FaceUI.Entities.ColoredRectangle.DefaultStyle);
                this.FillColor = fillColor.$clone();
                this.OutlineWidth = 0;
            },
            /**
             * Create default colored rectangle.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ColoredRectangle
             * @memberof FaceUI.Entities.ColoredRectangle
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.ColoredRectangle.$ctor3.call(this, Microsoft.Xna.Framework.Color.White);
            },
            /**
             * Create the rectangle with default styling.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ColoredRectangle
             * @memberof FaceUI.Entities.ColoredRectangle
             * @param   {Microsoft.Xna.Framework.Vector2}     size      Rectangle size in pixels.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from position anchor.
             * @return  {void}
             */
            $ctor4: function (size, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                this.UpdateStyle(FaceUI.Entities.ColoredRectangle.DefaultStyle);
            }
        },
        methods: {
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.ColoredRectangle
             * @memberof FaceUI.Entities.ColoredRectangle
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // get outline width
                var outlineWidth = this.OutlineWidth;

                // draw outline
                if (outlineWidth > 0) {
                    var outlineDest = this._destRect.$clone();
                    outlineDest.X = (outlineDest.X - outlineWidth) | 0;
                    outlineDest.Y = (outlineDest.Y - outlineWidth) | 0;
                    outlineDest.Width = (outlineDest.Width + (Bridge.Int.mul(outlineWidth, 2))) | 0;
                    outlineDest.Height = (outlineDest.Height + (Bridge.Int.mul(outlineWidth, 2))) | 0;
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, outlineDest.$clone(), this.OutlineColor.$clone());
                }

                // get fill color
                var fill = this.FillColor.$clone();

                // draw the rectangle
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, this._destRect.$clone(), fill.$clone());

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            }
        }
    });

    /**
     * DropDown is just like a list, but it only shows the currently selected value unless clicked on (the list is
     only revealed while interacted with).
     *
     * @public
     * @class FaceUI.Entities.DropDown
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.DropDown", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default style for the dropdown itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DropDown
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Default styling for dropdown labels. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DropDown
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultParagraphStyle: null,
                /**
                 * Default styling for the dropdown currently-selected label. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DropDown
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultSelectedParagraphStyle: null,
                /**
                 * Default height, in pixels, of the selected text panel.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DropDown
                 * @default 67
                 * @type number
                 */
                SelectedPanelHeight: 0,
                /**
                 * Size of the arrow to show on the side of the Selected Text Panel.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.DropDown
                 * @default 30
                 * @type number
                 */
                ArrowSize: 0
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultParagraphStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultSelectedParagraphStyle = new FaceUI.Entities.StyleSheet();
                    this.SelectedPanelHeight = 67;
                    this.ArrowSize = 30;
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.DropDown);
                }
            }
        },
        fields: {
            _placeholderText: null,
            _perItemCallbacks: null,
            _lastSelected: 0,
            _selectedTextPanel: null,
            _selectedTextParagraph: null,
            _arrowDownImage: null,
            _selectList: null,
            /**
             * If true, will auto-set the internal list height based on number of options.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @default false
             * @type boolean
             */
            AutoSetListHeight: false,
            /**
             * If set to true, whenever user select an item it will trigger event but jump back to placeholder value.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @default false
             * @type boolean
             */
            DontKeepSelection: false,
            /**
             * Special callback to execute when list size changes.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @type FaceUI.EventCallback
             */
            OnListChange: null
        },
        props: {
            /**
             * Default text to show when no value is selected from the list.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @function DefaultText
             * @type string
             */
            DefaultText: {
                get: function () {
                    return this._placeholderText;
                },
                set: function (value) {
                    this._placeholderText = value;
                }
            },
            /**
             * Get the selected text panel (what's shown when DropDown is closed).
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function SelectedTextPanel
             * @type FaceUI.Entities.Panel
             */
            SelectedTextPanel: {
                get: function () {
                    return this._selectedTextPanel;
                }
            },
            /**
             * If true and user clicks on the item currently selected item, it will still invoke value change event as if 
             a new value was selected.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @function AllowReselectValue
             * @type boolean
             */
            AllowReselectValue: {
                get: function () {
                    return this._selectList.AllowReselectValue;
                },
                set: function (value) {
                    this._selectList.AllowReselectValue = value;
                }
            },
            /**
             * Get the drop-down list component.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function SelectList
             * @type FaceUI.Entities.SelectList
             */
            SelectList: {
                get: function () {
                    return this._selectList;
                }
            },
            /**
             * Get the selected text panel paragraph (the text that's shown when DropDown is closed).
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function SelectedTextPanelParagraph
             * @type FaceUI.Entities.Paragraph
             */
            SelectedTextPanelParagraph: {
                get: function () {
                    return this._selectedTextParagraph;
                }
            },
            /**
             * Get the image entity of the arrow on the side of the Selected Text Panel.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function ArrowDownImage
             * @type FaceUI.Entities.Image
             */
            ArrowDownImage: {
                get: function () {
                    return this._arrowDownImage;
                }
            },
            /**
             * Is the DropDown list currentle opened (visible).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @function ListVisible
             * @type boolean
             */
            ListVisible: {
                get: function () {
                    return this._selectList.Visible;
                },
                set: function (value) {
                    // show / hide list
                    this._selectList.Visible = value;
                    this.OnDropDownVisibilityChange();
                }
            },
            /**
             * Set entity render and update priority.
             DropDown entity override this function to give some bonus priority, since when list is opened it needs to override entities
             under it, which usually have bigger index in container.
             *
             * @instance
             * @protected
             * @override
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function Priority
             * @type number
             */
            Priority: {
                get: function () {
                    return ((((100 - this._indexInParent) | 0) + this.PriorityBonus) | 0);
                }
            },
            /**
             * Return if currently have a selected value.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function HasSelectedValue
             * @type boolean
             */
            HasSelectedValue: {
                get: function () {
                    return this.SelectedIndex !== -1;
                }
            },
            /**
             * Currently selected item value (or null if none is selected).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @function SelectedValue
             * @type string
             */
            SelectedValue: {
                get: function () {
                    return this._selectList.SelectedValue;
                },
                set: function (value) {
                    this._selectList.SelectedValue = value;
                }
            },
            /**
             * Currently selected item index (or -1 if none is selected).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @function SelectedIndex
             * @type number
             */
            SelectedIndex: {
                get: function () {
                    return this._selectList.SelectedIndex;
                },
                set: function (value) {
                    this._selectList.SelectedIndex = value;
                }
            },
            /**
             * Current scrollbar position.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.DropDown
             * @function ScrollPosition
             * @type number
             */
            ScrollPosition: {
                get: function () {
                    return this._selectList.ScrollPosition;
                },
                set: function (value) {
                    this._selectList.ScrollPosition = value;
                }
            },
            /**
             * How many items currently in the list.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function Count
             * @type number
             */
            Count: {
                get: function () {
                    return this._selectList.Count;
                }
            },
            /**
             * Is the list currently empty.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.DropDown
             * @function Empty
             * @type boolean
             */
            Empty: {
                get: function () {
                    return this._selectList.Empty;
                }
            }
        },
        ctors: {
            init: function () {
                this._placeholderText = "Click to Select";
                this._perItemCallbacks = new (System.Collections.Generic.Dictionary$2(System.String,Function))();
                this._lastSelected = -1;
                this.AutoSetListHeight = false;
                this.DontKeepSelection = false;
            },
            /**
             * Create the DropDown list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {Microsoft.Xna.Framework.Vector2}     size         List size (refers to the whole size of the list + the header when dropdown list is opened).
             * @param   {FaceUI.Entities.Anchor}              anchor       Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset       Offset from anchor position.
             * @param   {FaceUI.Entities.PanelSkin}           skin         Panel skin to use for this DropDown list and header.
             * @param   {?FaceUI.Entities.PanelSkin}          listSkin     An optional skin to use for the dropdown list only (if you want a different skin for the list).
             * @param   {boolean}                             showArrow    If true, will show an up/down arrow next to the dropdown text.
             * @return  {void}
             */
            $ctor1: function (size, anchor, offset, skin, listSkin, showArrow) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }
                if (skin === void 0) { skin = 4; }
                if (listSkin === void 0) { listSkin = null; }
                if (showArrow === void 0) { showArrow = true; }
                var $t, $t1;

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                // default padding of self is 0
                this.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();

                // to get collision right when list is opened
                this.UseActualSizeForCollision = true;

                if (!FaceUI.UserInterface.Active._isDeserializing) {

                    // create the panel and paragraph used to show currently selected value (what's shown when drop-down is closed)
                    this._selectedTextPanel = new FaceUI.Entities.Panel.$ctor1(new Microsoft.Xna.Framework.Vector2.$ctor2(0, FaceUI.Entities.DropDown.SelectedPanelHeight), skin, FaceUI.Entities.Anchor.TopLeft);
                    this._selectedTextParagraph = FaceUI.UserInterface.DefaultParagraph("", FaceUI.Entities.Anchor.CenterLeft, void 0, void 0, void 0, void 0);
                    this._selectedTextParagraph.UseActualSizeForCollision = false;
                    this._selectedTextParagraph.UpdateStyle(FaceUI.Entities.SelectList.DefaultParagraphStyle);
                    this._selectedTextParagraph.UpdateStyle(FaceUI.Entities.DropDown.DefaultParagraphStyle);
                    this._selectedTextParagraph.UpdateStyle(FaceUI.Entities.DropDown.DefaultSelectedParagraphStyle);
                    this._selectedTextParagraph.Identifier = "_selectedTextParagraph";
                    this._selectedTextPanel.AddChild(this._selectedTextParagraph, true);
                    this._selectedTextPanel._hiddenInternalEntity = true;
                    this._selectedTextPanel.Identifier = "_selectedTextPanel";

                    // create the arrow down icon
                    this._arrowDownImage = new FaceUI.Entities.Image.$ctor1(FaceUI.Resources.ArrowDown, new Microsoft.Xna.Framework.Vector2.$ctor2(FaceUI.Entities.DropDown.ArrowSize, FaceUI.Entities.DropDown.ArrowSize), FaceUI.Entities.ImageDrawMode.Stretch, FaceUI.Entities.Anchor.CenterRight, new Microsoft.Xna.Framework.Vector2.$ctor2(-10, 0));
                    this._selectedTextPanel.AddChild(this._arrowDownImage, true);
                    this._arrowDownImage._hiddenInternalEntity = true;
                    this._arrowDownImage.Identifier = "_arrowDownImage";
                    this._arrowDownImage.Visible = showArrow;

                    // create the list component
                    this._selectList = new FaceUI.Entities.SelectList.$ctor2(new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, size.Y), FaceUI.Entities.Anchor.TopCenter, Microsoft.Xna.Framework.Vector2.Zero.$clone(), ($t = listSkin, $t != null ? $t : skin));

                    // update list offset and space before
                    this._selectList.Offset = new Microsoft.Xna.Framework.Vector2.$ctor2(0, FaceUI.Entities.DropDown.SelectedPanelHeight);
                    this._selectList.SpaceBefore = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                    this._selectList._hiddenInternalEntity = true;
                    this._selectList.Identifier = "_selectList";

                    // add the header and select list as children
                    this.AddChild(this._selectedTextPanel);
                    this.AddChild(this._selectList);

                    this.InitEvents();
                } else {
                    this._selectList = new FaceUI.Entities.SelectList.$ctor2(new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, size.Y), FaceUI.Entities.Anchor.TopCenter, Microsoft.Xna.Framework.Vector2.Zero.$clone(), ($t1 = listSkin, $t1 != null ? $t1 : skin));
                }
            },
            /**
             * Create default dropdown.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.DropDown.$ctor1.call(this, new Microsoft.Xna.Framework.Vector2.$ctor2(0, 200));
            }
        },
        methods: {
            /**
             * Init event-related stuff after all sub-entities are created.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            InitEvents: function () {
                var $t;
                // add callback on list value change
                this._selectList.OnValueChange = Bridge.fn.bind(this, $asm.$.FaceUI.Entities.DropDown.f1);

                // on click, always hide the selectlist
                this._selectList.OnClick = Bridge.fn.bind(this, $asm.$.FaceUI.Entities.DropDown.f2);

                // hide the list by default
                this._selectList.Visible = false;

                // setup the callback to show / hide the list when clicking the dropbox
                this._selectedTextPanel.OnClick = Bridge.fn.bind(this, $asm.$.FaceUI.Entities.DropDown.f3);

                // set starting text
                this._selectedTextParagraph.Text = (($t = this.SelectedValue, $t != null ? $t : this.DefaultText));

                // update styles
                this._selectList.UpdateStyle(FaceUI.Entities.DropDown.DefaultStyle);

                // make the list events trigger the dropdown events
                this._selectList.PropagateEventsTo$1(this);

                // make the selected value panel trigger the dropdown events
                this._selectedTextPanel.PropagateEventsTo(this);
            },
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.Entity.prototype.InitAfterDeserialize.call(this);

                this._selectedTextPanel = this.Find(FaceUI.Entities.Panel, "_selectedTextPanel");
                this._selectedTextPanel._hiddenInternalEntity = true;

                this._arrowDownImage = this._selectedTextPanel.Find(FaceUI.Entities.Image, "_arrowDownImage");
                this._arrowDownImage._hiddenInternalEntity = true;

                this._selectList = this.Find(FaceUI.Entities.SelectList, "_selectList");
                this._selectList._hiddenInternalEntity = true;

                this._selectedTextParagraph = Bridge.as(this._selectedTextPanel.Find$1("_selectedTextParagraph"), FaceUI.Entities.Paragraph);

                this.InitEvents();
            },
            /**
             * Set special callback to trigger if a specific value is selected.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {string}           itemValue    Item text to trigger event.
             * @param   {System.Action}    action       Event to trigger.
             * @return  {void}
             */
            OnSelectedSpecificItem: function (itemValue, action) {
                this._perItemCallbacks.set(itemValue, action);
            },
            /**
             * Clear all the per-item specific events.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            ClearSpecificItemEvents: function () {
                this._perItemCallbacks.clear();
            },
            /**
             * Return the actual dest rect for auto-anchoring purposes.
             This is useful for things like DropDown, that when opened they take a larger part of the screen, but we don't
             want it to push down other entities.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {Microsoft.Xna.Framework.Rectangle}
             */
            GetDestRectForAutoAnchors: function () {
                this._selectedTextPanel.UpdateDestinationRectsIfDirty();
                return this._selectedTextPanel.GetActualDestRect();
            },
            /**
             * Test if a given point is inside entity's boundaries.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {Microsoft.Xna.Framework.Vector2}    point    Point to test.
             * @return  {boolean}                                     True if point is in entity's boundaries (destination rectangle)
             */
            IsTouching: function (point) {
                // adjust scrolling
                point = Microsoft.Xna.Framework.Vector2.op_Addition(point.$clone(), this._lastScrollVal.ToVector2());

                // get destination rect based on whether the dropdown is opened or closed
                var rect = new Microsoft.Xna.Framework.Rectangle();

                // if list is currently visible, use the full size
                if (this.ListVisible) {
                    this._selectList.UpdateDestinationRectsIfDirty();
                    rect = this._selectList.GetActualDestRect();
                    rect.Height = (rect.Height + FaceUI.Entities.DropDown.SelectedPanelHeight) | 0;
                    rect.Y = (rect.Y - FaceUI.Entities.DropDown.SelectedPanelHeight) | 0;
                } else {
                    this._selectedTextPanel.UpdateDestinationRectsIfDirty();
                    rect = this._selectedTextPanel.GetActualDestRect();
                }

                // now test detection
                return (point.X >= rect.Left && point.X <= rect.Right && point.Y >= rect.Top && point.Y <= rect.Bottom);
            },
            /**
             * Called whenever the dropdown list is shown / hidden.
             Note: called *after* _isListVisible is set.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            OnDropDownVisibilityChange: function () {
                // if during deserialize, skip
                if (FaceUI.UserInterface.Active._isDeserializing) {
                    return;
                }

                // update arrow image
                this._arrowDownImage.Texture = this.ListVisible ? FaceUI.Resources.ArrowUp : FaceUI.Resources.ArrowDown;

                // focus on selectlist
                this._selectList.IsFocused = true;
                FaceUI.UserInterface.Active.ActiveEntity = this._selectList;

                // update destination rectangles
                this._selectList.UpdateDestinationRects();

                // if turned visible, scroll to selected
                if (this._selectList.Visible) {
                    this._selectList.ScrollToSelected();
                }

                // mark self as dirty
                this.MarkAsDirty();

                // do auto-height
                if (this.AutoSetListHeight) {
                    this._selectList.MatchHeightToList();
                }
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                if (this.SelectedIndex === -1 && !Bridge.referenceEquals(this._selectedTextParagraph.Text, this._placeholderText)) {
                    this._selectedTextParagraph.Text = this._placeholderText;
                }
            },
            /**
             * Called every frame after update.
             DropDown entity override this function to close the list if necessary and to remove the selected item panel from self.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            DoAfterUpdate: function () {
                // if list currently visible we want to check if we need to close it
                if (this.ListVisible) {
                    // check if mouse down and not inside list
                    var mousePosition = this.GetMousePos();
                    if (this.MouseInput.FaceUI$IMouseInput$AnyMouseButtonPressed() && !this.IsTouching(mousePosition.$clone())) {
                        this.ListVisible = false;
                    }
                }

                // call base do-before-update
                FaceUI.Entities.Entity.prototype.DoAfterUpdate.call(this);

                // do we have a selected item?
                if (this.HasSelectedValue) {
                    // trigger per-item events, but only if value changed
                    if (this.SelectedIndex !== this._lastSelected) {
                        var callback = { v : null };
                        if (this._perItemCallbacks.tryGetValue(this._selectList.SelectedValue, callback)) {
                            callback.v();
                        }
                    }

                    // if set to not keep selected value, return to original placeholder
                    if (this.DontKeepSelection && this.SelectedIndex !== -1) {
                        this.Unselect();
                    }
                }

                // store last known index
                this._lastSelected = this.SelectedIndex;
            },
            /**
             * Clear current selection.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            Unselect: function () {
                this._selectList.Unselect();
            },
            /**
             * Add value to list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {string}    value    Value to add.
             * @return  {void}
             */
            AddItem: function (value) {
                this._selectList.AddItem(value);
            },
            /**
             * Add value to list at a specific index.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {string}    value    Value to add.
             * @param   {number}    index    Index to insert the new item into.
             * @return  {void}
             */
            AddItem$1: function (value, index) {
                this._selectList.AddItem$1(value, index);
            },
            /**
             * Remove value from the list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {string}    value    Value to remove.
             * @return  {void}
             */
            RemoveItem$1: function (value) {
                this._selectList.RemoveItem$1(value);
            },
            /**
             * Remove item from the list, by index.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @param   {number}    index    Index of the item to remove.
             * @return  {void}
             */
            RemoveItem: function (index) {
                this._selectList.RemoveItem(index);
            },
            /**
             * Remove all items from the list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            ClearItems: function () {
                this._selectList.ClearItems();
            },
            /**
             * Is the list a natrually-interactable entity.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {boolean}        True.
             */
            IsNaturallyInteractable: function () {
                return true;
            },
            /**
             * Move scrollbar to currently selected item.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            ScrollToSelected: function () {
                this._selectList.ScrollToSelected();
            },
            /**
             * Move scrollbar to last item in list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.DropDown
             * @memberof FaceUI.Entities.DropDown
             * @return  {void}
             */
            scrollToEnd: function () {
                this._selectList.scrollToEnd();
            }
        }
    });

    Bridge.ns("FaceUI.Entities.DropDown", $asm.$);

    Bridge.apply($asm.$.FaceUI.Entities.DropDown, {
        f1: function (entity) {
            var $t;
            // hide list
            this.ListVisible = false;

            // set selected text
            this._selectedTextParagraph.Text = (($t = this.SelectedValue, $t != null ? $t : this.DefaultText));
        },
        f2: function (entity) {
            this.ListVisible = false;
        },
        f3: function (self) {
            // change visibility
            this.ListVisible = !this.ListVisible;
        }
    });

    /**
     * Paragraph is a renderable text. It can be multiline, wrap words, have outline, etc.
     *
     * @public
     * @class FaceUI.Entities.Paragraph
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.Paragraph", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default styling for paragraphs. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Paragraph
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * If the outline width is less than this value, the outline will be optimized but will appear slightly less sharp on corners.
                 *
                 * @static
                 * @protected
                 * @memberof FaceUI.Entities.Paragraph
                 * @default 1
                 * @type number
                 */
                MaxOutlineWidthToOptimize: 0,
                /**
                 * Base font size. Change this property to affect the size of all paragraphs and other text entities.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Paragraph
                 * @default 1.0
                 * @type number
                 */
                BaseSize: 0
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.MaxOutlineWidthToOptimize = 1;
                    this.BaseSize = 1.0;
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Paragraph);
                }
            }
        },
        fields: {
            /**
             * Paragraph's current text.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Paragraph
             * @default ""
             * @type string
             */
            _text: null,
            /**
             * Optional background color for text.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Color
             */
            BackgroundColor: null,
            /**
             * Extra padding for background color.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Point
             */
            BackgroundColorPadding: null,
            /**
             * An optional font you can set to override the default fonts.
             NOTE! Only monospace fonts are supported!
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Graphics.SpriteFont
             */
            FontOverride: null,
            SingleCharacterSize: null,
            /**
             * If true and have background color, will use the paragraph box size for it instead of the text actual size.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @default false
             * @type boolean
             */
            BackgroundColorUseBoxSize: false,
            _wrapWords: false,
            /**
             * Text actual destination rect.
             *
             * @instance
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Rectangle
             */
            _actualDestRect: null,
            /**
             * Actual processed text to display (after word-wrap etc).
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Paragraph
             * @type string
             */
            _processedText: null,
            /**
             * Current font used.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Graphics.SpriteFont
             */
            _currFont: null,
            /**
             * Calculated, final text scale.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Paragraph
             * @type number
             */
            _actualScale: 0,
            /**
             * Calculated text position.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Vector2
             */
            _position: null,
            /**
             * Calculated font draw origin.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Paragraph
             * @type Microsoft.Xna.Framework.Vector2
             */
            _fontOrigin: null,
            _breakWordsIfMust: false,
            _addHyphenWhenBreakWord: false
        },
        props: {
            /**
             * Get / Set the paragraph text.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @function Text
             * @type string
             */
            Text: {
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._text, value)) {
                        this._text = value;
                        this.MarkAsDirty();
                    }
                }
            },
            /**
             * Get / Set word wrap mode.
             If true, and text exceeded destination width, the paragraph will wrap words by adding line breaks where needed.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @function WrapWords
             * @type boolean
             */
            WrapWords: {
                get: function () {
                    return this._wrapWords;
                },
                set: function (value) {
                    this._wrapWords = value;
                    this.MarkAsDirty();
                }
            },
            /**
             * If WrapWords is true and there's a word that's too long (eg longer than max width), will break the word in the middle.
             If false, word wrap will only break lines in between words (eg spaces) and never break words.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @function BreakWordsIfMust
             * @type boolean
             */
            BreakWordsIfMust: {
                get: function () {
                    return this._breakWordsIfMust;
                },
                set: function (value) {
                    this._breakWordsIfMust = value;
                    this.MarkAsDirty();
                }
            },
            /**
             * If true and a long word is broken due to word wrap, will add hyphen at the breaking point.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @function AddHyphenWhenBreakWord
             * @type boolean
             */
            AddHyphenWhenBreakWord: {
                get: function () {
                    return this._addHyphenWhenBreakWord;
                },
                set: function (value) {
                    this._addHyphenWhenBreakWord = value;
                    this.MarkAsDirty();
                }
            },
            /**
             * Get how many characters can fit in a single line.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Paragraph
             * @function MaxCharactersInLine
             * @type number
             */
            MaxCharactersInLine: {
                get: function () {
                    return ((Bridge.Int.div(this.GetActualDestRect().Width, Bridge.Int.clip32(this.GetCharacterActualSize().X))) | 0);
                }
            },
            /**
             * Current font style - this is just a sugarcoat to access the default font style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @function TextStyle
             * @type FaceUI.Entities.FontStyle
             */
            TextStyle: {
                get: function () {
                    return this.GetActiveStyle("FontStyle").asInt;
                },
                set: function (value) {
                    this.SetStyleProperty("FontStyle", new FaceUI.DataTypes.StyleProperty.$ctor4(value));
                }
            },
            /**
             * Should we align text to center - this is just a sugarcoat to access the default force-align-to-center style property.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Paragraph
             * @function AlignToCenter
             * @type boolean
             */
            AlignToCenter: {
                get: function () {
                    return this.GetActiveStyle("ForceAlignCenter").asBool;
                },
                set: function (value) {
                    this.SetStyleProperty("ForceAlignCenter", new FaceUI.DataTypes.StyleProperty.$ctor3(value));
                }
            }
        },
        ctors: {
            init: function () {
                this.BackgroundColor = new Microsoft.Xna.Framework.Color();
                this.BackgroundColorPadding = new Microsoft.Xna.Framework.Point();
                this.SingleCharacterSize = new Microsoft.Xna.Framework.Vector2();
                this._actualDestRect = new Microsoft.Xna.Framework.Rectangle();
                this._position = new Microsoft.Xna.Framework.Vector2();
                this._fontOrigin = new Microsoft.Xna.Framework.Vector2();
                this._text = "";
                this.BackgroundColor = Microsoft.Xna.Framework.Color.Transparent.$clone();
                this.BackgroundColorPadding = new Microsoft.Xna.Framework.Point.$ctor2(10, 10);
                this.BackgroundColorUseBoxSize = false;
                this._wrapWords = true;
                this._breakWordsIfMust = true;
                this._addHyphenWhenBreakWord = true;
            },
            /**
             * Create the paragraph.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {string}                              text      Paragraph text (accept new line characters).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Paragraph size (note: not font size, but the region that will contain the paragraph).
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @param   {?number}                             scale     Optional font size.
             * @return  {void}
             */
            $ctor2: function (text, anchor, size, offset, scale) {
                if (anchor === void 0) { anchor = 9; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }
                if (scale === void 0) { scale = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                this.Text = text;
                this.UpdateStyle(FaceUI.Entities.Paragraph.DefaultStyle);
                if (scale != null) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.Scale, new FaceUI.DataTypes.StyleProperty.$ctor5(System.Nullable.getValue(scale)));
                }
                this.UpdateFontPropertiesIfNeeded();
            },
            /**
             * Create the paragraph with optional fill color and font size.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {string}                              text      Paragraph text (accept new line characters).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {Microsoft.Xna.Framework.Color}       color     Text fill color.
             * @param   {?number}                             scale     Optional font size.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Paragraph size (note: not font size, but the region that will contain the paragraph).
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (text, anchor, color, scale, size, offset) {
                if (scale === void 0) { scale = null; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }

                FaceUI.Entities.Paragraph.$ctor2.call(this, text, anchor, size, offset);
                this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.FillColor, new FaceUI.DataTypes.StyleProperty.$ctor1(color.$clone()));
                if (scale != null) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.Scale, new FaceUI.DataTypes.StyleProperty.$ctor5(System.Nullable.getValue(scale)));
                }
                this.UpdateFontPropertiesIfNeeded();
            },
            /**
             * Create default paragraph without text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Paragraph.$ctor2.call(this, "");
            }
        },
        methods: {
            /**
             * Get the actual destination rect that this paragraph takes (based on text content, font size, and word wrap).
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {Microsoft.Xna.Framework.Rectangle}        Actual paragraph destination rect.
             */
            GetActualDestRect: function () {
                return this._actualDestRect.$clone();
            },
            /**
             * Get the size, in pixels, of a single character in paragraph.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {Microsoft.Xna.Framework.Vector2}        Actual size, in pixels, of a single character.
             */
            GetCharacterActualSize: function () {
                var font = this.GetCurrFont();
                var scale = this.Scale * FaceUI.Entities.Paragraph.BaseSize * this.GlobalScale;
                return Microsoft.Xna.Framework.Vector2.op_Multiply$1(this.SingleCharacterSize.$clone(), scale);
            },
            /**
             * Wrap text to fit destination rect.
             Most if this code is coming from: http://stackoverflow.com/questions/15986473/how-do-i-implement-word-wrap
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {Microsoft.Xna.Framework.Graphics.SpriteFont}    font            Font of the text to wrap.
             * @param   {string}                                         text            Text content.
             * @param   {number}                                         maxLineWidth    Max line width to wrap.
             * @param   {number}                                         fontSize        Font scale (scale you are about to use when drawing the text).
             * @return  {string}                                                         Text that is wrapped to fit the given length (by adding line breaks at the right places).
             */
            WrapText: function (font, text, maxLineWidth, fontSize) {
                var $t, $t1;
                // invalid width (can happen during init steps - skip
                if (maxLineWidth <= 0) {
                    return text;
                }

                // create string to return as result
                var ret = new System.Text.StringBuilder("");

                // if text got line breaks, break into lines and process them seperately
                if (System.String.contains(text,"\n")) {
                    // break into lines
                    var lines = System.String.split(text, [10].map(function (i) {{ return String.fromCharCode(i); }}));

                    // iterate lines and wrap them
                    $t = Bridge.getEnumerator(lines);
                    try {
                        while ($t.moveNext()) {
                            var line = $t.Current;
                            ret.appendLine(this.WrapText(font, line, maxLineWidth, fontSize));
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    // remove the last extra linebreak that was added in this process and return.
                    ret = ret.remove(((ret.getLength() - 1) | 0), 1);
                    return ret.toString();
                }

                // if got here it means we are processing a single line. break it into words.
                // note: we use a list so we can push words in the middle while iterating (to handle words too long).
                var words = new (System.Collections.Generic.List$1(System.String)).$ctor1(System.String.split(text, [32].map(function (i) {{ return String.fromCharCode(i); }})));

                // iterate words
                var currWidth = 0;
                for (var i = 0; i < words.Count; i = (i + 1) | 0) {
                    // is it last word?
                    var lastWord = (i === ((words.Count - 1) | 0));

                    // get current word and its width
                    var word = words.getItem(i);
                    var wordWidth = Bridge.Int.clip32((font.MeasureString(word).X + this.SingleCharacterSize.X) * fontSize);

                    // special case: word itself is longer than line width
                    if (this.BreakWordsIfMust && wordWidth >= maxLineWidth && word.length >= 4) {
                        // find breaking position
                        var breakPos = 0;
                        var currWordWidth = Bridge.Int.clip32(this.SingleCharacterSize.X * fontSize);
                        $t1 = Bridge.getEnumerator(word);
                        try {
                            while ($t1.moveNext()) {
                                var c = $t1.Current;
                                currWordWidth = (currWordWidth + (Bridge.Int.clip32(font.MeasureString(String.fromCharCode(c)).X * fontSize))) | 0;
                                if (currWordWidth >= maxLineWidth) {
                                    break;
                                }
                                breakPos = (breakPos + 1) | 0;
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                        breakPos = (breakPos - 3) | 0;
                        if (breakPos >= ((word.length - 1) | 0)) {
                            breakPos = (breakPos - 2) | 0;
                        }
                        if (breakPos <= 0) {
                            breakPos = 1;
                        }

                        // break the word into two and add to the list of words after this position.
                        // we will process them in next loop iterations.
                        var firstHalf = word.substr(0, breakPos);
                        var secondHalf = word.substr(breakPos, ((word.length - breakPos) | 0));
                        if (this.AddHyphenWhenBreakWord) {
                            firstHalf = (firstHalf || "") + String.fromCharCode(45);
                        }
                        words.insert(((i + 1) | 0), firstHalf);
                        words.insert(((i + 2) | 0), secondHalf);

                        // continue to skip current word (it will be added later, with its broken parts)
                        continue;
                    }

                    // add to total width
                    currWidth = (currWidth + wordWidth) | 0;

                    // did overflow max width? add line break and reset current width.
                    if (currWidth >= maxLineWidth) {
                        ret.append(String.fromCharCode(10));
                        ret.append(word);
                        if (!lastWord) {
                            ret.append(String.fromCharCode(32));
                        }
                        currWidth = wordWidth;
                    } else {
                        ret.append(word);
                        if (!lastWord) {
                            ret.append(String.fromCharCode(32));
                        }
                    }
                }

                // remove the extra space that was appended to the end during the process and return wrapped text.
                //ret = ret.Remove(ret.Length - 1, 1);

                // special case - if last word was just the size of the line, it will add a useless trailing \n and create double line breaks.
                // remove that extra line break.
                if (ret.getLength() > 0 && ret.getChar(((ret.getLength() - 1) | 0)) === 10) {
                    ret = ret.remove(((ret.getLength() - 1) | 0), 1);
                }

                // return the final wrapped text
                return ret.toString();
            },
            /**
             * Return the processed text that is actually displayed on screen, after word-wrap etc.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {string}        Actual displayed text with word-wrap and other runtime processing.
             */
            GetProcessedText: function () {
                return this._processedText;
            },
            /**
             * Get the currently active font for this paragraph.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {Microsoft.Xna.Framework.Graphics.SpriteFont}        Current font.
             */
            GetCurrFont: function () {
                return this.FontOverride || FaceUI.Resources.Fonts[System.Array.index(this.TextStyle, FaceUI.Resources.Fonts)];
            },
            /**
             * Update dest rect and internal dest rect.
             This is called internally whenever a change is made to the entity or its parent.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {void}
             */
            UpdateDestinationRects: function () {
                // call base function
                FaceUI.Entities.Entity.prototype.UpdateDestinationRects.call(this);

                // do extra preperation for text entities
                this.CalcTextActualRectWithWrap();
            },
            /**
             * Update font-related properties, if needed.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {void}
             */
            UpdateFontPropertiesIfNeeded: function () {
                var font = this.GetCurrFont();
                if (!Bridge.referenceEquals(font, this._currFont)) {
                    // mark as dirty so we'll recalculate positions and line breaks
                    this.MarkAsDirty();

                    // set font and get single character size
                    this._currFont = font;
                    this.SingleCharacterSize = this._currFont.MeasureString(" ");

                    // sanity test
                    if ((this.SingleCharacterSize.X * 2) !== this._currFont.MeasureString("!.").X) {
                        throw new FaceUI.Exceptions.InvalidValueException.$ctor1("Cannot use non-monospace fonts!");
                    }
                }
            },
            /**
             * Calculate the paragraph actual destination rect with word-wrap and other factors taken into consideration.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @return  {void}
             */
            CalcTextActualRectWithWrap: function () {
                // update font properties
                this.UpdateFontPropertiesIfNeeded();

                // calc actual scale
                var actualScale = this.Scale * FaceUI.Entities.Paragraph.BaseSize * this.GlobalScale;
                if (actualScale !== this._actualScale) {
                    this._actualScale = actualScale;
                    this.MarkAsDirty();
                }

                // get text and add things like line-breaks to wrap words etc.
                var newProcessedText = this.Text;
                if (this.WrapWords) {
                    newProcessedText = this.WrapText(this._currFont, newProcessedText, this._destRect.Width, this._actualScale);
                }

                // if processed text changed
                if (!Bridge.referenceEquals(newProcessedText, this._processedText)) {
                    this._processedText = newProcessedText;
                    this.MarkAsDirty();
                }

                // due to the mechanism of calculating destination rect etc based on parent and anchor,
                // to set text alignment all we need to do is keep the size the actual text size.
                // so we just update _size every frame and the text alignemtn (left, right, center..) fix itself by the destination rect.
                this._fontOrigin = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                this._position = new Microsoft.Xna.Framework.Vector2.$ctor2(this._destRect.X, this._destRect.Y);
                var size = this._currFont.MeasureString(this._processedText);

                // set position and origin based on anchor.
                // note: no top-left here because thats the default set above.
                var alreadyCentered = false;
                switch (this._anchor) {
                    case FaceUI.Entities.Anchor.Center: 
                        this._fontOrigin = Microsoft.Xna.Framework.Vector2.op_Division$1(size.$clone(), 2);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(((Bridge.Int.div(this._destRect.Width, 2)) | 0), ((Bridge.Int.div(this._destRect.Height, 2)) | 0)));
                        alreadyCentered = true;
                        break;
                    case FaceUI.Entities.Anchor.AutoCenter: 
                    case FaceUI.Entities.Anchor.TopCenter: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(size.X / 2, 0);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(((Bridge.Int.div(this._destRect.Width, 2)) | 0), 0.0));
                        alreadyCentered = true;
                        break;
                    case FaceUI.Entities.Anchor.TopRight: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(size.X, 0);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(this._destRect.Width, 0.0));
                        break;
                    case FaceUI.Entities.Anchor.BottomCenter: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(size.X / 2, size.Y);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(((Bridge.Int.div(this._destRect.Width, 2)) | 0), this._destRect.Height));
                        alreadyCentered = true;
                        break;
                    case FaceUI.Entities.Anchor.BottomRight: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(size.X, size.Y);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(this._destRect.Width, this._destRect.Height));
                        break;
                    case FaceUI.Entities.Anchor.BottomLeft: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, size.Y);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, this._destRect.Height));
                        break;
                    case FaceUI.Entities.Anchor.CenterLeft: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, size.Y / 2);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, ((Bridge.Int.div(this._destRect.Height, 2)) | 0)));
                        break;
                    case FaceUI.Entities.Anchor.CenterRight: 
                        this._fontOrigin = new Microsoft.Xna.Framework.Vector2.$ctor2(size.X, size.Y / 2);
                        this._position = Microsoft.Xna.Framework.Vector2.op_Addition(this._position.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(this._destRect.Width, ((Bridge.Int.div(this._destRect.Height, 2)) | 0)));
                        break;
                }

                // force center align
                if (this.AlignToCenter && !alreadyCentered) {
                    this._fontOrigin.X = size.X / 2;
                    this._position.X = (this._destRect.X + ((Bridge.Int.div(this._destRect.Width, 2)) | 0)) | 0;
                }

                // set actual height
                this._actualDestRect.X = (Bridge.Int.clip32(this._position.X) - Bridge.Int.clip32((this._fontOrigin.X * this._actualScale))) | 0;
                this._actualDestRect.Y = (Bridge.Int.clip32(this._position.Y) - Bridge.Int.clip32((this._fontOrigin.Y * this._actualScale))) | 0;
                this._actualDestRect.Width = Bridge.Int.clip32((size.X) * this._actualScale);
                this._actualDestRect.Height = Bridge.Int.clip32((size.Y) * this._actualScale);

                // apply min size
                if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.MinSize), null)) {
                    var minInPixels = this.CalcActualSizeInPixels(System.Nullable.getValue(this.MinSize).$clone());
                    this._actualDestRect.Width = Math.max(minInPixels.X, this._actualDestRect.Width);
                    this._actualDestRect.Height = Math.max(minInPixels.Y, this._actualDestRect.Height);
                }
                // apply max size
                if (System.Nullable.liftne(Microsoft.Xna.Framework.Vector2.op_Inequality, System.Nullable.lift1("$clone", this.MaxSize), null)) {
                    var maxInPixels = this.CalcActualSizeInPixels(System.Nullable.getValue(this.MaxSize).$clone());
                    this._actualDestRect.Width = Math.min(maxInPixels.X, this._actualDestRect.Width);
                    this._actualDestRect.Height = Math.min(maxInPixels.Y, this._actualDestRect.Height);
                }
            },
            /**
             * Draw entity outline. Note: in paragraph its a special case and we implement it inside the DrawEntity function.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @return  {void}
             */
            DrawEntityOutline: function (spriteBatch) { },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // update processed text if needed
                if (this._processedText == null) {
                    this.UpdateDestinationRects();
                }

                // draw background color
                if (this.BackgroundColor.A > 0) {
                    // get background color
                    var backColor = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(this.BackgroundColor.$clone());

                    // get destination rect to draw it
                    var rect = this.BackgroundColorUseBoxSize ? this._destRect : this._actualDestRect;

                    // fix height for box background and scaling
                    if (this.BackgroundColorUseBoxSize) {
                        rect.Height = Bridge.Int.clip32(rect.Height / this.GlobalScale);
                    }

                    // add padding
                    var padding = new Microsoft.Xna.Framework.Point.$ctor2(Bridge.Int.clip32(this.BackgroundColorPadding.X * this.GlobalScale), Bridge.Int.clip32(this.BackgroundColorPadding.Y * this.GlobalScale));
                    rect.Location = Microsoft.Xna.Framework.Point.op_Subtraction(rect.Location.$clone(), padding.$clone());
                    rect.Size = Microsoft.Xna.Framework.Point.op_Addition(rect.Size.$clone(), Microsoft.Xna.Framework.Point.op_Addition(padding.$clone(), padding.$clone()));

                    // draw background color
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(FaceUI.Resources.WhiteTexture, rect.$clone(), backColor.$clone());
                }

                // draw outilnes
                var outlineWidth = this.OutlineWidth;
                if (outlineWidth > 0) {
                    this.DrawTextOutline(spriteBatch, outlineWidth);
                }

                // get fill color
                var fillCol = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(this.FillColor.$clone());

                // draw text itself
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(this._currFont, this._processedText, this._position.$clone(), fillCol.$clone(), 0, this._fontOrigin.$clone(), this._actualScale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            },
            /**
             * Draw text outline with default params.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch     Spritebatch to use.
             * @param   {number}                              outlineWidth    Outline width.
             * @return  {void}
             */
            DrawTextOutline: function (spriteBatch, outlineWidth) {
                // get outline color
                var outlineColor = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(this.OutlineColor.$clone());
                this.DrawTextOutline$1(spriteBatch, this._processedText, outlineWidth, this._currFont, this._actualScale, this._position.$clone(), outlineColor.$clone(), this._fontOrigin.$clone());
            },
            /**
             * Draw text outline.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Paragraph
             * @memberof FaceUI.Entities.Paragraph
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}               spriteBatch     Sprite batch to use.
             * @param   {string}                                         text            Text to draw outline for.
             * @param   {number}                                         outlineWidth    Outline width.
             * @param   {Microsoft.Xna.Framework.Graphics.SpriteFont}    font            Text font.
             * @param   {number}                                         scale           Text absolute scale.
             * @param   {Microsoft.Xna.Framework.Vector2}                position        Text position.
             * @param   {Microsoft.Xna.Framework.Color}                  outlineColor    Outline color.
             * @param   {Microsoft.Xna.Framework.Vector2}                origin          Text origin.
             * @return  {void}
             */
            DrawTextOutline$1: function (spriteBatch, text, outlineWidth, font, scale, position, outlineColor, origin) {
                // for not-too-thick outline we render just two corners
                if (outlineWidth <= FaceUI.Entities.Paragraph.MaxOutlineWidthToOptimize) {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(font, text, Microsoft.Xna.Framework.Vector2.op_Addition(position.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.One.$clone(), outlineWidth)), outlineColor.$clone(), 0, origin.$clone(), scale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(font, text, Microsoft.Xna.Framework.Vector2.op_Subtraction(position.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.One.$clone(), outlineWidth)), outlineColor.$clone(), 0, origin.$clone(), scale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                } else {
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(font, text, Microsoft.Xna.Framework.Vector2.op_Addition(position.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.UnitX.$clone(), outlineWidth)), outlineColor.$clone(), 0, origin.$clone(), scale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(font, text, Microsoft.Xna.Framework.Vector2.op_Subtraction(position.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.UnitX.$clone(), outlineWidth)), outlineColor.$clone(), 0, origin.$clone(), scale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(font, text, Microsoft.Xna.Framework.Vector2.op_Addition(position.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.UnitY.$clone(), outlineWidth)), outlineColor.$clone(), 0, origin.$clone(), scale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(font, text, Microsoft.Xna.Framework.Vector2.op_Subtraction(position.$clone(), Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.UnitY.$clone(), outlineWidth)), outlineColor.$clone(), 0, origin.$clone(), scale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                }
            }
        }
    });

    /**
     * An horizontal line, used to separate between different sections of a panel or to emphasize headers.
     *
     * @public
     * @class FaceUI.Entities.HorizontalLine
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.HorizontalLine", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                FRAME_WIDTH: null,
                /**
                 * Default styling for the horizontal line. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.HorizontalLine
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.FRAME_WIDTH = new Microsoft.Xna.Framework.Vector2();
                    this.FRAME_WIDTH = new Microsoft.Xna.Framework.Vector2.$ctor2(0.2, 0.0);
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.HorizontalLine);
                }
            }
        },
        ctors: {
            /**
             * Create the horizontal line.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.HorizontalLine
             * @memberof FaceUI.Entities.HorizontalLine
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (anchor, offset) {
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, Microsoft.Xna.Framework.Vector2.Zero, anchor, offset);
                // locked by default, so we won't do events etc.
                this.Locked = true;

                // update style
                this.UpdateStyle(FaceUI.Entities.HorizontalLine.DefaultStyle);

                // get line texture and set default height
                var texture = FaceUI.Resources.HorizontalLineTexture;
                this._size.Y = texture.Height * 1.75;
            },
            /**
             * Create default horizontal line.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.HorizontalLine
             * @memberof FaceUI.Entities.HorizontalLine
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.HorizontalLine.$ctor1.call(this, FaceUI.Entities.Anchor.Auto);
            }
        },
        methods: {
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.HorizontalLine
             * @memberof FaceUI.Entities.HorizontalLine
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // get line texture
                var texture = FaceUI.Resources.HorizontalLineTexture;

                // draw panel
                FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, texture, this._destRect.$clone(), FaceUI.Entities.HorizontalLine.FRAME_WIDTH.$clone(), 1, this.FillColor.$clone());

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            }
        }
    });

    /**
     * A renderable image (draw custom texture on UI entities).
     *
     * @public
     * @class FaceUI.Entities.Image
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.Image", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default styling for images. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Image
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Image);
                }
            }
        },
        fields: {
            /**
             * How to draw the texture.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Image
             * @type FaceUI.Entities.ImageDrawMode
             */
            DrawMode: 0,
            /**
             * When in Panel draw mode, this will be the frame width in texture percents.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Image
             * @type Microsoft.Xna.Framework.Vector2
             */
            FrameWidth: null,
            /**
             * Texture to draw.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Image
             * @type Microsoft.Xna.Framework.Graphics.Texture2D
             */
            Texture: null,
            /**
             * If provided, will be used as a source rectangle when drawing images in Stretch mode.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Image
             * @type ?Microsoft.Xna.Framework.Rectangle
             */
            SourceRectangle: null
        },
        props: {
            /**
             * Get / set texture from name.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Image
             * @function TextureName
             * @type string
             */
            TextureName: {
                get: function () {
                    return this.Texture.Name;
                },
                set: function (value) {
                    this.Texture = FaceUI.Resources._content.Load(Microsoft.Xna.Framework.Graphics.Texture2D, value);
                }
            }
        },
        ctors: {
            init: function () {
                this.FrameWidth = new Microsoft.Xna.Framework.Vector2();
                this.FrameWidth = Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.One.$clone(), 0.15);
            },
            /**
             * Create the new image entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    texture     Image texture.
             * @param   {?Microsoft.Xna.Framework.Vector2}              size        Image size.
             * @param   {FaceUI.Entities.ImageDrawMode}                 drawMode    How to draw the image (see ImageDrawMode for more info).
             * @param   {FaceUI.Entities.Anchor}                        anchor      Poisition anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}              offset      Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (texture, size, drawMode, anchor, offset) {
                if (size === void 0) { size = null; }
                if (drawMode === void 0) { drawMode = 0; }
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                // store image DrawMode and texture
                this.DrawMode = drawMode;
                this.Texture = texture;

                // update style
                this.UpdateStyle(FaceUI.Entities.Image.DefaultStyle);
            },
            /**
             * Create image without texture.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Image.$ctor1.call(this, null);
            }
        },
        methods: {
            /**
             * Convert a given position to texture coords of this image.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @param   {Microsoft.Xna.Framework.Vector2}    pos    Position to convert.
             * @return  {Microsoft.Xna.Framework.Point}             Texture coords from position.
             */
            GetTextureCoordsAt: function (pos) {
                // draw mode must be stretch for it to work
                if (this.DrawMode !== FaceUI.Entities.ImageDrawMode.Stretch) {
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Cannot get texture coords on image that is not in stretched mode!");
                }

                // make sure in boundaries
                if (!this.IsTouching(pos.$clone())) {
                    throw new FaceUI.Exceptions.InvalidValueException.$ctor1("Position to get coords for must be inside entity boundaries!");
                }

                // get actual dest rect
                this.CalcDestRect();
                var rect = this.GetActualDestRect();

                // calc uv
                var relativePos = new Microsoft.Xna.Framework.Vector2.$ctor2(rect.Right - pos.X, rect.Bottom - pos.Y);
                var uv = new Microsoft.Xna.Framework.Vector2.$ctor2(1.0 - relativePos.X / rect.Width, 1.0 - relativePos.Y / rect.Height);

                // convert to final texture coords
                var textCoords = new Microsoft.Xna.Framework.Point.$ctor2(Bridge.Int.clip32(uv.X * this.Texture.Width), Bridge.Int.clip32(uv.Y * this.Texture.Height));
                return textCoords.$clone();
            },
            /**
             * Get texture color at a given coordinates.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @param   {Microsoft.Xna.Framework.Point}    textureCoords    Texture coords to get color for.
             * @return  {Microsoft.Xna.Framework.Color}                     Color of texture at the given texture coords.
             */
            GetColorAt: function (textureCoords) {
                var data = System.Array.init(Bridge.Int.mul(this.Texture.Width, this.Texture.Height), function (){
                    return new Microsoft.Xna.Framework.Color();
                }, Microsoft.Xna.Framework.Color);
                var index = (textureCoords.X + (Bridge.Int.mul(textureCoords.Y, this.Texture.Width))) | 0;
                this.Texture.GetData(Microsoft.Xna.Framework.Color, data);
                return data[System.Array.index(index, data)].$clone();
            },
            /**
             * Set texture color at a given coordinates.
             Note: this will affect all entities using this texture.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @param   {Microsoft.Xna.Framework.Point}    textureCoords    Texture coords to set color for.
             * @param   {Microsoft.Xna.Framework.Color}    color            New color to set.
             * @return  {void}
             */
            SetTextureColorAt: function (textureCoords, color) {
                var data = System.Array.init([color.$clone()], Microsoft.Xna.Framework.Color);
                this.Texture.SetData$3(Microsoft.Xna.Framework.Color, 0, new Microsoft.Xna.Framework.Rectangle.$ctor2(textureCoords.X, textureCoords.Y, 1, 1), data, 0, 1);
            },
            /**
             * Calculate width automatically based on height, to maintain texture's original ratio.
             For example if you have a texture of 400x200 pixels (eg 2:1 ratio) and its height in pixels is currently
             100 units, calling this function will update this image width to be 100 x 2 = 200.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @return  {void}
             */
            CalcAutoWidth: function () {
                this.UpdateDestinationRectsIfDirty();
                var width = (this._destRect.Height / this.Texture.Height) * this.Texture.Width;
                this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(width, this._size.Y);
            },
            /**
             * Calculate height automatically based on width, to maintain texture's original ratio.
             For example if you have a texture of 400x200 pixels (eg 2:1 ratio) and its width in pixels is currently
             100 units, calling this function will update this image height to be 100 / 2 = 50.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @return  {void}
             */
            CalcAutoHeight: function () {
                this.UpdateDestinationRectsIfDirty();
                var height = (this._destRect.Width / this.Texture.Width) * this.Texture.Height;
                this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(this._size.X, height);
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Image
             * @memberof FaceUI.Entities.Image
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // draw image based on DrawMode
                switch (this.DrawMode) {
                    case FaceUI.Entities.ImageDrawMode.Panel: 
                        FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, this.Texture, this._destRect.$clone(), this.FrameWidth.$clone(), this.Scale, this.FillColor.$clone());
                        break;
                    case FaceUI.Entities.ImageDrawMode.Stretch: 
                        FaceUI.UserInterface.Active.DrawUtils.DrawImage(spriteBatch, this.Texture, this._destRect.$clone(), this.FillColor.$clone(), this.Scale, System.Nullable.lift1("$clone", this.SourceRectangle));
                        break;
                }

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            }
        }
    });

    /**
     * A line space is just a spacer for Auto-Anchored entities, eg a method to create artificial distance between rows.
     *
     * @public
     * @class FaceUI.Entities.LineSpace
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.LineSpace", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Single line space height.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.LineSpace
                 * @default 8.0
                 * @type number
                 */
                SpaceSize: 0
            },
            ctors: {
                init: function () {
                    this.SpaceSize = 8.0;
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.LineSpace);
                }
            }
        },
        ctors: {
            /**
             * Create a new Line Space entity.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.LineSpace
             * @memberof FaceUI.Entities.LineSpace
             * @param   {number}    spacesCount    How many spaces to create.
             * @return  {void}
             */
            $ctor1: function (spacesCount) {
                var $t;
                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, Microsoft.Xna.Framework.Vector2.One, FaceUI.Entities.Anchor.Auto, Microsoft.Xna.Framework.Vector2.Zero);
                // by default locked so it won't do events
                this.Locked = true;
                this.Enabled = false;
                this.ClickThrough = true;

                // set size based on space count
                this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(0, 1);

                // default padding and spacing zero
                this.SpaceBefore = ($t = Microsoft.Xna.Framework.Vector2.Zero.$clone(), this.Padding = $t.$clone(), $t);
                this.SpaceAfter = new Microsoft.Xna.Framework.Vector2.$ctor2(0, FaceUI.Entities.LineSpace.SpaceSize * this.GlobalScale * spacesCount);
            },
            /**
             * Create default line space.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.LineSpace
             * @memberof FaceUI.Entities.LineSpace
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.LineSpace.$ctor1.call(this, 1);
            }
        },
        methods: {
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.LineSpace
             * @memberof FaceUI.Entities.LineSpace
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) { }
        }
    });

    /**
     * A graphical panel or form you can create and add entities to.
     Used to group together entities with common logic.
     *
     * @public
     * @class FaceUI.Entities.PanelBase
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.PanelBase", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Min size for panels when trying to auto-adjust height for child entities.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelBase
                 * @default 50.0
                 * @type number
                 */
                MinAutoAdjustHeight: 0
            },
            ctors: {
                init: function () {
                    this.MinAutoAdjustHeight = 50.0;
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.PanelBase);
                }
            }
        },
        fields: {
            _skin: 0,
            /**
             * Optional alternative texture to use with this panel.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.PanelBase
             * @type Microsoft.Xna.Framework.Graphics.Texture2D
             */
            _customTexture: null,
            /**
             * Custom frame size to use with optional custom texture.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.PanelBase
             * @type ?Microsoft.Xna.Framework.Vector2
             */
            _customFrame: null,
            /**
             * If true, will set panel height automatically based on children.
             Note: this will change the Size.Y property every time children under this panel change.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.PanelBase
             * @default false
             * @type boolean
             */
            AdjustHeightAutomatically: false
        },
        props: {
            /**
             * Set / get current panel skin.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.PanelBase
             * @function Skin
             * @type FaceUI.Entities.PanelSkin
             */
            Skin: {
                get: function () {
                    return this._skin;
                },
                set: function (value) {
                    this._skin = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.AdjustHeightAutomatically = false;
            },
            /**
             * Create the panel.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelBase
             * @memberof FaceUI.Entities.PanelBase
             * @param   {Microsoft.Xna.Framework.Vector2}     size      Panel size.
             * @param   {FaceUI.Entities.PanelSkin}           skin      Panel skin (texture to use). Use PanelSkin.None for invisible panels.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (size, skin, anchor, offset) {
                if (skin === void 0) { skin = 0; }
                if (anchor === void 0) { anchor = 0; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                this._skin = skin;
                this.UpdateStyle(FaceUI.Entities.Panel.DefaultStyle);
            },
            /**
             * Create the panel with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelBase
             * @memberof FaceUI.Entities.PanelBase
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.PanelBase.$ctor1.call(this, new Microsoft.Xna.Framework.Vector2.$ctor2(500, 500));
            }
        },
        methods: {
            /**
             * Draw this panel.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.PanelBase
             * @memberof FaceUI.Entities.PanelBase
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Spritebatch to use when drawing this panel.
             * @return  {void}
             */
            Draw: function (spriteBatch) {
                // adjust height automatically
                if (this.AdjustHeightAutomatically && this.Visible) {
                    if (!this.SetHeightBasedOnChildren()) {
                        return;
                    }
                }

                // call base drawing function
                FaceUI.Entities.Entity.prototype.Draw.call(this, spriteBatch);
            },
            /**
             * Set the panel's height to match its children automatically.
             Note: to make this happen on its own every frame, set the 'AdjustHeightAutomatically' property to true.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelBase
             * @memberof FaceUI.Entities.PanelBase
             * @return  {boolean}        True if succeed to adjust height, false if couldn't for whatever reason.
             */
            SetHeightBasedOnChildren: function () {
                var $t, $t1;
                // get the absolute top of this panel, but if size is 0 skip
                this.UpdateDestinationRectsIfDirty();
                var selfDestRect = this.GetActualDestRect();
                var selfTop = selfDestRect.Y - this.Padding.Y;

                // calculate the max height this panel should have base on children
                var maxHeight = FaceUI.Entities.PanelBase.MinAutoAdjustHeight;
                var didAdjustHeight = false;
                $t = Bridge.getEnumerator(this._children);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        if (child.Size.Y !== 0 && !child.Draggable && child.Visible && (child.Anchor === FaceUI.Entities.Anchor.TopCenter || child.Anchor === FaceUI.Entities.Anchor.TopLeft || child.Anchor === FaceUI.Entities.Anchor.TopRight || child.Anchor === FaceUI.Entities.Anchor.Auto || child.Anchor === FaceUI.Entities.Anchor.AutoCenter || child.Anchor === FaceUI.Entities.Anchor.AutoInline || child.Anchor === FaceUI.Entities.Anchor.AutoInlineNoBreak)) {
                            // update child destination rects
                            child.UpdateDestinationRectsIfDirty();

                            // if child height is 0 skip it
                            if (child.GetActualDestRect().Height === 0) {
                                continue;
                            }

                            // get child height and check if should change this panel's height
                            var childDestRect = child.GetDestRectForAutoAnchors();
                            var currHeight = (childDestRect.Bottom + child.SpaceAfter.Y - selfTop);
                            didAdjustHeight = true;
                            if (currHeight > maxHeight) {
                                maxHeight = currHeight;
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // check if need to update size
                if ((this.Size.Y !== maxHeight)) {
                    this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(this.Size.X, maxHeight / FaceUI.UserInterface.Active.GlobalScale);
                    this.UpdateDestinationRects();
                    $t1 = Bridge.getEnumerator(this._children);
                    try {
                        while ($t1.moveNext()) {
                            var child1 = $t1.Current;
                            child1.UpdateDestinationRects();
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
                }

                // return if could adjust height
                return didAdjustHeight;
            },
            /**
             * Override the default theme textures and set a custom skin for this specific button.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelBase
             * @memberof FaceUI.Entities.PanelBase
             * @param   {Microsoft.Xna.Framework.Graphics.Texture2D}    customTexture    Texture to use for default state.
             * @param   {?Microsoft.Xna.Framework.Vector2}              frameWidth       The width of the custom texture's frame, in percents of texture size.
             * @return  {void}
             */
            SetCustomSkin: function (customTexture, frameWidth) {
                var $t;
                if (frameWidth === void 0) { frameWidth = null; }
                this._customTexture = customTexture;
                this._customFrame = ($t = frameWidth, $t != null ? $t : null);
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.PanelBase
             * @memberof FaceUI.Entities.PanelBase
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                var $t;
                // draw panel itself, but only if got style
                if (this._skin !== FaceUI.Entities.PanelSkin.None) {
                    // get texture based on skin
                    var texture = this._customTexture || FaceUI.Resources.PanelTextures.getItem(this._skin);
                    var data = FaceUI.Resources.PanelData[System.Array.index(this._skin, FaceUI.Resources.PanelData)];
                    var frameSize = ($t = this._customFrame, $t != null ? $t : new Microsoft.Xna.Framework.Vector2.$ctor2(data.FrameWidth, data.FrameHeight));

                    // draw panel
                    FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, texture, this._destRect.$clone(), frameSize.$clone(), 1.0, this.FillColor.$clone(), this.Scale);
                }

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            }
        }
    });

    /**
     * A graphical panel or form you can create and add entities to.
     Used to group together entities with common logic.
     *
     * @public
     * @class FaceUI.Entities.PanelTabs
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.PanelTabs", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default styling for panel buttons. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelTabs
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultButtonStyle: null,
                /**
                 * Default styling for panel buttons paragraphs. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.PanelTabs
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultButtonParagraphStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultButtonStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultButtonParagraphStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.PanelTabs);
                }
            }
        },
        fields: {
            /**
             * List of tabs data currently in panel tabs.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.PanelTabs
             * @type System.Collections.Generic.List$1
             */
            _tabs: null,
            /**
             * A special internal panel to hold all the tab buttons.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.PanelTabs
             * @type FaceUI.Entities.Panel
             */
            _buttonsPanel: null,
            /**
             * A special internal panel to hold all the panels.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.PanelTabs
             * @type FaceUI.Entities.Panel
             */
            _panelsPanel: null,
            /**
             * Internal panel that contains everything: panels + buttons.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.PanelTabs
             * @type FaceUI.Entities.Panel
             */
            _internalRoot: null,
            /**
             * Currently active tab.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.PanelTabs
             * @type FaceUI.Entities.TabData
             */
            _activeTab: null
        },
        props: {
            /**
             * Optional panel skin to set as tabs background.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.PanelTabs
             * @function BackgroundSkin
             * @type FaceUI.Entities.PanelSkin
             */
            BackgroundSkin: {
                get: function () {
                    return this._panelsPanel.Skin;
                },
                set: function (value) {
                    if (this._panelsPanel != null) {
                        this._panelsPanel.Skin = value;
                    }
                }
            },
            /**
             * Get the currently active tab.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.PanelTabs
             * @function ActiveTab
             * @type FaceUI.Entities.TabData
             */
            ActiveTab: {
                get: function () {
                    return this._activeTab;
                }
            }
        },
        ctors: {
            init: function () {
                this._tabs = new (System.Collections.Generic.List$1(FaceUI.Entities.TabData)).ctor();
            },
            /**
             * Create the panel tabs.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @param   {FaceUI.Entities.PanelSkin}    buttonsBackground    Optional buttons background panel.
             * @return  {void}
             */
            ctor: function (buttonsBackground) {
                if (buttonsBackground === void 0) { buttonsBackground = -1; }
                var $t, $t1, $t2, $t3, $t4, $t5;

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, new Microsoft.Xna.Framework.Vector2.$ctor2(0, 0), FaceUI.Entities.Anchor.TopCenter, Microsoft.Xna.Framework.Vector2.Zero);
                // update style
                this.UpdateStyle(FaceUI.Entities.Entity.DefaultStyle);

                // remove self padding
                this.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();

                if (!FaceUI.UserInterface.Active._isDeserializing) {
                    // create the internal panel that contains everything - buttons + panels
                    this._internalRoot = new FaceUI.Entities.Panel.$ctor1(Microsoft.Xna.Framework.Vector2.Zero.$clone(), FaceUI.Entities.PanelSkin.None, FaceUI.Entities.Anchor.TopCenter);
                    this._internalRoot.SpaceBefore = ($t = ($t1 = Microsoft.Xna.Framework.Vector2.Zero.$clone(), this._internalRoot.Padding = $t1.$clone(), $t1), this._internalRoot.SpaceAfter = $t.$clone(), $t);
                    this._internalRoot.Identifier = "_internalRoot";
                    this.AddChild(this._internalRoot);

                    // create the panel to hold the tab buttons
                    this._buttonsPanel = new FaceUI.Entities.Panel.$ctor1(Microsoft.Xna.Framework.Vector2.Zero.$clone(), buttonsBackground, FaceUI.Entities.Anchor.TopCenter);
                    this._buttonsPanel.SpaceBefore = ($t2 = ($t3 = Microsoft.Xna.Framework.Vector2.Zero.$clone(), this._buttonsPanel.Padding = $t3.$clone(), $t3), this._buttonsPanel.SpaceAfter = $t2.$clone(), $t2);
                    this._buttonsPanel.Identifier = "_buttonsPanel";
                    this._internalRoot.AddChild(this._buttonsPanel);

                    // create the panel to hold the tab panels
                    this._panelsPanel = new FaceUI.Entities.Panel.$ctor1(Microsoft.Xna.Framework.Vector2.Zero.$clone(), FaceUI.Entities.PanelSkin.None, FaceUI.Entities.Anchor.TopCenter, new Microsoft.Xna.Framework.Vector2.$ctor2(0, 0));
                    this._panelsPanel.SpaceBefore = ($t4 = ($t5 = Microsoft.Xna.Framework.Vector2.Zero.$clone(), this._panelsPanel.Padding = $t5.$clone(), $t5), this._panelsPanel.SpaceAfter = $t4.$clone(), $t4);
                    this._panelsPanel.Identifier = "_panelsPanel";
                    this._internalRoot.AddChild(this._panelsPanel);

                    // make internal stuff hidden
                    this._panelsPanel._hiddenInternalEntity = true;
                    this._buttonsPanel._hiddenInternalEntity = true;
                    this._internalRoot._hiddenInternalEntity = true;
                }
            }
        },
        methods: {
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.Entity.prototype.InitAfterDeserialize.call(this);

                // get internal panels
                this._internalRoot = this.Find(FaceUI.Entities.Panel, "_internalRoot");
                this._buttonsPanel = this._internalRoot.Find(FaceUI.Entities.Panel, "_buttonsPanel");
                this._panelsPanel = this._internalRoot.Find(FaceUI.Entities.Panel, "_panelsPanel");
                this._panelsPanel._hiddenInternalEntity = true;
                this._buttonsPanel._hiddenInternalEntity = true;
                this._internalRoot._hiddenInternalEntity = true;

                // rebuild tabs
                var buttons = new (System.Collections.Generic.List$1(FaceUI.Entities.Entity)).$ctor1(this._buttonsPanel._children);
                this._buttonsPanel.ClearChildren();
                var panels = new (System.Collections.Generic.List$1(FaceUI.Entities.Entity)).$ctor1(this._panelsPanel._children);
                this._panelsPanel.ClearChildren();
                for (var i = 0; i < panels.Count; i = (i + 1) | 0) {
                    this.AddTab$1(Bridge.as(panels.getItem(i), FaceUI.Entities.Panel), Bridge.as(buttons.getItem(i), FaceUI.Entities.Button));
                }
            },
            /**
             * Get the height of the buttons row.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @param   {boolean}    withGlobalScale    If true, will include global scale in return value. If false, will calculate without it.
             * @return  {number}                        Height of button row.
             */
            GetButtonsHeight: function (withGlobalScale) {
                if (this._tabs.Count === 0) {
                    return 0;
                }
                return (this._tabs.getItem(0).button.GetActualDestRect().Height / (withGlobalScale ? 1.0 : this.GlobalScale));
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                var $t;
                // negate parent's padding
                this._internalRoot.Padding = Microsoft.Xna.Framework.Vector2.op_UnaryNegation(this.Parent.Padding.$clone());

                // recalculate the size of the panel containing the internal panels
                var buttonsHeight = this.GetButtonsHeight(false);
                this._panelsPanel.Offset = new Microsoft.Xna.Framework.Vector2.$ctor2(0, buttonsHeight);

                // adjust buttons size to fix global scaling
                this._buttonsPanel.CalcDestRect();
                var buttons = this._buttonsPanel.Children;
                var sizeX = Bridge.Int.clip32(Bridge.Math.round(Bridge.Int.clip32(Bridge.Math.round(this._buttonsPanel.GetActualDestRect().Width / System.Array.getCount(buttons, FaceUI.Entities.Entity), 0, 6)) / this.GlobalScale, 0, 6));
                $t = Bridge.getEnumerator(buttons, FaceUI.Entities.Entity);
                try {
                    while ($t.moveNext()) {
                        var button = $t.Current;
                        button.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(sizeX, button.Size.Y);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            },
            /**
             * Select tab to be the currently active tab.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @param   {string}    name    Tab identifier to select.
             * @return  {void}
             */
            SelectTab: function (name) {
                var $t;
                // find the right tab and select it
                $t = Bridge.getEnumerator(this._tabs);
                try {
                    while ($t.moveNext()) {
                        var tab = $t.Current;
                        if (Bridge.referenceEquals(tab.name, name)) {
                            tab.button.Checked = true;
                            return;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // tab not found?
                if (FaceUI.UserInterface.Active.SilentSoftErrors) {
                    return;
                }
                throw new FaceUI.Exceptions.NotFoundException.$ctor1("Tab not found!");
            },
            /**
             * Add a new tab to the panel tabs.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @param   {string}                       name         Tab name (also what will appear on the panel button).
             * @param   {FaceUI.Entities.PanelSkin}    panelSkin    Panel skin to use for this panel.
             * @return  {FaceUI.Entities.TabData}                   The new tab we created - contains the panel and the button to switch it.
             */
            AddTab: function (name, panelSkin) {
                if (panelSkin === void 0) { panelSkin = -1; }
                var newPanel = new FaceUI.Entities.Panel.$ctor1(Microsoft.Xna.Framework.Vector2.Zero.$clone(), panelSkin, FaceUI.Entities.Anchor.TopCenter);
                var newButton = new FaceUI.Entities.Button.$ctor1(name, FaceUI.Entities.ButtonSkin.Default, FaceUI.Entities.Anchor.AutoInlineNoBreak, new Microsoft.Xna.Framework.Vector2.$ctor2(-1, -1));
                newPanel.Identifier = name;
                return this.AddTab$1(newPanel, newButton);
            },
            /**
             * Add a new tab to the panel tabs.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.PanelTabs
             * @memberof FaceUI.Entities.PanelTabs
             * @param   {FaceUI.Entities.Panel}      newPanel     Panel instance to add as a tab.
             * @param   {FaceUI.Entities.Button}     newButton    Button to activate this tab.
             * @return  {FaceUI.Entities.TabData}                 The new tab we created - contains the panel and the button to switch it.
             */
            AddTab$1: function (newPanel, newButton) {
                var $t;
                // get name from panel and create tab data
                var name = newPanel.Identifier;
                var newTab = new FaceUI.Entities.TabData(name, newPanel, newButton);

                // link tab data to panel
                newTab.panel.AttachedData = newTab;

                // set button styles
                newTab.button.UpdateStyle(FaceUI.Entities.PanelTabs.DefaultButtonStyle);
                newTab.button.ButtonParagraph.UpdateStyle(FaceUI.Entities.PanelTabs.DefaultButtonParagraphStyle);

                // add new tab to tabs list
                this._tabs.add(newTab);

                // update all button sizes
                var width = 1.0 / this._tabs.Count;
                if (width === 1) {
                    width = 0;
                }
                $t = Bridge.getEnumerator(this._tabs);
                try {
                    while ($t.moveNext()) {
                        var data = $t.Current;
                        data.button.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(width, data.button.Size.Y);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // set button to togglemode and unchecked
                newTab.button.ToggleMode = true;
                newTab.button.Checked = false;

                // set identifiers for panel and button
                newTab.button.Identifier = "tab-button-" + (name || "");
                newTab.panel.Identifier = "tab-panel-" + (name || "");

                // by default all panels are hidden
                newTab.panel.Visible = false;

                // attach callback to newly created button
                newTab.button.OnValueChange = Bridge.fn.bind(this, function (entity) {
                    var $t1;
                    // get self as a button
                    var self = Bridge.cast((entity), FaceUI.Entities.Button);

                    // clear the currently active panel
                    var prevActive = this._activeTab != null ? this._activeTab.panel : null;
                    this._activeTab = null;

                    // if we were checked, uncheck all the other buttons
                    if (self.Checked) {
                        // un-toggle all the other buttons
                        $t1 = Bridge.getEnumerator(this._tabs);
                        try {
                            while ($t1.moveNext()) {
                                var data1 = $t1.Current;
                                var iterButton = data1.button;
                                if (!Bridge.referenceEquals(iterButton, self) && iterButton.Checked) {
                                    iterButton.Checked = false;
                                }
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }

                    // get the panel associated with this tab button.
                    var selfPanel = this._panelsPanel.Find(FaceUI.Entities.Panel, "tab-panel-" + (name || ""));

                    // show / hide the panel
                    selfPanel.Visible = self.Checked;

                    // if our new value is checked, set as the currently active tab
                    if (self.Checked) {
                        this._activeTab = Bridge.cast(selfPanel.AttachedData, FaceUI.Entities.TabData);
                    }

                    // if at this phase there's no active panel, revert by checking self again
                    // it could happen if user click the same tab button twice or via code.
                    if (this._activeTab == null && Bridge.referenceEquals(prevActive, selfPanel)) {
                        self.Checked = true;
                    }

                    // invoke change event
                    if (self.Checked) {
                        this.DoOnValueChange();
                    }
                });

                // add button and panel to their corresponding containers
                this._panelsPanel.AddChild(newTab.panel);
                this._buttonsPanel.AddChild(newTab.button);

                // if its first button, set it as checked
                if (this._tabs.Count === 1) {
                    newTab.button.Checked = true;
                }

                // set as dirty to recalculate destination rect
                this.MarkAsDirty();

                // return the newly created tab data (panel + button)
                return newTab;
            }
        }
    });

    /**
     * Slider entity looks like a horizontal scrollbar that the user can drag left and right to select a numeric value from range.
     *
     * @public
     * @class FaceUI.Entities.Slider
     * @augments FaceUI.Entities.Entity
     */
    Bridge.define("FaceUI.Entities.Slider", {
        inherits: [FaceUI.Entities.Entity],
        statics: {
            fields: {
                /**
                 * Default styling for the slider itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Slider
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Slider);
                }
            }
        },
        fields: {
            _skin: 0,
            /**
             * Min slider value.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Slider
             * @type number
             */
            _min: 0,
            /**
             * Max slider value.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Slider
             * @type number
             */
            _max: 0,
            /**
             * How many steps (ticks) are in range.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Slider
             * @default 0
             * @type number
             */
            _stepsCount: 0,
            /**
             * Current value.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Slider
             * @type number
             */
            _value: 0,
            /**
             * Actual frame width in pixels (used internally).
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Slider
             * @default 0.0
             * @type number
             */
            _frameActualWidth: 0,
            /**
             * Actual mark width in pixels (used internally).
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Slider
             * @default 20
             * @type number
             */
            _markWidth: 0
        },
        props: {
            /**
             * Get / set slider skin.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Slider
             * @function SliderSkin
             * @type FaceUI.Entities.SliderSkin
             */
            SliderSkin: {
                get: function () {
                    return this._skin;
                },
                set: function (value) {
                    this._skin = value;
                }
            },
            /**
             * Current slider value.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Slider
             * @function Value
             * @type number
             */
            Value: {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    var prevVal = this._value;
                    this._value = this.NormalizeValue(value);
                    if (prevVal !== this._value) {
                        this.DoOnValueChange();
                    }
                }
            },
            /**
             * Slider min value (inclusive).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Slider
             * @function Min
             * @type number
             */
            Min: {
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    if (this._min !== value) {
                        this._min = value;
                        if (System.Int64(this.Value).lt(System.Int64(this._min))) {
                            this.Value = this._min | 0;
                        }
                    }
                }
            },
            /**
             * Slider max value (inclusive).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Slider
             * @function Max
             * @type number
             */
            Max: {
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    if (this._max !== value) {
                        this._max = value;
                        if (System.Int64(this.Value).gt(System.Int64(this._max))) {
                            this.Value = this._max | 0;
                        }
                    }
                }
            },
            /**
             * How many steps (ticks) in slider range.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Slider
             * @function StepsCount
             * @type number
             */
            StepsCount: {
                get: function () {
                    return this._stepsCount;
                },
                set: function (value) {
                    this._stepsCount = value;
                    this.Value = this.Value;
                }
            }
        },
        ctors: {
            init: function () {
                this._stepsCount = 0;
                this._frameActualWidth = 0.0;
                this._markWidth = 20;
            },
            /**
             * Create the slider.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @param   {number}                              min       Min value (inclusive).
             * @param   {number}                              max       Max value (inclusive).
             * @param   {Microsoft.Xna.Framework.Vector2}     size      Slider size.
             * @param   {FaceUI.Entities.SliderSkin}          skin      Slider skin (texture).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor2: function (min, max, size, skin, anchor, offset) {
                if (skin === void 0) { skin = 0; }
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Entity.ctor.call(this, size, anchor, offset);
                // store style
                this._skin = skin;

                // store min and max and set default value
                this.Min = min;
                this.Max = max;

                // set default steps count
                this._stepsCount = (this.Max - this.Min) >>> 0;

                // set starting value to center
                this._value = (((this.Min + ((Bridge.Int.div((((this.Max - this.Min) >>> 0)), 2)) >>> 0)) >>> 0)) | 0;

                // update default style
                this.UpdateStyle(FaceUI.Entities.Slider.DefaultStyle);
            },
            /**
             * Create slider with default size.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @param   {number}                              min       Min value (inclusive).
             * @param   {number}                              max       Max value (inclusive).
             * @param   {FaceUI.Entities.SliderSkin}          skin      Slider skin (texture).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (min, max, skin, anchor, offset) {
                if (skin === void 0) { skin = 0; }
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                FaceUI.Entities.Slider.$ctor2.call(this, min, max, FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone(), skin, anchor, offset);
            },
            /**
             * Create default slider.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Slider.$ctor1.call(this, 0, 10);
            }
        },
        methods: {
            /**
             * Get the size of a single step.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @return  {number}        Size of a single step, eg how much value changes in a step.
             */
            GetStepSize: function () {
                if (this.StepsCount > 0) {
                    if (((this.Max - this.Min) >>> 0) === this.StepsCount) {
                        return 1;
                    }
                    return ((Math.max((((((Bridge.Int.div((((this.Max - this.Min) >>> 0)), this.StepsCount)) >>> 0) + 1) >>> 0)), 2)) | 0);
                } else {
                    return 1;
                }
            },
            /**
             * Normalize value to fit slider range and be multiply of steps size.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @param   {number}    value    Value to normalize.
             * @return  {number}             Normalized value.
             */
            NormalizeValue: function (value) {
                if (!FaceUI.UserInterface.Active._isDeserializing) {
                    // round to steps
                    var stepSize = this.GetStepSize();
                    value = Bridge.Int.clip32(Bridge.Math.round(value / stepSize, 0, 6) * stepSize);

                    // camp between min and max
                    value = System.Int64.clip32(System.Int64.min(System.Int64.max(System.Int64(value), System.Int64(this.Min)), System.Int64(this.Max)));
                }

                // return normalized value
                return value;
            },
            /**
             * Is the slider a natrually-interactable entity.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @return  {boolean}        True.
             */
            IsNaturallyInteractable: function () {
                return true;
            },
            /**
             * Called every frame while mouse button is down over this entity.
             The slider entity override this function to handle slider value change (eg slider mark dragging).
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @return  {void}
             */
            DoWhileMouseDown: function () {
                // get mouse position and apply scroll value
                var mousePos = this.GetMousePos();
                mousePos = Microsoft.Xna.Framework.Vector2.op_Addition(mousePos.$clone(), this._lastScrollVal.ToVector2());

                // if mouse x is on the 0 side set to min
                if (mousePos.X <= this._destRect.X + this._frameActualWidth) {
                    this.Value = (this.Min) | 0;
                } else if (mousePos.X >= this._destRect.Right - this._frameActualWidth) {
                    this.Value = (this.Max) | 0;
                } else {
                    var val = ((mousePos.X - this._destRect.X - this._frameActualWidth + ((Bridge.Int.div(this._markWidth, 2)) | 0)) / (this._destRect.Width - this._frameActualWidth * 2));
                    this.Value = Bridge.Int.clip32(this.Min + val * (((this.Max - this.Min) >>> 0)));
                }

                // call base handler
                FaceUI.Entities.Entity.prototype.DoWhileMouseDown.call(this);
            },
            /**
             * Return current value as a percent between min and max.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @return  {number}        Current value as percent between min and max (0f-1f).
             */
            GetValueAsPercent: function () {
                return (System.Int64(this._value).sub(System.Int64(this.Min))) / (((this.Max - this.Min) >>> 0));
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // get textures based on skin
                var texture = FaceUI.Resources.SliderTextures.getItem(this._skin);
                var markTexture = FaceUI.Resources.SliderMarkTextures.getItem(this._skin);

                // get slider metadata
                var data = FaceUI.Resources.SliderData[System.Array.index(this._skin, FaceUI.Resources.SliderData)];
                var frameWidth = data.FrameWidth;

                // draw slider body
                FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, texture, this._destRect.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(frameWidth, 0.0), 1, this.FillColor.$clone());

                // calc frame actual height and scaling factor (this is needed to calc frame width in pixels)
                var frameSizeTexture = new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width * frameWidth, texture.Height);
                var frameSizeRender = frameSizeTexture.$clone();
                var ScaleXfac = this._destRect.Height / frameSizeRender.Y;

                // calc the size of the mark piece
                var markHeight = this._destRect.Height;
                this._markWidth = Bridge.Int.clip32((markTexture.Width / markTexture.Height) * markHeight);

                // calc frame width in pixels
                this._frameActualWidth = frameWidth * texture.Width * ScaleXfac;

                // now draw mark
                var markX = this._destRect.X + this._frameActualWidth + this._markWidth * 0.5 + (this._destRect.Width - this._frameActualWidth * 2 - this._markWidth) * this.GetValueAsPercent();
                var markDest = new Microsoft.Xna.Framework.Rectangle.$ctor2(((Bridge.Int.clip32(Bridge.Math.round(markX, 0, 6)) - ((Bridge.Int.div(this._markWidth, 2)) | 0)) | 0), this._destRect.Y, this._markWidth, markHeight);
                FaceUI.UserInterface.Active.DrawUtils.DrawImage(spriteBatch, markTexture, markDest.$clone(), this.FillColor.$clone());

                // call base draw function
                FaceUI.Entities.Entity.prototype.DrawEntity.call(this, spriteBatch, phase);
            },
            /**
             * Handle when mouse wheel scroll and this entity is the active entity.
             Note: Slider entity override this function to change slider value based on wheel scroll.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Slider
             * @memberof FaceUI.Entities.Slider
             * @return  {void}
             */
            DoOnMouseWheelScroll: function () {
                if (this._isMouseOver) {
                    this.Value = (this._value + Bridge.Int.mul(this.MouseInput.FaceUI$IMouseInput$MouseWheelChange, this.GetStepSize())) | 0;
                }
            }
        }
    });

    /**
     * Set of style properties for different entity states.
     For example, stylesheet can define that when mouse hover over a paragraph, its text turns red.
     *
     * @public
     * @class FaceUI.Entities.StyleSheet
     * @augments System.Collections.Generic.Dictionary$2
     */
    Bridge.define("FaceUI.Entities.StyleSheet", {
        inherits: [System.Collections.Generic.Dictionary$2(System.String,FaceUI.DataTypes.StyleProperty)],
        statics: {
            fields: {
                stateAsString: null,
                _identifiersCache: null
            },
            ctors: {
                init: function () {
                    this.stateAsString = System.Array.init([
                        "Default", 
                        "MouseHover", 
                        "MouseDown"
                    ], System.String);
                    this._identifiersCache = new (System.Collections.Generic.Dictionary$2(System.Collections.Generic.KeyValuePair$2(System.String,FaceUI.Entities.EntityState), System.String))(null, new FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer());
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.StyleSheet);
                }
            }
        },
        methods: {
            /**
             * Get the full string that represent a style property identifier.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.StyleSheet
             * @memberof FaceUI.Entities.StyleSheet
             * @param   {string}                         property    
             * @param   {FaceUI.Entities.EntityState}    state
             * @return  {string}
             */
            getPropertyFullId: function (property, state) {
                var $t;
                // get identifier from cache
                var pair = new (System.Collections.Generic.KeyValuePair$2(System.String,FaceUI.Entities.EntityState)).$ctor1(property, state);
                if (FaceUI.Entities.StyleSheet._identifiersCache.containsKey(pair)) {
                    return FaceUI.Entities.StyleSheet._identifiersCache.get(pair);
                }

                // build and return new identifier
                var fullPropertyIdentifier = new System.Text.StringBuilder(FaceUI.Entities.StyleSheet.stateAsString[System.Array.index(state, FaceUI.Entities.StyleSheet.stateAsString)]);
                fullPropertyIdentifier.append(String.fromCharCode(46));
                fullPropertyIdentifier.append(property);
                return ($t = fullPropertyIdentifier.toString(), FaceUI.Entities.StyleSheet._identifiersCache.set(pair, $t), $t);
            },
            /**
             * Return stylesheet property for a given state.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.StyleSheet
             * @memberof FaceUI.Entities.StyleSheet
             * @param   {string}                            property             Property identifier.
             * @param   {FaceUI.Entities.EntityState}       state                State to get property for (if undefined will fallback to default state).
             * @param   {boolean}                           fallbackToDefault    If true and property not found for given state, will fallback to default state.
             * @return  {FaceUI.DataTypes.StyleProperty}                         Style property value for given state or default, or null if undefined.
             */
            getStyleProperty: function (property, state, fallbackToDefault) {
                if (state === void 0) { state = 0; }
                if (fallbackToDefault === void 0) { fallbackToDefault = true; }
                // try to get for current state
                var ret = { v : new FaceUI.DataTypes.StyleProperty() };
                var gotVal = this.tryGetValue(this.getPropertyFullId(property, state), ret);

                // if not found, try default
                if (!gotVal && (state !== FaceUI.Entities.EntityState.Default) && fallbackToDefault) {
                    return this.getStyleProperty(property, FaceUI.Entities.EntityState.Default);
                }

                // return style value
                return ret.v.$clone();
            },
            /**
             * Set a stylesheet property.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.StyleSheet
             * @memberof FaceUI.Entities.StyleSheet
             * @param   {string}                            property    Property identifier.
             * @param   {FaceUI.DataTypes.StyleProperty}    value       Property value.
             * @param   {FaceUI.Entities.EntityState}       state       State to set property for.
             * @return  {void}
             */
            setStyleProperty: function (property, value, state) {
                if (state === void 0) { state = 0; }
                this.set(this.getPropertyFullId(property, state), value.$clone());
            },
            /**
             * Update the entire stylesheet from a different stylesheet.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.StyleSheet
             * @memberof FaceUI.Entities.StyleSheet
             * @param   {FaceUI.Entities.StyleSheet}    other    Other StyleSheet to update from.
             * @return  {void}
             */
            updateFrom: function (other) {
                var $t;
                $t = Bridge.getEnumerator(other);
                try {
                    while ($t.moveNext()) {
                        var de = $t.Current;
                        this.set(de.key, de.value.$clone());
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
     * Low allocation comparer for Dictionary
     *
     * @private
     * @class FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer
     * @implements  System.Collections.Generic.IEqualityComparer$1
     */
    Bridge.define("FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer", {
        inherits: [System.Collections.Generic.IEqualityComparer$1(System.Collections.Generic.KeyValuePair$2(System.String,FaceUI.Entities.EntityState))],
        $kind: "nested struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer(); }
            }
        },
        alias: [
            "equals2", ["System$Collections$Generic$IEqualityComparer$1$System$Collections$Generic$KeyValuePair$2$System$String$FaceUI$Entities$EntityState$equals2", "System$Collections$Generic$IEqualityComparer$1$equals2"],
            "getHashCode2", ["System$Collections$Generic$IEqualityComparer$1$System$Collections$Generic$KeyValuePair$2$System$String$FaceUI$Entities$EntityState$getHashCode2", "System$Collections$Generic$IEqualityComparer$1$getHashCode2"]
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            /**
             * Compares combined string, EntityState Kvp for equality
             *
             * @instance
             * @public
             * @this FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer
             * @memberof FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer
             * @param   {System.Collections.Generic.KeyValuePair$2}    x    
             * @param   {System.Collections.Generic.KeyValuePair$2}    y
             * @return  {boolean}
             */
            equals2: function (x, y) {
                return (Bridge.referenceEquals(x.key, y.key) && x.value === y.value);
            },
            /**
             * Creates a unique hash for string, EntityState Kvp
             *
             * @instance
             * @public
             * @this FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer
             * @memberof FaceUI.Entities.StyleSheet.StringEntityStateKvpComparer
             * @param   {System.Collections.Generic.KeyValuePair$2}    obj
             * @return  {number}
             */
            getHashCode2: function (obj) {
                var hashCode = 0;

                hashCode = (Bridge.Int.mul(hashCode, 397)) ^ (obj.key != null ? Bridge.getHashCode(obj.key) : 0);
                hashCode = (Bridge.Int.mul(hashCode, 397)) ^ Bridge.getHashCode(obj.value);

                return hashCode;
            },
            $clone: function (to) { return this; }
        }
    });

    /**
     * Make sure input don't contain double spaces or tabs.
     *
     * @public
     * @class FaceUI.Entities.TextValidators.OnlySingleSpaces
     * @augments FaceUI.Entities.TextValidators.ITextValidator
     */
    Bridge.define("FaceUI.Entities.TextValidators.OnlySingleSpaces", {
        inherits: [FaceUI.Entities.TextValidators.ITextValidator],
        statics: {
            ctors: {
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.TextValidators.OnlySingleSpaces);
                }
            }
        },
        methods: {
            /**
             * Return true if text input don't contain double spaces or tabs.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.TextValidators.OnlySingleSpaces
             * @memberof FaceUI.Entities.TextValidators.OnlySingleSpaces
             * @param   {System.String}    text       New text input value.
             * @param   {string}           oldText    Previous text input value.
             * @return  {boolean}                     If TextInput value is legal.
             */
            ValidateText: function (text, oldText) {
                return !System.String.contains(text.v,"  ") && !System.String.contains(text.v,"\t");
            }
        }
    });

    /**
     * Make sure input contains only letters, numbers, underscores or hyphens (and optionally spaces).
     *
     * @public
     * @class FaceUI.Entities.TextValidators.SlugValidator
     * @augments FaceUI.Entities.TextValidators.ITextValidator
     */
    Bridge.define("FaceUI.Entities.TextValidators.SlugValidator", {
        inherits: [FaceUI.Entities.TextValidators.ITextValidator],
        statics: {
            fields: {
                _slugNoSpaces: null,
                _slugWithSpaces: null
            },
            ctors: {
                init: function () {
                    this._slugNoSpaces = new System.Text.RegularExpressions.Regex.ctor("^[a-zA-Z\\-_0-9]+$");
                    this._slugWithSpaces = new System.Text.RegularExpressions.Regex.ctor("^[a-zA-Z\\-_\\ 0-9]+$");
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.TextValidators.SlugValidator);
                }
            }
        },
        fields: {
            _regex: null,
            _allowSpaces: false
        },
        props: {
            /**
             * Set / get if we allow spaces in text.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextValidators.SlugValidator
             * @function AllowSpaces
             * @type boolean
             */
            AllowSpaces: {
                get: function () {
                    return this._allowSpaces;
                },
                set: function (value) {
                    this._allowSpaces = value;
                    this._regex = this._allowSpaces ? FaceUI.Entities.TextValidators.SlugValidator._slugWithSpaces : FaceUI.Entities.TextValidators.SlugValidator._slugNoSpaces;
                }
            }
        },
        ctors: {
            /**
             * Create the slug validator.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.SlugValidator
             * @memberof FaceUI.Entities.TextValidators.SlugValidator
             * @param   {boolean}    allowSpaces    If true, will allow spaces.
             * @return  {void}
             */
            $ctor1: function (allowSpaces) {
                this.$initialize();
                FaceUI.Entities.TextValidators.ITextValidator.ctor.call(this);
                this.AllowSpaces = this.AllowSpaces;
            },
            /**
             * Create the validator with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.SlugValidator
             * @memberof FaceUI.Entities.TextValidators.SlugValidator
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.TextValidators.SlugValidator.$ctor1.call(this, false);
            }
        },
        methods: {
            /**
             * Return true if text input is slug.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.TextValidators.SlugValidator
             * @memberof FaceUI.Entities.TextValidators.SlugValidator
             * @param   {System.String}    text       New text input value.
             * @param   {string}           oldText    Previous text input value.
             * @return  {boolean}                     If TextInput value is legal.
             */
            ValidateText: function (text, oldText) {
                return (text.v.length === 0 || this._regex.isMatch(text.v));
            }
        }
    });

    /**
     * Make sure input contains only english characters.
     *
     * @public
     * @class FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
     * @augments FaceUI.Entities.TextValidators.ITextValidator
     */
    Bridge.define("FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly", {
        inherits: [FaceUI.Entities.TextValidators.ITextValidator],
        statics: {
            fields: {
                _slugNoSpaces: null,
                _slugWithSpaces: null
            },
            ctors: {
                init: function () {
                    this._slugNoSpaces = new System.Text.RegularExpressions.Regex.ctor("^[a-zA-Z|]+$");
                    this._slugWithSpaces = new System.Text.RegularExpressions.Regex.ctor("^[a-zA-Z|\\ ]+$");
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly);
                }
            }
        },
        fields: {
            _regex: null,
            _allowSpaces: false
        },
        props: {
            /**
             * Set / get if we allow spaces in text.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @function AllowSpaces
             * @type boolean
             */
            AllowSpaces: {
                get: function () {
                    return this._allowSpaces;
                },
                set: function (value) {
                    this._allowSpaces = value;
                    this._regex = this._allowSpaces ? FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly._slugWithSpaces : FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly._slugNoSpaces;
                }
            }
        },
        ctors: {
            /**
             * Create the validator.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @memberof FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @param   {boolean}    allowSpaces    If true, will allow spaces.
             * @return  {void}
             */
            $ctor1: function (allowSpaces) {
                this.$initialize();
                FaceUI.Entities.TextValidators.ITextValidator.ctor.call(this);
                this.AllowSpaces = allowSpaces;
            },
            /**
             * Create the validator with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @memberof FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly.$ctor1.call(this, false);
            }
        },
        methods: {
            /**
             * Return true if text input is only english characters.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @memberof FaceUI.Entities.TextValidators.TextValidatorEnglishCharsOnly
             * @param   {System.String}    text       New text input value.
             * @param   {string}           oldText    Previous text input value.
             * @return  {boolean}                     If TextInput value is legal.
             */
            ValidateText: function (text, oldText) {
                return (text.v.length === 0 || this._regex.isMatch(text.v));
            }
        }
    });

    /**
     * Make sure input is always title, eg starts with a capital letter followed by lowercase.
     *
     * @public
     * @class FaceUI.Entities.TextValidators.TextValidatorMakeTitle
     * @augments FaceUI.Entities.TextValidators.ITextValidator
     */
    Bridge.define("FaceUI.Entities.TextValidators.TextValidatorMakeTitle", {
        inherits: [FaceUI.Entities.TextValidators.ITextValidator],
        statics: {
            ctors: {
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.TextValidators.TextValidatorMakeTitle);
                }
            }
        },
        methods: {
            /**
             * Always return true, and make first character uppercase while all following
             chars lowercase.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.TextValidators.TextValidatorMakeTitle
             * @memberof FaceUI.Entities.TextValidators.TextValidatorMakeTitle
             * @param   {System.String}    text       New text input value.
             * @param   {string}           oldText    Previous text input value.
             * @return  {boolean}                     Always return true.
             */
            ValidateText: function (text, oldText) {
                if (text.v.length > 0) {
                    text.v = text.v.toLowerCase();
                    text.v = (String.fromCharCode(text.v.charCodeAt(0)).toUpperCase() || "") + (System.String.remove(text.v, 0, 1) || "");
                }
                return true;
            }
        }
    });

    /**
     * Make sure input is numeric and optionally validate min / max values.
     *
     * @public
     * @class FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
     * @augments FaceUI.Entities.TextValidators.ITextValidator
     */
    Bridge.define("FaceUI.Entities.TextValidators.TextValidatorNumbersOnly", {
        inherits: [FaceUI.Entities.TextValidators.ITextValidator],
        statics: {
            ctors: {
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.TextValidators.TextValidatorNumbersOnly);
                }
            }
        },
        fields: {
            /**
             * Do we allow decimal point?
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @type boolean
             */
            AllowDecimalPoint: false,
            /**
             * Optional min value.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @type ?number
             */
            Min: null,
            /**
             * Optional max value.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @type ?number
             */
            Max: null
        },
        ctors: {
            /**
             * Create the number validator.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @memberof FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @param   {boolean}    allowDecimal    If true, will allow decimal point in input.
             * @param   {?number}    min             If provided, will force min value.
             * @param   {?number}    max             If provided, will force max value.
             * @return  {void}
             */
            $ctor1: function (allowDecimal, min, max) {
                if (min === void 0) { min = null; }
                if (max === void 0) { max = null; }

                this.$initialize();
                FaceUI.Entities.TextValidators.ITextValidator.ctor.call(this);
                this.AllowDecimalPoint = allowDecimal;
                this.Min = min;
                this.Max = max;
            },
            /**
             * Create number validator with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @memberof FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.TextValidators.TextValidatorNumbersOnly.$ctor1.call(this, false);
            }
        },
        methods: {
            /**
             * Return true if text input is a valid number.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @memberof FaceUI.Entities.TextValidators.TextValidatorNumbersOnly
             * @param   {System.String}    text       New text input value.
             * @param   {string}           oldText    Previous text input value.
             * @return  {boolean}                     If TextInput value is legal.
             */
            ValidateText: function (text, oldText) {
                // if string empty return true
                if (text.v.length === 0) {
                    return true;
                }

                // will contain value as number
                var num = { };

                // try to parse as double
                if (this.AllowDecimalPoint) {
                    if (!System.Double.tryParse(text.v, null, num)) {
                        return false;
                    }
                } else {
                    var temp = { };
                    if (!System.Int32.tryParse(text.v, temp)) {
                        return false;
                    }
                    num.v = temp.v;
                }

                // validate range
                if (this.Min != null && num.v < System.Nullable.getValue(this.Min)) {
                    text.v = System.Nullable.toString(this.Min, function ($t) { return System.Double.format($t); });
                }
                if (this.Max != null && num.v > System.Nullable.getValue(this.Max)) {
                    text.v = System.Nullable.toString(this.Max, function ($t) { return System.Double.format($t); });
                }

                // valid number input
                return true;
            }
        }
    });

    Bridge.define("FaceUI.PipelineImporter.DefaultStylesReader", {
        inherits: [Microsoft.Xna.Framework.Content.ContentTypeReader$1(FaceUI.DataTypes.DefaultStylesList)],
        methods: {
            Read$1: function (reader, existingInstance) {
                var $t;
                var result = ($t = new FaceUI.DataTypes.DefaultStylesList(), $t.Styles = System.Array.init(reader.ReadInt32(), null, FaceUI.DataTypes.DefaultStyles), $t);

                for (var i = 0; i < result.Styles.length; i = (i + 1) | 0) {
                    result.Styles[System.Array.index(i, result.Styles)] = this.Read$2(reader);
                }

                return result;
            },
            Read$2: function (reader) {
                var result = new FaceUI.DataTypes.DefaultStyles();
                if (reader.ReadBoolean()) {
                    result.Scale = reader.ReadSingle();
                }
                if (reader.ReadBoolean()) {
                    result.FillColor = new Microsoft.Xna.Framework.Color.$ctor10(reader.ReadUInt32());
                }
                if (reader.ReadBoolean()) {
                    result.OutlineColor = new Microsoft.Xna.Framework.Color.$ctor10(reader.ReadUInt32());
                }
                if (reader.ReadBoolean()) {
                    result.OutlineWidth = reader.ReadInt32();
                }
                if (reader.ReadBoolean()) {
                    result.ForceAlignCenter = reader.ReadBoolean();
                }
                if (reader.ReadBoolean()) {
                    result.FontStyle = reader.ReadInt32();
                }
                if (reader.ReadBoolean()) {
                    result.SelectedHighlightColor = new Microsoft.Xna.Framework.Color.$ctor10(reader.ReadUInt32());
                }
                if (reader.ReadBoolean()) {
                    result.ShadowColor = new Microsoft.Xna.Framework.Color.$ctor10(reader.ReadUInt32());
                }
                if (reader.ReadBoolean()) {
                    result.ShadowOffset = new Microsoft.Xna.Framework.Vector2.$ctor2(reader.ReadSingle(), reader.ReadSingle());
                }
                if (reader.ReadBoolean()) {
                    result.Padding = new Microsoft.Xna.Framework.Vector2.$ctor2(reader.ReadSingle(), reader.ReadSingle());
                }
                if (reader.ReadBoolean()) {
                    result.SpaceBefore = new Microsoft.Xna.Framework.Vector2.$ctor2(reader.ReadSingle(), reader.ReadSingle());
                }
                if (reader.ReadBoolean()) {
                    result.SpaceAfter = new Microsoft.Xna.Framework.Vector2.$ctor2(reader.ReadSingle(), reader.ReadSingle());
                }
                if (reader.ReadBoolean()) {
                    result.ShadowScale = reader.ReadSingle();
                }
                if (reader.ReadBoolean()) {
                    result.DefaultSize = new Microsoft.Xna.Framework.Vector2.$ctor2(reader.ReadSingle(), reader.ReadSingle());
                }

                return result;
            }
        }
    });

    /**
     * @public
     * @class FaceUI.Utils.DefaultGraphicDeviceWrapper
     * @augments FaceUI.Utils.GraphicDeviceWrapper
     */
    Bridge.define("FaceUI.Utils.DefaultGraphicDeviceWrapper", {
        inherits: [FaceUI.Utils.GraphicDeviceWrapper],
        fields: {
            graphicDevice: null
        },
        props: {
            /**
             * @instance
             * @public
             * @memberof FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @function GraphicDevice
             * @type Microsoft.Xna.Framework.Graphics.GraphicsDevice
             */
            GraphicDevice: {
                get: function () {
                    return this.graphicDevice;
                },
                set: function (value) {
                    this.graphicDevice = value;
                    this.PresentationParameters.BackBufferFormat = value.PresentationParameters.BackBufferFormat;
                    this.PresentationParameters.DepthStencilFormat = value.PresentationParameters.DepthStencilFormat;
                }
            },
            /**
             * @instance
             * @public
             * @override
             * @readonly
             * @memberof FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @function GraphicsDevice
             * @type Microsoft.Xna.Framework.Graphics.GraphicsDevice
             */
            GraphicsDevice: {
                get: function () {
                    return this.GraphicDevice;
                }
            },
            /**
             * @instance
             * @public
             * @override
             * @memberof FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @function PresentationParameters
             * @type FaceUI.Utils.PresentationParametersWrapper
             */
            PresentationParameters: null,
            /**
             * @instance
             * @public
             * @override
             * @readonly
             * @memberof FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @function Viewport
             * @type Microsoft.Xna.Framework.Rectangle
             */
            Viewport: {
                get: function () {
                    return this.GraphicDevice.Viewport.Bounds.$clone();
                }
            }
        },
        ctors: {
            init: function () {
                this.PresentationParameters = new FaceUI.Utils.PresentationParametersWrapper();
            }
        },
        methods: {
            /**
             * @instance
             * @public
             * @override
             * @this FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @memberof FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @param   {Microsoft.Xna.Framework.Color}    color
             * @return  {void}
             */
            Clear: function (color) {
                this.GraphicDevice.Clear(color.$clone());
            },
            /**
             * @instance
             * @public
             * @override
             * @this FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @memberof FaceUI.Utils.DefaultGraphicDeviceWrapper
             * @param   {Microsoft.Xna.Framework.Graphics.RenderTarget2D}    target
             * @return  {void}
             */
            SetRenderTarget: function (target) {
                this.GraphicDevice.SetRenderTarget(target);
            }
        }
    });

    Bridge.define("FaceUI.Utils.DefaultSpriteBatchWrapper", {
        inherits: [FaceUI.Utils.ISpriteBatchWrapper],
        props: {
            Spritebatch: null,
            GraphicsDevice: null
        },
        alias: [
            "Begin", "FaceUI$Utils$ISpriteBatchWrapper$Begin",
            "End", "FaceUI$Utils$ISpriteBatchWrapper$End",
            "Draw", "FaceUI$Utils$ISpriteBatchWrapper$Draw",
            "Draw$1", "FaceUI$Utils$ISpriteBatchWrapper$Draw$1",
            "DrawString", "FaceUI$Utils$ISpriteBatchWrapper$DrawString",
            "GraphicsDevice", "FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice"
        ],
        methods: {
            Begin: function (sortMode, blendState, samplerState, depthStencilState, rasterizerState, effect, transformMatrix) {
                if (sortMode === void 0) { sortMode = 0; }
                if (blendState === void 0) { blendState = null; }
                if (samplerState === void 0) { samplerState = null; }
                if (depthStencilState === void 0) { depthStencilState = null; }
                if (rasterizerState === void 0) { rasterizerState = null; }
                if (effect === void 0) { effect = null; }
                if (transformMatrix === void 0) { transformMatrix = null; }
                this.Spritebatch.Begin(sortMode, blendState, samplerState, depthStencilState, rasterizerState, effect, System.Nullable.lift1("$clone", transformMatrix));
            },
            End: function () {
                this.Spritebatch.End();
            },
            Draw: function (texture, destRect, color) {
                this.Spritebatch.Draw(texture, destRect.$clone(), color.$clone());
            },
            Draw$1: function (texture, destRect, srcRect, color) {
                this.Spritebatch.Draw$1(texture, destRect.$clone(), srcRect.$clone(), color.$clone());
            },
            DrawString: function (spriteFont, text, position, color, rotation, origin, scalef, effects, layerDepth) {
                this.Spritebatch.DrawString$2(spriteFont, text, position.$clone(), color.$clone(), rotation, origin.$clone(), scalef, effects, layerDepth);
            }
        }
    });

    /**
     * Header entity is a subclass of Paragraph. Basically its the same, but with a different
     default styling, and serves as a sugarcoat to quickly create headers for menues.
     *
     * @public
     * @class FaceUI.Entities.Header
     * @augments FaceUI.Entities.Paragraph
     */
    Bridge.define("FaceUI.Entities.Header", {
        inherits: [FaceUI.Entities.Paragraph],
        statics: {
            fields: {
                /**
                 * Default styling for headers. Remember that header is a subclass of Paragraph and has its basic styline. 
                 Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Header
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Header);
                }
            }
        },
        ctors: {
            /**
             * Create the header.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Header
             * @memberof FaceUI.Entities.Header
             * @param   {string}                              text      Header text.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (text, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Paragraph.$ctor2.call(this, text, anchor, void 0, offset, void 0);
                this.UpdateStyle(FaceUI.Entities.Header.DefaultStyle);
            },
            /**
             * Create default header without text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Header
             * @memberof FaceUI.Entities.Header
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Header.$ctor1.call(this, "");
            }
        }
    });

    /**
     * A simple UI icon.
     Comes we a selection of pre-defined icons to use + optional inventory-like background.
     *
     * @public
     * @class FaceUI.Entities.Icon
     * @augments FaceUI.Entities.Image
     */
    Bridge.define("FaceUI.Entities.Icon", {
        inherits: [FaceUI.Entities.Image],
        statics: {
            fields: {
                /**
                 * Default styling for icons. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Icon
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Icon background size in pixels.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Icon
                 * @default 10
                 * @type number
                 */
                BackgroundSize: 0
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.BackgroundSize = 10;
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Icon);
                }
            }
        },
        fields: {
            /**
             * If true, will draw inventory-like background to this icon.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Icon
             * @default false
             * @type boolean
             */
            DrawBackground: false,
            _icon: 0
        },
        props: {
            /**
             * Set / get icon.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Icon
             * @function IconType
             * @type FaceUI.Entities.IconType
             */
            IconType: {
                get: function () {
                    return this._icon;
                },
                set: function (value) {
                    this.Texture = FaceUI.Resources.IconTextures.getItem(value);
                    this._icon = value;
                }
            }
        },
        ctors: {
            init: function () {
                this.DrawBackground = false;
            },
            /**
             * Create a new icon.
             Note: if you want to use your own texture for the icon, simply set 'icon' to be IconType.None and replace 'Texture' with
             your own texture after it is created.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Icon
             * @memberof FaceUI.Entities.Icon
             * @param   {FaceUI.Entities.IconType}            icon          A pre-defined icon to draw.
             * @param   {FaceUI.Entities.Anchor}              anchor        Position anchor.
             * @param   {number}                              scale         Icon default scale.
             * @param   {boolean}                             background    Whether or not to show icon inventory-like background.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset        Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (icon, anchor, scale, background, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (scale === void 0) { scale = 1.0; }
                if (background === void 0) { background = false; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Image.$ctor1.call(this, null, FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone(), FaceUI.Entities.ImageDrawMode.Stretch, anchor, offset);
                // set scale and basic properties
                this.Scale = scale;
                this.DrawBackground = background;
                this.IconType = icon;

                // set default background color
                this.SetStyleProperty("BackgroundColor", new FaceUI.DataTypes.StyleProperty.$ctor1(Microsoft.Xna.Framework.Color.White.$clone()));

                // if have background, add default space-after
                if (background) {
                    this.SpaceAfter = Microsoft.Xna.Framework.Vector2.op_Multiply$1(Microsoft.Xna.Framework.Vector2.One.$clone(), FaceUI.Entities.Icon.BackgroundSize);
                }

                // update default style
                this.UpdateStyle(FaceUI.Entities.Icon.DefaultStyle);
            },
            /**
             * Create default icon.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Icon
             * @memberof FaceUI.Entities.Icon
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Icon.$ctor1.call(this, FaceUI.Entities.IconType.Apple);
            }
        },
        methods: {
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Icon
             * @memberof FaceUI.Entities.Icon
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // draw background
                if (this.DrawBackground) {
                    // get background color based on phase
                    var backColor = Microsoft.Xna.Framework.Color.White.$clone();
                    switch (phase) {
                        case FaceUI.Entities.DrawPhase.Base: 
                            backColor = this.GetActiveStyle("BackgroundColor").asColor.$clone();
                            break;
                        case FaceUI.Entities.DrawPhase.Outline: 
                            backColor = this.OutlineColor.$clone();
                            break;
                        case FaceUI.Entities.DrawPhase.Shadow: 
                            backColor = this.ShadowColor.$clone();
                            break;
                    }

                    // get background dest rect
                    var dest = this._destRect.$clone();
                    dest.X = (dest.X - (((Bridge.Int.div(FaceUI.Entities.Icon.BackgroundSize, 2)) | 0))) | 0;
                    dest.Y = (dest.Y - (((Bridge.Int.div(FaceUI.Entities.Icon.BackgroundSize, 2)) | 0))) | 0;
                    dest.Width = (dest.Width + FaceUI.Entities.Icon.BackgroundSize) | 0;
                    dest.Height = (dest.Height + FaceUI.Entities.Icon.BackgroundSize) | 0;

                    // draw background
                    FaceUI.UserInterface.Active.DrawUtils.DrawImage(spriteBatch, FaceUI.Resources.IconBackgroundTexture, dest.$clone(), backColor.$clone());
                }

                // now draw the image itself
                FaceUI.Entities.Image.prototype.DrawEntity.call(this, spriteBatch, phase);
            }
        }
    });

    /**
     * Label entity is a subclass of Paragraph. Basically its the same, but with a different
     default styling, and serves as a sugarcoat to quickly create labels for widgets.
     *
     * @public
     * @class FaceUI.Entities.Label
     * @augments FaceUI.Entities.Paragraph
     */
    Bridge.define("FaceUI.Entities.Label", {
        inherits: [FaceUI.Entities.Paragraph],
        statics: {
            fields: {
                /**
                 * Default styling for labels. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Label
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Label);
                }
            }
        },
        ctors: {
            /**
             * Create the label.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Label
             * @memberof FaceUI.Entities.Label
             * @param   {string}                              text      Label text.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Optional label size.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (text, anchor, size, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Paragraph.$ctor2.call(this, text, anchor, size, offset, void 0);
                this.UpdateStyle(FaceUI.Entities.Label.DefaultStyle);
            },
            /**
             * Create label with default params and empty text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Label
             * @memberof FaceUI.Entities.Label
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Label.$ctor1.call(this, "");
            }
        }
    });

    /**
     * A graphical panel or form you can create and add entities to.
     Used to group together entities with common logic.
     *
     * @public
     * @class FaceUI.Entities.Panel
     * @augments FaceUI.Entities.PanelBase
     */
    Bridge.define("FaceUI.Entities.Panel", {
        inherits: [FaceUI.Entities.PanelBase],
        statics: {
            fields: {
                /**
                 * Default styling for panels. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.Panel
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.Panel);
                }
            }
        },
        fields: {
            _overflowMode: 0,
            /**
             * Panel scrollbar for specific overflow modes.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Panel
             * @type FaceUI.Entities.VerticalScrollbar
             */
            _scrollbar: null,
            /**
             * If panel got scrollbars, use this render target to scroll.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.Panel
             * @type Microsoft.Xna.Framework.Graphics.RenderTarget2D
             */
            _renderTarget: null,
            /**
             * Store the original destination rectangle if changing due to render target.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.Panel
             * @type Microsoft.Xna.Framework.Rectangle
             */
            _originalInternalDestRect: null
        },
        props: {
            /**
             * Get the scrollbar of this panel.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.Panel
             * @function Scrollbar
             * @type FaceUI.Entities.VerticalScrollbar
             */
            Scrollbar: {
                get: function () {
                    return this._scrollbar;
                }
            },
            /**
             * Set / get panel overflow behavior.
             Note: some modes require Render Targets, eg setting the 'UseRenderTarget' to true.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.Panel
             * @function PanelOverflowBehavior
             * @type FaceUI.Entities.PanelOverflowBehavior
             */
            PanelOverflowBehavior: {
                get: function () {
                    return this._overflowMode;
                },
                set: function (value) {
                    this._overflowMode = value;
                    this.UpdateOverflowMode();
                }
            },
            /**
             * Get overflow scrollbar value.
             *
             * @instance
             * @protected
             * @override
             * @readonly
             * @memberof FaceUI.Entities.Panel
             * @function OverflowScrollVal
             * @type Microsoft.Xna.Framework.Point
             */
            OverflowScrollVal: {
                get: function () {
                    return this._scrollbar == null ? Microsoft.Xna.Framework.Point.Zero : new Microsoft.Xna.Framework.Point.$ctor2(0, this._scrollbar.Value);
                }
            }
        },
        ctors: {
            init: function () {
                this._originalInternalDestRect = new Microsoft.Xna.Framework.Rectangle();
                this._overflowMode = FaceUI.Entities.PanelOverflowBehavior.Overflow;
            },
            /**
             * Create the panel.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @param   {Microsoft.Xna.Framework.Vector2}     size      Panel size.
             * @param   {FaceUI.Entities.PanelSkin}           skin      Panel skin (texture to use). Use PanelSkin.None for invisible panels.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (size, skin, anchor, offset) {
                if (skin === void 0) { skin = 0; }
                if (anchor === void 0) { anchor = 0; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.PanelBase.$ctor1.call(this, size, skin, anchor, offset);
                this.UpdateStyle(FaceUI.Entities.Panel.DefaultStyle);
                if (size.Y === -1) {
                    this.AdjustHeightAutomatically = true;
                }
            },
            /**
             * Create the panel with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.Panel.$ctor1.call(this, new Microsoft.Xna.Framework.Vector2.$ctor2(500, 500));
            }
        },
        methods: {
            /**
             * Calculate and return the destination rectangle, eg the space this entity is rendered on.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {Microsoft.Xna.Framework.Rectangle}        Destination rectangle.
             */
            CalcDestRect: function () {
                if (this.AdjustHeightAutomatically && this.Size.Y <= 0) {
                    this._size.Y = 1;
                }
                return FaceUI.Entities.PanelBase.prototype.CalcDestRect.call(this);
            },
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.PanelBase.prototype.InitAfterDeserialize.call(this);
                var scrollbar = this.Find(FaceUI.Entities.VerticalScrollbar, "__scrollbar");
                if (scrollbar != null) {
                    this.RemoveChild(scrollbar);
                }
                this.UpdateOverflowMode();
            },
            /**
             * Dispose unmanaged resources related to this panel (render target).
             *
             * @instance
             * @public
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {void}
             */
            Dispose: function () {
                this.DisposeRenderTarget();
            },
            /**
             * Get the rectangle used for target texture for this panel.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {Microsoft.Xna.Framework.Rectangle}        Destination rect for target texture.
             */
            GetRenderTargetRect: function () {
                var ret = this._destRectInternal.$clone();
                ret.Width = (ret.Width + (Bridge.Int.mul(this.GetScrollbarWidth(), 2))) | 0;
                return ret.$clone();
            },
            /**
             * Called before drawing child entities of this entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch used to draw entities.
             * @return  {void}
             */
            BeforeDrawChildren: function (spriteBatch) {
                // if overflow mode is simply overflow, dispose render target if such exist
                if (this._overflowMode === FaceUI.Entities.PanelOverflowBehavior.Overflow) {
                    this.DisposeRenderTarget();
                } else {
                    this.UpdatePanelRenderTarget(spriteBatch);
                }

            },
            /**
             * Set the panel's height to match its children automatically.
             Note: to make this happen on its own every frame, set the 'AdjustHeightAutomatically' property to true.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {boolean}        True if succeed to adjust height, false if couldn't for whatever reason.
             */
            SetHeightBasedOnChildren: function () {
                // sanity check - not supported with scrollbar
                if (this.PanelOverflowBehavior === FaceUI.Entities.PanelOverflowBehavior.VerticalScroll) {
                    throw new FaceUI.Exceptions.InvalidStateException.$ctor1("Cannot set panel height automatically while having vertical scrollbar!");
                }

                // call base implementation
                return FaceUI.Entities.PanelBase.prototype.SetHeightBasedOnChildren.call(this);
            },
            /**
             * Update panel's render target.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch
             * @return  {void}
             */
            UpdatePanelRenderTarget: function (spriteBatch) {
                // create the render target for this panel
                var targetRect = this.GetRenderTargetRect();
                if (this._renderTarget == null || this._renderTarget.Width !== targetRect.Width || this._renderTarget.Height !== targetRect.Height) {
                    // recreate render target
                    this.DisposeRenderTarget();
                    this._renderTarget = new Microsoft.Xna.Framework.Graphics.RenderTarget2D.$ctor2(FaceUI.Utils.GraphicDeviceWrapper.op_Implicit(spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice), targetRect.Width, targetRect.Height, false, spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.PresentationParameters.BackBufferFormat, spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.PresentationParameters.DepthStencilFormat, 0, Microsoft.Xna.Framework.Graphics.RenderTargetUsage.PreserveContents);
                }

                // clear render target
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.SetRenderTarget(this._renderTarget);
                spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$GraphicsDevice.Clear(Microsoft.Xna.Framework.Color.Transparent.$clone());

                // bind the render target
                FaceUI.UserInterface.Active.DrawUtils.PushRenderTarget(this._renderTarget);

                // set internal dest rect
                this._originalInternalDestRect = this._destRectInternal.$clone();
                this._destRectInternal.X = 2;
                this._destRectInternal.Y = 2;
                this._destRectInternal.Width = (this._destRectInternal.Width - 2) | 0;
                this._destRectInternal.Height = (this._destRectInternal.Height - 2) | 0;

                // if in scrolling mode, set scrollbar
                if (this._overflowMode === FaceUI.Entities.PanelOverflowBehavior.VerticalScroll) {
                    // move items position based on scrollbar
                    this._destRectInternal.Y = (this._destRectInternal.Y - this._scrollbar.Value) | 0;

                    // update scrollbar position
                    this._scrollbar.Anchor = FaceUI.Entities.Anchor.CenterLeft;
                    this._scrollbar.Offset = (Microsoft.Xna.Framework.Vector2.op_Division$1(new Microsoft.Xna.Framework.Vector2.$ctor2(((this._destRectInternal.Width + 5) | 0), ((-this._destRectInternal.Y) | 0)), this.GlobalScale));
                    if (this._scrollbar.Parent != null) {
                        this._scrollbar.BringToFront();
                    } else {
                        this.AddChild(this._scrollbar);
                    }
                }

                // to make sure the dest rect will not be recalculated while drawing children
                this.ClearDirtyFlag(true);
            },
            /**
             * Calculate and return the internal destination rectangle (note: this relay on the dest rect having a valid value first).
             *
             * @instance
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {Microsoft.Xna.Framework.Rectangle}        Internal destination rectangle.
             */
            CalcInternalRect: function () {
                FaceUI.Entities.PanelBase.prototype.CalcInternalRect.call(this);
                this._destRectInternal.Width = (this._destRectInternal.Width - (this.GetScrollbarWidth())) | 0;
                return this._destRectInternal.$clone();
            },
            /**
             * Get scrollbar width in pixels.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {number}        Scrollbar width, or 0 if have no scrollbar.
             */
            GetScrollbarWidth: function () {
                return this._scrollbar != null ? this._scrollbar.GetActualDestRect().Width : 0;
            },
            /**
             * Called after drawing child entities of this entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch used to draw entities.
             * @return  {void}
             */
            AfterDrawChildren: function (spriteBatch) {
                // if overflow mode is simply overflow, do nothing.
                if (this._overflowMode === FaceUI.Entities.PanelOverflowBehavior.Overflow) {
                    return;
                }

                // return dest rect back to normal
                this._destRectInternal = this._originalInternalDestRect.$clone();
                this._destRectVersion = (this._destRectVersion + 1) >>> 0;

                // if this panel got a render target
                if (this._renderTarget != null) {
                    // unbind the render target
                    FaceUI.UserInterface.Active.DrawUtils.PopRenderTarget();

                    // draw the render target itself
                    FaceUI.UserInterface.Active.DrawUtils.StartDraw(spriteBatch, this.IsDisabled());
                    spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$Draw(this._renderTarget, this.GetRenderTargetRect(), Microsoft.Xna.Framework.Color.White.$clone());
                    FaceUI.UserInterface.Active.DrawUtils.EndDraw(spriteBatch);

                    // fix scrollbar positioning
                    if (this._scrollbar != null) {
                        this._destRectInternal.Y = (this._destRectInternal.Y - this._scrollbar.Value) | 0;
                        this._destRectInternal.Width = (this._destRectInternal.Width - this._scrollbar.GetActualDestRect().Width) | 0;
                        this._scrollbar.UpdateDestinationRects();

                        // set destination rect back to normal
                        this._destRectInternal = this._originalInternalDestRect.$clone();
                    }
                }
            },
            /**
             * Called after a change in overflow mode.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {void}
             */
            UpdateOverflowMode: function () {
                var $t;
                // if its vertical scroll mode:
                if (this._overflowMode === FaceUI.Entities.PanelOverflowBehavior.VerticalScroll) {
                    // if need to create scrollbar
                    if (this._scrollbar == null) {
                        // create scrollbar
                        this._scrollbar = ($t = new FaceUI.Entities.VerticalScrollbar.$ctor1(0, 0, FaceUI.Entities.Anchor.TopRight), $t.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone(), $t.AdjustMaxAutomatically = true, $t.Identifier = "__scrollbar", $t._hiddenInternalEntity = true, $t);
                        var prev_needToSortChildren = this._needToSortChildren;
                        this.AddChild(this._scrollbar);
                        this._needToSortChildren = prev_needToSortChildren;
                    }
                } else {
                    if (this._scrollbar != null) {
                        this._scrollbar.RemoveFromParent();
                    }
                }
            },
            /**
             * Dispose the render target (only if use) and set it to null.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @return  {void}
             */
            DisposeRenderTarget: function () {
                if (this._renderTarget != null) {
                    this._renderTarget.Dispose();
                    this._renderTarget = null;
                }
            },
            /**
             * Called every frame to update the children of this entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.Panel
             * @memberof FaceUI.Entities.Panel
             * @param   {FaceUI.Entities.Entity}           targetEntity        The deepest child entity with highest priority that we point on and can be interacted with.
             * @param   {FaceUI.Entities.Entity}           dragTargetEntity    The deepest child dragable entity with highest priority that we point on and can be drag if mouse down.
             * @param   {System.Boolean}                   wasEventHandled     Set to true if current event was already handled by a deeper child.
             * @param   {Microsoft.Xna.Framework.Point}    scrollVal           Combined scrolling value (panels with scrollbar etc) of all parents.
             * @return  {void}
             */
            UpdateChildren: function (targetEntity, dragTargetEntity, wasEventHandled, scrollVal) {
                var $t;
                // if not in overflow mode and mouse not on this panel boundaries, skip calling children
                // this is so we won't target / activate entities that are not visible
                var skipChildren = false;
                if (this._overflowMode !== FaceUI.Entities.PanelOverflowBehavior.Overflow) {
                    var mousePos = this.GetMousePos();
                    if (mousePos.X < this._destRectInternal.Left || mousePos.X > this._destRectInternal.Right || mousePos.Y < this._destRectInternal.Top || mousePos.Y > this._destRectInternal.Bottom) {
                        skipChildren = true;
                    }
                }

                // before updating children, disable scrollbar
                if (this._scrollbar != null) {
                    this._scrollbar.Enabled = false;
                }

                // call base update children function
                if (!skipChildren) {
                    FaceUI.Entities.PanelBase.prototype.UpdateChildren.call(this, targetEntity, dragTargetEntity, wasEventHandled, scrollVal.$clone());
                } else {
                    $t = Bridge.getEnumerator(this._children);
                    try {
                        while ($t.moveNext()) {
                            var child = $t.Current;
                            child.UpdateAnimators(true);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }

                // re-enable scrollbar and update it
                if (this._scrollbar != null) {
                    this._scrollbar.Enabled = true;
                    this._scrollbar.Update(targetEntity, dragTargetEntity, wasEventHandled, Microsoft.Xna.Framework.Point.op_Subtraction(scrollVal.$clone(), this.OverflowScrollVal.$clone()));
                }
            }
        }
    });

    /**
     * A sub-class of the slider entity, with graphics more fitting for a progress bar or things like hp bar etc.
     Behaves the same as a slider, if you want it to be for display only (and not changeable by user), simple set Locked = true.
     *
     * @public
     * @class FaceUI.Entities.ProgressBar
     * @augments FaceUI.Entities.Slider
     */
    Bridge.define("FaceUI.Entities.ProgressBar", {
        inherits: [FaceUI.Entities.Slider],
        statics: {
            fields: {
                /**
                 * Default styling for progress bar. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ProgressBar
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Default styling for the progress bar fill part. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.ProgressBar
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultFillStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultFillStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.ProgressBar);
                }
            }
        },
        fields: {
            /**
             * The fill part of the progress bar.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.ProgressBar
             * @type FaceUI.Entities.Image
             */
            ProgressFill: null,
            /**
             * An optional caption to display over the center of the progress bar.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.ProgressBar
             * @type FaceUI.Entities.Label
             */
            Caption: null
        },
        ctors: {
            /**
             * Create progress bar with size.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ProgressBar
             * @memberof FaceUI.Entities.ProgressBar
             * @param   {number}                              min       Min value.
             * @param   {number}                              max       Max value.
             * @param   {Microsoft.Xna.Framework.Vector2}     size      Entity size.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor2: function (min, max, size, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Slider.$ctor2.call(this, min, max, size, FaceUI.Entities.SliderSkin.Default, anchor, offset);
                // update default styles
                this.UpdateStyle(FaceUI.Entities.ProgressBar.DefaultStyle);

                if (!FaceUI.UserInterface.Active._isDeserializing) {
                    // create the fill part
                    this.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                    this.ProgressFill = new FaceUI.Entities.Image.$ctor1(FaceUI.Resources.ProgressBarFillTexture, Microsoft.Xna.Framework.Vector2.Zero.$clone(), FaceUI.Entities.ImageDrawMode.Stretch, FaceUI.Entities.Anchor.CenterLeft);
                    this.ProgressFill.UpdateStyle(FaceUI.Entities.ProgressBar.DefaultFillStyle);
                    this.ProgressFill._hiddenInternalEntity = true;
                    this.ProgressFill.Identifier = "_progress_fill";
                    this.AddChild(this.ProgressFill, true);

                    // create caption on progressbar
                    this.Caption = new FaceUI.Entities.Label.$ctor1("", FaceUI.Entities.Anchor.Center);
                    this.Caption.ClickThrough = true;
                    this.Caption._hiddenInternalEntity = true;
                    this.Caption.Identifier = "_progress_caption";
                    this.AddChild(this.Caption);
                }
            },
            /**
             * Create progress bar.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ProgressBar
             * @memberof FaceUI.Entities.ProgressBar
             * @param   {number}                              min       Min value.
             * @param   {number}                              max       Max value.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (min, max, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                FaceUI.Entities.ProgressBar.$ctor2.call(this, min, max, FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone(), anchor, offset);
            },
            /**
             * Create progressbar with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.ProgressBar
             * @memberof FaceUI.Entities.ProgressBar
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.ProgressBar.$ctor1.call(this, 0, 10);
            }
        },
        methods: {
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.ProgressBar
             * @memberof FaceUI.Entities.ProgressBar
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.Slider.prototype.InitAfterDeserialize.call(this);
                this.Caption = this.Find(FaceUI.Entities.Label, "_progress_caption", false);
                this.Caption._hiddenInternalEntity = true;
                this.ProgressFill = this.Find(FaceUI.Entities.Image, "_progress_fill");
                this.ProgressFill._hiddenInternalEntity = true;
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.ProgressBar
             * @memberof FaceUI.Entities.ProgressBar
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // get progressbar frame width
                var progressbarFrameWidth = FaceUI.Resources.ProgressBarData.FrameWidth;

                // draw progress bar frame
                var barTexture = FaceUI.Resources.ProgressBarTexture;
                FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, barTexture, this._destRect.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(progressbarFrameWidth, 0.0), 1, this.FillColor.$clone());

                // calc frame actual height and scaling factor (this is needed to calc frame width in pixels)
                var frameSizeTexture = new Microsoft.Xna.Framework.Vector2.$ctor2(barTexture.Width * progressbarFrameWidth, barTexture.Height);
                var frameSizeRender = frameSizeTexture.$clone();
                var ScaleXfac = this._destRect.Height / frameSizeRender.Y;

                // calc frame width in pixels
                this._frameActualWidth = progressbarFrameWidth * barTexture.Width * ScaleXfac;

                // update the progress bar color and size
                var markWidth = Bridge.Int.clip32((this._destRect.Width - this._frameActualWidth * 2) * this.GetValueAsPercent());
                this.ProgressFill.Offset = (new Microsoft.Xna.Framework.Vector2.$ctor2(this._frameActualWidth / this.GlobalScale, 0));
                this.ProgressFill.Size = Microsoft.Xna.Framework.Vector2.op_Division$1(new Microsoft.Xna.Framework.Vector2.$ctor2(markWidth, this._destRectInternal.Height), this.GlobalScale);
                this.ProgressFill.Visible = markWidth > 0;
            }
        }
    });

    /**
     * A Radio Button entity is like a checkbox (label with a box next to it that can be checked / unchecked) with the exception that whenever a radio button is checked, all its siblings are unchecked automatically.
     *
     * @public
     * @class FaceUI.Entities.RadioButton
     * @augments FaceUI.Entities.CheckBox
     */
    Bridge.define("FaceUI.Entities.RadioButton", {
        inherits: [FaceUI.Entities.CheckBox],
        statics: {
            fields: {
                /**
                 * Default styling for the radio button itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.RadioButton
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Default styling for radio button label. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.RadioButton
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultParagraphStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultParagraphStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.RadioButton);
                }
            }
        },
        fields: {
            /**
             * If set to true, clicking on an already checked radio button will uncheck if. If false (default), will do nothing.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RadioButton
             * @default false
             * @type boolean
             */
            CanUncheck: false
        },
        ctors: {
            init: function () {
                this.CanUncheck = false;
            },
            /**
             * Create the radio button.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RadioButton
             * @memberof FaceUI.Entities.RadioButton
             * @param   {string}                              text         Radio button label text.
             * @param   {FaceUI.Entities.Anchor}              anchor       Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size         Radio button size.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset       Offset from anchor position.
             * @param   {boolean}                             isChecked    If true, radio button will be created as checked.
             * @return  {void}
             */
            $ctor1: function (text, anchor, size, offset, isChecked) {
                if (anchor === void 0) { anchor = 9; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }
                if (isChecked === void 0) { isChecked = false; }

                this.$initialize();
                FaceUI.Entities.CheckBox.$ctor1.call(this, text, anchor, size, offset, isChecked);
                this.UpdateStyle(FaceUI.Entities.RadioButton.DefaultStyle);
                if (this.TextParagraph != null) {
                    this.TextParagraph.UpdateStyle(FaceUI.Entities.RadioButton.DefaultParagraphStyle);
                }
            },
            /**
             * Create radiobutton without text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RadioButton
             * @memberof FaceUI.Entities.RadioButton
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.RadioButton.$ctor1.call(this, "");
            }
        },
        methods: {
            /**
             * Helper function to get radio button texture based on state and current value.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.RadioButton
             * @memberof FaceUI.Entities.RadioButton
             * @return  {Microsoft.Xna.Framework.Graphics.Texture2D}        Which texture to use for the checkbox.
             */
            GetTexture: function () {
                var state = this._entityState;
                if (state !== FaceUI.Entities.EntityState.MouseDown && this.Checked) {
                    state = FaceUI.Entities.EntityState.MouseDown;
                }
                return FaceUI.Resources.RadioTextures.getItem(state);
            },
            /**
             * Handle value change.
             RadioButton override this function to handle the task of unchecking siblings when selected.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.RadioButton
             * @memberof FaceUI.Entities.RadioButton
             * @return  {void}
             */
            DoOnValueChange: function () {
                var $t;
                // if not checked, do nothing
                if (!this.Checked) {
                    return;
                }

                // disable all sibling radio buttons
                if (this._parent != null) {
                    $t = Bridge.getEnumerator(this._parent._children);
                    try {
                        while ($t.moveNext()) {
                            var entity = $t.Current;
                            // skip self
                            if (Bridge.referenceEquals(entity, this)) {
                                continue;
                            }

                            // if entity is a radio button make sure its disabled
                            if (Bridge.is(entity, FaceUI.Entities.RadioButton)) {
                                var radio = Bridge.cast(entity, FaceUI.Entities.RadioButton);
                                if (radio.Checked) {
                                    radio.Checked = false;
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }

                // call base handler
                FaceUI.Entities.CheckBox.prototype.DoOnValueChange.call(this);
            },
            /**
             * Handle mouse click event. 
             Radio buttons entity override this function to handle value toggle.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.RadioButton
             * @memberof FaceUI.Entities.RadioButton
             * @return  {void}
             */
            DoOnClick: function () {
                // call base handler
                FaceUI.Entities.CheckBox.prototype.DoOnClick.call(this);

                // if cannot be unchecked, make sure its checked
                if (!this.CanUncheck) {
                    this.Checked = true;
                }
            }
        }
    });

    /**
     * @memberof FaceUI.Entities
     * @callback FaceUI.Entities.RichParagraph.PerCharacterManipulationFunc
     * @param   {FaceUI.Entities.RichParagraph}      paragraph       
     * @param   {number}                             currChar        
     * @param   {number}                             index           
     * @param   {Microsoft.Xna.Framework.Color}      fillColor       
     * @param   {Microsoft.Xna.Framework.Color}      outlineColor    
     * @param   {System.Int32}                       outlineWidth    
     * @param   {Microsoft.Xna.Framework.Vector2}    offset          
     * @param   {System.Single}                      scale
     * @return  {void}
     */

    /**
     * Multicolor Paragraph is a paragraph that supports in-text color tags that changes the fill color of the text.
     *
     * @public
     * @class FaceUI.Entities.RichParagraph
     * @augments FaceUI.Entities.Paragraph
     */
    Bridge.define("FaceUI.Entities.RichParagraph", {
        inherits: [FaceUI.Entities.Paragraph],
        statics: {
            fields: {
                /**
                 * Default styling for paragraphs. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.RichParagraph
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.RichParagraph);
                }
            }
        },
        fields: {
            /**
             * Optional manipulators we can add to change per-character color and position.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraph
             * @type FaceUI.Entities.RichParagraph.PerCharacterManipulationFunc
             */
            PerCharacterManipulators: null,
            _enableStyleInstructions: false,
            _needUpdateStyleInstructions: false,
            /**
             * List of parsed style-changing instructions in this paragraph, and the position they apply.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.RichParagraph
             * @type System.Collections.Generic.Dictionary$2
             */
            _styleInstructions: null
        },
        props: {
            /**
             * If true, will enable style-changing instructions.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.RichParagraph
             * @function EnableStyleInstructions
             * @type boolean
             */
            EnableStyleInstructions: {
                get: function () {
                    return this._enableStyleInstructions;
                },
                set: function (value) {
                    this._enableStyleInstructions = value;
                    this._needUpdateStyleInstructions = true;
                }
            },
            /**
             * Get / Set the paragraph text.
             *
             * @instance
             * @public
             * @override
             * @memberof FaceUI.Entities.RichParagraph
             * @function Text
             * @type string
             */
            Text: {
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    if (!Bridge.referenceEquals(this._text, value)) {
                        this._text = value;
                        this.MarkAsDirty();
                        if (this.EnableStyleInstructions) {
                            this._needUpdateStyleInstructions = true;
                        }
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this._enableStyleInstructions = true;
                this._needUpdateStyleInstructions = true;
                this._styleInstructions = new (System.Collections.Generic.Dictionary$2(System.Int32,FaceUI.Entities.RichParagraphStyleInstruction))();
            },
            /**
             * Create the paragraph.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @param   {string}                              text      Paragraph text (accept new line characters).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Paragraph size (note: not font size, but the region that will contain the paragraph).
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @param   {?number}                             scale     Optional font size.
             * @return  {void}
             */
            $ctor2: function (text, anchor, size, offset, scale) {
                if (anchor === void 0) { anchor = 9; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }
                if (scale === void 0) { scale = null; }

                this.$initialize();
                FaceUI.Entities.Paragraph.$ctor2.call(this, text, anchor, size, offset, scale);
            },
            /**
             * Create default multicolor paragraph with empty text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.RichParagraph.$ctor2.call(this, "");
            },
            /**
             * Create the paragraph with optional fill color and font size.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @param   {string}                              text      Paragraph text (accept new line characters).
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {Microsoft.Xna.Framework.Color}       color     Text fill color.
             * @param   {?number}                             scale     Optional font size.
             * @param   {?Microsoft.Xna.Framework.Vector2}    size      Paragraph size (note: not font size, but the region that will contain the paragraph).
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (text, anchor, color, scale, size, offset) {
                if (scale === void 0) { scale = null; }
                if (size === void 0) { size = null; }
                if (offset === void 0) { offset = null; }

                this.$initialize();
                FaceUI.Entities.Paragraph.$ctor1.call(this, text, anchor, color, scale, size, offset);
            }
        },
        methods: {
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.Paragraph.prototype.InitAfterDeserialize.call(this);
                this._needUpdateStyleInstructions = true;
            },
            /**
             * Parse special style-changing instructions inside the text.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @return  {void}
             */
            ParseStyleInstructions: function () {
                var $t;
                // clear previous color instructions
                this._styleInstructions.clear();

                // if color instructions are disabled, stop here
                if (!this.EnableStyleInstructions) {
                    this._needUpdateStyleInstructions = false;
                    return;
                }

                // get opening and closing denotes
                var openingDenote = FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsOpening;
                var closingDenote = FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsClosing;
                var denotesLength = (((openingDenote.length + closingDenote.length) | 0));

                // find and parse color instructions
                if (System.String.contains(this._text,openingDenote)) {
                    var iLastLength = 0;

                    var oMatches = FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsRegex.matches(this._text);
                    $t = Bridge.getEnumerator(oMatches);
                    try {
                        while ($t.moveNext()) {
                            var oMatch = Bridge.cast($t.Current, System.Text.RegularExpressions.Match);
                            var key = oMatch.getValue().substr(openingDenote.length, ((oMatch.getValue().length - denotesLength) | 0));
                            var sColor = oMatch.getValue().substr(openingDenote.length, ((oMatch.getValue().length - denotesLength) | 0));
                            this._styleInstructions.set(((oMatch.getIndex() - iLastLength) | 0), FaceUI.Entities.RichParagraphStyleInstruction._instructions.get(key).$clone());
                            iLastLength = (iLastLength + oMatch.getValue().length) | 0;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    // remove all the style instructions from text so it won't be shown
                    this._text = FaceUI.Entities.RichParagraphStyleInstruction._styleInstructionsRegex.replace(this._text, "");
                }

                // no longer need to update colors
                this._needUpdateStyleInstructions = false;
            },
            /**
             * Draw entity outline. Note: in paragraph its a special case and we implement it inside the DrawEntity function.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @return  {void}
             */
            DrawEntityOutline: function (spriteBatch) { },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.RichParagraph
             * @memberof FaceUI.Entities.RichParagraph
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                var $t;
                // update processed text if needed
                if (this._needUpdateStyleInstructions) {
                    this.ParseStyleInstructions();
                    this.UpdateDestinationRects();
                }

                // if there are color changing instructions in paragraph, draw with color changes
                if (this._styleInstructions.count > 0 || !Bridge.staticEquals(this.PerCharacterManipulators, null)) {
                    // iterate characters in text and check when there's an instruction to apply
                    var iTextIndex = 0;
                    var currColor = { v : Microsoft.Xna.Framework.Color.White.$clone() };
                    var currOutlineColor = { v : Microsoft.Xna.Framework.Color.Black.$clone() };
                    var currFont = null;
                    var characterSize = this.GetCharacterActualSize();
                    var currPosition = new Microsoft.Xna.Framework.Vector2.$ctor2(this._position.X - characterSize.X, this._position.Y);
                    var currOutlineWidth = { v : 0 };

                    // function to reset styles back to defaults
                    var ResetToDefaults = Bridge.fn.bind(this, function () {
                        currColor.v = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(this.FillColor.$clone());
                        currFont = this._currFont;
                        currOutlineWidth.v = this.OutlineWidth;
                        currOutlineColor.v = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(this.OutlineColor.$clone());
                        characterSize = this.GetCharacterActualSize();
                    });
                    ResetToDefaults();

                    $t = Bridge.getEnumerator(this._processedText);
                    try {
                        while ($t.moveNext()) {
                            var currCharacter = $t.Current;
                            // if we found style instruction:
                            var styleInstruction = { v : new FaceUI.Entities.RichParagraphStyleInstruction() };
                            if (this._styleInstructions.tryGetValue(iTextIndex, styleInstruction)) {
                                // reset properties
                                if (styleInstruction.v.ResetStyles) {
                                    ResetToDefaults();
                                }

                                // set fill color
                                if (System.Nullable.hasValue(styleInstruction.v.FillColor)) {
                                    currColor.v = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(System.Nullable.getValue(styleInstruction.v.FillColor).$clone());
                                }

                                // set font style
                                if (System.Nullable.hasValue(styleInstruction.v.FontStyle)) {
                                    currFont = FaceUI.Resources.Fonts[System.Array.index(System.Nullable.getValue(styleInstruction.v.FontStyle), FaceUI.Resources.Fonts)];
                                }

                                // set outline width
                                if (System.Nullable.hasValue(styleInstruction.v.OutlineWidth)) {
                                    currOutlineWidth.v = System.Nullable.getValue(styleInstruction.v.OutlineWidth);
                                }

                                // set outline color
                                if (System.Nullable.hasValue(styleInstruction.v.OutlineColor)) {
                                    currOutlineColor.v = FaceUI.UserInterface.Active.DrawUtils.FixColorOpacity(System.Nullable.getValue(styleInstruction.v.OutlineColor).$clone());
                                }
                            }

                            // adjust character position
                            if (currCharacter === 10) {
                                currPosition.X = this._position.X - characterSize.X;
                                currPosition.Y += currFont.LineSpacing * this._actualScale;
                            } else {
                                iTextIndex = (iTextIndex + 1) | 0;
                                currPosition.X += characterSize.X;
                            }

                            // get current char as string
                            var currText = FaceUI.Resources.GetStringForChar(currCharacter);

                            // do per-character manipulations
                            var offset = { v : Microsoft.Xna.Framework.Vector2.Zero.$clone() };
                            if (!Bridge.staticEquals(this.PerCharacterManipulators, null)) {
                                this.PerCharacterManipulators(this, currCharacter, iTextIndex, currColor, currOutlineColor, currOutlineWidth, offset, Bridge.ref(this, "_actualScale"));
                            }

                            // draw outline
                            this.DrawTextOutline$1(spriteBatch, currText, currOutlineWidth.v, currFont, this._actualScale, Microsoft.Xna.Framework.Vector2.op_Addition(currPosition.$clone(), offset.v.$clone()), currOutlineColor.v.$clone(), this._fontOrigin.$clone());

                            // fix color opacity and draw
                            spriteBatch.FaceUI$Utils$ISpriteBatchWrapper$DrawString(currFont, currText, Microsoft.Xna.Framework.Vector2.op_Addition(currPosition.$clone(), offset.v.$clone()), currColor.v.$clone(), 0, this._fontOrigin.$clone(), this._actualScale, Microsoft.Xna.Framework.Graphics.SpriteEffects.None, 0.5);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                } else {
                    FaceUI.Entities.Paragraph.prototype.DrawEntity.call(this, spriteBatch, phase);
                }
            }
        }
    });

    /**
     * List of items (strings) user can scroll and pick from.
     *
     * @public
     * @class FaceUI.Entities.SelectList
     * @augments FaceUI.Entities.PanelBase
     */
    Bridge.define("FaceUI.Entities.SelectList", {
        inherits: [FaceUI.Entities.PanelBase],
        statics: {
            fields: {
                /**
                 * Default styling for select list labels. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.SelectList
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultParagraphStyle: null,
                /**
                 * Default styling for the select list itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.SelectList
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultParagraphStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.SelectList);
                }
            }
        },
        fields: {
            _value: null,
            _index: 0,
            _prevSize: null,
            _paragraphs: null,
            _scrollbar: null,
            _hadResizeWhileNotVisible: false,
            /**
             * Extra space (in pixels) between items on Y axis.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default 0
             * @type number
             */
            ExtraSpaceBetweenLines: 0,
            /**
             * Scale items in list.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default 1.0
             * @type number
             */
            ItemsScale: 0,
            /**
             * Special callback to execute when list size changes.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @type FaceUI.EventCallback
             */
            OnListChange: null,
            /**
             * If true and an item in the list is too long for its width, the list will cut its value to fit width.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default true
             * @type boolean
             */
            ClipTextIfOverflow: false,
            /**
             * String to append when clipping items width.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default ".."
             * @type string
             */
            AddWhenClipping: null,
            /**
             * When set to true, users cannot change the currently selected value.
             Note: unlike the basic entity "Locked" that prevent all input from entity and its children,
             this method of locking will still allow users to scroll through the list, thus making it useable
             as a read-only list entity.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default false
             * @type boolean
             */
            LockSelection: false,
            /**
             * Optional dictionary of list indexes you want to lock.
             Every item in this dictionary set to true will be locked and user won't be able to select it.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @type System.Collections.Generic.Dictionary$2
             */
            LockedItems: null,
            _list: null,
            /**
             * If true and user clicks on the item currently selected item, it will still invoke value change event as if 
             a new value was selected.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default false
             * @type boolean
             */
            AllowReselectValue: false,
            /**
             * If provided, will not be able to add any more of this number of items.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @default 0
             * @type number
             */
            MaxItems: 0
        },
        props: {
            /**
             * Get / set all items.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @function Items
             * @type Array.<string>
             */
            Items: {
                get: function () {
                    return this._list.ToArray();
                },
                set: function (value) {
                    this._list.clear();
                    this._list.AddRange(value);
                    this.OnListChanged();
                }
            },
            /**
             * How many items currently in the list.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.SelectList
             * @function Count
             * @type number
             */
            Count: {
                get: function () {
                    return this._list.Count;
                }
            },
            /**
             * Is the list currently empty.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.SelectList
             * @function Empty
             * @type boolean
             */
            Empty: {
                get: function () {
                    return this._list.Count === 0;
                }
            },
            /**
             * Currently selected item value (or null if none is selected).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @function SelectedValue
             * @type string
             */
            SelectedValue: {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    this.Select$1(value);
                }
            },
            /**
             * Currently selected item index (or -1 if none is selected).
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @function SelectedIndex
             * @type number
             */
            SelectedIndex: {
                get: function () {
                    return this._index;
                },
                set: function (value) {
                    this.Select(value);
                }
            },
            /**
             * Current scrollbar position.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.SelectList
             * @function ScrollPosition
             * @type number
             */
            ScrollPosition: {
                get: function () {
                    return this._scrollbar.Value;
                },
                set: function (value) {
                    this._scrollbar.Value = value;
                }
            },
            /**
             * Return if currently have a selected value.
             *
             * @instance
             * @public
             * @readonly
             * @memberof FaceUI.Entities.SelectList
             * @function HasSelectedValue
             * @type boolean
             */
            HasSelectedValue: {
                get: function () {
                    return this.SelectedIndex !== -1;
                }
            }
        },
        ctors: {
            init: function () {
                this._prevSize = new Microsoft.Xna.Framework.Point();
                this._index = -1;
                this._prevSize = Microsoft.Xna.Framework.Point.Zero.$clone();
                this._paragraphs = new (System.Collections.Generic.List$1(FaceUI.Entities.Paragraph)).ctor();
                this._hadResizeWhileNotVisible = false;
                this.ExtraSpaceBetweenLines = 0;
                this.ItemsScale = 1.0;
                this.ClipTextIfOverflow = true;
                this.AddWhenClipping = "..";
                this.LockSelection = false;
                this.LockedItems = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Boolean))();
                this._list = new (System.Collections.Generic.List$1(System.String)).ctor();
                this.AllowReselectValue = false;
                this.MaxItems = 0;
            },
            /**
             * Create the select list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {Microsoft.Xna.Framework.Vector2}     size      List size.
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @param   {FaceUI.Entities.PanelSkin}           skin      SelectList skin, eg which texture to use.
             * @return  {void}
             */
            $ctor2: function (size, anchor, offset, skin) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }
                if (skin === void 0) { skin = 4; }

                this.$initialize();
                FaceUI.Entities.PanelBase.$ctor1.call(this, size, skin, anchor, offset);
                // update style and set default padding
                this.UpdateStyle(FaceUI.Entities.SelectList.DefaultStyle);

                // create the scrollbar
                this._scrollbar = new FaceUI.Entities.VerticalScrollbar.$ctor1(0, 10, FaceUI.Entities.Anchor.CenterRight, new Microsoft.Xna.Framework.Vector2.$ctor2(-8, 0), false);
                this._scrollbar.Value = 0;
                this._scrollbar.Visible = false;
                this._scrollbar._hiddenInternalEntity = true;
                this.AddChild(this._scrollbar, false);
            },
            /**
             * Create the select list with default values.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {FaceUI.Entities.Anchor}              anchor    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset    Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (anchor, offset) {
                if (offset === void 0) { offset = null; }

                FaceUI.Entities.SelectList.$ctor2.call(this, FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone(), anchor, offset);
            },
            /**
             * Create emprt select list with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.SelectList.$ctor1.call(this, FaceUI.Entities.Anchor.Auto);
            }
        },
        methods: {
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.PanelBase.prototype.InitAfterDeserialize.call(this);
                this._scrollbar._hiddenInternalEntity = true;
            },
            /**
             * Called every time the list itself changes (items added / removed).
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            OnListChanged: function () {
                // if already placed in a parent, call the resize event to recalculate scollbar and labels
                if (this._parent != null) {
                    this.OnResize();
                }

                // make sure selected index is valid
                if (this.SelectedIndex >= this._list.Count) {
                    this.Unselect();
                }

                // invoke list change callback
                !Bridge.staticEquals(this.OnListChange, null) ? this.OnListChange(this) : null;
            },
            /**
             * Add value to list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {string}    value    Value to add.
             * @return  {void}
             */
            AddItem: function (value) {
                if (this.MaxItems !== 0 && this.Count >= this.MaxItems) {
                    return;
                }
                this._list.add(value);
                this.OnListChanged();
            },
            /**
             * Add value to list at a specific index.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {string}    value    Value to add.
             * @param   {number}    index    Index to insert the new item into.
             * @return  {void}
             */
            AddItem$1: function (value, index) {
                if (this.MaxItems !== 0 && this.Count >= this.MaxItems) {
                    return;
                }
                this._list.insert(index, value);
                this.OnListChanged();
            },
            /**
             * Remove value from the list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {string}    value    Value to remove.
             * @return  {void}
             */
            RemoveItem$1: function (value) {
                this._list.remove(value);
                this.OnListChanged();
            },
            /**
             * Remove item from the list, by index.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {number}    index    Index of the item to remove.
             * @return  {void}
             */
            RemoveItem: function (index) {
                this._list.removeAt(index);
                this.OnListChanged();
            },
            /**
             * Remove all items from the list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            ClearItems: function () {
                this._list.clear();
                this.OnListChanged();
            },
            /**
             * Is the list a natrually-interactable entity.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {boolean}        True.
             */
            IsNaturallyInteractable: function () {
                return true;
            },
            /**
             * Calculate the height of the select list to match the height of all the items in it.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            MatchHeightToList: function () {
                // no items? nothing to do
                if (this._list.Count === 0) {
                    return;
                }

                // if there are no initialized paragraphs, build them
                if (this._paragraphs.Count === 0) {
                    // calling resize will build paragraphs list
                    this.OnResize();

                    // if still no paragraphs were created, skip
                    if (this._paragraphs.Count === 0) {
                        return;
                    }
                }

                // get height of a single paragraph and calculate size from it
                var height = this._list.Count * (this._paragraphs.getItem(0).GetCharacterActualSize().Y / this.GlobalScale + this._paragraphs.getItem(0).SpaceAfter.Y) + this.Padding.Y * 2;
                this.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(this.Size.X, height);
            },
            /**
             * Move scrollbar to currently selected item.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            ScrollToSelected: function () {
                if (this._scrollbar != null && this._scrollbar.Visible) {
                    this._scrollbar.Value = this.SelectedIndex;
                }
            },
            /**
             * Move scrollbar to last item in list.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            scrollToEnd: function () {
                if (this._scrollbar != null && this._scrollbar.Visible) {
                    this._scrollbar.Value = this._list.Count;
                }
            },
            /**
             * Set the panel's height to match its children automatically.
             Note: to make this happen on its own every frame, set the 'AdjustHeightAutomatically' property to true.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {boolean}        True if succeed to adjust height, false if couldn't for whatever reason.
             */
            SetHeightBasedOnChildren: function () {
                this.MatchHeightToList();
                return true;
            },
            /**
             * Called for every new paragraph entity created as part of the list, to allow children classes
             to add extra processing etc to list labels.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {FaceUI.Entities.Paragraph}    paragraph    The newly created paragraph once ready (after added to list container).
             * @return  {void}
             */
            OnCreatedListParagraph: function (paragraph) { },
            /**
             * Called every frame before drawing is done.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to draw on.
             * @return  {void}
             */
            OnBeforeDraw: function (spriteBatch) {
                FaceUI.Entities.PanelBase.prototype.OnBeforeDraw.call(this, spriteBatch);
                if (this._hadResizeWhileNotVisible) {
                    this.OnResize();
                }
            },
            /**
             * When list is resized (also called on init), create the labels to show item values and init graphical stuff.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            OnResize: function () {
                // if not visible, skip
                if (!this.IsVisible()) {
                    this._hadResizeWhileNotVisible = true;
                    return;
                }

                // clear the _hadResizeWhileNotVisible flag
                this._hadResizeWhileNotVisible = false;

                // remove all children before re-creating them
                this.ClearChildren();

                // remove previous paragraphs list
                this._paragraphs.clear();

                // make sure destination rect is up-to-date
                this.UpdateDestinationRects();

                // calculate paragraphs quantity
                var i = 0;
                while (true) {
                    // create and add new paragraph
                    var paragraph = FaceUI.UserInterface.DefaultParagraph(".", FaceUI.Entities.Anchor.Auto, void 0, void 0, void 0, void 0);
                    paragraph.PromiscuousClicksMode = true;
                    paragraph.WrapWords = false;
                    paragraph.UpdateStyle(FaceUI.Entities.SelectList.DefaultParagraphStyle);
                    paragraph.Scale = paragraph.Scale * this.ItemsScale;
                    paragraph.SpaceAfter = Microsoft.Xna.Framework.Vector2.op_Addition(paragraph.SpaceAfter.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(0, ((this.ExtraSpaceBetweenLines - 2) | 0)));
                    paragraph.ExtraMargin.Y = (((Bridge.Int.div(this.ExtraSpaceBetweenLines, 2)) | 0) + 3) | 0;
                    paragraph.AttachedData = new FaceUI.Entities.ParagraphData.$ctor1(this, Bridge.identity(i, (i = (i + 1) | 0))).$clone();
                    paragraph.UseActualSizeForCollision = false;
                    paragraph.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(0, paragraph.GetCharacterActualSize().Y + this.ExtraSpaceBetweenLines);
                    paragraph.BackgroundColorPadding = new Microsoft.Xna.Framework.Point.$ctor2(Bridge.Int.clip32(this.Padding.X), 5);
                    paragraph.BackgroundColorUseBoxSize = true;
                    paragraph._hiddenInternalEntity = true;
                    paragraph.PropagateEventsTo(this);
                    this.AddChild(paragraph);

                    // call the callback whenever a new paragraph is created
                    this.OnCreatedListParagraph(paragraph);

                    // add to paragraphs list
                    this._paragraphs.add(paragraph);

                    // add callback to selection
                    paragraph.OnClick = Bridge.fn.combine(paragraph.OnClick, $asm.$.FaceUI.Entities.SelectList.f1);

                    // to calculate paragraph actual bottom
                    paragraph.UpdateDestinationRects();

                    // if out of list bounderies remove this paragraph and stop
                    if ((paragraph.GetActualDestRect().Bottom > this._destRect.Bottom - this._scaledPadding.Y) || i > this._list.Count) {
                        this.RemoveChild(paragraph);
                        this._paragraphs.remove(paragraph);
                        break;
                    }
                }

                // add scrollbar last, but only if needed
                if (this._paragraphs.Count > 0 && this._paragraphs.Count < this._list.Count) {
                    // add scrollbar to list
                    this.AddChild(this._scrollbar, false);

                    // calc max scroll value
                    this._scrollbar.Max = (((this._list.Count - this._paragraphs.Count) | 0)) >>> 0;
                    if (this._scrollbar.Max < 2) {
                        this._scrollbar.Max = 2;
                    }
                    this._scrollbar.StepsCount = this._scrollbar.Max;
                    this._scrollbar.Visible = true;
                } else {
                    this._scrollbar.Visible = false;
                    if (this._scrollbar.Value > 0) {
                        this._scrollbar.Value = 0;
                    }
                }
            },
            /**
             * Propagate all events trigger by this entity to a given other entity.
             For example, if "OnClick" will be called on this entity, it will trigger OnClick on 'other' as well.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {FaceUI.Entities.SelectList}    other    Entity to propagate events to.
             * @return  {void}
             */
            PropagateEventsTo$2: function (other) {
                this.PropagateEventsTo(Bridge.cast(other, FaceUI.Entities.Entity));
                this.OnListChange = Bridge.fn.combine(this.OnListChange, function (entity) {
                    !Bridge.staticEquals(other.OnListChange, null) ? other.OnListChange(other) : null;
                });
            },
            /**
             * Propagate all events trigger by this entity to a given other entity.
             For example, if "OnClick" will be called on this entity, it will trigger OnClick on 'other' as well.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {FaceUI.Entities.DropDown}    other    Entity to propagate events to.
             * @return  {void}
             */
            PropagateEventsTo$1: function (other) {
                this.PropagateEventsTo(Bridge.cast(other, FaceUI.Entities.Entity));
                this.OnListChange = Bridge.fn.combine(this.OnListChange, function (entity) {
                    !Bridge.staticEquals(other.OnListChange, null) ? other.OnListChange(other) : null;
                });
            },
            /**
             * Clear current selection.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @return  {void}
             */
            Unselect: function () {
                this.Select(-1, false);
            },
            /**
             * Select list item by value.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {string}    value    Item value to select.
             * @return  {void}
             */
            Select$1: function (value) {
                // value not changed? skip
                if (!this.AllowReselectValue && Bridge.referenceEquals(value, this._value)) {
                    return;
                }

                // special case - value is null
                if (value == null) {
                    this._value = value;
                    this._index = -1;
                    this.DoOnValueChange();
                    return;
                }

                // find index in list
                this._index = this._list.indexOf(value);
                if (this._index === -1) {
                    this._value = null;
                    if (FaceUI.UserInterface.Active.SilentSoftErrors) {
                        return;
                    }
                    throw new FaceUI.Exceptions.NotFoundException.$ctor1("Value to set not found in list!");
                }

                // set value
                this._value = value;

                // call on-value-change event
                this.DoOnValueChange();
            },
            /**
             * Select list item by index.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {number}     index                  Item index to select.
             * @param   {boolean}    relativeToScrollbar    If true, index will be relative to scrollbar current position.
             * @return  {void}
             */
            Select: function (index, relativeToScrollbar) {
                if (relativeToScrollbar === void 0) { relativeToScrollbar = false; }
                // if relative to current scrollbar update index
                if (relativeToScrollbar) {
                    index = (index + this._scrollbar.Value) | 0;
                }

                // index not changed? skip
                if (!this.AllowReselectValue && index === this._index) {
                    return;
                }

                // make sure legal index
                if (index >= -1 && index >= this._list.Count) {
                    if (FaceUI.UserInterface.Active.SilentSoftErrors) {
                        return;
                    }
                    throw new FaceUI.Exceptions.NotFoundException.$ctor1("Invalid list index to select!");
                }

                // pick based on index
                this._value = index > -1 ? this._list.getItem(index) : null;
                this._index = index;

                // call on-value-change event
                this.DoOnValueChange();
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.SelectList
             * @memberof FaceUI.Entities.SelectList
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // if size changed, update paragraphs list
                if ((this._prevSize.Y !== this._destRectInternal.Size.Y) || this._hadResizeWhileNotVisible) {
                    this.OnResize();
                }

                // store last known size
                this._prevSize = this._destRectInternal.Size.$clone();

                // call base draw function to draw the panel part
                FaceUI.Entities.PanelBase.prototype.DrawEntity.call(this, spriteBatch, phase);

                // update paragraphs list values
                for (var i = 0; i < this._paragraphs.Count; i = (i + 1) | 0) {
                    // get item index
                    var item_index = (i + this._scrollbar.Value) | 0;

                    // get current paragraph
                    var par = this._paragraphs.getItem(i);

                    // if we got an item to show for this paragraph index:
                    if (item_index < this._list.Count) {
                        // set paragraph text, make visible, and remove background.
                        par.Text = this._list.getItem(item_index);
                        par.BackgroundColor.A = 0;
                        par.Visible = true;

                        // check if we need to trim size
                        if (this.ClipTextIfOverflow) {
                            // get width we need to clip and if we need to clip at all
                            var charWidth = par.GetCharacterActualSize().X;
                            var toClip = (charWidth * par.Text.length) - this._destRectInternal.Width;
                            if (toClip > 0) {
                                // calc how many chars we need to remove
                                var charsToClip = (((Bridge.Int.clip32(Math.ceil(toClip / charWidth)) + this.AddWhenClipping.length) | 0) + 1) | 0;

                                // remove them from text
                                if (charsToClip < par.Text.length) {
                                    par.Text = (par.Text.substr(0, ((par.Text.length - charsToClip) | 0)) || "") + (this.AddWhenClipping || "");
                                } else {
                                    par.Text = this.AddWhenClipping;
                                }
                            }
                        }

                        // set locked state
                        var isLocked = { v : false };
                        this.LockedItems.tryGetValue(item_index, isLocked);
                        par.Locked = isLocked.v;
                    } else {
                        par.Visible = false;
                        par.Text = "";
                    }
                }

                // highlight the currently selected item paragraph (eg the paragraph that represent the selected value, if currently visible)
                var selectedParagraphIndex = this._index;
                if (selectedParagraphIndex !== -1) {
                    var i1 = (selectedParagraphIndex - this._scrollbar.Value) | 0;
                    if (i1 >= 0 && i1 < this._paragraphs.Count) {
                        // add background to selected paragraph
                        var paragraph = this._paragraphs.getItem(i1);
                        var destRect = paragraph.GetActualDestRect();
                        paragraph.State = FaceUI.Entities.EntityState.MouseDown;
                        paragraph.BackgroundColor = this.GetActiveStyle("SelectedHighlightColor").asColor.$clone();
                    }
                }
            }
        }
    });

    Bridge.ns("FaceUI.Entities.SelectList", $asm.$);

    Bridge.apply($asm.$.FaceUI.Entities.SelectList, {
        f1: function (entity) {
            var data = System.Nullable.getValue(Bridge.cast(Bridge.unbox(entity.AttachedData, FaceUI.Entities.ParagraphData), FaceUI.Entities.ParagraphData));
            if (!data.list.LockSelection) {
                data.list.Select(data.relativeIndex, true);
            }
        }
    });

    /**
     * A textbox that allow users to put in free text.
     *
     * @public
     * @class FaceUI.Entities.TextInput
     * @augments FaceUI.Entities.PanelBase
     */
    Bridge.define("FaceUI.Entities.TextInput", {
        inherits: [FaceUI.Entities.PanelBase],
        statics: {
            fields: {
                /**
                 * Default styling for the text input itself. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.TextInput
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null,
                /**
                 * Default style for paragraph that show current value.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.TextInput
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultParagraphStyle: null,
                /**
                 * Default style for the placeholder paragraph.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.TextInput
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultPlaceholderStyle: null,
                /**
                 * How fast to blink caret when text input is selected.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.TextInput
                 * @default 2.0
                 * @type number
                 */
                CaretBlinkingSpeed: 0
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultParagraphStyle = new FaceUI.Entities.StyleSheet();
                    this.DefaultPlaceholderStyle = new FaceUI.Entities.StyleSheet();
                    this.CaretBlinkingSpeed = 2.0;
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.TextInput);
                }
            }
        },
        fields: {
            _value: null,
            _caret: 0,
            /**
             * The Paragraph object showing current text value.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @type FaceUI.Entities.Paragraph
             */
            TextParagraph: null,
            /**
             * A placeholder paragraph to show when text input is empty.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @type FaceUI.Entities.Paragraph
             */
            PlaceholderParagraph: null,
            /**
             * If false, it will only allow one line input.
             *
             * @instance
             * @protected
             * @memberof FaceUI.Entities.TextInput
             * @default false
             * @type boolean
             */
            _multiLine: false,
            _scrollbar: null,
            /**
             * If provided, will automatically put this value whenever the user leave the input box and its empty.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @type string
             */
            ValueWhenEmpty: null,
            _caretAnim: 0,
            /**
             * Text to show when there's no input. Note that this text will be drawn with PlaceholderParagraph, and not TextParagraph.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.TextInput
             * @default ""
             * @type string
             */
            _placeholderText: null,
            /**
             * Set to any number to limit input by characters count.
             Note: this will only take effect when user insert input, if you set value programmatically it will be ignored.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @default 0
             * @type number
             */
            CharactersLimit: 0,
            /**
             * If true, will limit max input length to fit textbox size.
             Note: this will only take effect when user insert input, if you set value programmatically it will be ignored.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @default false
             * @type boolean
             */
            LimitBySize: false,
            /**
             * If provided, hide input and replace it with the given character.
             This is useful for stuff like password input field.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @type ?number
             */
            HideInputWithChar: null,
            /**
             * The actual displayed text, after wordwrap and other processing. 
             note: only the text currently visible by scrollbar.
             *
             * @instance
             * @private
             * @memberof FaceUI.Entities.TextInput
             * @default ""
             * @type string
             */
            _actualDisplayText: null,
            /**
             * List of validators to apply on text input.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @type System.Collections.Generic.List$1
             */
            Validators: null
        },
        props: {
            /**
             * Set / get multiline mode.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @function Multiline
             * @type boolean
             */
            Multiline: {
                get: function () {
                    return this._multiLine;
                },
                set: function (value) {
                    if (this._multiLine !== value) {
                        this._multiLine = value;
                        this.UpdateMultilineState();
                    }
                }
            },
            /**
             * Text to show when there's no input using the placeholder style.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @function PlaceholderText
             * @type string
             */
            PlaceholderText: {
                get: function () {
                    return this._placeholderText;
                },
                set: function (value) {
                    this._placeholderText = this._multiLine ? value : System.String.replaceAll(value, "\n", "");
                }
            },
            /**
             * Current input text value.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @function Value
             * @type string
             */
            Value: {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    var $t;
                    value = ($t = value, $t != null ? $t : "");
                    this._value = this._multiLine ? value : System.String.replaceAll(value, "\n", "");
                    this.FixCaretPosition();
                }
            },
            /**
             * Current cursor, eg where we are about to put next character.
             Set to -1 to jump to end.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @function Caret
             * @type number
             */
            Caret: {
                get: function () {
                    return this._caret;
                },
                set: function (value) {
                    this._caret = value;
                }
            },
            /**
             * Current scrollbar position.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.TextInput
             * @function ScrollPosition
             * @type number
             */
            ScrollPosition: {
                get: function () {
                    return this._scrollbar != null ? this._scrollbar.Value : 0;
                },
                set: function (value) {
                    if (this._scrollbar != null) {
                        this._scrollbar.Value = value;
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this._value = "";
                this._caret = -1;
                this._multiLine = false;
                this._caretAnim = 0.0;
                this._placeholderText = "";
                this.CharactersLimit = 0;
                this.LimitBySize = false;
                this._actualDisplayText = "";
                this.Validators = new (System.Collections.Generic.List$1(FaceUI.Entities.TextValidators.ITextValidator)).ctor();
            },
            /**
             * Create the text input.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @param   {boolean}                             multiline    If true, text input will accept multiple lines.
             * @param   {Microsoft.Xna.Framework.Vector2}     size         Input box size.
             * @param   {FaceUI.Entities.Anchor}              anchor       Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset       Offset from anchor position.
             * @param   {FaceUI.Entities.PanelSkin}           skin         TextInput skin, eg which texture to use.
             * @return  {void}
             */
            $ctor2: function (multiline, size, anchor, offset, skin) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }
                if (skin === void 0) { skin = 4; }

                this.$initialize();
                FaceUI.Entities.PanelBase.$ctor1.call(this, size, skin, anchor, offset);
                // set multiline mode
                this._multiLine = multiline;

                // update default style
                this.UpdateStyle(FaceUI.Entities.TextInput.DefaultStyle);

                // default size of multiline text input is 4 times bigger
                if (multiline) {
                    this.SetStyleProperty(FaceUI.Entities.StylePropertyIds.DefaultSize, new FaceUI.DataTypes.StyleProperty.$ctor2(Microsoft.Xna.Framework.Vector2.op_Multiply(this.EntityDefaultSize.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(1, 4))));
                }

                // set limit by size - default true in single-line, default false in multi-line
                this.LimitBySize = !this._multiLine;

                if (!FaceUI.UserInterface.Active._isDeserializing) {

                    // create paragraph to show current value
                    this.TextParagraph = FaceUI.UserInterface.DefaultParagraph("", FaceUI.Entities.Anchor.TopLeft, void 0, void 0, void 0, void 0);
                    this.TextParagraph.UpdateStyle(FaceUI.Entities.TextInput.DefaultParagraphStyle);
                    this.TextParagraph._hiddenInternalEntity = true;
                    this.TextParagraph.Identifier = "_TextParagraph";
                    this.AddChild(this.TextParagraph, true);

                    // create the placeholder paragraph
                    this.PlaceholderParagraph = FaceUI.UserInterface.DefaultParagraph("", FaceUI.Entities.Anchor.TopLeft, void 0, void 0, void 0, void 0);
                    this.PlaceholderParagraph.UpdateStyle(FaceUI.Entities.TextInput.DefaultPlaceholderStyle);
                    this.PlaceholderParagraph._hiddenInternalEntity = true;
                    this.PlaceholderParagraph.Identifier = "_PlaceholderParagraph";
                    this.AddChild(this.PlaceholderParagraph, true);

                    // update multiline related stuff
                    this.UpdateMultilineState();

                    // if the default paragraph type is multicolor, disable it for input
                    var colorTextParagraph = Bridge.as(this.TextParagraph, FaceUI.Entities.RichParagraph);
                    if (colorTextParagraph != null) {
                        colorTextParagraph.EnableStyleInstructions = false;
                    }
                }
            },
            /**
             * Create the text input with default size.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @param   {boolean}                             multiline    If true, text input will accept multiple lines.
             * @param   {FaceUI.Entities.Anchor}              anchor       Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset       Offset from anchor position.
             * @return  {void}
             */
            $ctor1: function (multiline, anchor, offset) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }

                FaceUI.Entities.TextInput.$ctor2.call(this, multiline, FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone(), anchor, offset);
            },
            /**
             * Create default single-line text input.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.TextInput.$ctor1.call(this, false);
            }
        },
        methods: {
            /**
             * Update after multiline state was changed.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            UpdateMultilineState: function () {
                var $t;
                // we are now multiline
                if (this._multiLine) {
                    this._scrollbar = new FaceUI.Entities.VerticalScrollbar.$ctor1(0, 0, FaceUI.Entities.Anchor.CenterRight, new Microsoft.Xna.Framework.Vector2.$ctor2(-8, 0), false);
                    this._scrollbar.Value = 0;
                    this._scrollbar.Visible = false;
                    this._scrollbar._hiddenInternalEntity = true;
                    this._scrollbar.Identifier = "__inputScrollbar";
                    this.AddChild(this._scrollbar, false);
                } else {
                    if (this._scrollbar != null) {
                        this._scrollbar.RemoveFromParent();
                        this._scrollbar = null;
                    }
                }

                // set default wrap words state
                this.TextParagraph.WrapWords = this._multiLine;
                this.PlaceholderParagraph.WrapWords = this._multiLine;
                this.TextParagraph.Anchor = ($t = this._multiLine ? FaceUI.Entities.Anchor.TopLeft : FaceUI.Entities.Anchor.CenterLeft, this.PlaceholderParagraph.Anchor = $t, $t);
            },
            /**
             * Special init after deserializing entity from file.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            InitAfterDeserialize: function () {
                FaceUI.Entities.PanelBase.prototype.InitAfterDeserialize.call(this);

                // set main text paragraph
                this.TextParagraph = Bridge.as(this.Find$1("_TextParagraph"), FaceUI.Entities.Paragraph);
                this.TextParagraph._hiddenInternalEntity = true;

                // set scrollbar
                this._scrollbar = this.Find(FaceUI.Entities.VerticalScrollbar, "__inputScrollbar");
                if (this._scrollbar != null) {
                    this._scrollbar._hiddenInternalEntity = true;
                }

                // set placeholder paragraph
                this.PlaceholderParagraph = Bridge.as(this.Find$1("_PlaceholderParagraph"), FaceUI.Entities.Paragraph);
                this.PlaceholderParagraph._hiddenInternalEntity = true;

                // recalc dest rects
                this.UpdateMultilineState();
            },
            /**
             * Is the text input a natrually-interactable entity.
             *
             * @instance
             * @override
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {boolean}        True.
             */
            IsNaturallyInteractable: function () {
                return true;
            },
            /**
             * Move scrollbar to show caret position.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            ScrollToCaret: function () {
                // skip if no scrollbar
                if (this._scrollbar == null) {
                    return;
                }

                // make sure caret position is legal
                if (this._caret >= this._value.length) {
                    this._caret = -1;
                }

                // if caret is at end of text jump to it
                if (this._caret === -1) {
                    this._scrollbar.Value = (this._scrollbar.Max) | 0;
                } else {
                    this.TextParagraph.Text = this._value;
                    this.TextParagraph.CalcTextActualRectWithWrap();
                    var processedValueText = this.TextParagraph.GetProcessedText();
                    var currLine = System.String.split(processedValueText.substr(0, this._caret), [10].map(function (i) {{ return String.fromCharCode(i); }})).length;
                    this._scrollbar.Value = (currLine - 1) | 0;
                }
            },
            /**
             * Move caret to the end of text.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @param   {boolean}    scrollToCaret    If true, will also scroll to show caret position.
             * @return  {void}
             */
            ResetCaret: function (scrollToCaret) {
                this.Caret = -1;
                if (scrollToCaret) {
                    this.ScrollToCaret();
                }
            },
            /**
             * Prepare the input paragraph for display.
             *
             * @instance
             * @protected
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @param   {boolean}    usePlaceholder    If true, will use the placeholder text. Else, will use the real input text.
             * @param   {boolean}    showCaret         If true, will also add the caret text when needed. If false, will not show caret.
             * @return  {string}                       Processed text that will actually be displayed on screen.
             */
            PrepareInputTextForDisplay: function (usePlaceholder, showCaret) {
                // set caret char
                var caretShow = showCaret ? (Bridge.Int.clip32(this._caretAnim) % 2 === 0) ? "|" : " " : "";

                // set main text when hidden with password char
                if (this.HideInputWithChar != null) {
                    var hiddenVal = System.String.fromCharCount(System.Nullable.getValue(this.HideInputWithChar), this._value.length);
                    this.TextParagraph.Text = System.String.insert(this._caret >= 0 ? this._caret : hiddenVal.length, hiddenVal, caretShow);
                } else {
                    this.TextParagraph.Text = System.String.insert(this._caret >= 0 ? this._caret : this._value.length, this._value, caretShow);
                }

                // update placeholder text
                this.PlaceholderParagraph.Text = this._placeholderText;

                // get current paragraph and prepare to draw
                var currParagraph = usePlaceholder ? this.PlaceholderParagraph : this.TextParagraph;
                this.TextParagraph.UpdateDestinationRectsIfDirty();

                // get text to display
                return currParagraph.GetProcessedText();
            },
            /**
             * Handle mouse click event.
             TextInput override this function to handle picking caret position.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            DoOnClick: function () {
                // first call base DoOnClick
                FaceUI.Entities.PanelBase.prototype.DoOnClick.call(this);

                // check if hit paragraph
                if (this._value.length > 0) {
                    // get relative position
                    var actualParagraphPos = new Microsoft.Xna.Framework.Vector2.$ctor2(this._destRectInternal.Location.X, this._destRectInternal.Location.Y);
                    var relativeOffset = this.GetMousePos(Microsoft.Xna.Framework.Vector2.op_UnaryNegation(actualParagraphPos.$clone()));

                    // calc caret position
                    var charSize = this.TextParagraph.GetCharacterActualSize();
                    var x = Bridge.Int.clip32(relativeOffset.X / charSize.X);
                    this._caret = x;

                    // if multiline, take line into the formula
                    if (this._multiLine) {
                        // get the whole processed text
                        this.TextParagraph.Text = this._value;
                        this.TextParagraph.CalcTextActualRectWithWrap();
                        var processedValueText = this.TextParagraph.GetProcessedText();

                        // calc y position and add scrollbar value to it
                        var y = (Bridge.Int.clip32((relativeOffset.Y / charSize.Y)) + this._scrollbar.Value) | 0;

                        // break actual text into lines
                        var lines = new (System.Collections.Generic.List$1(System.String)).$ctor1(System.String.split(processedValueText, [10].map(function (i) {{ return String.fromCharCode(i); }})));
                        for (var i = 0; i < y && i < lines.Count; i = (i + 1) | 0) {
                            this._caret = (this._caret + (((lines.getItem(i).length + 1) | 0))) | 0;
                        }
                    }

                    // if override text length reset caret
                    if (this._caret >= this._value.length) {
                        this._caret = -1;
                    }
                } else {
                    this._caret = -1;
                }
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // call base draw function to draw the panel part
                FaceUI.Entities.PanelBase.prototype.DrawEntity.call(this, spriteBatch, phase);

                // get which paragraph we currently show - real or placeholder
                var showPlaceholder = !(this.IsFocused || this._value.length > 0);
                var currParagraph = showPlaceholder ? this.PlaceholderParagraph : this.TextParagraph;

                // get actual processed string
                this._actualDisplayText = this.PrepareInputTextForDisplay(showPlaceholder, this.IsFocused);

                // for multiline only - handle scrollbar visibility and max
                if (this._multiLine && (this._actualDisplayText != null) && (this._destRectInternal.Height > 0)) {
                    // get how many lines can fit in the textbox and how many lines display text actually have
                    var linesFit = (Bridge.Int.div(this._destRectInternal.Height, Bridge.Int.clip32((Math.max(currParagraph.GetCharacterActualSize().Y, 1))))) | 0;
                    var linesInText = System.String.split(this._actualDisplayText, [10].map(function (i) {{ return String.fromCharCode(i); }})).length;

                    // if there are more lines than can fit, show scrollbar and manage scrolling:
                    if (linesInText > linesFit) {
                        // fix paragraph width to leave room for the scrollbar
                        var prevWidth = currParagraph.Size.X;
                        currParagraph.Size = new Microsoft.Xna.Framework.Vector2.$ctor2(this._destRectInternal.Width / this.GlobalScale - 20, 0);
                        if (currParagraph.Size.X !== prevWidth) {
                            // update size and re-calculate lines in text
                            this._actualDisplayText = this.PrepareInputTextForDisplay(showPlaceholder, this.IsFocused);
                            linesInText = System.String.split(this._actualDisplayText, [10].map(function (i) {{ return String.fromCharCode(i); }})).length;
                        }

                        // set scrollbar max and steps
                        this._scrollbar.Max = (Math.max(((linesInText - linesFit) | 0), 2)) >>> 0;
                        this._scrollbar.StepsCount = this._scrollbar.Max;
                        this._scrollbar.Visible = true;

                        // update text to fit scrollbar. first, rebuild the text with just the visible segment
                        var lines = new (System.Collections.Generic.List$1(System.String)).$ctor1(System.String.split(this._actualDisplayText, [10].map(function (i) {{ return String.fromCharCode(i); }})));
                        var from = Math.min(this._scrollbar.Value, ((lines.Count - 1) | 0));
                        var size = Math.min(linesFit, ((lines.Count - from) | 0));
                        lines = lines.GetRange(from, size);
                        this._actualDisplayText = Bridge.toArray(lines).join("\n");
                        currParagraph.Text = this._actualDisplayText;
                    } else {
                        currParagraph.Size = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                        this._scrollbar.Visible = false;
                    }
                }

                // set placeholder and main text visibility based on current value
                this.TextParagraph.Visible = !showPlaceholder;
                this.PlaceholderParagraph.Visible = showPlaceholder;
            },
            /**
             * Validate current text input after change (usually addition of text).
             *
             * @instance
             * @private
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @param   {System.String}    newVal    New text value, to check validity.
             * @param   {string}           oldVal    Previous text value, before the change.
             * @return  {boolean}                    True if new input is valid, false otherwise.
             */
            ValidateInput: function (newVal, oldVal) {
                var $t;
                // if new characters were added, and we now exceed characters limit, revet to previous value.
                if (this.CharactersLimit !== 0 && newVal.v.length > this.CharactersLimit) {
                    newVal.v = oldVal;
                    return false;
                }

                // if not multiline and got line break, revet to previous value
                if (!this._multiLine && System.String.contains(newVal.v,"\n")) {
                    newVal.v = oldVal;
                    return false;
                }

                // if set to limit by size make sure we don't exceed it
                if (this.LimitBySize) {
                    // prepare display
                    this.PrepareInputTextForDisplay(false, false);

                    // get main paragraph actual size
                    var textSize = this.TextParagraph.GetActualDestRect();

                    // if multiline, compare heights
                    if (this._multiLine && textSize.Height >= this._destRectInternal.Height) {
                        newVal.v = oldVal;
                        return false;
                    } else if (textSize.Width >= this._destRectInternal.Width) {
                        newVal.v = oldVal;
                        return false;
                    }
                }

                // if got here we iterate over additional validators
                $t = Bridge.getEnumerator(this.Validators);
                try {
                    while ($t.moveNext()) {
                        var validator = $t.Current;
                        if (!validator.ValidateText(newVal, oldVal)) {
                            newVal.v = oldVal;
                            return false;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // looks good!
                return true;
            },
            /**
             * Make sure caret position is currently valid and in range.
             *
             * @instance
             * @private
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            FixCaretPosition: function () {
                if (this._caret < -1) {
                    this._caret = 0;
                }
                if (this._caret >= this._value.length || this._value.length === 0) {
                    this._caret = -1;
                }
            },
            /**
             * Called every frame before update.
             TextInput implement this function to get keyboard input and also to animate caret timer.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            DoBeforeUpdate: function () {
                // animate caret
                this._caretAnim += FaceUI.UserInterface.Active.CurrGameTime.ElapsedGameTime.getTotalSeconds() * FaceUI.Entities.TextInput.CaretBlinkingSpeed;

                // if focused, and got character input in this frame..
                if (this.IsFocused) {
                    // validate caret position
                    this.FixCaretPosition();

                    // get caret position
                    var pos = { v : this._caret };

                    // store old string and update based on user input
                    var oldVal = this._value;
                    this._value = this.KeyboardInput.FaceUI$IKeyboardInput$GetTextInput(this._value, this.TextParagraph.MaxCharactersInLine, pos);

                    // update caret position
                    this._caret = pos.v;

                    // if value changed:
                    if (!Bridge.referenceEquals(this._value, oldVal)) {
                        // if new characters were added and input is now illegal, revert to previous value
                        if (!this.ValidateInput(Bridge.ref(this, "_value"), oldVal)) {
                            this._value = oldVal;
                        }

                        // call change event
                        if (!Bridge.referenceEquals(this._value, oldVal)) {
                            this.DoOnValueChange();
                        }

                        // after change, scroll to caret
                        this.ScrollToCaret();

                        // fix caret position
                        this.FixCaretPosition();
                    }
                }

                // call base do-before-update
                FaceUI.Entities.PanelBase.prototype.DoBeforeUpdate.call(this);
            },
            /**
             * Called every time this entity is focused / unfocused.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.TextInput
             * @memberof FaceUI.Entities.TextInput
             * @return  {void}
             */
            DoOnFocusChange: function () {
                // call base on focus change
                FaceUI.Entities.PanelBase.prototype.DoOnFocusChange.call(this);

                // check if need to set default value
                if (this.ValueWhenEmpty != null && this.Value.length === 0) {
                    this.Value = this.ValueWhenEmpty;
                }
            }
        }
    });

    /**
     * Used internally as a scrollbar for lists, text boxes, etc..
     *
     * @public
     * @class FaceUI.Entities.VerticalScrollbar
     * @augments FaceUI.Entities.Slider
     */
    Bridge.define("FaceUI.Entities.VerticalScrollbar", {
        inherits: [FaceUI.Entities.Slider],
        statics: {
            fields: {
                /**
                 * Default styling for vertical scrollbars. Note: loaded from UI theme xml file.
                 *
                 * @static
                 * @public
                 * @memberof FaceUI.Entities.VerticalScrollbar
                 * @type FaceUI.Entities.StyleSheet
                 */
                DefaultStyle: null
            },
            ctors: {
                init: function () {
                    this.DefaultStyle = new FaceUI.Entities.StyleSheet();
                },
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.VerticalScrollbar);
                }
            }
        },
        fields: {
            _frameActualHeight: 0,
            _markHeight: 0,
            /**
             * If true, will adjust max value automatically based on entities in parent.
             *
             * @instance
             * @public
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @default false
             * @type boolean
             */
            AdjustMaxAutomatically: false
        },
        ctors: {
            init: function () {
                this._frameActualHeight = 0.0;
                this._markHeight = 20;
                this.AdjustMaxAutomatically = false;
            },
            /**
             * Create the scrollbar.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @param   {number}                              min                       Min scrollbar value.
             * @param   {number}                              max                       Max scrollbar value.
             * @param   {FaceUI.Entities.Anchor}              anchor                    Position anchor.
             * @param   {?Microsoft.Xna.Framework.Vector2}    offset                    Offset from anchor position.
             * @param   {boolean}                             adjustMaxAutomatically    If true, the scrollbar will set its max value automatically based on entities in its parent.
             * @return  {void}
             */
            $ctor1: function (min, max, anchor, offset, adjustMaxAutomatically) {
                if (anchor === void 0) { anchor = 9; }
                if (offset === void 0) { offset = null; }
                if (adjustMaxAutomatically === void 0) { adjustMaxAutomatically = false; }

                this.$initialize();
                FaceUI.Entities.Slider.$ctor2.call(this, 0, 0, FaceUI.Entities.Entity.USE_DEFAULT_SIZE.$clone(), FaceUI.Entities.SliderSkin.Default, anchor, offset);
                // set this scrollbar to respond even when direct parent is locked
                this.DoEventsIfDirectParentIsLocked = true;

                // set if need to adjust max automatically
                this.AdjustMaxAutomatically = adjustMaxAutomatically;

                // update default style
                this.UpdateStyle(FaceUI.Entities.VerticalScrollbar.DefaultStyle);
            },
            /**
             * Create vertical scroll with default params.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @return  {void}
             */
            ctor: function () {
                FaceUI.Entities.VerticalScrollbar.$ctor1.call(this, 0, 10);
            }
        },
        methods: {
            /**
             * Handle mouse down event.
             The Scrollbar entity override this function to handle sliding mark up and down, instead of left-right.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @return  {void}
             */
            DoOnMouseReleased: function () {
                // get mouse position and apply scroll value
                var mousePos = this.GetMousePos(this._lastScrollVal.ToVector2());

                // if mouse is on the min side, decrease by 1
                if (mousePos.Y <= this._destRect.Y + this._frameActualHeight) {
                    this.Value = (this._value - this.GetStepSize()) | 0;
                } else if (mousePos.Y >= this._destRect.Bottom - this._frameActualHeight) {
                    this.Value = (this._value + this.GetStepSize()) | 0;
                }

                // call base function
                FaceUI.Entities.Slider.prototype.DoOnMouseReleased.call(this);
            },
            /**
             * Handle while mouse is down event.
             The Scrollbar entity override this function to handle sliding mark up and down, instead of left-right.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @return  {void}
             */
            DoWhileMouseDown: function () {
                // get mouse position and apply scroll value
                var mousePos = this.GetMousePos(this._lastScrollVal.ToVector2());

                // if in the middle calculate value based on mouse position
                if ((mousePos.Y >= this._destRect.Y + this._frameActualHeight * 0.5) && (mousePos.Y <= this._destRect.Bottom - this._frameActualHeight * 0.5)) {
                    var relativePos = (mousePos.Y - this._destRect.Y - this._frameActualHeight * 0.5 - this._markHeight * 0.5);
                    var internalHeight = (this._destRect.Height - this._frameActualHeight) - this._markHeight * 0.5;
                    var relativeVal = (relativePos / internalHeight);
                    this.Value = Bridge.Int.clip32(Bridge.Math.round(this.Min + relativeVal * (((this.Max - this.Min) >>> 0)), 0, 6));
                }

                // call event handler
                !Bridge.staticEquals(this.WhileMouseDown, null) ? this.WhileMouseDown(this) : null;
            },
            /**
             * Draw the entity.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    Sprite batch to draw on.
             * @param   {FaceUI.Entities.DrawPhase}           phase          The phase we are currently drawing.
             * @return  {void}
             */
            DrawEntity: function (spriteBatch, phase) {
                // if needed, recalc max (but not if currently interacting with this object).
                if (!Bridge.referenceEquals(FaceUI.UserInterface.Active.ActiveEntity, this)) {
                    this.CalcAutoMaxValue();
                }

                // get textures based on type
                var texture = FaceUI.Resources.VerticalScrollbarTexture;
                var markTexture = FaceUI.Resources.VerticalScrollbarMarkTexture;
                var FrameHeight = FaceUI.Resources.VerticalScrollbarData.FrameHeight;

                // draw scrollbar body
                FaceUI.UserInterface.Active.DrawUtils.DrawSurface(spriteBatch, texture, this._destRect.$clone(), new Microsoft.Xna.Framework.Vector2.$ctor2(0.0, FrameHeight), 1, this.FillColor.$clone());

                // calc frame actual height and scaling factor (this is needed to calc frame width in pixels)
                var frameSizeTexture = new Microsoft.Xna.Framework.Vector2.$ctor2(texture.Width, texture.Height * FrameHeight);
                var frameSizeRender = frameSizeTexture.$clone();
                var ScaleYfac = this._destRect.Width / frameSizeRender.X;

                // calc the size of the mark piece
                var markWidth = this._destRect.Width;
                this._markHeight = Bridge.Int.clip32((markTexture.Height / markTexture.Width) * markWidth);

                // calc frame width in pixels
                this._frameActualHeight = FrameHeight * texture.Height * ScaleYfac;

                // now draw mark
                var markY = this._destRect.Y + this._frameActualHeight + this._markHeight * 0.5 + (this._destRect.Height - this._frameActualHeight * 2 - this._markHeight) * (this.GetValueAsPercent());
                var markDest = new Microsoft.Xna.Framework.Rectangle.$ctor2(this._destRect.X, ((Bridge.Int.clip32(Bridge.Math.round(markY, 0, 6)) - ((Bridge.Int.div(this._markHeight, 2)) | 0)) | 0), markWidth, this._markHeight);
                FaceUI.UserInterface.Active.DrawUtils.DrawImage(spriteBatch, markTexture, markDest.$clone(), this.FillColor.$clone());
            },
            /**
             * Called every frame after update.
             Scrollbar override this function to handle wheel scroll while pointing on parent entity - we still want to capture that.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @return  {void}
             */
            DoAfterUpdate: function () {
                // if the active entity is self or parent, listen to mousewheel
                if (this._isInteractable && (Bridge.referenceEquals(FaceUI.UserInterface.Active.ActiveEntity, this) || Bridge.referenceEquals(FaceUI.UserInterface.Active.ActiveEntity, this._parent) || (FaceUI.UserInterface.Active.ActiveEntity != null && FaceUI.UserInterface.Active.ActiveEntity.IsDeepChildOf(this._parent)))) {
                    if (this.MouseInput.FaceUI$IMouseInput$MouseWheelChange !== 0) {
                        this.Value = (this._value - Bridge.Int.mul(this.MouseInput.FaceUI$IMouseInput$MouseWheelChange, this.GetStepSize())) | 0;
                    }
                }
            },
            /**
             * Calculate max value based on siblings (note: only if AdjustMaxAutomatically is true)
             *
             * @instance
             * @private
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @return  {void}
             */
            CalcAutoMaxValue: function () {
                var $t;
                // if need to adjust max automatically
                if (this.AdjustMaxAutomatically) {
                    // get parent top
                    var newMax = 0;
                    var parentTop = this.Parent.InternalDestRect.Y;

                    // iterate parent children to get the most bottom child
                    $t = Bridge.getEnumerator(this.Parent._children);
                    try {
                        while ($t.moveNext()) {
                            var child = $t.Current;
                            // skip self
                            if (Bridge.referenceEquals(child, this)) {
                                continue;
                            }

                            // skip internals
                            if (child._hiddenInternalEntity) {
                                continue;
                            }

                            // get current child bottom
                            var bottom = child.GetActualDestRect().Bottom;

                            // calc new max value
                            var currNewMax = (bottom - parentTop) | 0;
                            newMax = Math.max(newMax, currNewMax);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    // remove parent size from result (the -4 is to give extra pixels down)
                    newMax = (newMax - (((this.Parent.InternalDestRect.Height - 4) | 0))) | 0;
                    newMax = Math.max(newMax, 0);

                    // set new max value
                    if (System.Int64(newMax).ne(System.Int64(this.Max))) {
                        this.Max = newMax >>> 0;
                    }

                    // set steps count
                    this.StepsCount = (Bridge.Int.div((((this.Max - this.Min) >>> 0)), 80)) >>> 0;
                }
            },
            /**
             * Handle when mouse wheel scroll and this entity is the active entity.
             Note: Scrollbar entity override this function to change scrollbar value based on wheel scroll, which is inverted.
             *
             * @instance
             * @protected
             * @override
             * @this FaceUI.Entities.VerticalScrollbar
             * @memberof FaceUI.Entities.VerticalScrollbar
             * @return  {void}
             */
            DoOnMouseWheelScroll: function () {
                this.Value = (this._value - Bridge.Int.mul(this.MouseInput.FaceUI$IMouseInput$MouseWheelChange, this.GetStepSize())) | 0;
            }
        }
    });

    /**
     * A special panel used as the root panel that covers the entire screen.
     This panel is used internally to serve as the constant root entity in the entities tree.
     *
     * @public
     * @class FaceUI.Entities.RootPanel
     * @augments FaceUI.Entities.Panel
     */
    Bridge.define("FaceUI.Entities.RootPanel", {
        inherits: [FaceUI.Entities.Panel],
        statics: {
            ctors: {
                ctor: function () {
                    FaceUI.Entities.Entity.MakeSerializable(FaceUI.Entities.RootPanel);
                }
            }
        },
        ctors: {
            /**
             * Create the root panel.
             *
             * @instance
             * @public
             * @this FaceUI.Entities.RootPanel
             * @memberof FaceUI.Entities.RootPanel
             * @return  {void}
             */
            ctor: function () {
                this.$initialize();
                FaceUI.Entities.Panel.$ctor1.call(this, Microsoft.Xna.Framework.Vector2.Zero, FaceUI.Entities.PanelSkin.None, FaceUI.Entities.Anchor.Center, Microsoft.Xna.Framework.Vector2.Zero);
                this.Padding = Microsoft.Xna.Framework.Vector2.Zero.$clone();
                this.ShadowColor = Microsoft.Xna.Framework.Color.Transparent.$clone();
                this.OutlineWidth = 0;
                this.ClickThrough = true;
            }
        },
        methods: {
            /**
             * Override the function to calculate the destination rectangle, so the root panel will always cover the entire screen.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.RootPanel
             * @memberof FaceUI.Entities.RootPanel
             * @return  {Microsoft.Xna.Framework.Rectangle}        Rectangle in the size of the whole screen.
             */
            CalcDestRect: function () {
                var width = FaceUI.UserInterface.Active.ScreenWidth;
                var height = FaceUI.UserInterface.Active.ScreenHeight;
                return new Microsoft.Xna.Framework.Rectangle.$ctor2(0, 0, width, height);
            },
            /**
             * Update dest rect and internal dest rect, but only if needed (eg if something changed since last update).
             *
             * @instance
             * @override
             * @this FaceUI.Entities.RootPanel
             * @memberof FaceUI.Entities.RootPanel
             * @return  {void}
             */
            UpdateDestinationRectsIfDirty: function () {
                // if dirty, update destination rectangles
                if (this.IsDirty) {
                    this.UpdateDestinationRects();
                }
            },
            /**
             * Draw this entity and its children.
             *
             * @instance
             * @public
             * @override
             * @this FaceUI.Entities.RootPanel
             * @memberof FaceUI.Entities.RootPanel
             * @param   {FaceUI.Utils.ISpriteBatchWrapper}    spriteBatch    SpriteBatch to use for drawing.
             * @return  {void}
             */
            Draw: function (spriteBatch) {
                var $t;
                // if not visible skip
                if (!this.Visible) {
                    return;
                }

                // do before draw event
                this.OnBeforeDraw(spriteBatch);

                // calc desination rect
                this.UpdateDestinationRectsIfDirty();

                // get sorted children list
                var childrenSorted = this.GetSortedChildren();

                // draw all children
                $t = Bridge.getEnumerator(childrenSorted);
                try {
                    while ($t.moveNext()) {
                        var child = $t.Current;
                        child.Draw(spriteBatch);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                // do after draw event
                this.OnAfterDraw(spriteBatch);
            }
        }
    });
});
