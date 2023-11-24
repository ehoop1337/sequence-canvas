var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SequenceCanvas_render;
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
        this.initiate = false;
        this.logging = false;
        // Domestic
        this.rendering = false;
        this.requestId = 0;
        this.fpsInterval = 0;
        this.now = 0;
        this.then = 0;
        this.startTime = 0;
        this.elapsed = 0;
        // Events
        this.events = {
            init: new CustomEvent('init', { bubbles: true }),
            load: new CustomEvent('load', { bubbles: true }),
            loaded: new CustomEvent('loaded', { bubbles: true }),
            render: new CustomEvent('render', { bubbles: true }),
            start: new CustomEvent('start', { bubbles: true }),
            play: new CustomEvent('play', { bubbles: true }),
            stop: new CustomEvent('stop', { bubbles: true }),
            pause: new CustomEvent('pause', { bubbles: true }),
        };
        /**
         * The method is loop rendering.
         *
         * @method
         * @private
         * @name this.#render
         * @return {void}
         */
        _SequenceCanvas_render.set(this, () => {
            if (!this.rendering) {
                if (this.requestId)
                    cancelAnimationFrame(this.requestId);
                return;
            }
            this.requestId = requestAnimationFrame(__classPrivateFieldGet(this, _SequenceCanvas_render, "f"));
            this.now = Date.now();
            this.elapsed = this.now - this.then;
            if (this.elapsed > this.fpsInterval) {
                this.then = this.now - (this.elapsed % this.fpsInterval);
                this.logic();
            }
        }
        /**
         * Logic for changing images
         *
         * @method
         * @private
         * @name logic
         * @return {void}
         */
        );
        /**
         * Add listeners before initialization
         *
         * @method
         * @private
         * @name addListenersBeforeInitialization
         * @param {any} listeners
         * @return {void}
         */
        this.addListenersBeforeInitialization = (listeners) => {
            if (listeners) {
                for (let key in listeners) {
                    this.canvas.addEventListener(key, listeners[key].bind(this));
                }
            }
        };
        // Canvas
        this.canvas = settings.canvas.element;
        this.context = this.canvas.getContext("2d");
        this.widthCanvas = settings.canvas.width || 0;
        this.heightCanvas = settings.canvas.height || 0;
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
        if (settings.on) {
            this.addListenersBeforeInitialization(settings.on);
        }
        if (this.initiate) {
            this.init();
        }
    }
    /**
     * This method loads the image by index.
     *
     * @method
     * @private
     * @name this.#loadImage
     * @param {number} index Index of element in image array.
     * @return {void}
     */
    loadImage(index) {
        this.images[index].state = 'LOADING';
        this.canvas.dispatchEvent(this.events.load);
        const img = new Image();
        img.src = this.images[index].path;
        img.onload = () => {
            this.images[index].state = 'LOADED';
            this.images[index].image = img;
            this.canvas.dispatchEvent(this.events.loaded);
            if (!this.rendering &&
                (this.startImmediately ||
                    this.startAfterLoaded &&
                        this.isLoadedFrames())) {
                this.currentIndex === this.startIndex ? this.start() : this.play();
            }
        };
        img.onerror = () => {
            this.images[index].state = 'ERROR';
        };
    }
    /**
     * Changing the rendering flag.
     *
     * @method
     * @private
     * @name this.#setRendering
     * @param {boolean} isRendering
     * @return {void}
     */
    setRendering(isRendering) {
        this.rendering = isRendering;
    }
    /**
     * The method starts the rendering loop
     *
     * @method
     * @private
     * @name this.#startRender
     * @return {void}
     */
    startRender() {
        this.setRendering(true);
        this.drawImage(this.currentIndex);
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        this.startTime = this.then;
        __classPrivateFieldGet(this, _SequenceCanvas_render, "f").call(this);
    }
    /**
     * Logic for changing images
     *
     * @method
     * @private
     * @name logic
     * @return {void}
     */
    logic() {
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
                    this.setRendering(false);
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
                    this.setRendering(false);
                }
                else {
                    this.setCurrentImage(this.currentIndex - 1);
                }
            }
        }
        this.drawImage(this.currentIndex);
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
        this.canvas.dispatchEvent(this.events.render);
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
        this.canvas.dispatchEvent(this.events.init);
        this.setSizesCanvas({ width: this.widthCanvas, height: this.heightCanvas });
        this.images.forEach((_, index) => {
            this.loadImage(index);
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
     * Start rendering from the starting image
     *
     * @method
     * @public
     * @name start
     * @return {void}
     */
    start() {
        this.currentIndex = this.startIndex;
        this.canvas.dispatchEvent(this.events.start);
        this.startRender();
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
        this.canvas.dispatchEvent(this.events.play);
        this.startRender();
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
        this.canvas.dispatchEvent(this.events.stop);
        this.setRendering(false);
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
        this.canvas.dispatchEvent(this.events.pause);
        this.setRendering(false);
    }
    /**
     * Attaches a listener to an event
     *
     * @method
     * @public
     * @name on
     * @param {EventSequenceCanvas} eventName
     * @param {(event: CustomEvent) => void} callback
     * @return {void}
     */
    on(eventName, callback) {
        this.canvas.addEventListener(eventName, callback.bind(this));
    }
    /**
     * Removing an event listener
     *
     * @method
     * @public
     * @name off
     * @param {EventSequenceCanvas} eventName
     * @param {(event: CustomEvent) => void} callback
     * @return {void}
     */
    off(eventName, callback) {
        this.canvas.removeEventListener(eventName, callback.bind(this));
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
     * Get current image
     *
     * @method
     * @public
     * @name getCurrentImage
     * @return {number}
     */
    getCurrentImage() {
        return this.currentIndex;
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
    /**
     * The method gets the size of the canvas
     *
     * @method
     * @public
     * @name getSizesCanvas
     * @return {{width: number, height: number}}
     */
    getSizesCanvas() {
        return {
            width: this.widthCanvas,
            height: this.heightCanvas,
        };
    }
    /**
     * Set image options
     *
     * @method
     * @public
     * @name setImageOptions
     * @param {ImageOptionsSequenceCanvas} options
     * @return {void}
     */
    setImageOptions(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.isPositionImages = (options === null || options === void 0 ? void 0 : options.position) !== undefined;
        this.xPosImages = (_a = options.position) === null || _a === void 0 ? void 0 : _a.x;
        this.yPosImages = (_b = options.position) === null || _b === void 0 ? void 0 : _b.y;
        this.isSizeImages = (options === null || options === void 0 ? void 0 : options.size) !== undefined;
        this.widthImages = (_c = options.size) === null || _c === void 0 ? void 0 : _c.width;
        this.heightImages = (_d = options.size) === null || _d === void 0 ? void 0 : _d.height;
        this.isTrimImages = (options === null || options === void 0 ? void 0 : options.trim) !== undefined;
        this.xTrimImages = (_e = options.trim) === null || _e === void 0 ? void 0 : _e.x;
        this.yTrimImages = (_f = options.trim) === null || _f === void 0 ? void 0 : _f.y;
        this.widthTrimImages = (_g = options.trim) === null || _g === void 0 ? void 0 : _g.width;
        this.heightTrimImages = (_h = options.trim) === null || _h === void 0 ? void 0 : _h.height;
    }
    /**
     * Get image settings
     *
     * @method
     * @public
     * @name getImageSettings
     * @return {ReturnImageOptionsSequenceCanvas}
     */
    getImageSettings() {
        return {
            position: {
                x: this.xPosImages,
                y: this.yPosImages
            },
            trim: {
                x: this.xTrimImages,
                y: this.yTrimImages,
                width: this.widthTrimImages,
                height: this.heightTrimImages
            },
            size: {
                width: this.widthImages,
                height: this.heightImages
            }
        };
    }
    /**
     * Set fps
     *
     * @method
     * @public
     * @name setFps
     * @param {number} value
     * @return {void}
     */
    setFps(value) {
        this.fps = 60 >= value && value > 0 ? value : 60;
    }
    /**
     * Get fps
     *
     * @method
     * @public
     * @name getFps
     * @return {number}
     */
    getFps() {
        return this.fps;
    }
    /**
     * Set direction
     *
     * @method
     * @public
     * @name setDirection
     * @param {DirectionSequenceCanvas} value
     * @return {void}
     */
    setDirection(value) {
        this.direction = value;
    }
    /**
     * Get direction
     *
     * @method
     * @public
     * @name getDirection
     * @return {DirectionSequenceCanvas}
     */
    getDirection() {
        return this.direction;
    }
    /**
     * Set loop
     *
     * @method
     * @public
     * @name setLoop
     * @param {boolean} value
     * @return {void}
     */
    setLoop(value) {
        this.loop = value;
    }
    /**
     * Get loop
     *
     * @method
     * @public
     * @name getLoop
     * @return {boolean}
     */
    getLoop() {
        return this.loop;
    }
    /**
     * Set start index
     *
     * @method
     * @public
     * @name setStartIndex
     * @param {number} index
     * @return {void}
     */
    setStartIndex(index) {
        if (index > this.images.length) {
            this.startIndex = this.images.length;
            return;
        }
        if (index < 0) {
            this.startIndex = 0;
            return;
        }
        this.startIndex = index;
    }
    /**
     * Get start index
     *
     * @method
     * @public
     * @name getStartIndex
     * @return {number}
     */
    getStartIndex() {
        return this.startIndex;
    }
    /**
     * Set finish index
     *
     * @method
     * @public
     * @name setFinishIndex
     * @param {number} index
     * @return {void}
     */
    setFinishIndex(index) {
        if (index > this.images.length) {
            this.finishIndex = this.images.length;
            return;
        }
        if (index < 0) {
            this.finishIndex = 0;
            return;
        }
        this.finishIndex = index;
    }
    /**
     * Get finish index
     *
     * @method
     * @public
     * @name getFinishIndex
     * @return {number}
     */
    getFinishIndex() {
        return this.finishIndex;
    }
    /**
     * Enable logging
     *
     * @method
     * @public
     * @name enableLogging
     * @return {void}
     */
    enableLogging() {
        this.logging = true;
    }
    /**
     * Disable logging
     *
     * @method
     * @public
     * @name disableLogging
     * @return {void}
     */
    disableLogging() {
        this.logging = false;
    }
    /**
     * Get logging
     *
     * @method
     * @public
     * @name getLogging
     * @return {void}
     */
    getLogging() {
        return this.logging;
    }
}
_SequenceCanvas_render = new WeakMap();
export default SequenceCanvas;
