const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron/main')
const path = require('node:path')

// Create a function to produce the app window and attach the renderer process whilst loading the UI component from index.html
function createWindow() {
  const windowSize = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  windowSize.loadFile('index.html')
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a connection to the renderer process to toggle between dark and light mode
ipcMain.handle('dark-mode:toggle', () => {
  if(nativeTheme.shouldUseDarkColors){
    nativeTheme.themeSource = 'light'
  } else{
    nativeTheme.themeSource = 'dark'
  }

  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Call the electron app window function when electron launches
// Also check if a window is created, if not, call the create window function again
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0){
      createWindow()
    }
  })
})

// Call the window-all-closed event when windows on the electron app are closed 
// Also check if OS is macOS and fully terminate app
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
    app.quit
  }
})

// const { updateElectronApp } = require('update-electron-app')
// updateElectronApp({
//   repo: 'quantum-agornyrah/electron_app_tutorial',
// })