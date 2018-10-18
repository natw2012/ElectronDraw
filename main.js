const electron = require("electron");
const path = require("path");
const url = require("url");


const { app, ipcMain, dialog, BrowserWindow } = require('electron');

// Added electron-reload to refresh app on save
require("electron-reload")(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    resizable: true,
    movable: true
  });

  //Create toolWindow
  toolWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: true,
    transparent: false,
    resizable: true,
    movable: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  toolWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "tools.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  toolWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    toolWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('drawMode', function (e, mode, color, lineWidth, shadowWidth, shadowColor) {
  mainWindow.webContents.send('drawMode', mode, color, lineWidth, shadowWidth, shadowColor);
})
ipcMain.on('colorChange', function (e, value) {
  mainWindow.webContents.send('colorChange', value);
})
ipcMain.on('shadowColorChange', function (e, value) {
  mainWindow.webContents.send('shadowColorChange', value);
})
ipcMain.on('drawMode', function (e, o, value) {
  mainWindow.webContents.send('lineWidthChange', o, value);
})
ipcMain.on('shadowWidthChange', function (e, o, value) {
  mainWindow.webContents.send('shadowWidthChange', o, value);
})
ipcMain.on('shadowOffsetChange', function (e, o, value) {
  mainWindow.webContents.send('shadowOffsetChange', o, value);
})
ipcMain.on('drawingModeE1', function (e, drawingModeEl, drawingOptionsEl) {
  mainWindow.webContents.send('drawingModeE1', drawingModeEl,drawingOptionsEl);
})
ipcMain.on('canvasClear', function (e) {
  mainWindow.webContents.send('canvasClear');
})
