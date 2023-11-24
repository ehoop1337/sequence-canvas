# sequence-canvas
Frame-by-frame reproduction of images in HTML Canvas

## Installation

#### Package Manager

```sh
    npm install sequence-canvas
```

`ES6`

```javascript
    import SequenceCanvas from 'sequence-canvas';
    
    const canvas = new SequenceCanvas({
      // settings
    });
```

`CommonJS`

```javascript
    const SequenceCanvas = include('sequence-canvas');
    
    const canvas = new SequenceCanvas({
      // settings
    });
```

#### Bundle

`html`

```html
    <script src="sequence-canvas.js"></script>
    <script>
        const canvas = new SequenceCanvas({
            // settings
        });
    </script>
```

`cdn`

- https://cdn.jsdelivr.net/gh/ehoop1337/sequence-canvas/lib/sequence-canvas.js

## Settings

`Required`

| Option         | Type              | Description                                              |
|----------------|-------------------|----------------------------------------------------------|
| canvas         | object            | An object that has an `element` and `images` property.   |
| canvas.element | HTMLCanvasElement | Need to pass HTMLCanvasElement.                          |
| images         | object            | An object that has the `paths` and `options` properties. |
| images.paths   | string[]          | An array of strings with paths to images.                |

`Optional`

| Option                     | Type    | Default           | Description                                                                                                                                                                            |
|----------------------------|---------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| canvas.width               | number  |                   | Width of the canvas.                                                                                                                                                                   |
| canvas.height              | number  |                   | Height of the canvas                                                                                                                                                                   |
| images.options             | object  |                   | An object containing images settings.                                                                                                                                                  |
| images.options.position    | object  |                   | It can be used without specifying the `trim` and `size` properties.                                                                                                                    |
| images.options.position.x  | number  |                   | The X coordinate on the canvas where the image will be placed.                                                                                                                         |
| images.options.position.y  | number  |                   | The Y coordinate on the canvas where the image will be placed.                                                                                                                         |
| images.options.trim        | object  |                   | It cannot be used without specifying the `position` and `size` properties.                                                                                                             |
| images.options.trim.x      | number  |                   | The X coordinate of the starting point of the crop.                                                                                                                                    |
| images.options.trim.y      | number  |                   | The Y coordinate of the starting point of the crop.                                                                                                                                    |
| images.options.trim.width  | number  |                   | The width of the cropped image.                                                                                                                                                        |
| images.options.trim.height | number  |                   | The height of the cropped image.                                                                                                                                                       |
| images.options.size        | object  |                   | It cannot be used without specifying the `position` property.                                                                                                                          |
| images.options.size.width  | number  |                   | The applied width of the image (you can stretch or compress the image).                                                                                                                |
| images.options.size.height | number  |                   | The applied height of the image (you can stretch or compress the image).                                                                                                               |
| init                       | boolean | true              | Initializes the library in full. Starts loading images and sets the canvas dimensions.                                                                                                 |
| direction                  | number  | 1                 | Frame change direction. `1` is forward, `-1` is back.                                                                                                                                  |
| loop                       | boolean | true              | Looping rendering.                                                                                                                                                                     |
| fps                        | number  | 60                | Number of frames per second. Range from `1` to `60`.                                                                                                                                   |
| startIndex                 | number  | 0                 | The lower border of the render.                                                                                                                                                        |
| finishIndex                | number  | images.length - 1 | The upper border of the render.                                                                                                                                                        |
| currentIndex               | number  | 0                 | Specifies which index in the image array is currently being rendered. During initialization, it will call the `play` method, not `start` if it differs from the `startIndex` property. |
| startImmediately           | boolean | false             | Start immediately after loading the first image.                                                                                                                                       |
| startAfterLoaded           | boolean | true              | Starts rendering immediately after loading all images.                                                                                                                                 |
| logging                    | boolean | false             | Output to the console information about the rendering of a certain image.                                                                                                              |

## Methods

| Method          | Description                                                                                                         |
|-----------------|---------------------------------------------------------------------------------------------------------------------|
| start           | Starts rendering from the image index specified in `startIndex`.                                                    |
| play            | Plays rendering.                                                                                                    |
| pause           | Pauses rendering.                                                                                                   |
| stop            | Stops rendering and draws images with index `startIndex`.                                                           |
| on              | Adds an event listener.                                                                                             |
| off             | Removes an event listener.                                                                                          |
| setCurrentImage | Sets the value for the `currentImage` properties. Make sure that the value does not exceed the length of the array. |
| getCurrentImage | Gets the value of the `currentImage` property.                                                                      |
| setSizesCanvas  | Sets the dimensions for the canvas `{ width, height }`.                                                             |
| getSizesCanvas  | Gets canvas settings `{ width, height }`.                                                                           |
| setImageOptions | Sets new settings for images `{ position?: { x, y }, trim?: { x, y, width, height }, size?: { width, height } }`.   |
| getImageOptions | Gets image settings `{ position: { x, y }, trim: { x, y, width, height }, size: { width, height } }`.               |
| setFps          | Sets the value for the `fps` properties. Range from `1` to `60`.                                                    |
| getFps          | Gets the value of the `fps` property.                                                                               |
| setDirection    | Sets the value for the `directions` properties. The value can be `1` or `-1`.                                       |
| getDirection    | Gets the value of the `directions` property.                                                                        |
| setLoop         | Sets the value for the `loop` properties, `boolean` value only.                                                     |
| getLoop         | Gets the value of the `directions` property.                                                                        |
| setStartIndex   | Sets the value for the `startIndex` properties. Make sure that the value does not exceed the length of the array.   |
| getStartIndex   | Gets the value of the `startIndex` property.                                                                        |
| setFinishIndex  | Sets the value for the `finishIndex` properties. Make sure that the value does not exceed the length of the array.  |
| getFinishIndex  | Gets the value of the `finishIndex` property.                                                                       |
| getLogging      | Gets the value of the `logging` property.                                                                           |
| enableLogging   | Enable logging.                                                                                                     |
| disableLogging  | Disable logging.                                                                                                    |

#### Usage of methods

```javascript
const canvas = new SequenceCanvas({
  // ...
})
//...
canvas.pause();
```

## Events

| Event  | Description                                                                                                  |
|--------|--------------------------------------------------------------------------------------------------------------|
| init   | Initialization.                                                                                              |
| load   | Image loading has started.                                                                                   |
| loaded | Finished loading the image.                                                                                  |
| render | The picture is drawn on the canvas.                                                                          |
| start  | The `start` method is called, the rendering of images has started from the index specified in `startIndex`.  |
| play   | The `play` method is called, the rendering of images has started from the index specified in `currentIndex`. |
| pause  | The `pause` method is called, rendering is on pause.                                                         |
| stop   | The `stop` method is called, `currentIndex` borrows a value from `startIndex`.                               |

#### Usage of events

```javascript
const canvas = new SequenceCanvas({
  // ...
  on: {
    'init': function(event) {
      console.log('init', event);
    }
  }
});
// ...
function pauseHandler() {
  console.log('pause');
}
canvas.on('pause', pauseHandler);
canvas.off('pause', pauseHandler);
```

## Authors

- [@ehoop1337](https://www.github.com/ehoop1337)

## License

[MIT](https://choosealicense.com/licenses/mit/)

