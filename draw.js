const { ipcRenderer } = require('electron');

function resizeCanvas() {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
    canvas.renderAll();
}

//Clear Canvas
function clearCanvas(event) {
  canvas.clear();
  clearOutputs();
}

function init(){
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, false);
}
window.addEventListener('load', init, false);

var $ = function (id) { return document.getElementById(id) };

var canvas = this.__canvas = new fabric.Canvas('canvas', {
  isDrawingMode: true
});

fabric.Object.prototype.transparentCorners = false;

var drawingModeEl = $('drawing-mode'),
drawingOptionsEl = $('drawing-mode-options'),
drawingColorEl = $('drawing-color'),
drawingShadowColorEl = $('drawing-shadow-color'),
drawingLineWidthEl = $('drawing-line-width'),
drawingShadowWidth = $('drawing-shadow-width'),
drawingShadowOffset = $('drawing-shadow-offset'),
clearEl = $('clear-canvas');

ipcRenderer.on('canvasClear', function (e) {
  canvas.clear();
});
ipcRenderer.on('drawingModeE1', function (e, drawingModeEl,drawingOptionsEl) {
  canvas.isDrawingMode = !canvas.isDrawingMode;
  if (canvas.isDrawingMode) {
    console.log(drawingModeEl,drawingOptionsEl);
    drawingModeEl.innerHTML = 'Cancel drawing mode';
    drawingOptionsEl.style.display = '';
  }
  else {
    console.log(drawingModeEl,drawingOptionsEl);
    drawingModeEl.innerHTML = 'Enter drawing mode';
    drawingOptionsEl.style.display = 'none';
  }
});

if (fabric.PatternBrush) {
  var vLinePatternBrush = new fabric.PatternBrush(canvas);
  vLinePatternBrush.getPatternSrc = function () {

    var patternCanvas = fabric.document.createElement('canvas');
    patternCanvas.width = patternCanvas.height = 10;
    var ctx = patternCanvas.getContext('2d');

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.stroke();

    return patternCanvas;
  };

  var hLinePatternBrush = new fabric.PatternBrush(canvas);
  hLinePatternBrush.getPatternSrc = function () {

    var patternCanvas = fabric.document.createElement('canvas');
    patternCanvas.width = patternCanvas.height = 10;
    var ctx = patternCanvas.getContext('2d');

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.stroke();

    return patternCanvas;
  };

  var squarePatternBrush = new fabric.PatternBrush(canvas);
  squarePatternBrush.getPatternSrc = function () {

    var squareWidth = 10, squareDistance = 2;

    var patternCanvas = fabric.document.createElement('canvas');
    patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
    var ctx = patternCanvas.getContext('2d');

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, squareWidth, squareWidth);

    return patternCanvas;
  };

  var diamondPatternBrush = new fabric.PatternBrush(canvas);
  diamondPatternBrush.getPatternSrc = function () {

    var squareWidth = 10, squareDistance = 5;
    var patternCanvas = fabric.document.createElement('canvas');
    var rect = new fabric.Rect({
      width: squareWidth,
      height: squareWidth,
      angle: 45,
      fill: this.color
    });

    var canvasWidth = rect.getBoundingRect().width;

    patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
    rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

    var ctx = patternCanvas.getContext('2d');
    rect.render(ctx);

    return patternCanvas;
  };

  var img = new Image();
  img.src = 'honey_im_subtle.png';

  var texturePatternBrush = new fabric.PatternBrush(canvas);
  texturePatternBrush.source = img;
}


ipcRenderer.on('drawMode', function (e, mode, color, lineWidth, shadowWidth, shadowColor) {

  if (mode === 'hline') {
    canvas.freeDrawingBrush = vLinePatternBrush;
  }
  else if (mode === 'vline') {
    canvas.freeDrawingBrush = hLinePatternBrush;
  }
  else if (mode === 'square') {
    canvas.freeDrawingBrush = squarePatternBrush;
  }
  else if (mode === 'diamond') {
    canvas.freeDrawingBrush = diamondPatternBrush;
  }
  else if (mode === 'texture') {
    canvas.freeDrawingBrush = texturePatternBrush;
  }
  else {
    console.log(mode);
    console.log(color);
    console.log(lineWidth);
    canvas.freeDrawingBrush = new fabric[mode + 'Brush'](canvas);
  }

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = parseInt(lineWidth, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(shadowWidth, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: shadowColor,
    });
  }
});

ipcRenderer.on('colorChange', function (e, color) {
  canvas.freeDrawingBrush.color = color;
});

ipcRenderer.on('shadowColorChange', function (e, color) {
  canvas.freeDrawingBrush.shadow.color = color;
});

ipcRenderer.on('lineWidthChange', function (e, width) {
  canvas.freeDrawingBrush.width = parseInt(width, 10) || 1;
});

ipcRenderer.on('shadowWidthChange', function (e, o, blur) {
  canvas.freeDrawingBrush.shadow.blur = parseInt(blur, 10) || 0;
  o.previousSibling.innerHTML = blur;
});

ipcRenderer.on('shadowOffsetChange', function (e, o, offset) {
  canvas.freeDrawingBrush.shadow.offsetX = parseInt(offset, 10) || 0;
  canvas.freeDrawingBrush.shadow.offsetY = parseInt(offset, 10) || 0;
  o.previousSibling.innerHTML = offset;
});

ipcRenderer.on('lineWidthChange', function (e, width) {
  canvas.freeDrawingBrush.width = parseInt(width, 10) || 1;
});



// if (canvas.freeDrawingBrush) {
//   canvas.freeDrawingBrush.color = drawingColorEl.value;
//   canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
//   canvas.freeDrawingBrush.shadow = new fabric.Shadow({
//     blur: parseInt(drawingShadowWidth.value, 10) || 0,
//     offsetX: 0,
//     offsetY: 0,
//     affectStroke: true,
//     color: drawingShadowColorEl.value,
//   });
// }

(function () {
  fabric.util.addListener(fabric.window, 'load', function () {
    var canvas = this.__canvas || this.canvas,
    canvases = this.__canvases || this.canvases;

    canvas && canvas.calcOffset && canvas.calcOffset();

    if (canvases && canvases.length) {
      for (var i = 0, len = canvases.length; i < len; i++) {
        canvases[i].calcOffset();
      }
    }


  });
})();
