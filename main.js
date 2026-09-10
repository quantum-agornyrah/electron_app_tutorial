const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    // SECURITY 2: Do not enable Node.js integration for remote content
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
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

  // SECURITY 1: Only load secure content
  win.loadFile('https://index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
}

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

///////////////////////////////////////////////////////////////////
// SECURITY 5: Handle session permission requests from remote content
const { session } = require('electron')
const { URL } = require('node:url')

session
  .defaultSession
  .setPermissionRequestHandler((webContents, permission, callback) => {
    const parsedUrl = new URL(webContents.getURL())

    if (permission === 'notifications') {
      // Approves the permissions request
      callback(true)
    }

    // Verify URL
    if (parsedUrl.protocol !== 'https:' || parsedUrl.host !== 'example.com') {
      // Denies the permissions request
      return callback(false)
    }
  })

///////////////////////////////////////////////////////////////////
// SESSION 7: Define a Content Security Policy
const { session } = require('electron')

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ['default-src \'none\'']
    }
  })
})

///////////////////////////////////////////////////////////////////
// SESSION: 8. Do not enable allowRunningInsecureContent
// Bad
const mainWindow = new BrowserWindow({
  webPreferences: {
    allowRunningInsecureContent: true
  }
})

// Good
const mainWindow = new BrowserWindow({})

const { updateElectronApp } = require('update-electron-app')
updateElectronApp({
  repo: 'quantum-agornyrah/electron_app_tutorial',
})