export type StateImageSequenceCanvas = 'WAIT' | 'LOADING' | 'LOADED' | 'ERROR';
export type DirectionSequenceCanvas = -1 | 1;
export type EventSequenceCanvas = 'init' | 'load' | 'loaded' | 'render' | 'start' | 'play' | 'stop' | 'pause';
export interface ImageOptionsSequenceCanvas {
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
export interface ReturnImageOptionsSequenceCanvas {
  position: {
    x?: number;
    y?: number;
  }
  trim: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }
  size: {
    width?: number;
    height?: number;
  }
}
export interface SettingsSequenceCanvas {
  canvas: {
    element: HTMLCanvasElement;
    width?: number;
    height?: number;
  };
  images: {
    paths: Array<string>;
    options?: ImageOptionsSequenceCanvas
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
  on?: any;
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
  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  private heightCanvas: number;
  private widthCanvas: number;

  // Images
  private readonly images: Array<ImageSequenceCanvas>;
  private isPositionImages: boolean;
  private xPosImages?: number;
  private yPosImages?: number;
  private isSizeImages: boolean;
  private widthImages?: number;
  private heightImages?: number;
  private isTrimImages: boolean;
  private xTrimImages?: number;
  private yTrimImages?: number;
  private widthTrimImages?: number;
  private heightTrimImages?: number;

  // Optional
  private fps: number;
  private direction: DirectionSequenceCanvas;
  private loop: boolean;
  private startIndex: number;
  private finishIndex: number;
  private currentIndex: number;
  private readonly startImmediately: boolean;
  private readonly startAfterLoaded: boolean;
  private readonly initiate: boolean = false;
  private logging: boolean = false;

  // Domestic
  private rendering: boolean = false;
  private requestId: number = 0;
  private fpsInterval: number = 0;
  private now: number = 0;
  private then: number = 0;
  private startTime: number = 0;
  private elapsed: number = 0;

  // Events
  private events = {
    init: new CustomEvent('init', {bubbles: true}),
    load: new CustomEvent('load', {bubbles: true}),
    loaded: new CustomEvent('loaded', {bubbles: true}),
    render: new CustomEvent('render', {bubbles: true}),
    start: new CustomEvent('start', {bubbles: true}),
    play: new CustomEvent('play', {bubbles: true}),
    stop: new CustomEvent('stop', {bubbles: true}),
    pause: new CustomEvent('pause', {bubbles: true}),
  }



  /**
   * Create a point.
   * @constructor
   * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
   */

  constructor(settings: SettingsSequenceCanvas) {
    // Canvas
    this.canvas = settings.canvas.element;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.widthCanvas = settings.canvas.width || 0;
    this.heightCanvas = settings.canvas.height || 0;

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

  private loadImage(index: number): void {
    this.images[index].state = 'LOADING';
    this.canvas.dispatchEvent(this.events.load);
    const img = new Image();
    img.src = this.images[index].path;
    img.onload = () => {
      this.images[index].state = 'LOADED';
      this.images[index].image = img;
      this.canvas.dispatchEvent(this.events.loaded);
      if (
        !this.rendering &&
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

  private setRendering(isRendering: boolean): void {
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

  private startRender(): void {
    this.setRendering(true);
    this.drawImage(this.currentIndex);
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
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
    if (!this.rendering) {
      if (this.requestId) cancelAnimationFrame(this.requestId);
      return;
    }
    this.requestId = requestAnimationFrame(this.#render);
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

  private logic(): void {
    if (this.direction > 0) {
      if (this.loop) {
        if (this.currentIndex === this.finishIndex) {
          this.setCurrentImage(this.startIndex)
        } else {
          this.setCurrentImage(this.currentIndex + 1)
        }
      } else {
        if (this.currentIndex === this.finishIndex) {
          this.setRendering(false);
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
          this.setRendering(false);
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

  public drawImage(indexImage: number): void {
    if (this.images[indexImage].state !== 'LOADED' || !this.images[indexImage].image) {
      if (this.logging) console.log('not rendered', indexImage, this.images[indexImage]);
      return;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.logging) console.log('rendered:', indexImage, this.images[indexImage]);
    this.canvas.dispatchEvent(this.events.render);

    if (this.isTrimImages) {
      if (this.isSizeImages && this.isPositionImages) {
        // trim + size + pos
        this.context.drawImage(
          this.images[indexImage].image as HTMLImageElement,
          this.xTrimImages as number,
          this.yTrimImages as number,
          this.widthTrimImages as number,
          this.heightTrimImages as number,
          this.xPosImages as number,
          this.yPosImages as number,
          this.widthImages as number,
          this.heightImages as number,
        );
        return;
      } else if (this.isSizeImages) {
        // trim + size
        this.context.drawImage(
          this.images[indexImage].image as HTMLImageElement,
          this.xTrimImages as number,
          this.yTrimImages as number,
          this.widthTrimImages as number,
          this.heightTrimImages as number,
          0,
          0,
          this.widthImages as number,
          this.heightImages as number,
        );
        return;
      } else if (this.isPositionImages) {
        // trim + pos
        this.context.drawImage(
          this.images[indexImage].image as HTMLImageElement,
          this.xTrimImages as number,
          this.yTrimImages as number,
          this.widthCanvas,
          this.heightCanvas,
          this.xPosImages as number,
          this.yPosImages as number,
          this.widthImages as number,
          this.heightImages as number,
        );
      } else {
        // trim
        this.context.drawImage(
          this.images[indexImage].image as HTMLImageElement,
          this.xTrimImages as number,
          this.yTrimImages as number,
          this.widthCanvas,
          this.heightCanvas,
          0,
          0,
          this.widthImages as number,
          this.heightImages as number,
        );
      }
    }

    if (this.isSizeImages) {
      if (this.isPositionImages) {
        // size + pos
        this.context.drawImage(
          this.images[indexImage].image as HTMLImageElement,
          this.xPosImages as number,
          this.yPosImages as number,
          this.widthImages as number,
          this.heightImages as number,
        );
        return;
      } else {
        // size
        this.context.drawImage(
          this.images[indexImage].image as HTMLImageElement,
          0,
          0,
          this.widthImages as number,
          this.heightImages as number,
        );
        return;
      }
    }

    if (this.isPositionImages) {
      // pos
      this.context.drawImage(
        this.images[indexImage].image as HTMLImageElement,
        this.xPosImages as number,
        this.yPosImages as number,
      );
      return;
    }

    // default
    this.context.drawImage(
      this.images[indexImage].image as HTMLImageElement,
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

  public init(): void {
    this.canvas.dispatchEvent(this.events.init);
    this.setSizesCanvas({width: this.widthCanvas, height: this.heightCanvas});
    this.images.forEach((_, index) => {
      this.loadImage(index);
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

  public isLoadedFrames(): boolean {
    return this.images.every(img => img.state === "LOADED")
  }



  /**
   * Start rendering from the starting image
   *
   * @method
   * @public
   * @name start
   * @return {void}
   */

  public start(): void {
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
  public play(): void {
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

  public stop(): void {
    this.canvas.dispatchEvent(this.events.stop);
    this.setRendering(false);
    this.setCurrentImage(this.startIndex);
    this.drawImage(this.startIndex);
  }



  /**
   * Pause rendering
   *
   * @method
   * @public
   * @name pause
   * @return {void}
   */

  public pause() {
    this.canvas.dispatchEvent(this.events.pause);
    this.setRendering(false);
  }



  /**
   * Add listeners before initialization
   *
   * @method
   * @private
   * @name addListenersBeforeInitialization
   * @param {any} listeners
   * @return {void}
   */

  private addListenersBeforeInitialization = (listeners: any): void => {
    if (listeners) {
      for (let key in listeners) {
        this.canvas.addEventListener(key, listeners[key].bind(this));
      }
    }
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

  public on(eventName: EventSequenceCanvas, callback: (event: CustomEvent) => void): void {
    this.canvas.addEventListener(eventName as string, callback.bind(this) as EventListenerOrEventListenerObject);
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

  public off(eventName: EventSequenceCanvas, callback: (event: CustomEvent) => void): void {
    this.canvas.removeEventListener(eventName as string, callback.bind(this) as EventListenerOrEventListenerObject);
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

  public setCurrentImage(indexImage: number): void {
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

  public getCurrentImage(): number {
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

  public setSizesCanvas(sizes: {width?: number; height?: number}) {
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

  public getSizesCanvas() {
    return {
      width: this.widthCanvas,
      height: this.heightCanvas,
    }
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

  public setImageOptions(options: ImageOptionsSequenceCanvas) {
    this.isPositionImages = options?.position !== undefined;
    this.xPosImages = options.position?.x;
    this.yPosImages = options.position?.y;
    this.isSizeImages = options?.size !== undefined;
    this.widthImages = options.size?.width;
    this.heightImages = options.size?.height;
    this.isTrimImages = options?.trim !== undefined;
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

  public getImageSettings(): ReturnImageOptionsSequenceCanvas {
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
    }
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

  setFps(value: number): void {
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

  getFps(): number {
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

  setDirection(value: DirectionSequenceCanvas): void {
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

  getDirection(): DirectionSequenceCanvas {
    return this.direction
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

  setLoop(value: boolean): void {
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

  getLoop(): boolean {
    return this.loop
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

  setStartIndex(index: number): void {
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

  getStartIndex(): number {
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

  setFinishIndex(index: number): void {
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

  getFinishIndex(): number {
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

  enableLogging(): void {
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

  disableLogging(): void {
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

  getLogging(): boolean {
    return this.logging;
  }
}
