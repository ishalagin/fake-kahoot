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
  serverRequest('POST', '/createQuestion', `QUESTION_CONTENT=${questionInput.value}&RIGHT_ANSWER=${correctAnswerInput.value}&WRONG_ANSWER1=${wrongAnswerInput1.value}&WRONG_ANSWER2=${wrongAnswerInput2.value}&WRONG_ANSWER3=${wrongAnswerInput3.value}`, (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      swal({
        title: 'Success',
        text: 'Question created!',
        icon: 'success'
      }).then((value) => {
        window.location.reload()
      })
    } else {
      swal({
        title: 'Failed',
        text: 'Failed to create question!',
        icon: 'error'
      })
    }
  })
}
