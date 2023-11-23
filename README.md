# sequence-canvas
Frame-by-frame reproduction of images in HTML Canvas

## Installation

#### Package Managers
```sh
    npm install sequence-canvas
```
```javascript
    import SequenceCanvas from 'sequence-canvas';
    
    const canvas = new SequenceCanvas({
      // settings
    });
```

#### Loading js file
```html
    <script src="sequence-canvas.js"></script>
    <script>
        const canvas = new SequenceCanvas({
            // settings
        });
    </script>
```

## Settings

`Required`

| Option | Type  | Description |
| ------ | ------ | ------ |
| canvas | object |  |
| canvas.element | HTMLCanvasElement |  |
| images | object |  |
| images.paths | array |  |

`Optional`

| Option | Type | Default           | Description |
| ------ | ------ |-------------------| ------ |
| canvas.width | number |                   |  |
| canvas.height | number |                   |  |
| images.options | object |                   |  |
| images.options.position | object |                   |  |
| images.options.position.x | number |                   |  |
| images.options.position.y | number |                   |  |
| images.options.trim | object |                   |  |
| images.options.trim.x | number |                   |  |
| images.options.trim.y | number |                   |  |
| images.options.trim.width | number |                   |  |
| images.options.trim.height | number |                   |  |
| images.options.size | object |                   |  |
| images.options.size.width | number |                   |  |
| images.options.size.height | number |                   |  |
| init | boolean | true              |  |
| direction | 1 \| -1                | 1 |  |
| loop | boolean | true              |  |
| fps | 1 ... 60 | 60                |  |
| startIndex | number | 0                 |  |
| finishIndex | number | images.length - 1 |  |
| currentIndex | number | 0                 |  |
| startImmediately | boolean | false             |  |
| startAfterLoaded | boolean | true              |  |
| logging | boolean | false             |  |

## Methods
| Method          | Description |
|-----------------| ------ |
| start           |  |
| play            |  |
| pause           |  |
| stop            |  |
| on              |  |
| off             |  |
| setCurrentImage |  |
| getCurrentImage |  |
| setSizesCanvas  |  |
| getSizesCanvas  |  |
| setImageOptions |  |
| getImageOptions |  |
| setFps          |  |
| getFps          |  |
| setDirection    |  |
| getDirection    |  |
| setLoop         |  |
| getLoop         |  |
| setStartIndex   |  |
| getStartIndex   |  |
| setFinishIndex  |  |
| getFinishIndex  |  |
| setLogging      |  |
| getLogging      |  |
| enableLogging   |  |
| disableLogging  |  |

#### Usage of methods

```javascript
const canvas = new SequenceCanvas({
  // ...
})
//...
canvas.pause();
```

## Events

| Event | Description |
| ------ | ------ |
| init |  |
| load |  |
| loaded |  |
| render |  |
| start |  |
| play |  |
| pause |  |
| stop |  |

#### Usage of events

```javascript
const canvas = new SequenceCanvas({
  // ...
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

