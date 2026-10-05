const { app, BrowserWindow } = require('electron/main')

function createWindow () {
  const win = new BrowserWindow({
    width: 500,
    height: 800,
    resizable: false,
    frame: false,
    transparent: true
  })
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.clearRecentDocuments()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
}) 