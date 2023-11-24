export type StateImageSequenceCanvas = 'WAIT' | 'LOADING' | 'LOADED' | 'ERROR';
export type DirectionSequenceCanvas = -1 | 1;
export type EventSequenceCanvas = 'init' | 'load' | 'loaded' | 'render' | 'start' | 'play' | 'stop' | 'pause';
export interface ImageOptionsSequenceCanvas {
    position?: {
        x: number;
        y: number;
    };
    trim?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    size?: {
        width: number;
        height: number;
    };
}
export interface ReturnImageOptionsSequenceCanvas {
    position: {
        x?: number;
        y?: number;
    };
    trim: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };
    size: {
        width?: number;
        height?: number;
    };
}
export interface SettingsSequenceCanvas {
    canvas: {
        element: HTMLCanvasElement;
        width?: number;
        height?: number;
    };
    images: {
        paths: Array<string>;
        options?: ImageOptionsSequenceCanvas;
    };
    init?: boolean;
    direction?: DirectionSequenceCanvas;
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
    #private;
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    private heightCanvas;
    private widthCanvas;
    private readonly images;
    private isPositionImages;
    private xPosImages?;
    private yPosImages?;
    private isSizeImages;
    private widthImages?;
    private heightImages?;
    private isTrimImages;
    private xTrimImages?;
    private yTrimImages?;
    private widthTrimImages?;
    private heightTrimImages?;
    private fps;
    private direction;
    private loop;
    private startIndex;
    private finishIndex;
    private currentIndex;
    private readonly startImmediately;
    private readonly startAfterLoaded;
    private readonly initiate;
    private logging;
    private rendering;
    private requestId;
    private fpsInterval;
    private now;
    private then;
    private startTime;
    private elapsed;
    private events;
    /**
     * Create a point.
     * @constructor
     * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
     */
    constructor(settings: SettingsSequenceCanvas);
    /**
     * This method loads the image by index.
     *
     * @method
     * @private
     * @name this.#loadImage
     * @param {number} index Index of element in image array.
     * @return {void}
     */
    private loadImage;
    /**
     * Changing the rendering flag.
     *
     * @method
     * @private
     * @name this.#setRendering
     * @param {boolean} isRendering
     * @return {void}
     */
    private setRendering;
    /**
     * The method starts the rendering loop
     *
     * @method
     * @private
     * @name this.#startRender
     * @return {void}
     */
    private startRender;
    /**
     * Logic for changing images
     *
     * @method
     * @private
     * @name logic
     * @return {void}
     */
    private logic;
    /**
     * Drawing an image by index
     *
     * @method
     * @public
     * @name drawImage
     * @param {number} indexImage Index of the image in the array
     * @return {void}
     */
    drawImage(indexImage: number): void;
    /**
     * Initializing canvas and image array (possibly downloading them)
     *
     * @method
     * @public
     * @name init
     * @return {void}
     */
    init(): void;
    /**
     * This method checks if all images are loaded
     *
     * @method
     * @public
     * @name isLoadedFrames
     * @return {boolean}
     */
    isLoadedFrames(): boolean;
    /**
     * Start rendering from the starting image
     *
     * @method
     * @public
     * @name start
     * @return {void}
     */
    start(): void;
    /**
     * Start rendering from the current image
     *
     * @method
     * @public
     * @name play
     * @return {void}
     */
    play(): void;
    /**
     * Pausing rendering and displaying the initial image
     *
     * @method
     * @public
     * @name stop
     * @return {void}
     */
    stop(): void;
    /**
     * Pause rendering
     *
     * @method
     * @public
     * @name pause
     * @return {void}
     */
    pause(): void;
    /**
     * Add listeners before initialization
     *
     * @method
     * @private
     * @name addListenersBeforeInitialization
     * @param {any} listeners
     * @return {void}
     */
    private addListenersBeforeInitialization;
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
    on(eventName: EventSequenceCanvas, callback: (event: CustomEvent) => void): void;
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
    off(eventName: EventSequenceCanvas, callback: (event: CustomEvent) => void): void;
    /**
     * Set current image
     *
     * @method
     * @public
     * @name setCurrentImage
     * @param {number} indexImage Index of the image in the array
     * @return {void}
     */
    setCurrentImage(indexImage: number): void;
    /**
     * Get current image
     *
     * @method
     * @public
     * @name getCurrentImage
     * @return {number}
     */
    getCurrentImage(): number;
    /**
     * The method sets the size of the canvas
     *
     * @method
     * @public
     * @name setSizesCanvas
     * @param {width: number, height: number} sizes Dimensions
     * @return {void}
     */
    setSizesCanvas(sizes: {
        width?: number;
        height?: number;
    }): void;
    /**
     * The method gets the size of the canvas
     *
     * @method
     * @public
     * @name getSizesCanvas
     * @return {{width: number, height: number}}
     */
    getSizesCanvas(): {
        width: number;
        height: number;
    };
    /**
     * Set image options
     *
     * @method
     * @public
     * @name setImageOptions
     * @param {ImageOptionsSequenceCanvas} options
     * @return {void}
     */
    setImageOptions(options: ImageOptionsSequenceCanvas): void;
    /**
     * Get image settings
     *
     * @method
     * @public
     * @name getImageSettings
     * @return {ReturnImageOptionsSequenceCanvas}
     */
    getImageSettings(): ReturnImageOptionsSequenceCanvas;
    /**
     * Set fps
     *
     * @method
     * @public
     * @name setFps
     * @param {number} value
     * @return {void}
     */
    setFps(value: number): void;
    /**
     * Get fps
     *
     * @method
     * @public
     * @name getFps
     * @return {number}
     */
    getFps(): number;
    /**
     * Set direction
     *
     * @method
     * @public
     * @name setDirection
     * @param {DirectionSequenceCanvas} value
     * @return {void}
     */
    setDirection(value: DirectionSequenceCanvas): void;
    /**
     * Get direction
     *
     * @method
     * @public
     * @name getDirection
     * @return {DirectionSequenceCanvas}
     */
    getDirection(): DirectionSequenceCanvas;
    /**
     * Set loop
     *
     * @method
     * @public
     * @name setLoop
     * @param {boolean} value
     * @return {void}
     */
    setLoop(value: boolean): void;
    /**
     * Get loop
     *
     * @method
     * @public
     * @name getLoop
     * @return {boolean}
     */
    getLoop(): boolean;
    /**
     * Set start index
     *
     * @method
     * @public
     * @name setStartIndex
     * @param {number} index
     * @return {void}
     */
    setStartIndex(index: number): void;
    /**
     * Get start index
     *
     * @method
     * @public
     * @name getStartIndex
     * @return {number}
     */
    getStartIndex(): number;
    /**
     * Set finish index
     *
     * @method
     * @public
     * @name setFinishIndex
     * @param {number} index
     * @return {void}
     */
    setFinishIndex(index: number): void;
    /**
     * Get finish index
     *
     * @method
     * @public
     * @name getFinishIndex
     * @return {number}
     */
    getFinishIndex(): number;
    /**
     * Enable logging
     *
     * @method
     * @public
     * @name enableLogging
     * @return {void}
     */
    enableLogging(): void;
    /**
     * Disable logging
     *
     * @method
     * @public
     * @name disableLogging
     * @return {void}
     */
    disableLogging(): void;
    /**
     * Get logging
     *
     * @method
     * @public
     * @name getLogging
     * @return {void}
     */
    getLogging(): boolean;
}
