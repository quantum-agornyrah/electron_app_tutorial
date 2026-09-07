// Access the various elements in the DOM and add interactivity to the button.
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')

setButton.addEventListener('click', () => {
  const title = titleInput.value

  // EXPLAIN: Use the exposed window.electronAPI to call the button function in the main
  window.electronAPI.setTitle(title)
})