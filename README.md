# sequence-canvas
Frame-by-frame reproduction of images in HTML Canvas

### Installation
```sh
    npm install sequence-canvas@0.1.0
```
```javascript
    import SequenceCanvas from 'sequence-canvas';
```
```javascript
    const canvas = new SequenceCanvas({
        canvas: {
            element: document.querySelector('canvas')
        },
        images: {
            paths: arrayPathImages
        }
    });
```

### Settings

`Required`

| Option | Type  | Description |
| ------ | ------ | ------ |
| canvas | object |  |
| images | object |  |

`Optional`

| Option | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| init | boolean | true |  |
| direction | 1 \| -1 | 1 |  |
| loop | boolean | true |  |
| fps | 1 ... 60 | 60 |  |
| startIndex | number | 0 |  |
| finishIndex | number | inages.length - 1 |  |
| currentIndex | number | 0 |  |
| startImmediately | boolean | false |  |
| startAfterLoaded | boolean | true |  |
| logging | boolean | false |  |

## Methods
| Method | Description |
| ------ | ------ |
| start |  |
| play |  |
| pause |  |
| stop |  |

```javascript
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

```javascript
canvas.on('pause', function() {
    console.log('paused');
})
```


