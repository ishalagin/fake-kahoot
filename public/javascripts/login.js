let loginWrap = document.getElementById('loginWrap')
let overlayWindow = document.getElementById('overlayWindow')
let loginInputUsername = document.getElementById('loginInputUsername')
let loginInputPassword = document.getElementById('loginInputPassword')
/**
 * @module
 */

/**
 * @summary overlayWindow
 */
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
  loginInputUsername.focus()
}

/**
 * @summary Server request to confirm login
 * @function
 * @public
 */
let login = () => {
  if (loginInputPassword !== '' && loginInputUsername !== '') {
    serverRequest('POST', '/login', `username=${loginInputUsername.value}&password=${loginInputPassword.value}`, (xmlhttp) => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        swal({
          type: 'success',
          title: 'Login successful!',
          showConfirmButton: false,
          timer: 1000
        }).then((value) => {
          window.location.reload()
        })
      } else if (xmlhttp.readyState === 4 && xmlhttp.status === 406) {
        swal({
          type: 'error',
          title: 'Invalid username and password pair!',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }
}

/**
 * @summary Server request to confirm logout
 * @function
 * @public
 */
let logout = () => {
  serverRequest('POST', '/logout', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      window.location = '/'
    }
  })
}

document.getElementById('loginInputPassword').addEventListener('keyup', function (ev) {
  if (ev.keyCode === 13) {
    login()
  }
})
