// Create and invoke an isolated set of connections to communicate with the main process' connection definition
const { contextBridge, ipcRenderer } = require('electron/renderer')

// Create a new darkMode API to communicate through the two exposed channels(toggle & system)
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})
