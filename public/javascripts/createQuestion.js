let createQuestionWrap = document.getElementById('createQuestionWrap')
let createQuestionOverlay = document.getElementById('createQuestionOverlay')
let questionInput = document.getElementById('questionInput')
let correctAnswerInput = document.getElementById("correctAnswerInput")
let wrongAnswerInput1 = document.getElementById("wrongAnswerInput1")
let wrongAnswerInput2 = document.getElementById("wrongAnswerInput2")
let wrongAnswerInput3 = document.getElementById("wrongAnswerInput3")

createQuestionOverlay.addEventListener('click', () => {
  createQuestionOverlay.style.backgroundColor = 'rgba(236, 239, 241, 0)'
  createQuestionWrap.style.top = '-100vh'
  setTimeout(() => {
    createQuestionOverlay.style.display = 'none'
  }, 300)
})

createQuestionWrap.addEventListener('click', (event) => {
  event.stopPropagation()
})

let showCreateQuestionWindow = () => {
  createQuestionOverlay.style.display = 'block'
  setTimeout(() => {
    createQuestionOverlay.style.backgroundColor = 'rgba(236, 239, 241, 0.5)'
    createQuestionWrap.style.top = '15vh'
  }, 10)
}

let createQuestion = () => {
  if (questionInput.value !== '' && correctAnswerInput.value !== '' && wrongAnswerInput1.value !== '' && wrongAnswerInput2.value !== '' && wrongAnswerInput3.value !== '') {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open('POST', '/createQuestion', true)
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        console.log(xmlhttp.responseText)
      }
    }
    xmlhttp.send(`username=${loginInputUsername.value}&password=${loginInputPassword.value}`)
  }
}
