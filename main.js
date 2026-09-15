// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell, dialog, Menu } = require('electron/main')
const path = require('node:path')

// Define a Menu Template
const isMac = process.platform === 'darwin'
const template = [
  // macOS App Menu
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),

  // File Menu
  {
    label: 'File',
    submenu: [
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+B', // Keyboard shortcut
        click: () => {
          const { pathToFileURL } = require('node:url')
          const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
          const pagePath = pathToFileURL(path.join(pageDirectory, 'index.html')).href
          shell.openExternal(pagePath)
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },

  // Edit Menu (Built-in OS functionality)
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  },

  // View Menu
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },

  // Help Menu
  {
    label: 'Help',
    submenu: [
      {
        label: 'Documentation',
        click: async () => {
          await shell.openExternal('https://www.electronjs.org/docs')
        }
      }
    ]
  }
]

let mainWindow
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Right-click context menu
  mainWindow.webContents.on('context-menu', (e, params) => {
    const contextMenu = Menu.buildFromTemplate([
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      {
        label: 'Inspect Element',
        click: () => mainWindow.webContents.inspectElement(params.x, params.y)
      }
    ])
    contextMenu.popup(mainWindow)
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const { pathToFileURL } = require('node:url')