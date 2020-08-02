const { app, BrowserWindow } = require('electron')
const path = require('path')
const { updateHandle } = require('../src/update.js')
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, '../src/renderer.js')
    }
  })
  mainWindow.webContents.toggleDevTools();
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  let feedUrl = "http://localhost/";
  updateHandle(mainWindow, feedUrl);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
