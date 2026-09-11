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
// SESSION 8: Do not enable allowRunningInsecureContent
// Bad
const mainWindow = new BrowserWindow({
  webPreferences: {
    allowRunningInsecureContent: true
  }
})

// Good
const mainWindow = new BrowserWindow({})


/////////////////////////////////////////////////////////////////////////
// SESSION 9 & 10: Do not use enableBlinkFeatures and experimentalFeatures
// Bad
const mainWindow = new BrowserWindow({
  webPreferences: {
    enableBlinkFeatures: 'ExecCommandInJavaScript',
    experimentalFeatures: true,
  }
})

// Good
const mainWindow = new BrowserWindow()

//////////////////////////////////////////////////////////////////////////
// SECTION 13: Disable or limit navigation
const { app } = require('electron')

const { URL } = require('node:url')

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'https://example.com') {
      event.preventDefault()
    }
  })
})

//////////////////////////////////////////////////////////////////////////
// SECTION 14: Disable or limit creation of new windows
const { app, shell } = require('electron')

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    //
    // See the following item for considerations regarding what
    // URLs should be allowed through to shell.openExternal.
    if (isSafeForExternalOpen(url)) {
      setImmediate(() => {
        shell.openExternal(url)
      })
    }

    return { action: 'deny' }
  })
})

//////////////////////////////////////////////////////////////////
// SECTION 17: Validate the sender of all IPC messages
// Bad
ipcMain.handle('get-secrets', () => {
  return getSecrets()
})

// Good
ipcMain.handle('get-secrets', (e) => {
  if (!validateSender(e.senderFrame)) return null
  return getSecrets()
})

function validateSender (frame) {
  // Validate the frame's origin against an allowlist. Use the origin, not the
  // URL: about:blank, blob: and sandboxed documents have URLs that do not
  // identify who controls them, and the frame may be null if it has gone away.
  if (frame && frame.origin === 'https://electronjs.org') return true
  return false
}

//////////////////////////////////////////////////////////////////////////
const { updateElectronApp } = require('update-electron-app')
updateElectronApp({
  repo: 'quantum-agornyrah/electron_app_tutorial',
})