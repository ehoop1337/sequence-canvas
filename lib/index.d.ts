type StateImageSequenceCanvas = 'WAIT' | 'LOADING' | 'LOADED' | 'ERROR';
type DirectionSequenceCanvas = -1 | 1;
type EventSequenceCanvas = 'init' | 'load' | 'loaded' | 'render' | 'start' | 'play' | 'stop' | 'pause';
interface SettingsSequenceCanvas {
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
        };
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
}
interface ImageSequenceCanvas {
    path: string;
    state: StateImageSequenceCanvas;
    image?: HTMLImageElement;
}
/**
 * Creates a new sequence canvas.
 * @name SequenceCanvas
 * @class
 */
declare class SequenceCanvas {
    #private;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    heightCanvas: number;
    widthCanvas: number;
    images: Array<ImageSequenceCanvas>;
    isPositionImages: boolean;
    xPosImages: number;
    yPosImages: number;
    isSizeImages: boolean;
    widthImages: number;
    heightImages: number;
    isTrimImages: boolean;
    xTrimImages: number;
    yTrimImages: number;
    widthTrimImages: number;
    heightTrimImages: number;
    fps: number;
    direction: DirectionSequenceCanvas;
    loop: boolean;
    startIndex: number;
    finishIndex: number;
    currentIndex: number;
    startImmediately: boolean;
    startAfterLoaded: boolean;
    initiate: boolean;
    logging: boolean;
    /**
     * Create a point.
     * @constructor
     * @param {SettingsSequenceCanvas} settings - Settings for creating a new instance
     */
    constructor(settings: SettingsSequenceCanvas);
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
     * The method checks whether at least one image had a problem loading
     *
     * @method
     * @public
     * @name isErrorLoadFrames
     * @return {boolean}
     */
    isErrorLoadFrames(): boolean;
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
    on(eventName: EventSequenceCanvas, callback: (event: CustomEvent) => void): void;
}
export default SequenceCanvas;
