const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}

// EXPLAIN: 1. When the app is ready, listen for events with ipcMain.handle() API
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
 
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// EXPLAIN: 2. Handle the filepath event with the callback function
async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const { updateElectronApp } = require('update-electron-app')
updateElectronApp({
  repo: 'quantum-agornyrah/electron_app_tutorial',
})