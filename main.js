const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

// Instantiate variables
let bluetoothPinCallback
let selectBluetoothCallback

// Function to create a window
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // A method action for scanning available bluetooth devices
  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    selectBluetoothCallback = callback
    
    // Filter out unnamed or 'Unknown or Unsupported' background BLE signals
    const validDevices = deviceList.filter(d => 
      d.deviceName && 
      d.deviceName.trim().length > 0 && 
      !d.deviceName.startsWith('Unknown or Unsupported Device')
    )

    if (validDevices.length > 0) {
      console.log('Found named Bluetooth device:', validDevices[0].deviceName)
      callback(validDevices[0].deviceId)
      selectBluetoothCallback = null
    } else {
      console.log(`Scanning... detected ${deviceList.length} nearby BLE signals (waiting for a named device...)`)
    }
  })

  // A channel link to trigger the cancel bluetooth button
  ipcMain.on('cancel-bluetooth-request', (event) => {
    if (typeof selectBluetoothCallback === 'function') {
      selectBluetoothCallback('')
      selectBluetoothCallback = null
    }
  })

  // Listen for a message from the renderer to get the response for the Bluetooth pairing.
  ipcMain.on('bluetooth-pairing-response', (event, response) => {
    if (typeof bluetoothPinCallback === 'function') {
      bluetoothPinCallback(response)
      bluetoothPinCallback = null
    }
  })

  win.webContents.session.setBluetoothPairingHandler((details, callback) => {
    bluetoothPinCallback = callback
    // Send a message to the renderer to prompt the user to confirm the pairing.
    win.webContents.send('bluetooth-pairing-request', details)
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})