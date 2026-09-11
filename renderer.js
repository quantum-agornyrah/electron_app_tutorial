const systemTheme = document.getElementById('theme-source')
const darkModeToggle = document.getElementById('toggle-dark-mode')
const systemModeToggle = document.getElementById('reset-to-system')

darkModeToggle.addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    systemTheme.innerHTML = isDarkMode ? 'Dark Theme' : 'Light Theme'
})

systemModeToggle.addEventListener('click', async () => {
    await window.darkMode.system()
    systemTheme.innerHTML = 'System'
})