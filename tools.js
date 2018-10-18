const { ipcRenderer } = require('electron');





function init () {
    var $ = function (id) { return document.getElementById(id) };

    var drawingModeEl = $('drawing-mode'),
    drawingOptionsEl = $('drawing-mode-options'),
    drawingColorEl = $('drawing-color'),
    drawingShadowColorEl = $('drawing-shadow-color'),
    drawingLineWidthEl = $('drawing-line-width'),
    drawingShadowWidth = $('drawing-shadow-width'),
    drawingShadowOffset = $('drawing-shadow-offset'),
    clearEl = $('clear-canvas');

    $('drawing-mode-selector').onchange = function () {
        ipcRenderer.send('drawMode', this.value, drawingColorEl.value, drawingLineWidthEl.value, drawingShadowWidth.value, drawingShadowColorEl.value);
    }
    clearEl.onclick = function () { 
        ipcRenderer.send('canvasClear');
    }
    drawingColorEl.onchange = function () {
        ipcRenderer.send('colorChange', this.value);
    };
    drawingShadowColorEl.onchange = function () {
        ipcRenderer.send('shadowColorChange', this.value);
    };
    drawingLineWidthEl.onchange = function () {
        ipcRenderer.send('lineWidthChange', this, this.value);
    };
    drawingShadowWidth.onchange = function () {
        ipcRenderer.send('shadowWidthChange', this, this.value);
    };
    drawingShadowOffset.onchange = function () {
        ipcRenderer.send('shadowOffsetChange', this, this.value);
    };
    drawingModeEl.onclick = function () {
        ipcRenderer.send('drawingModeE1', this, drawingOptionsEl);
    }

}

window.addEventListener('load', init, false);