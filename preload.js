const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

  // EXPLAIN: 1. expose the ipcRenderer to the electronAPI to be listened by an ipcMain API
  openFile: () => ipcRenderer.invoke('dialog:openFile')

})
