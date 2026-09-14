const scanBluetoothDevices = document.getElementById('scanDevices')
const cancelBluetoothScan = document.getElementById('cancelScan')
const deviceName = document.getElementById('device-name')

async function testIt () {
  try {
    deviceName.innerText = 'Scanning for devices...'
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    })

    deviceName.innerHTML = device.name || `ID: ${device.id}`
  } catch (error) {
    console.log('Bluetooth request cancelled or failed:', error)
    deviceName.innerText = 'Request cancelled or device not found.'
  }
}

scanBluetoothDevices.addEventListener('click', testIt)

function cancelRequest () {
  window.electronAPI.cancelBluetoothRequest()
  deviceName.innerText = 'Request cancelled.'
}

cancelBluetoothScan.addEventListener('click', cancelRequest)

window.electronAPI.bluetoothPairingRequest((event, details) => {
  const response = {}

  switch (details.pairingKind) {
    case 'confirm': {
      response.confirmed = window.confirm(`Do you want to connect to device ${details.deviceId}?`)
      break
    }
    case 'confirmPin': {
      response.confirmed = window.confirm(`Does the pin ${details.pin} match the pin displayed on device ${details.deviceId}?`)
      break
    }
    case 'providePin': {
      const pin = window.prompt(`Please provide a pin for ${details.deviceId}.`)
      if (pin) {
        response.pin = pin
        response.confirmed = true
      } else {
        response.confirmed = false
      }
    }
  }

  window.electronAPI.bluetoothPairingResponse(response)
})