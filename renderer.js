// Access the various elements in the DOM and add interactivity to the button.
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  // EXPLAIN: Use the exposed window.electronAPI to call the button function in the main
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath;
})