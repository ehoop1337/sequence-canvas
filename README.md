# sequence-canvas
---
Frame-by-frame reproduction of images in HTML Canvas

### Installation
```sh
    npm insall sequence-canvas
```
```javascript
    import SequenceCanvas from 'sequence-canvas';
```
```html
    <script src="sequence-canvas.js" type="module"></script>
```

### Settings

`Required`

| Option | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| canvas | object |  |  |
| images | object |  |  |
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


