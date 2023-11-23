export type StateImageSequenceCanvas = 'WAIT' | 'LOADING' | 'LOADED' | 'ERROR';
export type DirectionSequenceCanvas = -1 | 1;
export type EventSequenceCanvas = 'init' | 'load' | 'loaded' | 'render' | 'start' | 'play' | 'stop' | 'pause';

export interface SettingsSequenceCanvas {
  canvas: {
    element: HTMLCanvasElement;
    width?: number;
    height?: number;
  };
  images: {
    paths: Array<string>;
    options?: {
      position?: {
        x: number;
        y: number;
      }
      trim?: {
        x: number;
        y: number;
        width: number;
        height: number;
      }
      size?: {
        width: number;
        height: number;
      }
    }
  };
  init?: boolean;
  direction?: DirectionSequenceCanvas
  loop?: boolean;
  fps?: number;
  startIndex?: number;
  finishIndex?: number;
  currentIndex?: number;
  startImmediately?: boolean;
  startAfterLoaded?: boolean;
  logging?: boolean;
}

export interface ImageSequenceCanvas {
  path: string;
  state: StateImageSequenceCanvas;
  image?: HTMLImageElement;
}

/**
 * Creates a new sequence canvas.
 * @name SequenceCanvas
 * @class
 */

export default class SequenceCanvas {
  // Canvas
  canvas: HTMLCanvasElement = undefined;
  context: CanvasRenderingContext2D = undefined;
  heightCanvas: number = undefined;
  widthCanvas: number = undefined;

  // Images
  images: Array<ImageSequenceCanvas> = undefined;
  isPositionImages: boolean = undefined;
  xPosImages: number = undefined;
  yPosImages: number = undefined;
  isSizeImages: boolean = undefined;
  widthImages: number = undefined;
  heightImages: number = undefined;
  isTrimImages: boolean = undefined;
  xTrimImages: number = undefined;
  yTrimImages: number = undefined;
  widthTrimImages: number = undefined;
  heightTrimImages: number = undefined;

  // Optional
  fps: number = undefined;
  direction: DirectionSequenceCanvas = undefined;
  loop: boolean = undefined;
  startIndex: number = undefined;
  finishIndex: number = undefined;
  currentIndex: number = undefined;
  startImmediately: boolean = undefined;
  startAfterLoaded: boolean = undefined;
  initiate: boolean = false;
  logging: boolean = false;

  // Domestic
  #rendering: boolean = false;
  #requestId: number;
  #fpsInterval: number;
  #now: number;
  #then: number;
  #startTime: number;
  #elapsed: number;

  // Events
  #events = {
    init: new Event('init', {bubbles: true}),
    load: new Event('load', {bubbles: true}),
    loaded: new Event('loaded', {bubbles: true}),
    render: new Event('render', {bubbles: true}),
    start: new Event('start', {bubbles: true}),
    play: new Event('play', {bubbles: true}),
    stop: new Event('stop', {bubbles: true}),
    pause: new Event('pause', {bubbles: true}),
  }

  /**
   * Create a point.
   * @constructor
   * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
   */

  constructor(settings: SettingsSequenceCanvas) {
    // Canvas
    this.canvas = settings.canvas.element;
    this.context = this.canvas.getContext("2d");
    this.widthCanvas = settings.canvas.width;
    this.heightCanvas = settings.canvas.height;

    // Images
    this.images = settings.images.paths.map((path) => {
      return {path, state: 'WAIT'};
    });
    this.isPositionImages = settings.images?.options?.position !== undefined;
    this.xPosImages = settings.images?.options?.position?.x;
    this.yPosImages = settings.images?.options?.position?.y;
    this.isSizeImages = settings.images?.options?.size !== undefined;
    this.widthImages = settings.images?.options?.size?.width;
    this.heightImages = settings.images?.options?.size?.height;
    this.isTrimImages = settings.images?.options?.trim !== undefined;
    this.xTrimImages = settings.images?.options?.trim?.x;
    this.yTrimImages = settings.images?.options?.trim?.y;
    this.widthTrimImages = settings.images?.options?.trim?.width;
    this.heightTrimImages = settings.images?.options?.trim?.height;

    // Optional
    this.fps = typeof settings.fps === 'number' && 60 >= settings.fps && settings.fps > 0 ? settings.fps : 60;
    this.direction = settings.direction ?? 1;
    this.loop = settings.loop ?? true;
    this.startIndex = settings.startIndex ?? 0;
    this.finishIndex = settings.finishIndex ?? (settings.images.paths.length ? settings.images.paths.length - 1 : 0);
    this.currentIndex = settings.currentIndex ?? 0;
    this.startImmediately = settings.startImmediately ?? false;
    this.startAfterLoaded = settings.startAfterLoaded ?? true;
    this.initiate = settings.init ?? true;
    this.logging = settings.logging ?? false;

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

  #loadImage(index: number): void {
    this.images[index].state = 'LOADING';
    this.canvas.dispatchEvent(this.#events.load);
    const img = new Image();
    img.src = this.images[index].path;
    img.onload = () => {
      this.images[index].state = 'LOADED';
      this.images[index].image = img;
      this.canvas.dispatchEvent(this.#events.loaded);
      if (
        !this.#rendering &&
        (
          this.startImmediately ||
          this.startAfterLoaded &&
          this.isLoadedFrames()
        )
      ) {
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

  #setRendering(isRendering: boolean): void {
    this.#rendering = isRendering;
  }

  /**
   * The method starts the rendering loop
   *
   * @method
   * @private
   * @name this.#startRender
   * @return {void}
   */

  #startRender(): void {
    this.#setRendering(true);
    this.drawImage(this.currentIndex);
    this.#fpsInterval = 1000 / this.fps;
    this.#then = Date.now();
    this.#startTime = this.#then;
    this.#render();
  }

  /**
   * The method is loop rendering.
   *
   * @method
   * @private
   * @name this.#render
   * @return {void}
   */

  #render = (): void => {
    if (!this.#rendering) {
      if (this.#requestId) cancelAnimationFrame(this.#requestId);
      return;
    }
    this.#requestId = requestAnimationFrame(this.#render);
    this.#now = Date.now();
    this.#elapsed = this.#now - this.#then;
    if (this.#elapsed > this.#fpsInterval) {
      this.#then = this.#now - (this.#elapsed % this.#fpsInterval);
      this.#logic();
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

  #logic() {
    if (this.direction > 0) {
      if (this.loop) {
        if (this.currentIndex === this.finishIndex) {
          this.setCurrentImage(this.startIndex)
        } else {
          this.setCurrentImage(this.currentIndex + 1)
        }
      } else {
        if (this.currentIndex === this.finishIndex) {
          this.#setRendering(false);
        } else {
          this.setCurrentImage(this.currentIndex + 1)
        }
      }
    } else {
      if (this.loop) {
        if (this.currentIndex === this.startIndex) {
          this.setCurrentImage(this.finishIndex)
        } else {
          this.setCurrentImage(this.currentIndex - 1)
        }
      } else {
        if (this.currentIndex === this.startIndex) {
          this.#setRendering(false);
        } else {
          this.setCurrentImage(this.currentIndex - 1)
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

  drawImage(indexImage: number): void {
    if (this.images[indexImage].state !== 'LOADED' || !this.images[indexImage].image) {
      if (this.logging) console.log('not rendered', indexImage, this.images[indexImage]);
      return;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.logging) console.log('rendered:', indexImage, this.images[indexImage]);
    this.canvas.dispatchEvent(this.#events.render);

    if (this.isTrimImages) {
      if (this.isSizeImages && this.isPositionImages) {
        // trim + size + pos
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthTrimImages,
          this.heightTrimImages,
          this.xPosImages,
          this.yPosImages,
          this.widthImages,
          this.heightImages,
        );
        return;
      } else if (this.isSizeImages) {
        // trim + size
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthTrimImages,
          this.heightTrimImages,
          0,
          0,
          this.widthImages,
          this.heightImages,
        );
        return;
      } else if (this.isPositionImages) {
        // trim + pos
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthCanvas,
          this.heightCanvas,
          this.xPosImages,
          this.yPosImages,
          this.widthImages,
          this.heightImages,
        );
      } else {
        // trim
        this.context.drawImage(
          this.images[indexImage].image,
          this.xTrimImages,
          this.yTrimImages,
          this.widthCanvas,
          this.heightCanvas,
          0,
          0,
          this.widthImages,
          this.heightImages,
        );
      }
    }

    if (this.isSizeImages) {
      if (this.isPositionImages) {
        // size + pos
        this.context.drawImage(
          this.images[indexImage].image,
          this.xPosImages,
          this.yPosImages,
          this.widthImages,
          this.heightImages,
        );
        return;
      } else {
        // size
        this.context.drawImage(
          this.images[indexImage].image,
          0,
          0,
          this.widthImages,
          this.heightImages,
        );
        return;
      }
    }

    if (this.isPositionImages) {
      // pos
      this.context.drawImage(
        this.images[indexImage].image,
        this.xPosImages,
        this.yPosImages,
      );
      return;
    }

    // default
    this.context.drawImage(
      this.images[indexImage].image,
      0,
      0,
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

  init(): void {
    this.canvas.dispatchEvent(this.#events.init);
    this.setSizesCanvas({width: this.widthCanvas, height: this.heightCanvas});
    this.images.forEach((_, index) => {
      this.#loadImage(index);
    })
  }

  /**
   * This method checks if all images are loaded
   *
   * @method
   * @public
   * @name isLoadedFrames
   * @return {boolean}
   */

  isLoadedFrames(): boolean {
    return this.images.every(img => img.state === "LOADED")
  }

  /**
   * The method checks whether at least one image had a problem loading
   *
   * @method
   * @public
   * @name isErrorLoadFrames
   * @return {boolean}
   */

  isErrorLoadFrames(): boolean {
    return this.images.some(img => img.state === "ERROR")
  }

  /**
   * Start rendering from the starting image
   *
   * @method
   * @public
   * @name start
   * @return {void}
   */

  start(): void {
    this.currentIndex = this.startIndex;
    this.canvas.dispatchEvent(this.#events.start);
    this.#startRender();
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
  play(): void {
    this.canvas.dispatchEvent(this.#events.play);
    this.#startRender();
  }

  /**
   * Pausing rendering and displaying the initial image
   *
   * @method
   * @public
   * @name stop
   * @return {void}
   */

  stop(): void {
    this.canvas.dispatchEvent(this.#events.stop);
    this.#setRendering(false);
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
    this.canvas.dispatchEvent(this.#events.pause);
    this.#setRendering(false);
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

  setCurrentImage(indexImage: number): void {
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

  setSizesCanvas(sizes: {width?: number; height?: number}) {
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

  on(eventName: EventSequenceCanvas, callback: (event: CustomEvent) => void) {
    this.canvas.addEventListener(eventName, callback.bind(this));
  }
}
