let accountUsername = document.getElementById('accountUsername')
let accountMenuOptionProfile = document.getElementById('accountMenuOptionProfile')
let accountMenuOptionLogin = document.getElementById('accountMenuOptionLogin')
let accountMenuOptionLogout = document.getElementById('accountMenuOptionLogout')

let checkLoginStatus = () => {
  serverRequest('POST', '/checkLoginStatus', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      let userObject = JSON.parse(xmlhttp.responseText)
      accountUsername.innerHTML = userObject.username
      accountMenuOptionProfile.style.display = 'block'
      accountMenuOptionLogin.style.display = 'none'
      accountMenuOptionLogout.style.display = 'block'
      return true
    } else {
      accountMenuOptionProfile.style.display = 'none'
      accountMenuOptionLogin.style.display = 'block'
      accountMenuOptionLogout.style.display = 'none'
      return false
    }
  })
}

checkLoginStatus()