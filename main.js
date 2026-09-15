// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron/main')
const path = require('node:path')

let mainWindow
const PROTOCOL = 'electron-fiddle'

// Handle registration during development vs packaged build
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL)
}

// To prevent a second istance from opening
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    const url = commandLine.pop()
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Welcome Back',
      message: 'Deep Link Activated',
      detail: `You arrived from: ${url}`
    })
  })

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow()
  })

  app.on('open-url', (event, url) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Welcome Back',
      message: 'Deep Link Activated',
      detail: `You arrived from: ${url}`
    })
  })
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const { pathToFileURL } = require('node:url')

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = pathToFileURL(path.join(pageDirectory, 'index.html')).href
  shell.openExternal(pagePath)
})