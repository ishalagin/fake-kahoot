let loginWrap = document.getElementById('loginWrap')
let overlayWindow = document.getElementById('overlayWindow')
let loginInputUsername = document.getElementById('loginInputUsername')
let loginInputPassword =document.getElementById('loginInputPassword')

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

let logIn = () => {
  if (loginInputPassword !== '' && loginInputUsername !== '') {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open('POST', '/login', true)
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        console.log(xmlhttp.responseText)
      }
    }
    xmlhttp.send(`username=${loginInputUsername.value}&password=${loginInputPassword.value}`)
  }
}
