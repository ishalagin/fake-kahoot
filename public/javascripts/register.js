let userNameInput = document.getElementById('signUpBoxUsernameInput')
let passwordInput = document.getElementById('signUpBoxPasswordInput')
let cpasswordInput = document.getElementById('signUpBoxConfirmPasswordInput')
let signUpBoxResetButton = document.getElementById('signUpBoxResetButton')
let nameIcon = document.getElementById('nameValidationIcon')
let passwordIcon = document.getElementById('passwordValidationIcon')
let cpasswordIcon = document.getElementById('cpasswordValidationIcon')
let hintWrap = document.getElementById('hintWrap')
/**
 * @module
 */

/**
 * @summary Sends username input to server
 * @function
 * @public
 */
userNameInput.addEventListener('blur', function () {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/validateusername', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      nameIcon.src = '/assets/images/icons/checked.svg'
    } else {
      nameIcon.src = '/assets/images/icons/cross.svg'
    }
  }
  xmlhttp.send(`USERNAME=${userNameInput.value}`)
})

/**
 * @summary Sends password input to server
 * @function
 * @public
 */
passwordInput.addEventListener('keyup', function () {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/validatepassword', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      passwordIcon.src = '/assets/images/icons/checked.svg'
    } else {
      passwordIcon.src = '/assets/images/icons/cross.svg'
    }
  }
  xmlhttp.send(`PASSWORD=${passwordInput.value}`)

  if (passwordIcon.getAttribute('src') === '/assets/images/icons/checked.svg') {
    if (cpasswordInput.value === passwordInput.value) {
      cpasswordIcon.src = '/assets/images/icons/checked.svg'
    } else {
      cpasswordIcon.src = '/assets/images/icons/cross.svg'
    }
  } else {
    cpasswordIcon.src = ''
  }
})

/**
 * @summary Sends confirmation password input to server
 * @function
 * @public
 */
cpasswordInput.addEventListener('keyup', function () {
  if (passwordIcon.getAttribute('src') === '/assets/images/icons/checked.svg') {
    if (cpasswordInput.value === passwordInput.value) {
      cpasswordIcon.src = '/assets/images/icons/checked.svg'
    } else {
      cpasswordIcon.src = '/assets/images/icons/cross.svg'
    }
  } else {
    cpasswordIcon.src = ''
  }
})

signUpBoxResetButton.addEventListener('click', function () {
  signUpBoxUsernameInput.value = ''
  signUpBoxPasswordInput.value = ''
  signUpBoxConfirmPasswordInput.value = ''
  document.getElementById('nameValidationIcon').src = ''
  document.getElementById('cpasswordValidationIcon').src = ''
  document.getElementById('passwordValidationIcon').src = ''
})

nameIcon.addEventListener('mouseover', function () {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/validateusername', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      nameIcon.src = '/assets/images/icons/checked.svg'
    } else {
      nameIcon.src = '/assets/images/icons/cross.svg'
    }
  }
  xmlhttp.send(`USERNAME=${userNameInput.value}`)
  if (nameIcon.getAttribute('src') === '/assets/images/icons/cross.svg') {
    hintWrap.innerHTML = 'Sorry, this user name is already taken. Try another one.'
    hintWrap.style.display = 'block'
  }
})

passwordIcon.addEventListener('mouseover', function () {
  if (passwordIcon.getAttribute('src') === '/assets/images/icons/cross.svg') {
    hintWrap.innerHTML = 'Password must be a minimum of six characters and' +
      ' include at least one uppercase letter, one lowercase letter, and one number. '
    hintWrap.style.display = 'block'
  }
})

cpasswordIcon.addEventListener('mouseover', function () {
  if (cpasswordIcon.getAttribute('src') === '/assets/images/icons/cross.svg') {
    hintWrap.innerHTML = 'Must match the previews password.'
    hintWrap.style.display = 'block'
  }
})

nameIcon.addEventListener('mouseout', function () {
  hintWrap.style.display = 'none'
})

passwordIcon.addEventListener('mouseout', function () {
  hintWrap.style.display = 'none'
})

cpasswordIcon.addEventListener('mouseout', function () {
  hintWrap.style.display = 'none'
})

document.getElementById('signUpBoxCreateButton').addEventListener('click', function () {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open('POST', '/register', true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      swal({
        title: 'Success',
        text: 'Registration successful!',
        type: 'success',
        showConfirmButton: false,
        timer: 1000
      })
      signUpBoxUsernameInput.value = ''
      signUpBoxPasswordInput.value = ''
      signUpBoxConfirmPasswordInput.value = ''
      document.getElementById('nameValidationIcon').src = ''
      document.getElementById('cpasswordValidationIcon').src = ''
      document.getElementById('passwordValidationIcon').src = ''
    } else {
      swal({
        title: 'Failed',
        text: 'Registration failed!',
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      })
    }
  }
  xmlhttp.send(`USERNAME=${userNameInput.value}&` +
  `PASSWORD=${passwordInput.value}&` +
  `CPASSWORD=${cpasswordInput.value}`)
})
