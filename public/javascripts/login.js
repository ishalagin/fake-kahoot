let loginWrap = document.getElementById('loginWrap')
let overlayWindow = document.getElementById('overlayWindow')

overlayWindow.addEventListener('click', () => {
  overlayWindow.style.backgroundColor = 'rgba(236, 239, 241, 0)'
  loginWrap.style.top = '-100vh'
  setTimeout(() => {
    overlayWindow.style.display = 'none'
  }, 300)
})

loginWrap.addEventListener('click', (event) => {
  event.stopPropagation()
})

let showLoginWindow = () => {
  overlayWindow.style.display = 'block'
  setTimeout(() => {
    overlayWindow.style.backgroundColor = 'rgba(236, 239, 241, 0.5)'
    loginWrap.style.top = '50vh'
  }, 10)
}

