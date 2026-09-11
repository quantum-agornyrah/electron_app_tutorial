const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

  // EXPLAIN: 1. expose the ipcRenderer to the electronAPI to be recorded by an ipcMain API
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send('counter-value', value)

})

//////////////////////////////////////////////////////////////////
// SECTION 20:  Do not expose Electron APIs to untrusted web content
// Bad
contextBridge.exposeInMainWorld('electronAPI', {
  on: ipcRenderer.on
})

// Also bad
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback)
})

// Good
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value))
})