const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send('update-counter', 1),
          label: 'Increase counter'
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrease counter'
        }
      ]
    }

  ])
  Menu.setApplicationMenu(menu)
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
}

// EXPLAIN: 1. When the app is ready, send a event from the ipcMain.on channel to the ipcRenderer.send channel
app.whenReady().then(() => {
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const { updateElectronApp } = require('update-electron-app')
updateElectronApp({
  repo: 'quantum-agornyrah/electron_app_tutorial',
})