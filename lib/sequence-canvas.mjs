// src/index.ts
var SequenceCanvas = class {
  /**
   * Create a point.
   * @constructor
   * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
   */
  constructor(settings) {
    // Canvas
    this.canvas = void 0;
    this.context = void 0;
    this.heightCanvas = void 0;
    this.widthCanvas = void 0;
    // Images
    this.images = void 0;
    this.isPositionImages = void 0;
    this.xPosImages = void 0;
    this.yPosImages = void 0;
    this.isSizeImages = void 0;
    this.widthImages = void 0;
    this.heightImages = void 0;
    this.isTrimImages = void 0;
    this.xTrimImages = void 0;
    this.yTrimImages = void 0;
    this.widthTrimImages = void 0;
    this.heightTrimImages = void 0;
    // Optional
    this.fps = void 0;
    this.direction = void 0;
    this.loop = void 0;
    this.startIndex = void 0;
    this.finishIndex = void 0;
    this.currentIndex = void 0;
    this.startImmediately = void 0;
    this.startAfterLoaded = void 0;
    this.initiate = false;
    this.logging = false;
    // Domestic
    this.rendering = false;
    // Events
    this.events = {
      init: new CustomEvent("init", { bubbles: true }),
      load: new CustomEvent("load", { bubbles: true }),
      loaded: new CustomEvent("loaded", { bubbles: true }),
      render: new CustomEvent("render", { bubbles: true }),
      start: new CustomEvent("start", { bubbles: true }),
      play: new CustomEvent("play", { bubbles: true }),
      stop: new CustomEvent("stop", { bubbles: true }),
      pause: new CustomEvent("pause", { bubbles: true })
    };
    /**
     * The method is loop rendering.
     *
     * @method
     * @private
     * @name this.#render
     * @return {void}
     */
    this.#render = () => {
      if (!this.rendering) {
        if (this.requestId)
          cancelAnimationFrame(this.requestId);
        return;
      }
      this.requestId = requestAnimationFrame(this.#render);
      this.now = Date.now();
      this.elapsed = this.now - this.then;
      if (this.elapsed > this.fpsInterval) {
        this.then = this.now - this.elapsed % this.fpsInterval;
        this.logic();
      }
    };
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
    this.canvas = settings.canvas.element;
    this.context = this.canvas.getContext("2d");
    this.widthCanvas = settings.canvas.width;
    this.heightCanvas = settings.canvas.height;
    this.images = settings.images.paths.map((path) => {
      return { path, state: "WAIT" };
    });
    this.isPositionImages = settings.images?.options?.position !== void 0;
    this.xPosImages = settings.images?.options?.position?.x;
    this.yPosImages = settings.images?.options?.position?.y;
    this.isSizeImages = settings.images?.options?.size !== void 0;
    this.widthImages = settings.images?.options?.size?.width;
    this.heightImages = settings.images?.options?.size?.height;
    this.isTrimImages = settings.images?.options?.trim !== void 0;
    this.xTrimImages = settings.images?.options?.trim?.x;
    this.yTrimImages = settings.images?.options?.trim?.y;
    this.widthTrimImages = settings.images?.options?.trim?.width;
    this.heightTrimImages = settings.images?.options?.trim?.height;
    this.fps = typeof settings.fps === "number" && 60 >= settings.fps && settings.fps > 0 ? settings.fps : 60;
    this.direction = settings.direction ?? 1;
    this.loop = settings.loop ?? true;
    this.startIndex = settings.startIndex ?? 0;
    this.finishIndex = settings.finishIndex ?? (settings.images.paths.length ? settings.images.paths.length - 1 : 0);
    this.currentIndex = settings.currentIndex ?? 0;
    this.startImmediately = settings.startImmediately ?? false;
    this.startAfterLoaded = settings.startAfterLoaded ?? true;
    this.initiate = settings.init ?? true;
    this.logging = settings.logging ?? false;
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
    this.images[index].state = "LOADING";
    this.canvas.dispatchEvent(this.events.load);
    const img = new Image();
    img.src = this.images[index].path;
    img.onload = () => {
      this.images[index].state = "LOADED";
      this.images[index].image = img;
      this.canvas.dispatchEvent(this.events.loaded);
      if (!this.rendering && (this.startImmediately || this.startAfterLoaded && this.isLoadedFrames())) {
        this.currentIndex === this.startIndex ? this.start() : this.play();
      }
    };
    img.onerror = () => {
      this.images[index].state = "ERROR";
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
    this.fpsInterval = 1e3 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
    this.#render();
  }
  #render;
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
        } else {
          this.setCurrentImage(this.currentIndex + 1);
        }
      } else {
        if (this.currentIndex === this.finishIndex) {
          this.setRendering(false);
        } else {
          this.setCurrentImage(this.currentIndex + 1);
        }
      }
    } else {
      if (this.loop) {
        if (this.currentIndex === this.startIndex) {
          this.setCurrentImage(this.finishIndex);
        } else {
          this.setCurrentImage(this.currentIndex - 1);
        }
      } else {
        if (this.currentIndex === this.startIndex) {
          this.setRendering(false);
        } else {
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
    if (this.images[indexImage].state !== "LOADED" || !this.images[indexImage].image) {
      if (this.logging)
        console.log("not rendered", indexImage, this.images[indexImage]);
      return;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.logging)
      console.log("rendered:", indexImage, this.images[indexImage]);
    this.canvas.dispatchEvent(this.events.render);
    if (this.isTrimImages) {
      if (this.isSizeImages && this.isPositionImages) {
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthTrimImages,
          this.heightTrimImages,
          this.xPosImages,
          this.yPosImages,
          this.widthImages,
          this.heightImages
        );
        return;
      } else if (this.isSizeImages) {
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthTrimImages,
          this.heightTrimImages,
          0,
          0,
          this.widthImages,
          this.heightImages
        );
        return;
      } else if (this.isPositionImages) {
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthCanvas,
          this.heightCanvas,
          this.xPosImages,
          this.yPosImages,
          this.widthImages,
          this.heightImages
        );
      } else {
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthCanvas,
          this.heightCanvas,
          0,
          0,
          this.widthImages,
          this.heightImages
        );
      }
    }
    if (this.isSizeImages) {
      if (this.isPositionImages) {
        this.context.drawImage(
          this.images[indexImage].image,
          this.xPosImages,
          this.yPosImages,
          this.widthImages,
          this.heightImages
        );
        return;
      } else {
        this.context.drawImage(
          this.images[indexImage].image,
          0,
          0,
          this.widthImages,
          this.heightImages
        );
        return;
      }
    }
    if (this.isPositionImages) {
      this.context.drawImage(
        this.images[indexImage].image,
        this.xPosImages,
        this.yPosImages
      );
      return;
    }
    this.context.drawImage(
      this.images[indexImage].image,
      0,
      0
    );
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
    return this.images.every((img) => img.state === "LOADED");
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
    } else {
      this.widthCanvas = this.canvas.width;
    }
    if (sizes.height) {
      this.canvas.height = sizes.height;
      this.heightCanvas = sizes.height;
    } else {
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
      height: this.heightCanvas
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
    this.isPositionImages = options?.position !== void 0;
    this.xPosImages = options.position?.x;
    this.yPosImages = options.position?.y;
    this.isSizeImages = options?.size !== void 0;
    this.widthImages = options.size?.width;
    this.heightImages = options.size?.height;
    this.isTrimImages = options?.trim !== void 0;
    this.xTrimImages = options.trim?.x;
    this.yTrimImages = options.trim?.y;
    this.widthTrimImages = options.trim?.width;
    this.heightTrimImages = options.trim?.height;
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
    this.fps = typeof value === "number" && 60 >= value && value > 0 ? value : 60;
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
};
export {
  SequenceCanvas as default
};
//# sourceMappingURL=sequence-canvas.mjs.map
