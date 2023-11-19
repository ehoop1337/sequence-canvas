var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _SequenceCanvas_instances, _SequenceCanvas_rendering, _SequenceCanvas_requestId, _SequenceCanvas_fpsInterval, _SequenceCanvas_now, _SequenceCanvas_then, _SequenceCanvas_startTime, _SequenceCanvas_elapsed, _SequenceCanvas_events, _SequenceCanvas_loadImage, _SequenceCanvas_setRendering, _SequenceCanvas_startRender, _SequenceCanvas_render, _SequenceCanvas_logic;
/**
 * Creates a new sequence canvas.
 * @name SequenceCanvas
 * @class
 */
class SequenceCanvas {
    /**
     * Create a point.
     * @constructor
     * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
     */
    constructor(settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
        _SequenceCanvas_instances.add(this);
        // Canvas
        this.canvas = undefined;
        this.context = undefined;
        this.heightCanvas = undefined;
        this.widthCanvas = undefined;
        // Images
        this.images = undefined;
        this.isPositionImages = undefined;
        this.xPosImages = undefined;
        this.yPosImages = undefined;
        this.isSizeImages = undefined;
        this.widthImages = undefined;
        this.heightImages = undefined;
        this.isTrimImages = undefined;
        this.xTrimImages = undefined;
        this.yTrimImages = undefined;
        this.widthTrimImages = undefined;
        this.heightTrimImages = undefined;
        // Optional
        this.fps = undefined;
        this.direction = undefined;
        this.loop = undefined;
        this.startIndex = undefined;
        this.finishIndex = undefined;
        this.currentIndex = undefined;
        this.startImmediately = undefined;
        this.startAfterLoaded = undefined;
        this.initiate = false;
        this.logging = false;
        // Domestic
        _SequenceCanvas_rendering.set(this, false);
        _SequenceCanvas_requestId.set(this, void 0);
        _SequenceCanvas_fpsInterval.set(this, void 0);
        _SequenceCanvas_now.set(this, void 0);
        _SequenceCanvas_then.set(this, void 0);
        _SequenceCanvas_startTime.set(this, void 0);
        _SequenceCanvas_elapsed.set(this, void 0);
        // Events
        _SequenceCanvas_events.set(this, {
            init: new Event('init', { bubbles: true }),
            load: new Event('load', { bubbles: true }),
            loaded: new Event('loaded', { bubbles: true }),
            render: new Event('render', { bubbles: true }),
            start: new Event('start', { bubbles: true }),
            play: new Event('play', { bubbles: true }),
            stop: new Event('stop', { bubbles: true }),
            pause: new Event('pause', { bubbles: true }),
        }
        /**
         * Create a point.
         * @constructor
         * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
         */
        );
        /**
         * The method is loop rendering.
         *
         * @method
         * @private
         * @name this.#render
         * @return {void}
         */
        _SequenceCanvas_render.set(this, () => {
            if (!__classPrivateFieldGet(this, _SequenceCanvas_rendering, "f")) {
                if (__classPrivateFieldGet(this, _SequenceCanvas_requestId, "f"))
                    cancelAnimationFrame(__classPrivateFieldGet(this, _SequenceCanvas_requestId, "f"));
                return;
            }
            __classPrivateFieldSet(this, _SequenceCanvas_requestId, requestAnimationFrame(__classPrivateFieldGet(this, _SequenceCanvas_render, "f")), "f");
            __classPrivateFieldSet(this, _SequenceCanvas_now, Date.now(), "f");
            __classPrivateFieldSet(this, _SequenceCanvas_elapsed, __classPrivateFieldGet(this, _SequenceCanvas_now, "f") - __classPrivateFieldGet(this, _SequenceCanvas_then, "f"), "f");
            if (__classPrivateFieldGet(this, _SequenceCanvas_elapsed, "f") > __classPrivateFieldGet(this, _SequenceCanvas_fpsInterval, "f")) {
                __classPrivateFieldSet(this, _SequenceCanvas_then, __classPrivateFieldGet(this, _SequenceCanvas_now, "f") - (__classPrivateFieldGet(this, _SequenceCanvas_elapsed, "f") % __classPrivateFieldGet(this, _SequenceCanvas_fpsInterval, "f")), "f");
                __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_logic).call(this);
            }
        }
        /**
         * Logic for changing images
         *
         * @method
         * @private
         * @name this.#logic
         * @return {void}
         */
        );
        // Canvas
        this.canvas = settings.canvas.element;
        this.context = this.canvas.getContext("2d");
        this.widthCanvas = settings.canvas.width;
        this.heightCanvas = settings.canvas.height;
        // Images
        this.images = settings.images.paths.map((path) => {
            return { path, state: 'WAIT' };
        });
        this.isPositionImages = ((_b = (_a = settings.images) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.position) !== undefined;
        this.xPosImages = (_e = (_d = (_c = settings.images) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.position) === null || _e === void 0 ? void 0 : _e.x;
        this.yPosImages = (_h = (_g = (_f = settings.images) === null || _f === void 0 ? void 0 : _f.options) === null || _g === void 0 ? void 0 : _g.position) === null || _h === void 0 ? void 0 : _h.y;
        this.isSizeImages = ((_k = (_j = settings.images) === null || _j === void 0 ? void 0 : _j.options) === null || _k === void 0 ? void 0 : _k.size) !== undefined;
        this.widthImages = (_o = (_m = (_l = settings.images) === null || _l === void 0 ? void 0 : _l.options) === null || _m === void 0 ? void 0 : _m.size) === null || _o === void 0 ? void 0 : _o.width;
        this.heightImages = (_r = (_q = (_p = settings.images) === null || _p === void 0 ? void 0 : _p.options) === null || _q === void 0 ? void 0 : _q.size) === null || _r === void 0 ? void 0 : _r.height;
        this.isTrimImages = ((_t = (_s = settings.images) === null || _s === void 0 ? void 0 : _s.options) === null || _t === void 0 ? void 0 : _t.trim) !== undefined;
        this.xTrimImages = (_w = (_v = (_u = settings.images) === null || _u === void 0 ? void 0 : _u.options) === null || _v === void 0 ? void 0 : _v.trim) === null || _w === void 0 ? void 0 : _w.x;
        this.yTrimImages = (_z = (_y = (_x = settings.images) === null || _x === void 0 ? void 0 : _x.options) === null || _y === void 0 ? void 0 : _y.trim) === null || _z === void 0 ? void 0 : _z.y;
        this.widthTrimImages = (_2 = (_1 = (_0 = settings.images) === null || _0 === void 0 ? void 0 : _0.options) === null || _1 === void 0 ? void 0 : _1.trim) === null || _2 === void 0 ? void 0 : _2.width;
        this.heightTrimImages = (_5 = (_4 = (_3 = settings.images) === null || _3 === void 0 ? void 0 : _3.options) === null || _4 === void 0 ? void 0 : _4.trim) === null || _5 === void 0 ? void 0 : _5.height;
        // Optional
        this.fps = typeof settings.fps === 'number' && 60 >= settings.fps && settings.fps > 0 ? settings.fps : 60;
        this.direction = (_6 = settings.direction) !== null && _6 !== void 0 ? _6 : 1;
        this.loop = (_7 = settings.loop) !== null && _7 !== void 0 ? _7 : true;
        this.startIndex = (_8 = settings.startIndex) !== null && _8 !== void 0 ? _8 : 0;
        this.finishIndex = (_9 = settings.finishIndex) !== null && _9 !== void 0 ? _9 : (settings.images.paths.length ? settings.images.paths.length - 1 : 0);
        this.currentIndex = (_10 = settings.currentIndex) !== null && _10 !== void 0 ? _10 : 0;
        this.startImmediately = (_11 = settings.startImmediately) !== null && _11 !== void 0 ? _11 : false;
        this.startAfterLoaded = (_12 = settings.startAfterLoaded) !== null && _12 !== void 0 ? _12 : true;
        this.initiate = (_13 = settings.init) !== null && _13 !== void 0 ? _13 : true;
        this.logging = (_14 = settings.logging) !== null && _14 !== void 0 ? _14 : false;
        if (this.initiate) {
            this.init();
        }
    }
    /**
     * Drawing an image by index
     *
     * @method
     * @public
     * @name drawImage
     * @param {number} indexImage Index of the image in the array
     * @return {void}
     */
    drawImage(indexImage) {
        if (this.images[indexImage].state !== 'LOADED' || !this.images[indexImage].image) {
            if (this.logging)
                console.log('not rendered', indexImage, this.images[indexImage]);
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.logging)
            console.log('rendered:', indexImage, this.images[indexImage]);
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").render);
        if (this.isTrimImages) {
            if (this.isSizeImages && this.isPositionImages) {
                // trim + size + pos
                this.context.drawImage(this.images[indexImage].image, this.xTrimImages, this.yTrimImages, this.widthTrimImages, this.heightTrimImages, this.xPosImages, this.yPosImages, this.widthImages, this.heightImages);
                return;
            }
            else if (this.isSizeImages) {
                // trim + size
                this.context.drawImage(this.images[indexImage].image, this.xTrimImages, this.yTrimImages, this.widthTrimImages, this.heightTrimImages, 0, 0, this.widthImages, this.heightImages);
                return;
            }
            else if (this.isPositionImages) {
                // trim + pos
                this.context.drawImage(this.images[indexImage].image, this.xTrimImages, this.yTrimImages, this.widthCanvas, this.heightCanvas, this.xPosImages, this.yPosImages, this.widthImages, this.heightImages);
            }
            else {
                // trim
                this.context.drawImage(this.images[indexImage].image, this.xTrimImages, this.yTrimImages, this.widthCanvas, this.heightCanvas, 0, 0, this.widthImages, this.heightImages);
            }
        }
        if (this.isSizeImages) {
            if (this.isPositionImages) {
                // size + pos
                this.context.drawImage(this.images[indexImage].image, this.xPosImages, this.yPosImages, this.widthImages, this.heightImages);
                return;
            }
            else {
                // size
                this.context.drawImage(this.images[indexImage].image, 0, 0, this.widthImages, this.heightImages);
                return;
            }
        }
        if (this.isPositionImages) {
            // pos
            this.context.drawImage(this.images[indexImage].image, this.xPosImages, this.yPosImages);
            return;
        }
        // default
        this.context.drawImage(this.images[indexImage].image, 0, 0);
    }
    /**
     * Initializing canvas and image array (possibly downloading them)
     *
     * @method
     * @public
     * @name init
     * @return {void}
     */
    init() {
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").init);
        this.setSizesCanvas({ width: this.widthCanvas, height: this.heightCanvas });
        this.images.forEach((_, index) => {
            __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_loadImage).call(this, index);
        });
    }
    /**
     * This method checks if all images are loaded
     *
     * @method
     * @public
     * @name isLoadedFrames
     * @return {boolean}
     */
    isLoadedFrames() {
        return this.images.every(img => img.state === "LOADED");
    }
    /**
     * The method checks whether at least one image had a problem loading
     *
     * @method
     * @public
     * @name isErrorLoadFrames
     * @return {boolean}
     */
    isErrorLoadFrames() {
        return this.images.some(img => img.state === "ERROR");
    }
    /**
     * Start rendering from the starting image
     *
     * @method
     * @public
     * @name start
     * @return {void}
     */
    start() {
        this.currentIndex = this.startIndex;
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").start);
        __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_startRender).call(this);
    }
    /**
     * Start rendering from the current image
     *
     * @method
     * @public
     * @name play
     * @return {void}
     */
    // Запуск рендеринга
    play() {
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").play);
        __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_startRender).call(this);
    }
    /**
     * Pausing rendering and displaying the initial image
     *
     * @method
     * @public
     * @name stop
     * @return {void}
     */
    stop() {
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").stop);
        __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_setRendering).call(this, false);
        this.setCurrentImage(this.startIndex);
    }
    /**
     * Pause rendering
     *
     * @method
     * @public
     * @name pause
     * @return {void}
     */
    pause() {
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").pause);
        __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_setRendering).call(this, false);
    }
    /**
     * Set current image
     *
     * @method
     * @public
     * @name setCurrentImage
     * @param {number} indexImage Index of the image in the array
     * @return {void}
     */
    setCurrentImage(indexImage) {
        this.currentIndex = indexImage;
    }
    /**
     * The method sets the size of the canvas
     *
     * @method
     * @public
     * @name setSizesCanvas
     * @param {width: number, height: number} sizes Dimensions
     * @return {void}
     */
    setSizesCanvas(sizes) {
        if (sizes.width) {
            this.canvas.width = sizes.width;
            this.widthCanvas = sizes.width;
        }
        else {
            this.widthCanvas = this.canvas.width;
        }
        if (sizes.height) {
            this.canvas.height = sizes.height;
            this.heightCanvas = sizes.height;
        }
        else {
            this.heightCanvas = this.canvas.height;
        }
    }
    on(eventName, callback) {
        this.canvas.addEventListener(eventName, callback.bind(this));
    }
}
_SequenceCanvas_rendering = new WeakMap(), _SequenceCanvas_requestId = new WeakMap(), _SequenceCanvas_fpsInterval = new WeakMap(), _SequenceCanvas_now = new WeakMap(), _SequenceCanvas_then = new WeakMap(), _SequenceCanvas_startTime = new WeakMap(), _SequenceCanvas_elapsed = new WeakMap(), _SequenceCanvas_events = new WeakMap(), _SequenceCanvas_render = new WeakMap(), _SequenceCanvas_instances = new WeakSet(), _SequenceCanvas_loadImage = function _SequenceCanvas_loadImage(index) {
    this.images[index].state = 'LOADING';
    this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").load);
    const img = new Image();
    img.src = this.images[index].path;
    img.onload = () => {
        this.images[index].state = 'LOADED';
        this.images[index].image = img;
        this.canvas.dispatchEvent(__classPrivateFieldGet(this, _SequenceCanvas_events, "f").loaded);
        if (!__classPrivateFieldGet(this, _SequenceCanvas_rendering, "f") &&
            (this.startImmediately ||
                this.startAfterLoaded &&
                    this.isLoadedFrames())) {
            this.currentIndex === this.startIndex ? this.start() : this.play();
        }
    };
    img.onerror = () => {
        this.images[index].state = 'ERROR';
    };
}, _SequenceCanvas_setRendering = function _SequenceCanvas_setRendering(isRendering) {
    __classPrivateFieldSet(this, _SequenceCanvas_rendering, isRendering, "f");
}, _SequenceCanvas_startRender = function _SequenceCanvas_startRender() {
    __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_setRendering).call(this, true);
    this.drawImage(this.currentIndex);
    __classPrivateFieldSet(this, _SequenceCanvas_fpsInterval, 1000 / this.fps, "f");
    __classPrivateFieldSet(this, _SequenceCanvas_then, Date.now(), "f");
    __classPrivateFieldSet(this, _SequenceCanvas_startTime, __classPrivateFieldGet(this, _SequenceCanvas_then, "f"), "f");
    __classPrivateFieldGet(this, _SequenceCanvas_render, "f").call(this);
}, _SequenceCanvas_logic = function _SequenceCanvas_logic() {
    if (this.direction > 0) {
        if (this.loop) {
            if (this.currentIndex === this.finishIndex) {
                this.setCurrentImage(this.startIndex);
            }
            else {
                this.setCurrentImage(this.currentIndex + 1);
            }
        }
        else {
            if (this.currentIndex === this.finishIndex) {
                __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_setRendering).call(this, false);
            }
            else {
                this.setCurrentImage(this.currentIndex + 1);
            }
        }
    }
    else {
        if (this.loop) {
            if (this.currentIndex === this.startIndex) {
                this.setCurrentImage(this.finishIndex);
            }
            else {
                this.setCurrentImage(this.currentIndex - 1);
            }
        }
        else {
            if (this.currentIndex === this.startIndex) {
                __classPrivateFieldGet(this, _SequenceCanvas_instances, "m", _SequenceCanvas_setRendering).call(this, false);
            }
            else {
                this.setCurrentImage(this.currentIndex - 1);
            }
        }
    }
    this.drawImage(this.currentIndex);
};
export default SequenceCanvas;
//# sourceMappingURL=index.js.map